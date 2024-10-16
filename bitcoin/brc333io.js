//  **********************************************************************************************************
//  brc333io.js
//  Input/output functions for BRC333 Dynamic Ordinals protocol
//  
//  This script is meant to be used locally and provides essential i/o functions for working 
//  with BRC333 ordinals, enabling the generation of metadata and images.
//  
//  Created: Shiftshapr (2024-09-13)
//  **********************************************************************************************************
//  About BRC333 Protocol: 
//  The BRC333 Dynamic Ordinals protocol, incubated by Pachaverse, has evolved into a DMT (Digital Matter Theory) 
//  gamification protocol that supports dynamic UNAT ordinals. It transcends traditional protocol boundaries, 
//  embodying a philosophy that champions ordinals as unique digital artifacts on the Bitcoin blockchain, which  
//  offers humanity a perpetual connection to a decentralized web.
//
//  Key features of BRC333 DMT gamification include:
//  - Messages and updates from the future appearing and occurring on specific blocks
//  - Support for up to 8 special powers
//  - Visual moon representation that follows the real-world moon cycle
//
//  Technically, BRC333 creates visual elements directly on pixel canvases or through vector-based SVG images, 
//  allowing for unmatched flexibility in design, color, and interactivity. This approach breathes life into 
//  digital collectibles, making them dynamic and interactive, capable of evolving over time and reacting to 
//  user interactions.
//
//  About Pachaverse:
//  Pachaverse is a storyworld featuring Pacha, a little girl with big dreams whose pajamas make her dreamworld. 
//  When she goes to sleep, the characters on her pajamas join her for a dream adventure to learn more about 
//  herself and her connection to the world. In "SATS: The Game," Pacha finds herself inside the Bitcoin virtual 
//  machine with trillions of sats that want to become ordinals. Pachaverse collections use BRC333 for gamification 
//  and feature the Pachaverse signature moon which tracks the moon cycle.
//
//  For more info on BRC333, visit https://brc333.xyz
//  For more info on Pachaverse, visit https://pachaverse.io
//  **********************************************************************************************************

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

/**
 * Function to save all goblin data as a CSV file
 * @param {array} allData - array with all the data
 * @param {array} powers - array with all the power names
 * @param {boolean} hasNonce - boolean of whether data has nonce and noncePatterns 
 * @param {string} dataDir - name of data folder
 * 
*/
function saveAllAsCSV(allData, powers, hasNonce = true, dataDir) {
    // Sort allData by block number
    allData.sort((a, b) => a.block - b.block);
    
    // Now format the sorted data
    const csvContent = formatAllCSVData(allData, powers, hasNonce);
    const dirPath = path.join(dataDir);
    fs.mkdirSync(dirPath, { recursive: true });
    const filePath = path.join(dirPath, `AllNatGoblins_${Date.now()}.csv`);
    fs.writeFileSync(filePath, csvContent);
    console.log(`CSV file saved: ${filePath}`);
}

/**
 * Formats goblin data into CSV format
 * @param {Array} dataArray - Array of data objects
 * @param {array} powers - array with all the power names
 * @param {boolean} hasNonce - Boolean of whether data includes nonce and nonce patterns
 * @returns {string} CSV formatted data
 */
function formatAllCSVData(dataArray, powers, hasNonce) {
    let headers = `Index; Block; Patterns; Traits; Powers [${powers}]; oneOfOneTrait;\n`; 
    if (hasNonce) headers = `Index; Block; Block Patterns; Nonce; Nonce Patterns; Traits; Powers [${powers}]; oneOfOneTrait;\n`;
    const rows = dataArray.map((data, index) => {
        if (hasNonce) {
            return `${index+1};${data.block};[${data.blockPatterns}];${data.nonce};[${data.noncePatterns}];[${data.allTraits}];[${data.totalScores}];${data.oneOfOneTrait}`;
        } else return `${index+1};${data.block};[${data.blockPatterns}];[${data.allTraits}];[${data.totalScores}];${data.oneOfOneTrait || ''}`;
    }).join('\n');
    return headers + rows;
}

/**
 * Generates images for a given number of ordinals
 * @param {number} count - Number of ordinals to generate
 * @param {Array} blocks - Array of block numbers
 * @param {Array} allData - Empty array for data
 * @param {string} dataDir - name of data folder, default is 'images'
 * @returns {Array} Array of ordinal data objects
 */
const generateImages = async (canvas, loadAndModify, count, blocks, allData, hasNonce, imagesDir) => {
    console.log('count', count);
    const batchSize = 100; // Process in batches of 100
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    for (let i = 0; i < count; i += batchSize) {
        const batchPromises = [];
        for (let j = i; j < Math.min(i + batchSize, count); j++) {
            const block = blocks[j];
            const now = Date.now();
            const promise = retry(() => loadAndModify(block, now), 3, 1000)
                .then(result => {
                    const {blockPatterns, nonce, noncePatterns, allTraits, totalScores, powers, oneOfOneTrait = ''} = result;
            
                    if (hasNonce) 
                        allData.push({
                            block,
                            blockPatterns,
                            nonce,
                            noncePatterns,
                            allTraits,
                            totalScores,
                            oneOfOneTrait
                        });
                    else 
                        allData.push({
                            block,
                            blockPatterns,
                            allTraits,
                            totalScores,
                            oneOfOneTrait
                        });
                    return generateAndSaveImage(canvas, j + 1, imagesDir);
                });
            batchPromises.push(promise);
        }
        await Promise.all(batchPromises);
        await delay(1000); // Wait 1 second between batches
    }
    console.log('generateImages is done');
    return allData;
};

// Retry function with exponential backoff
const retry = async (fn, retries, delay) => {
    try {
        return await fn();
    } catch (error) {
        if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, delay));
            return retry(fn, retries - 1, delay * 2);
        }
        throw error;
    }
};


/**
 * Generates images for a given number of ordinals
 * @param {Canvas} canvas - Canvas to be saved as image
 * @param {Integer} index - index of ordinal to be used in filename
 * @param {string} imagesDir - name of images folder
 */
const generateAndSaveImage = (canvas, index, imageDir) => {
    //console.log('canvas',canvas);
    const dataURL = canvas.toDataURL('image/png');
    const base64Data = dataURL.replace(/^data:image\/png;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');
    const dirPath = path.join(imageDir);
    fs.mkdirSync(dirPath, { recursive: true });
    const filePath = path.join(dirPath, `${index}.webp`);

    sharp(buffer)
        .webp({ quality: 80 })
        .toFile(filePath)
        .then(() => {
            console.log(`Image ${index} saved successfully as WebP`);
        })
        .catch(err => {
            console.error(`Error saving image ${index}:`, err);
        });
};

/**
 * Generates and appends audio elements and the custom modal  
 * @param {Array} audioSources - An array of audio sources to append
 */
function generateAudioAndModal(audioSources) {
    audioSources.forEach(audio => {
        const audioElement = document.createElement('audio');
        audioElement.id = audio.id;
        audioElement.src = audio.src;
        document.body.appendChild(audioElement);
    });

    const modalHtml = `
        <div id="customModal" class="modal" style="display: none;">
            <div class="modalContent">
                <span class="close">&times;</span>
                <p id="modalText"></p>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

// Expose IO functions to the global scope for use in other modules
module.exports = {
    saveAllAsCSV,
    formatAllCSVData,
    generateImages,
    generateAndSaveImage,
    generateAudioAndModal
};

// Examples of how to use these functions:

// Save all ordinal data as CSV
//saveAllAsCSV();

// Format ordinal data into CSV
//const csvData = formatAllCSVData(allGoblinData);

// Generate images for 10 goblins
//const blocks = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
//const generatedData = generateImages(10, blocks);

// Generate and save a single image
//const canvas = document.createElement('canvas');
// ... (set up canvas)
//generateAndSaveImage(canvas, 1);