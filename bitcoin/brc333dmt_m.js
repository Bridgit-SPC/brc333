//  **********************************************************************************************************
//  brc333_dmt.js
//  BRC333 Dynamic Ordinals protocol - DMT (Digital Matter Theory) implementation
//  
//  This script handles the core functionality of BRC333 DMT, including:
//  - Event handling for key presses
//  - Block and nonce pattern analysis
//  - Moon phase calculations
//  - Trait selection and manipulation
//  - Canvas rendering and image saving
//  
//  Created: Shiftshapr (2024-10-01)
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

/**
 * Main function to initialize the minting process
 * @param {function} loadAndModify - function to call
 * @param {string} collectionDescription - Description of the collection
 * @param {string} brc333message - BRC333 specific message
 * @param {string} fieldMessage - Additional field message
 * @param {boolean} hasPowers - Indicates if the collection has powers
 * @param {boolean} hasBlocks - Indicates if the collection uses block patterns
 * @param {boolean} hasNonce - Indicates if the collection uses nonce patterns
 * @param {string} chain - name of blockchain (e.g., Bitcoin)
 * @param {string} medium - name of medium (e.g., ordinals)
 * @param {string} protocol - name of protocol (i.e., BRC333)
 * @param {integer} supply - total supply of the collection
 * @param {string} blockNumberTitle - title of the Block Number field
 * @param {number} avgScore - the average score for the collection
 * @param {number} maxScore - the max score for the collection
 * @param {string} inscriptionId - inscription ID for the digital artifact
 * @param {integer} start - starting DNA seed for input1
 * @param {boolean} visible - starts out visible, default false
 * @param {boolean} showFuture - enables the user to see future days
 * @param {boolean} isDMT - true if this a DMT collection, default is false ATM for Fractal Bitcoin 
 * @param {boolean} hasInput1 - enables user to change DNA seed (blk)  
 */
async function main(loadAndModify, collectionDescription, brc333message, fieldMessage, hasPowers, hasBlocks, hasNonce, chain, medium, protocol, supply, blockNumberTitle, avgScore, maxScore, inscriptionId, visible = false, showFuture = false, start = null, isDMT = false, hasInput1 = false, blocknumbers = null ) {
    window.addEventListener('keydown', function(event) {
        let blockMessage = "";
        let nonceMessage = "";
        let powersMessage = "";
        let inscriptionText = "";

        if (hasPowers) powersMessage = `\n<strong>Powers\u{1F447}</strong>\n${displayPowers(totalScores,avgScore,maxScore)}`;
        if (hasBlocks) blockMessage = `\n\n<strong>${blockNumberTitle} Patterns: <\strong> ${patternsToString(blockPatterns)}`;
        if (hasNonce) nonceMessage = `\n\n<strong>Nonce Patterns: <\strong> ${patternsToString(noncePatterns)}`;
        if (inscriptionId && inscriptionId != 'MINT_INSCRIPTION_ID') {
            inscriptionText = `<span class="inscription-id"><strong>Inscription Id:</strong> ${inscriptionId}\n`;
        }     
        
        if (event.key === 'i') {
            let rarities = "";
            let perfectSquareText = is3DigitPerfectSquare.found ? ` \u{1F987}Perfect Square Match: ${is3DigitPerfectSquare.perfectSquare}\u{1F987}`:'';
            if (allTraits.length >10) 
                rarities = `\n<strong>Rarity Traits\u{1F447}<\strong>\n${traitsToString(allTraits,10,allTraits.length-1)}`;
            showCustomModal(`${collectionDescription}
            <strong>Current Time:</strong> ${Utils.displayDate(now)} (${Math.floor(now/1000)})\n<strong>Current Blockheight:</strong> ${blockheight} ${perfectSquareText} \n<strong>Moon Phase (0-1):</strong> ${phase.toFixed(2)}\n<strong>Moon Stage:</strong> ${stageToString(stage)}\n<strong>Moon Name:</strong> ${moonName}\n<strong>Background:</strong> ${background}\n
            <strong>Protocol:</strong> ${protocol}\n<strong>Medium:</strong> ${medium}\n<strong>Protocol:</strong> ${protocol}\n<strong>Initial Supply:</strong> ${supply}\n<strong>${blockNumberTitle}:</strong> ${blk}
            ${inscriptionText}<strong>Satoshi number:</strong> ${sat}\n<strong>Timestamp:</strong> ${timestamp} (${Utils.displayDate(timestamp*1000)})\n
            ${fieldMessage}<strong>Blockheight:</strong> ${height}\n<strong>Bits:</strong> ${Utils.displayHex(bits)}\n<strong>Nonce:</strong> ${nonce} ${oneOfOne}${blockMessage}${nonceMessage}
            \n<strong>Common Traits\u{1F447}</strong>\n${traitsToString(allTraits,0,9)}${rarities}${powersMessage}
            ${brc333message}`);
            event.stopImmediatePropagation();
        }

        if (event.key === 'h') {
            const input1 = document.querySelector('#input1');
            const input2 = document.querySelector('#input2');
            if (input1 && input2) {
                const display = input1.style.display === 'none' ? 'block' : 'none';
                input1.style.display = display;
                input2.style.display = display;
            } else if (input1) {
                const display = input1.style.display === 'none' ? 'block' : 'none';
                input1.style.display = display;
            } else if (input2) {
                const display = input2.style.display === 'none' ? 'block' : 'none';
                input2.style.display = display;
            } 
            event.stopImmediatePropagation();
        }

        if (event.key === 'd') {
            const input2 = document.querySelector('#input2');
            if (input2) {
                const display = input2.style.display === 'none' ? 'block' : 'none';
                input2.style.display = display;
            }
            event.stopImmediatePropagation();
        }    

        if (event.key === 'b') {
            const input1 = document.querySelector('#input1');
            if (input1) {
                const display = input1.style.display === 'none' ? 'block' : 'none';
                input1.style.display = display;
            }
            event.stopImmediatePropagation();
        }    

        if (event.key === 'l') {
            const lowerThirds = document.querySelector('#lower-thirds');
            if (lowerThirds) {
                const display = lowerThirds.style.display === 'none' ? 'block' : 'none';
                lowerThirds.style.display = display;
            }
            event.stopImmediatePropagation();
        }
        if (event.key === 's') {
            const canvas = document.getElementById('image-canvas');
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = 1200;
            tempCanvas.height = 1200;
            const tempCtx = tempCanvas.getContext('2d');
            tempCtx.imageSmoothingEnabled = false;
            tempCtx.drawImage(canvas, 0, 0, 1200, 1200);
            
            tempCanvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `goblin_${blk}.webp`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 'image/webp');
            
            event.stopImmediatePropagation();
        }    
    });

    if (isDMT && inscriptionId && inscriptionId === 'MINT_INSCRIPTION_ID') {
        // NO MINT PROVIDED
        if (hasInput1) {
            setupInput1(start, visible);
            setupInput2(visible, showFuture);        
        } else setupInput2(visible, showFuture, '20px');        

        blockheight = estimateBlockHeight(now);

        try {
            window.Oracle.cleanup();
        } catch (error) {
            console.error('Could not clean up Oracle');
        }

        try {
            loadAndModify(now);
        } catch (error) {
            console.error('Error running LoadandModify', error);
        }

    } else if (isDMT && inscriptionId) {
        // MINT WAS PROVIDED
        setupInput2(false, false, '20px');
        
        try {
            blockheight = await getMetadata('/r/blockheight'); 
        } catch (error) {
            console.error('error getting blockheight ');
        }

        try {
            const request = new XMLHttpRequest()
            request.open('GET', '/content/' + inscriptionId); 
            request.responseType = 'text';
            request.addEventListener('load', () => initialize(request.response));
            request.addEventListener('error', () => console.error('XHR error'));
            request.send();
        } catch (error) {
            console.error(`XHR error ${request.status}`);
        }
    } else {     
        // THIS IS NOT A DMT COLLECTION
        blockheight = estimateBlockHeight(now);

        if (hasInput1) {
            setupInput1(start, visible, blocknumbers);
            setupInput2(visible, showFuture);        
        } else setupInput2(visible, showFuture, '20px');      

        try {
            window.Oracle.cleanup();
        } catch (error) {
            console.error('Could not clean up Oracle');
        }

        try {
            blockheight = await getMetadata('/r/blockheight'); 
        } catch (error) {
            console.error('Error getting blockheight', error);
        }

        try {
            loadAndModify(now);
        } catch (error) {
            console.error('Error running LoadandModify', error);
        }
    }
}

/**
 * Sets up and configures the input1 element for block number input
 * @param {integer} start - first number to display in input1
 * @param {boolean} visible - Whether the input should be visible initially
 * @param {string|null} blocknumbers - Initial value for the input, typically a block number
 * @param {string} top - space from the top
 * @returns {HTMLElement|null} The configured input1 element, or null if not available
 */
function setupInput1(start, visible = false, blocknumbers = null, top = '0') {

    let input1 = document.getElementById('input1');
    if (!input1) {
        input1 = document.createElement('input');
        input1.id = 'input1';
        input1.type = 'number';
        document.body.appendChild(input1);
    }
    
    input1.style.display = visible ? 'block' : 'none';
    input1.style.position = 'absolute';
    input1.style.fontSize = '20px';
    input1.style.margin = '20px';
    input1.style.top = top;
    input1.style.zIndex = '10';
    if (!start) start = 0;
    input1.value = start;

    let currentIndex = 0;

    if (blocknumbers) {
        currentIndex = blocknumbers.indexOf(parseInt(input1.value));
        if (currentIndex === -1) currentIndex = 0;

        input1.addEventListener('input', handleInputChange);
    } else {
        input1.addEventListener('input', async (event) => {
            blk = input1.value;
            updates = 0;
            try {
                window.Oracle.cleanup();
            } catch (error) {
                console.error('could not clean up Oracle');
            }

            try {
                blockinfo = await getMetadata(`/r/blockinfo/${blk}`);
            } catch (error) {
                console.error('Error fetching block info:', error, 'blk=', blk);
            }

            try {
                loadAndModify(now);
            } catch (error) {
                console.error('Error on loadAndModify:', error);
            }
        });
    }

    function handleInputChange(event) {
        const direction = event.target.validity.rangeOverflow ? 'down' : 'up';
        if (direction === 'up') {
            currentIndex = (currentIndex + 1) % blocknumbers.length;
        } else {
            currentIndex = (currentIndex - 1 + blocknumbers.length) % blocknumbers.length;
        }
        const newBlockNumber = blocknumbers[currentIndex];
        input1.value = newBlockNumber.toString();

        blk = input1.value;
        updates = 0;
        try {
            window.Oracle.cleanup();
        } catch (error) {
            console.error('Could not clean up Oracle');
        }
        try {
            loadAndModify(now);
        } catch (error) {
            console.error('Error running loadAndModify');
        }
    }

    return input1;
}
    
/**
 * Sets up and configures the input2 element for date/time selection
 * @param {boolean} visible - Whether the input should be visible initially
 * @param {boolean} showFuture - User can display future dates
 * @param {string} top - space from the top
 * @returns {HTMLElement} The configured input2 element
 */
function setupInput2(visible = false, showFuture = false, top = '40px') {

    function getNextValidDate(value) {
        let date = new Date(value);
        date.setDate(date.getDate() + 1);
        return date;
    }

    let input2 = document.getElementById('input2');
    if (!input2) {
        input2 = document.createElement('input');
        input2.id = 'input2';
        input2.type = 'datetime-local';
        document.body.appendChild(input2);
    }
    
    input2.style.display = visible ? 'block' : 'none';
    input2.style.position = 'absolute';
    input2.style.fontSize = '20px';
    input2.style.margin = '20px';
    input2.style.top = top;
    input2.style.zIndex = '10';

    input2.value = new Date().toLocaleString("sv-SE", {year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit"}).replace(" ", "T");
    if (input2.value) previousDate = input2.value;

    input2.addEventListener('input', (event) => {
        let selectedDate = new Date(input2.value);
        let currentDate = new Date();
        
        if (!showFuture && selectedDate > currentDate) {
            selectedDate = currentDate;
            input2.value = currentDate.toLocaleString("sv-SE", {year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit"}).replace(" ", "T");
        }
        
        if (input2.value) {
            nowDate = new Date(selectedDate.getTime());
        } else {
            nowDate = getNextValidDate(previousDate);
            input2.value = nowDate.toLocaleString("sv-SE", {year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit"}).replace(" ", "T");
        }
        
        previousDate = nowDate;
        now = nowDate.getTime();
        blockheight = estimateBlockHeight(now);
        
        try {
            window.Oracle.cleanup();
        } catch (error) {
            console.error('Could not clean up Oracle');
        }
        try {
            loadAndModify(now);
        } catch (error) {
            console.error('Error running loadAndModify');
        }
    });

    return input2;
}

/**
 * Initializes the application with the provided result data
 * @param {string} result - JSON string containing initialization data
 */
function initialize(result) {
    if(result) {
        data = JSON.parse(result);
        blk = data.blk;
    }
    loadAndModify(now);
}


// General utility functions 

// Fetch utility function
async function fetchJson(url) {
  try {
    const response = await fetch(url);
    return response.json();    
  } catch (e) {
    console.error(`Error fetching ${url}: ${e}`);
  }
}

/**
 * Draws a trait on the canvas
 * @param {CanvasRenderingContext2D} ctx - The canvas context
 * @param {Array} coordinates - Array of coordinate objects
 * @param {string} trait - The trait to draw
 */
function drawTrait(ctx, coordinates, trait) {
  const traitData = coordinates.find(t => t.trait === trait);
  if (traitData) {
      for (const color in traitData.colors) {
          ctx.fillStyle = color;
          for (const coordinate of traitData.colors[color]) {
              ctx.fillRect(coordinate[0], coordinate[1], 1, 1); // Assuming each pixel is 1x1
          }
      }
  } else {
      console.log(`No data found for trait: ${trait}`);
  }            
} 

/**
 * The array of colors pairs of the Pachaverse moon
 */
let moonArray = [
  {
      trait: "Chinese Silver",
      colors: ['#000000', '#F4F4F4']
  },
  {
      trait: "Pale",
      colors: ['#091828', '#dfd5e6']
  },
  { 
      trait: "Blue", 
      colors: ['#122F50','#90c0df']
  },
  { 
      trait: "Teal", 
      colors: ['#122F50', '#3AA8C2']
  },
  {
      trait: "Blue Glow",
      colors: ['#122F50', '#95CCD2']
  },
  { 
      trait: "Goblin Glow", 
      colors: ['#25587C', '#C9E5D6']
  },
  {
      trait: "Yellow Glow",
      colors: ['#CACACA', '#FCFEDA']
  },
  { 
      trait: "Egg Yolk", 
      colors: ['#CACACA', '#EEDC7C']
  },
  {
      trait: "Satoshi",
      colors: ['#757375', '#f0c420']
  },
  { 
      trait: "Blood", 
      colors: ['#757375', '#d53333']
  },
  { 
      trait: "Strawberry", 
      colors: ['#757375', '#d96ba1']
  },
  { 
      trait: "Pastel", 
      colors: ['#b9bde4', '#f1ead1']
  },
  { 
      trait: "Yin Yang", 
      colors: ['#000000', '#FFFFFF']
  }
]

/**
 * Returns the coordinates of the moon for the moon color pairs
 * @param {Array<object>} moonColors - Array of moon color pairs
 * @returns {Array<object>} Array of color coordinate pairs
 */
function getMoonCoordinates(moonColors) {
  return [
      {
          trait: "moon0",
          colors: {
                  [moonColors[0]]: [[81, 6], [82, 6], [83, 6], [84, 6], [85, 6], [86, 6], [87, 6], [79, 7], [80, 7], [81, 7], [82, 7], [83, 7], [84, 7], [85, 7], [86, 7], [87, 7], [88, 7], [89, 7], [78, 8], [79, 8], [80, 8], [81, 8], [82, 8], [83, 8], [84, 8], [85, 8], [86, 8], [87, 8], [88, 8], [89, 8], [90, 8], [77, 9], [78, 9], [79, 9], [80, 9], [81, 9], [82, 9], [83, 9], [84, 9], [85, 9], [86, 9], [87, 9], [88, 9], [89, 9], [90, 9], [91, 9], [76, 10], [77, 10], [78, 10], [79, 10], [80, 10], [81, 10], [82, 10], [83, 10], [84, 10], [85, 10], [86, 10], [87, 10], [88, 10], [89, 10], [90, 10], [91, 10], [92, 10], [75, 11], [76, 11], [77, 11], [78, 11], [79, 11], [80, 11], [81, 11], [82, 11], [83, 11], [84, 11], [85, 11], [86, 11], [87, 11], [88, 11], [89, 11], [90, 11], [91, 11], [92, 11], [93, 11], [75, 12], [76, 12], [77, 12], [78, 12], [79, 12], [80, 12], [81, 12], [82, 12], [83, 12], [84, 12], [85, 12], [86, 12], [87, 12], [88, 12], [89, 12], [90, 12], [91, 12], [92, 12], [93, 12], [74, 13], [75, 13], [76, 13], [77, 13], [78, 13], [79, 13], [80, 13], [81, 13], [82, 13], [83, 13], [84, 13], [85, 13], [86, 13], [87, 13], [88, 13], [89, 13], [90, 13], [91, 13], [92, 13], [93, 13], [94, 13], [74, 14], [75, 14], [76, 14], [77, 14], [78, 14], [79, 14], [80, 14], [81, 14], [82, 14], [83, 14], [84, 14], [85, 14], [86, 14], [87, 14], [88, 14], [89, 14], [90, 14], [91, 14], [92, 14], [93, 14], [94, 14], [74, 15], [75, 15], [76, 15], [77, 15], [78, 15], [79, 15], [80, 15], [81, 15], [82, 15], [83, 15], [84, 15], [85, 15], [86, 15], [87, 15], [88, 15], [89, 15], [90, 15], [91, 15], [92, 15], [93, 15], [94, 15], [74, 16], [75, 16], [76, 16], [77, 16], [78, 16], [79, 16], [80, 16], [81, 16], [82, 16], [83, 16], [84, 16], [85, 16], [86, 16], [87, 16], [88, 16], [89, 16], [90, 16], [91, 16], [92, 16], [93, 16], [94, 16], [74, 17], [75, 17], [76, 17], [77, 17], [78, 17], [79, 17], [80, 17], [81, 17], [82, 17], [83, 17], [84, 17], [85, 17], [86, 17], [87, 17], [88, 17], [89, 17], [90, 17], [91, 17], [92, 17], [93, 17], [94, 17], [74, 18], [75, 18], [76, 18], [77, 18], [78, 18], [79, 18], [80, 18], [81, 18], [82, 18], [83, 18], [84, 18], [85, 18], [86, 18], [87, 18], [88, 18], [89, 18], [90, 18], [91, 18], [92, 18], [93, 18], [94, 18], [74, 19], [75, 19], [76, 19], [77, 19], [78, 19], [79, 19], [80, 19], [81, 19], [82, 19], [83, 19], [84, 19], [85, 19], [86, 19], [87, 19], [88, 19], [89, 19], [90, 19], [91, 19], [92, 19], [93, 19], [94, 19], [75, 20], [76, 20], [77, 20], [78, 20], [79, 20], [80, 20], [81, 20], [82, 20], [83, 20], [84, 20], [85, 20], [86, 20], [87, 20], [88, 20], [89, 20], [90, 20], [91, 20], [92, 20], [93, 20], [75, 21], [76, 21], [77, 21], [78, 21], [79, 21], [80, 21], [81, 21], [82, 21], [83, 21], [84, 21], [85, 21], [86, 21], [87, 21], [88, 21], [89, 21], [90, 21], [91, 21], [92, 21], [93, 21], [76, 22], [77, 22], [78, 22], [79, 22], [80, 22], [81, 22], [82, 22], [83, 22], [84, 22], [85, 22], [86, 22], [87, 22], [88, 22], [89, 22], [90, 22], [91, 22], [92, 22], [77, 23], [78, 23], [79, 23], [80, 23], [81, 23], [82, 23], [83, 23], [84, 23], [85, 23], [86, 23], [87, 23], [88, 23], [89, 23], [90, 23], [91, 23], [78, 24], [79, 24], [80, 24], [81, 24], [82, 24], [83, 24], [84, 24], [85, 24], [86, 24], [87, 24], [88, 24], [89, 24], [90, 24], [79, 25], [80, 25], [81, 25], [82, 25], [83, 25], [84, 25], [85, 25], [86, 25], [87, 25], [88, 25], [89, 25], [81, 26], [82, 26], [83, 26], [84, 26], [85, 26], [86, 26], [87, 26]]
          }
      },
      {
          trait: "moon1",
          colors: {
                  [moonColors[0]]: [[81, 6], [82, 6], [83, 6], [84, 6], [85, 6], [79, 7], [80, 7], [81, 7], [82, 7], [83, 7], [84, 7], [85, 7], [86, 7], [78, 8], [79, 8], [80, 8], [81, 8], [82, 8], [83, 8], [84, 8], [85, 8], [86, 8], [87, 8], [77, 9], [78, 9], [79, 9], [80, 9], [81, 9], [82, 9], [83, 9], [84, 9], [85, 9], [86, 9], [87, 9], [88, 9], [76, 10], [77, 10], [78, 10], [79, 10], [80, 10], [81, 10], [82, 10], [83, 10], [84, 10], [85, 10], [86, 10], [87, 10], [88, 10], [75, 11], [76, 11], [77, 11], [78, 11], [79, 11], [80, 11], [81, 11], [82, 11], [83, 11], [84, 11], [85, 11], [86, 11], [87, 11], [88, 11], [89, 11], [75, 12], [76, 12], [77, 12], [78, 12], [79, 12], [80, 12], [81, 12], [82, 12], [83, 12], [84, 12], [85, 12], [86, 12], [87, 12], [88, 12], [89, 12], [74, 13], [75, 13], [76, 13], [77, 13], [78, 13], [79, 13], [80, 13], [81, 13], [82, 13], [83, 13], [84, 13], [85, 13], [86, 13], [87, 13], [88, 13], [89, 13], [90, 13], [74, 14], [75, 14], [76, 14], [77, 14], [78, 14], [79, 14], [80, 14], [81, 14], [82, 14], [83, 14], [84, 14], [85, 14], [86, 14], [87, 14], [88, 14], [89, 14], [90, 14], [74, 15], [75, 15], [76, 15], [77, 15], [78, 15], [79, 15], [80, 15], [81, 15], [82, 15], [83, 15], [84, 15], [85, 15], [86, 15], [87, 15], [88, 15], [89, 15], [90, 15], [74, 16], [75, 16], [76, 16], [77, 16], [78, 16], [79, 16], [80, 16], [81, 16], [82, 16], [83, 16], [84, 16], [85, 16], [86, 16], [87, 16], [88, 16], [89, 16], [90, 16], [74, 17], [75, 17], [76, 17], [77, 17], [78, 17], [79, 17], [80, 17], [81, 17], [82, 17], [83, 17], [84, 17], [85, 17], [86, 17], [87, 17], [88, 17], [89, 17], [90, 17], [74, 18], [75, 18], [76, 18], [77, 18], [78, 18], [79, 18], [80, 18], [81, 18], [82, 18], [83, 18], [84, 18], [85, 18], [86, 18], [87, 18], [88, 18], [89, 18], [74, 19], [75, 19], [76, 19], [77, 19], [78, 19], [79, 19], [80, 19], [81, 19], [82, 19], [83, 19], [84, 19], [85, 19], [86, 19], [87, 19], [88, 19], [89, 19], [75, 20], [76, 20], [77, 20], [78, 20], [79, 20], [80, 20], [81, 20], [82, 20], [83, 20], [84, 20], [85, 20], [86, 20], [87, 20], [88, 20], [75, 21], [76, 21], [77, 21], [78, 21], [79, 21], [80, 21], [81, 21], [82, 21], [83, 21], [84, 21], [85, 21], [86, 21], [87, 21], [88, 21], [76, 22], [77, 22], [78, 22], [79, 22], [80, 22], [81, 22], [82, 22], [83, 22], [84, 22], [85, 22], [86, 22], [87, 22], [88, 22], [77, 23], [78, 23], [79, 23], [80, 23], [81, 23], [82, 23], [83, 23], [84, 23], [85, 23], [86, 23], [87, 23], [78, 24], [79, 24], [80, 24], [81, 24], [82, 24], [83, 24], [84, 24], [85, 24], [86, 24], [79, 25], [80, 25], [81, 25], [82, 25], [83, 25], [84, 25], [85, 25], [86, 25], [80, 26], [81, 26], [82, 26], [83, 26], [84, 26]],
                  [moonColors[1]]: [[86, 6], [87, 6], [87, 7], [88, 7], [89, 7], [90, 7], [88, 8], [89, 8], [90, 8], [89, 9], [90, 9], [91, 9], [89, 10], [90, 10], [91, 10], [92, 10], [90, 11], [91, 11], [92, 11], [93, 11], [90, 12], [91, 12], [92, 12], [93, 12], [91, 13], [92, 13], [93, 13], [94, 13], [91, 14], [92, 14], [93, 14], [94, 14], [91, 15], [92, 15], [93, 15], [94, 15], [91, 16], [92, 16], [93, 16], [94, 16], [91, 17], [92, 17], [93, 17], [94, 17], [90, 18], [91, 18], [92, 18], [93, 18], [94, 18], [90, 19], [91, 19], [92, 19], [93, 19], [94, 19], [89, 20], [90, 20], [91, 20], [92, 20], [93, 20], [89, 21], [90, 21], [91, 21], [92, 21], [93, 21], [89, 22], [90, 22], [91, 22], [92, 22], [88, 23], [89, 23], [90, 23], [91, 23], [87, 24], [88, 24], [89, 24], [90, 24], [87, 25], [88, 25], [89, 25], [85, 26], [86, 26], [87, 26], [88, 26]]
          }
      },
      {
          trait: "moon2",
          colors: {
                  [moonColors[0]]: [[80, 6], [81, 6], [82, 6], [83, 6], [79, 7], [80, 7], [81, 7], [82, 7], [83, 7], [78, 8], [79, 8], [80, 8], [81, 8], [82, 8], [83, 8], [84, 8], [77, 9], [78, 9], [79, 9], [80, 9], [81, 9], [82, 9], [83, 9], [84, 9], [76, 10], [77, 10], [78, 10], [79, 10], [80, 10], [81, 10], [82, 10], [83, 10], [84, 10], [85, 10], [75, 11], [76, 11], [77, 11], [78, 11], [79, 11], [80, 11], [81, 11], [82, 11], [83, 11], [84, 11], [85, 11], [75, 12], [76, 12], [77, 12], [78, 12], [79, 12], [80, 12], [81, 12], [82, 12], [83, 12], [84, 12], [85, 12], [74, 13], [75, 13], [76, 13], [77, 13], [78, 13], [79, 13], [80, 13], [81, 13], [82, 13], [83, 13], [84, 13], [85, 13], [74, 14], [75, 14], [76, 14], [77, 14], [78, 14], [79, 14], [80, 14], [81, 14], [82, 14], [83, 14], [84, 14], [85, 14], [74, 15], [75, 15], [76, 15], [77, 15], [78, 15], [79, 15], [80, 15], [81, 15], [82, 15], [83, 15], [84, 15], [85, 15], [74, 16], [75, 16], [76, 16], [77, 16], [78, 16], [79, 16], [80, 16], [81, 16], [82, 16], [83, 16], [84, 16], [85, 16], [74, 17], [75, 17], [76, 17], [77, 17], [78, 17], [79, 17], [80, 17], [81, 17], [82, 17], [83, 17], [84, 17], [74, 18], [75, 18], [76, 18], [77, 18], [78, 18], [79, 18], [80, 18], [81, 18], [82, 18], [83, 18], [84, 18], [74, 19], [75, 19], [76, 19], [77, 19], [78, 19], [79, 19], [80, 19], [81, 19], [82, 19], [83, 19], [84, 19], [75, 20], [76, 20], [77, 20], [78, 20], [79, 20], [80, 20], [81, 20], [82, 20], [83, 20], [75, 21], [76, 21], [77, 21], [78, 21], [79, 21], [80, 21], [81, 21], [82, 21], [83, 21], [76, 22], [77, 22], [78, 22], [79, 22], [80, 22], [81, 22], [82, 22], [83, 22], [77, 23], [78, 23], [79, 23], [80, 23], [81, 23], [82, 23], [78, 24], [79, 24], [80, 24], [81, 24], [82, 24], [78, 25], [79, 25], [80, 25], [81, 25]],
                  [moonColors[1]]: [[84, 6], [85, 6], [86, 6], [87, 6], [88, 6], [84, 7], [85, 7], [86, 7], [87, 7], [88, 7], [89, 7], [85, 8], [86, 8], [87, 8], [88, 8], [89, 8], [90, 8], [85, 9], [86, 9], [87, 9], [88, 9], [89, 9], [90, 9], [91, 9], [86, 10], [87, 10], [88, 10], [89, 10], [90, 10], [91, 10], [92, 10], [86, 11], [87, 11], [88, 11], [89, 11], [90, 11], [91, 11], [92, 11], [93, 11], [86, 12], [87, 12], [88, 12], [89, 12], [90, 12], [91, 12], [92, 12], [93, 12], [86, 13], [87, 13], [88, 13], [89, 13], [90, 13], [91, 13], [92, 13], [93, 13], [94, 13], [86, 14], [87, 14], [88, 14], [89, 14], [90, 14], [91, 14], [92, 14], [93, 14], [94, 14], [86, 15], [87, 15], [88, 15], [89, 15], [90, 15], [91, 15], [92, 15], [93, 15], [94, 15], [86, 16], [87, 16], [88, 16], [89, 16], [90, 16], [91, 16], [92, 16], [93, 16], [94, 16], [85, 17], [86, 17], [87, 17], [88, 17], [89, 17], [90, 17], [91, 17], [92, 17], [93, 17], [94, 17], [85, 18], [86, 18], [87, 18], [88, 18], [89, 18], [90, 18], [91, 18], [92, 18], [93, 18], [94, 18], [85, 19], [86, 19], [87, 19], [88, 19], [89, 19], [90, 19], [91, 19], [92, 19], [93, 19], [94, 19], [84, 20], [85, 20], [86, 20], [87, 20], [88, 20], [89, 20], [90, 20], [91, 20], [92, 20], [93, 20], [84, 21], [85, 21], [86, 21], [87, 21], [88, 21], [89, 21], [90, 21], [91, 21], [92, 21], [93, 21], [84, 22], [85, 22], [86, 22], [87, 22], [88, 22], [89, 22], [90, 22], [91, 22], [92, 22], [83, 23], [84, 23], [85, 23], [86, 23], [87, 23], [88, 23], [89, 23], [90, 23], [91, 23], [83, 24], [84, 24], [85, 24], [86, 24], [87, 24], [88, 24], [89, 24], [90, 24], [82, 25], [83, 25], [84, 25], [85, 25], [86, 25], [87, 25], [88, 25], [89, 25], [81, 26], [82, 26], [83, 26], [84, 26], [85, 26], [86, 26], [87, 26]]
          }
      },
      {
          trait: "moon3",
          colors: {
                  [moonColors[0]]: [[81, 6], [82, 6], [78, 7], [79, 7], [80, 7], [81, 7], [78, 8], [79, 8], [80, 8], [77, 9], [78, 9], [79, 9], [76, 10], [77, 10], [78, 10], [79, 10], [75, 11], [76, 11], [77, 11], [78, 11], [75, 12], [76, 12], [77, 12], [78, 12], [74, 13], [75, 13], [76, 13], [77, 13], [74, 14], [75, 14], [76, 14], [77, 14], [74, 15], [75, 15], [76, 15], [77, 15], [74, 16], [75, 16], [76, 16], [77, 16], [74, 17], [75, 17], [76, 17], [77, 17], [74, 18], [75, 18], [76, 18], [77, 18], [78, 18], [74, 19], [75, 19], [76, 19], [77, 19], [78, 19], [75, 20], [76, 20], [77, 20], [78, 20], [79, 20], [75, 21], [76, 21], [77, 21], [78, 21], [79, 21], [76, 22], [77, 22], [78, 22], [79, 22], [77, 23], [78, 23], [79, 23], [80, 23], [78, 24], [79, 24], [80, 24], [81, 24], [79, 25], [80, 25], [81, 25], [82, 25], [80, 26], [81, 26], [82, 26], [83, 26]],
                  [moonColors[1]]: [[83, 6], [84, 6], [85, 6], [86, 6], [87, 6], [82, 7], [83, 7], [84, 7], [85, 7], [86, 7], [87, 7], [88, 7], [89, 7], [81, 8], [82, 8], [83, 8], [84, 8], [85, 8], [86, 8], [87, 8], [88, 8], [89, 8], [90, 8], [80, 9], [81, 9], [82, 9], [83, 9], [84, 9], [85, 9], [86, 9], [87, 9], [88, 9], [89, 9], [90, 9], [91, 9], [80, 10], [81, 10], [82, 10], [83, 10], [84, 10], [85, 10], [86, 10], [87, 10], [88, 10], [89, 10], [90, 10], [91, 10], [92, 10], [79, 11], [80, 11], [81, 11], [82, 11], [83, 11], [84, 11], [85, 11], [86, 11], [87, 11], [88, 11], [89, 11], [90, 11], [91, 11], [92, 11], [93, 11], [79, 12], [80, 12], [81, 12], [82, 12], [83, 12], [84, 12], [85, 12], [86, 12], [87, 12], [88, 12], [89, 12], [90, 12], [91, 12], [92, 12], [93, 12], [78, 13], [79, 13], [80, 13], [81, 13], [82, 13], [83, 13], [84, 13], [85, 13], [86, 13], [87, 13], [88, 13], [89, 13], [90, 13], [91, 13], [92, 13], [93, 13], [94, 13], [78, 14], [79, 14], [80, 14], [81, 14], [82, 14], [83, 14], [84, 14], [85, 14], [86, 14], [87, 14], [88, 14], [89, 14], [90, 14], [91, 14], [92, 14], [93, 14], [94, 14], [78, 15], [79, 15], [80, 15], [81, 15], [82, 15], [83, 15], [84, 15], [85, 15], [86, 15], [87, 15], [88, 15], [89, 15], [90, 15], [91, 15], [92, 15], [93, 15], [94, 15], [78, 16], [79, 16], [80, 16], [81, 16], [82, 16], [83, 16], [84, 16], [85, 16], [86, 16], [87, 16], [88, 16], [89, 16], [90, 16], [91, 16], [92, 16], [93, 16], [94, 16], [78, 17], [79, 17], [80, 17], [81, 17], [82, 17], [83, 17], [84, 17], [85, 17], [86, 17], [87, 17], [88, 17], [89, 17], [90, 17], [91, 17], [92, 17], [93, 17], [94, 17], [79, 18], [80, 18], [81, 18], [82, 18], [83, 18], [84, 18], [85, 18], [86, 18], [87, 18], [88, 18], [89, 18], [90, 18], [91, 18], [92, 18], [93, 18], [94, 18], [79, 19], [80, 19], [81, 19], [82, 19], [83, 19], [84, 19], [85, 19], [86, 19], [87, 19], [88, 19], [89, 19], [90, 19], [91, 19], [92, 19], [93, 19], [94, 19], [80, 20], [81, 20], [82, 20], [83, 20], [84, 20], [85, 20], [86, 20], [87, 20], [88, 20], [89, 20], [90, 20], [91, 20], [92, 20], [93, 20], [80, 21], [81, 21], [82, 21], [83, 21], [84, 21], [85, 21], [86, 21], [87, 21], [88, 21], [89, 21], [90, 21], [91, 21], [92, 21], [93, 21], [80, 22], [81, 22], [82, 22], [83, 22], [84, 22], [85, 22], [86, 22], [87, 22], [88, 22], [89, 22], [90, 22], [91, 22], [92, 22], [81, 23], [82, 23], [83, 23], [84, 23], [85, 23], [86, 23], [87, 23], [88, 23], [89, 23], [90, 23], [91, 23], [82, 24], [83, 24], [84, 24], [85, 24], [86, 24], [87, 24], [88, 24], [89, 24], [90, 24], [83, 25], [84, 25], [85, 25], [86, 25], [87, 25], [88, 25], [89, 25], [84, 26], [85, 26], [86, 26], [87, 26], [88, 26]]
          }
      },
      {
          trait: "moon4",
          colors: {
                  [moonColors[1]]: [[81, 6], [82, 6], [83, 6], [84, 6], [85, 6], [86, 6], [87, 6], [79, 7], [80, 7], [81, 7], [82, 7], [83, 7], [84, 7], [85, 7], [86, 7], [87, 7], [88, 7], [89, 7], [78, 8], [79, 8], [80, 8], [81, 8], [82, 8], [83, 8], [84, 8], [85, 8], [86, 8], [87, 8], [88, 8], [89, 8], [90, 8], [77, 9], [78, 9], [79, 9], [80, 9], [81, 9], [82, 9], [83, 9], [84, 9], [85, 9], [86, 9], [87, 9], [88, 9], [89, 9], [90, 9], [91, 9], [76, 10], [77, 10], [78, 10], [79, 10], [80, 10], [81, 10], [82, 10], [83, 10], [84, 10], [85, 10], [86, 10], [87, 10], [88, 10], [89, 10], [90, 10], [91, 10], [92, 10], [75, 11], [76, 11], [77, 11], [78, 11], [79, 11], [80, 11], [81, 11], [82, 11], [83, 11], [84, 11], [85, 11], [86, 11], [87, 11], [88, 11], [89, 11], [90, 11], [91, 11], [92, 11], [93, 11], [75, 12], [76, 12], [77, 12], [78, 12], [79, 12], [80, 12], [81, 12], [82, 12], [83, 12], [84, 12], [85, 12], [86, 12], [87, 12], [88, 12], [89, 12], [90, 12], [91, 12], [92, 12], [93, 12], [74, 13], [75, 13], [76, 13], [77, 13], [78, 13], [79, 13], [80, 13], [81, 13], [82, 13], [83, 13], [84, 13], [85, 13], [86, 13], [87, 13], [88, 13], [89, 13], [90, 13], [91, 13], [92, 13], [93, 13], [94, 13], [74, 14], [75, 14], [76, 14], [77, 14], [78, 14], [79, 14], [80, 14], [81, 14], [82, 14], [83, 14], [84, 14], [85, 14], [86, 14], [87, 14], [88, 14], [89, 14], [90, 14], [91, 14], [92, 14], [93, 14], [94, 14], [74, 15], [75, 15], [76, 15], [77, 15], [78, 15], [79, 15], [80, 15], [81, 15], [82, 15], [83, 15], [84, 15], [85, 15], [86, 15], [87, 15], [88, 15], [89, 15], [90, 15], [91, 15], [92, 15], [93, 15], [94, 15], [74, 16], [75, 16], [76, 16], [77, 16], [78, 16], [79, 16], [80, 16], [81, 16], [82, 16], [83, 16], [84, 16], [85, 16], [86, 16], [87, 16], [88, 16], [89, 16], [90, 16], [91, 16], [92, 16], [93, 16], [94, 16], [74, 17], [75, 17], [76, 17], [77, 17], [78, 17], [79, 17], [80, 17], [81, 17], [82, 17], [83, 17], [84, 17], [85, 17], [86, 17], [87, 17], [88, 17], [89, 17], [90, 17], [91, 17], [92, 17], [93, 17], [94, 17], [74, 18], [75, 18], [76, 18], [77, 18], [78, 18], [79, 18], [80, 18], [81, 18], [82, 18], [83, 18], [84, 18], [85, 18], [86, 18], [87, 18], [88, 18], [89, 18], [90, 18], [91, 18], [92, 18], [93, 18], [94, 18], [74, 19], [75, 19], [76, 19], [77, 19], [78, 19], [79, 19], [80, 19], [81, 19], [82, 19], [83, 19], [84, 19], [85, 19], [86, 19], [87, 19], [88, 19], [89, 19], [90, 19], [91, 19], [92, 19], [93, 19], [94, 19], [75, 20], [76, 20], [77, 20], [78, 20], [79, 20], [80, 20], [81, 20], [82, 20], [83, 20], [84, 20], [85, 20], [86, 20], [87, 20], [88, 20], [89, 20], [90, 20], [91, 20], [92, 20], [93, 20], [75, 21], [76, 21], [77, 21], [78, 21], [79, 21], [80, 21], [81, 21], [82, 21], [83, 21], [84, 21], [85, 21], [86, 21], [87, 21], [88, 21], [89, 21], [90, 21], [91, 21], [92, 21], [93, 21], [76, 22], [77, 22], [78, 22], [79, 22], [80, 22], [81, 22], [82, 22], [83, 22], [84, 22], [85, 22], [86, 22], [87, 22], [88, 22], [89, 22], [90, 22], [91, 22], [92, 22], [77, 23], [78, 23], [79, 23], [80, 23], [81, 23], [82, 23], [83, 23], [84, 23], [85, 23], [86, 23], [87, 23], [88, 23], [89, 23], [90, 23], [91, 23], [78, 24], [79, 24], [80, 24], [81, 24], [82, 24], [83, 24], [84, 24], [85, 24], [86, 24], [87, 24], [88, 24], [89, 24], [90, 24], [79, 25], [80, 25], [81, 25], [82, 25], [83, 25], [84, 25], [85, 25], [86, 25], [87, 25], [88, 25], [89, 25], [81, 26], [82, 26], [83, 26], [84, 26], [85, 26], [86, 26], [87, 26]]
              }
          },
          {
              trait: "moon5",
              colors: {
                  [moonColors[0]]: [[85, 6], [86, 6], [87, 6], [88, 6], [86, 7], [87, 7], [88, 7], [89, 7], [87, 8], [88, 8], [89, 8], [90, 8], [88, 9], [89, 9], [90, 9], [91, 9], [89, 10], [90, 10], [91, 10], [92, 10], [89, 11], [90, 11], [91, 11], [92, 11], [93, 11], [89, 12], [90, 12], [91, 12], [92, 12], [93, 12], [90, 13], [91, 13], [92, 13], [93, 13], [94, 13], [90, 14], [91, 14], [92, 14], [93, 14], [94, 14], [91, 15], [92, 15], [93, 15], [94, 15], [91, 16], [92, 16], [93, 16], [94, 16], [91, 17], [92, 17], [93, 17], [94, 17], [91, 18], [92, 18], [93, 18], [94, 18], [91, 19], [92, 19], [93, 19], [94, 19], [90, 20], [91, 20], [92, 20], [93, 20], [90, 21], [91, 21], [92, 21], [93, 21], [89, 22], [90, 22], [91, 22], [92, 22], [89, 23], [90, 23], [91, 23], [88, 24], [89, 24], [90, 24], [87, 25], [88, 25], [89, 25], [90, 25], [86, 26], [87, 26]],
                  [moonColors[1]]: [[80, 6], [81, 6], [82, 6], [83, 6], [84, 6], [79, 7], [80, 7], [81, 7], [82, 7], [83, 7], [84, 7], [85, 7], [78, 8], [79, 8], [80, 8], [81, 8], [82, 8], [83, 8], [84, 8], [85, 8], [86, 8], [77, 9], [78, 9], [79, 9], [80, 9], [81, 9], [82, 9], [83, 9], [84, 9], [85, 9], [86, 9], [87, 9], [76, 10], [77, 10], [78, 10], [79, 10], [80, 10], [81, 10], [82, 10], [83, 10], [84, 10], [85, 10], [86, 10], [87, 10], [88, 10], [75, 11], [76, 11], [77, 11], [78, 11], [79, 11], [80, 11], [81, 11], [82, 11], [83, 11], [84, 11], [85, 11], [86, 11], [87, 11], [88, 11], [75, 12], [76, 12], [77, 12], [78, 12], [79, 12], [80, 12], [81, 12], [82, 12], [83, 12], [84, 12], [85, 12], [86, 12], [87, 12], [88, 12], [74, 13], [75, 13], [76, 13], [77, 13], [78, 13], [79, 13], [80, 13], [81, 13], [82, 13], [83, 13], [84, 13], [85, 13], [86, 13], [87, 13], [88, 13], [89, 13], [74, 14], [75, 14], [76, 14], [77, 14], [78, 14], [79, 14], [80, 14], [81, 14], [82, 14], [83, 14], [84, 14], [85, 14], [86, 14], [87, 14], [88, 14], [89, 14], [74, 15], [75, 15], [76, 15], [77, 15], [78, 15], [79, 15], [80, 15], [81, 15], [82, 15], [83, 15], [84, 15], [85, 15], [86, 15], [87, 15], [88, 15], [89, 15], [90, 15], [74, 16], [75, 16], [76, 16], [77, 16], [78, 16], [79, 16], [80, 16], [81, 16], [82, 16], [83, 16], [84, 16], [85, 16], [86, 16], [87, 16], [88, 16], [89, 16], [90, 16], [74, 17], [75, 17], [76, 17], [77, 17], [78, 17], [79, 17], [80, 17], [81, 17], [82, 17], [83, 17], [84, 17], [85, 17], [86, 17], [87, 17], [88, 17], [89, 17], [90, 17], [74, 18], [75, 18], [76, 18], [77, 18], [78, 18], [79, 18], [80, 18], [81, 18], [82, 18], [83, 18], [84, 18], [85, 18], [86, 18], [87, 18], [88, 18], [89, 18], [90, 18], [74, 19], [75, 19], [76, 19], [77, 19], [78, 19], [79, 19], [80, 19], [81, 19], [82, 19], [83, 19], [84, 19], [85, 19], [86, 19], [87, 19], [88, 19], [89, 19], [90, 19], [75, 20], [76, 20], [77, 20], [78, 20], [79, 20], [80, 20], [81, 20], [82, 20], [83, 20], [84, 20], [85, 20], [86, 20], [87, 20], [88, 20], [89, 20], [75, 21], [76, 21], [77, 21], [78, 21], [79, 21], [80, 21], [81, 21], [82, 21], [83, 21], [84, 21], [85, 21], [86, 21], [87, 21], [88, 21], [89, 21], [76, 22], [77, 22], [78, 22], [79, 22], [80, 22], [81, 22], [82, 22], [83, 22], [84, 22], [85, 22], [86, 22], [87, 22], [88, 22], [77, 23], [78, 23], [79, 23], [80, 23], [81, 23], [82, 23], [83, 23], [84, 23], [85, 23], [86, 23], [87, 23], [88, 23], [78, 24], [79, 24], [80, 24], [81, 24], [82, 24], [83, 24], [84, 24], [85, 24], [86, 24], [87, 24], [79, 25], [80, 25], [81, 25], [82, 25], [83, 25], [84, 25], [85, 25], [86, 25], [81, 26], [82, 26], [83, 26], [84, 26], [85, 26]]
              }
          },
          {
              trait: "moon6",
              colors: {
                  [moonColors[0]]: [[87, 7], [88, 7], [89, 7], [90, 7], [86, 8], [87, 8], [88, 8], [89, 8], [90, 8], [86, 9], [87, 9], [88, 9], [89, 9], [90, 9], [91, 9], [85, 10], [86, 10], [87, 10], [88, 10], [89, 10], [90, 10], [91, 10], [92, 10], [85, 11], [86, 11], [87, 11], [88, 11], [89, 11], [90, 11], [91, 11], [92, 11], [93, 11], [85, 12], [86, 12], [87, 12], [88, 12], [89, 12], [90, 12], [91, 12], [92, 12], [93, 12], [84, 13], [85, 13], [86, 13], [87, 13], [88, 13], [89, 13], [90, 13], [91, 13], [92, 13], [93, 13], [94, 13], [84, 14], [85, 14], [86, 14], [87, 14], [88, 14], [89, 14], [90, 14], [91, 14], [92, 14], [93, 14], [94, 14], [84, 15], [85, 15], [86, 15], [87, 15], [88, 15], [89, 15], [90, 15], [91, 15], [92, 15], [93, 15], [94, 15], [83, 16], [84, 16], [85, 16], [86, 16], [87, 16], [88, 16], [89, 16], [90, 16], [91, 16], [92, 16], [93, 16], [94, 16], [83, 17], [84, 17], [85, 17], [86, 17], [87, 17], [88, 17], [89, 17], [90, 17], [91, 17], [92, 17], [93, 17], [94, 17], [83, 18], [84, 18], [85, 18], [86, 18], [87, 18], [88, 18], [89, 18], [90, 18], [91, 18], [92, 18], [93, 18], [94, 18], [83, 19], [84, 19], [85, 19], [86, 19], [87, 19], [88, 19], [89, 19], [90, 19], [91, 19], [92, 19], [93, 19], [94, 19], [83, 20], [84, 20], [85, 20], [86, 20], [87, 20], [88, 20], [89, 20], [90, 20], [91, 20], [92, 20], [93, 20], [83, 21], [84, 21], [85, 21], [86, 21], [87, 21], [88, 21], [89, 21], [90, 21], [91, 21], [92, 21], [93, 21], [83, 22], [84, 22], [85, 22], [86, 22], [87, 22], [88, 22], [89, 22], [90, 22], [91, 22], [92, 22], [84, 23], [85, 23], [86, 23], [87, 23], [88, 23], [89, 23], [90, 23], [91, 23], [84, 24], [85, 24], [86, 24], [87, 24], [88, 24], [89, 24], [90, 24], [85, 25], [86, 25], [87, 25], [88, 25], [89, 25], [85, 26], [86, 26], [87, 26], [88, 26]],
                  [moonColors[1]]: [[81, 6], [82, 6], [83, 6], [84, 6], [85, 6], [86, 6], [87, 6], [79, 7], [80, 7], [81, 7], [82, 7], [83, 7], [84, 7], [85, 7], [86, 7], [78, 8], [79, 8], [80, 8], [81, 8], [82, 8], [83, 8], [84, 8], [85, 8], [77, 9], [78, 9], [79, 9], [80, 9], [81, 9], [82, 9], [83, 9], [84, 9], [85, 9], [76, 10], [77, 10], [78, 10], [79, 10], [80, 10], [81, 10], [82, 10], [83, 10], [84, 10], [75, 11], [76, 11], [77, 11], [78, 11], [79, 11], [80, 11], [81, 11], [82, 11], [83, 11], [84, 11], [75, 12], [76, 12], [77, 12], [78, 12], [79, 12], [80, 12], [81, 12], [82, 12], [83, 12], [84, 12], [74, 13], [75, 13], [76, 13], [77, 13], [78, 13], [79, 13], [80, 13], [81, 13], [82, 13], [83, 13], [74, 14], [75, 14], [76, 14], [77, 14], [78, 14], [79, 14], [80, 14], [81, 14], [82, 14], [83, 14], [74, 15], [75, 15], [76, 15], [77, 15], [78, 15], [79, 15], [80, 15], [81, 15], [82, 15], [83, 15], [74, 16], [75, 16], [76, 16], [77, 16], [78, 16], [79, 16], [80, 16], [81, 16], [82, 16], [74, 17], [75, 17], [76, 17], [77, 17], [78, 17], [79, 17], [80, 17], [81, 17], [82, 17], [74, 18], [75, 18], [76, 18], [77, 18], [78, 18], [79, 18], [80, 18], [81, 18], [82, 18], [74, 19], [75, 19], [76, 19], [77, 19], [78, 19], [79, 19], [80, 19], [81, 19], [82, 19], [75, 20], [76, 20], [77, 20], [78, 20], [79, 20], [80, 20], [81, 20], [82, 20], [75, 21], [76, 21], [77, 21], [78, 21], [79, 21], [80, 21], [81, 21], [82, 21], [76, 22], [77, 22], [78, 22], [79, 22], [80, 22], [81, 22], [82, 22], [77, 23], [78, 23], [79, 23], [80, 23], [81, 23], [82, 23], [83, 23], [78, 24], [79, 24], [80, 24], [81, 24], [82, 24], [83, 24], [79, 25], [80, 25], [81, 25], [82, 25], [83, 25], [84, 25], [80, 26], [81, 26], [82, 26], [83, 26], [84, 26]]
              }
          },
          {
              trait: "moon7",
              colors: {
                  [moonColors[0]]: [[84, 6], [85, 6], [86, 6], [87, 6], [88, 6], [82, 7], [83, 7], [84, 7], [85, 7], [86, 7], [87, 7], [88, 7], [89, 7], [82, 8], [83, 8], [84, 8], [85, 8], [86, 8], [87, 8], [88, 8], [89, 8], [90, 8], [81, 9], [82, 9], [83, 9], [84, 9], [85, 9], [86, 9], [87, 9], [88, 9], [89, 9], [90, 9], [91, 9], [80, 10], [81, 10], [82, 10], [83, 10], [84, 10], [85, 10], [86, 10], [87, 10], [88, 10], [89, 10], [90, 10], [91, 10], [92, 10], [80, 11], [81, 11], [82, 11], [83, 11], [84, 11], [85, 11], [86, 11], [87, 11], [88, 11], [89, 11], [90, 11], [91, 11], [92, 11], [93, 11], [80, 12], [81, 12], [82, 12], [83, 12], [84, 12], [85, 12], [86, 12], [87, 12], [88, 12], [89, 12], [90, 12], [91, 12], [92, 12], [93, 12], [79, 13], [80, 13], [81, 13], [82, 13], [83, 13], [84, 13], [85, 13], [86, 13], [87, 13], [88, 13], [89, 13], [90, 13], [91, 13], [92, 13], [93, 13], [94, 13], [79, 14], [80, 14], [81, 14], [82, 14], [83, 14], [84, 14], [85, 14], [86, 14], [87, 14], [88, 14], [89, 14], [90, 14], [91, 14], [92, 14], [93, 14], [94, 14], [78, 15], [79, 15], [80, 15], [81, 15], [82, 15], [83, 15], [84, 15], [85, 15], [86, 15], [87, 15], [88, 15], [89, 15], [90, 15], [91, 15], [92, 15], [93, 15], [94, 15], [78, 16], [79, 16], [80, 16], [81, 16], [82, 16], [83, 16], [84, 16], [85, 16], [86, 16], [87, 16], [88, 16], [89, 16], [90, 16], [91, 16], [92, 16], [93, 16], [94, 16], [78, 17], [79, 17], [80, 17], [81, 17], [82, 17], [83, 17], [84, 17], [85, 17], [86, 17], [87, 17], [88, 17], [89, 17], [90, 17], [91, 17], [92, 17], [93, 17], [94, 17], [78, 18], [79, 18], [80, 18], [81, 18], [82, 18], [83, 18], [84, 18], [85, 18], [86, 18], [87, 18], [88, 18], [89, 18], [90, 18], [91, 18], [92, 18], [93, 18], [94, 18], [78, 19], [79, 19], [80, 19], [81, 19], [82, 19], [83, 19], [84, 19], [85, 19], [86, 19], [87, 19], [88, 19], [89, 19], [90, 19], [91, 19], [92, 19], [93, 19], [94, 19], [79, 20], [80, 20], [81, 20], [82, 20], [83, 20], [84, 20], [85, 20], [86, 20], [87, 20], [88, 20], [89, 20], [90, 20], [91, 20], [92, 20], [93, 20], [79, 21], [80, 21], [81, 21], [82, 21], [83, 21], [84, 21], [85, 21], [86, 21], [87, 21], [88, 21], [89, 21], [90, 21], [91, 21], [92, 21], [93, 21], [80, 22], [81, 22], [82, 22], [83, 22], [84, 22], [85, 22], [86, 22], [87, 22], [88, 22], [89, 22], [90, 22], [91, 22], [92, 22], [80, 23], [81, 23], [82, 23], [83, 23], [84, 23], [85, 23], [86, 23], [87, 23], [88, 23], [89, 23], [90, 23], [91, 23], [81, 24], [82, 24], [83, 24], [84, 24], [85, 24], [86, 24], [87, 24], [88, 24], [89, 24], [90, 24], [82, 25], [83, 25], [84, 25], [85, 25], [86, 25], [87, 25], [88, 25], [89, 25], [83, 26], [84, 26], [85, 26], [86, 26], [87, 26]],
                  [moonColors[1]]: [[80, 6], [81, 6], [82, 6], [83, 6], [79, 7], [80, 7], [81, 7], [78, 8], [79, 8], [80, 8], [81, 8], [77, 9], [78, 9], [79, 9], [80, 9], [76, 10], [77, 10], [78, 10], [79, 10], [75, 11], [76, 11], [77, 11], [78, 11], [79, 11], [75, 12], [76, 12], [77, 12], [78, 12], [79, 12], [74, 13], [75, 13], [76, 13], [77, 13], [78, 13], [74, 14], [75, 14], [76, 14], [77, 14], [78, 14], [74, 15], [75, 15], [76, 15], [77, 15], [74, 16], [75, 16], [76, 16], [77, 16], [74, 17], [75, 17], [76, 17], [77, 17], [74, 18], [75, 18], [76, 18], [77, 18], [74, 19], [75, 19], [76, 19], [77, 19], [75, 20], [76, 20], [77, 20], [78, 20], [75, 21], [76, 21], [77, 21], [78, 21], [76, 22], [77, 22], [78, 22], [79, 22], [77, 23], [78, 23], [79, 23], [78, 24], [79, 24], [80, 24], [78, 25], [79, 25], [80, 25], [81, 25], [81, 26], [82, 26]]
          }
      }
  ];
}

/**
 * Calculates the moon phase for a given date
 * @param {Date} date - The date to calculate the moon phase for
 * @returns {Object} An object containing the phase, stage, and moonIndex
 */
function calculateMoonPhase(date) {
  const KNOWN_NEW_MOON = new Date('2000-01-06');
  const LUNAR_MONTH = 29.53058867;
  if (!date) date = new Date();
  const daysSinceNewMoon = (date - KNOWN_NEW_MOON) / (24 * 3600 * 1000);
  const lunarCycles = Math.floor(daysSinceNewMoon / LUNAR_MONTH);
  const moonIndex = Math.floor(lunarCycles % 13); // 13 ordered moons 
  const lunarMonthsSinceNewMoon = daysSinceNewMoon / LUNAR_MONTH;
  const phase = lunarMonthsSinceNewMoon % 1;
  let stage;
  if (phase < 0.0625) {
      stage = 0;
  } else if (phase >= 0.0625 && phase < 0.1875) {
      stage = 1;
  } else if (phase >= 0.1875 && phase < 0.3125) {
      stage = 2;
  } else if (phase >= 0.3125 && phase < 0.4375) {
      stage = 3;
  } else if (phase >= 0.4375 && phase < 0.5625) {
      stage = 4;
  } else if (phase >= 0.5625 && phase < 0.6875) {
      stage = 5;
  } else if (phase >= 0.6875 && phase < 0.8125) {
      stage = 6;
  } else if (phase >= 0.8125 && phase < 0.9375) {
      stage = 7;
  } else {
      stage = 0;
  }

  return {phase, stage, moonIndex};
}

function organizeDisplayTraits(selectedTraits,allTraitsByCategory) {
  const displayTraits = Array(10).fill().map(() => []);

  selectedTraits.forEach(trait => {
      for (let i = 0; i <= 9; i++) {
          if (allTraitsByCategory[i] && allTraitsByCategory[i].includes(trait)) {
              displayTraits[i].push(trait);
              break;
          }
      }
  });

  displayTraits.forEach(categoryTraits => {
      categoryTraits.sort((a, b) => {
          const rarityA = categoryData.find(item => item.trait === a)?.rarity || 0;
          const rarityB = categoryData.find(item => item.trait === b)?.rarity || 0;
          return rarityB - rarityA;
      });
  });

  return Object.fromEntries(displayTraits.map((traits, index) => [index, traits]));
}

/**
 * Draws the moon on the canvas based on current conditions
 * @param {CanvasRenderingContext2D} ctx - The canvas context to draw on
 * @param {Array} moonColors - Array of colors for the moon
 * @param {string} moonName - Name of the current moon
 * @param {number} stage - Current moon stage
 * @param {number} hours - Current hour of the day
 * @param {boolean} noMoon - Flag to indicate if moon should be drawn
 */
function drawMoon(ctx, moonColors, moonName, stage, hours, noMoon) {
  const moonCoordinates = getMoonCoordinates(moonColors);
  
  if (!noMoon && (hours >= 21 || hours <= 5)) {  
      const moonData = moonCoordinates.find(t => t.trait === `moon${stage}`);
      if (moonData) {
          for (const color in moonData.colors) {
              ctx.fillStyle = color;
              for (const coordinate of moonData.colors[color]) {
                  ctx.fillRect(coordinate[0], coordinate[1], 1, 1); 
              }
          }
      } else {
          console.log('No data found for the current moon stage');
      }
  }
}

/**
 * Finds patterns in a given field
 * @param {number} field - The field to analyze for patterns
 * @param {number} gematriaOneDigit - First gematria value
 * @param {number} gematriaTwoDigit - Second gematria value
 * @param {Array<number>} multiples - Array of multiples to check
 * @param {Array<string>} contains - Array of strings to check for containment
 * @param {Array<number>} powersOf - Array of numbers to check for powers
 * @returns {Array<string>} Array of pattern strings found
 */
function findPatterns(field,gematriaOneDigit,gematriaTwoDigit, multiples,contains,powersOf) {
  const fieldStr = field.toString();
  const patterns = [];
  const digits = '0123456789';
  
  //  Fibonacci patterns
  for (let length = 3; length <= 7; length++) {
      const matching_fields = findFibonacci(field, length);
      if (matching_fields.length > 0) {
          patterns.push(`fibonacci_${length}`);
      }
  }

  for (let power of powersOf) {
      if (isPowerOf(power, field)) {
          patterns.push(`power_of_${power}_${power.toString().length}`);
      }
  }

  const powersOf7 = [343, 2401, 16807, 117649, 823543, 5764801];
  for (let power of powersOf7) {
      if (fieldStr.includes(power.toString())) {
          patterns.push(`inc_power_of_7_${power.toString().length}`);
      }
  }

  patterns.push(`gematria_${gematriaOneDigit}`);
  patterns.push(`gematria_${gematriaTwoDigit}`);
  
  // Check repeating digits
  for (let i = 0; i < digits.length; i++) {
      const digit = digits[i];
      const repeat2 = new RegExp(`${digit}{2}`);
      const repeat3 = new RegExp(`${digit}{3}`);
      const repeat4 = new RegExp(`${digit}{4}`);
      const repeat5 = new RegExp(`${digit}{5}`);
      
      if (repeat2.test(fieldStr)) patterns.push(`repeat_2_${digit}`);
      if (repeat3.test(fieldStr)) patterns.push(`repeat_3_${digit}`);
      if (repeat4.test(fieldStr)) patterns.push(`repeat_4_${digit}`);
      if (repeat5.test(fieldStr)) patterns.push(`repeat_5_${digit}`);
  }

  // Check palindromes
  if (fieldStr.length === 5) {
      if (fieldStr === fieldStr.split('').reverse().join('')) {
          patterns.push('palindrome_5');
      }
  } else if (fieldStr.length === 6) {
      if (fieldStr === fieldStr.split('').reverse().join('')) {
          patterns.push('palindrome_6');
      }
  }

  // Check multiples
  multiples.forEach(multiple => {
      if (field % multiple === 0) {
          patterns.push(`multiple_${multiple}`);
      }
  });

  for (let contain of contains) {
    if (fieldStr.includes(contain)) {
    patterns.push(`contains_${contain}`);
    }
  }

  // Check for perfect squares
  const checkPerfectSquare = (numStr) => {
      const num = parseInt(numStr);
      const sqrt = Math.sqrt(num);
      return sqrt === Math.floor(sqrt);
  };

  for (let i = 0; i <= fieldStr.length - 3; i++) {
      const substr3 = fieldStr.substring(i, i + 3);
      if (substr3[0] !== '0' && checkPerfectSquare(substr3)) {
          patterns.push('perfect_square_3');
          break;
      }
  }

  for (let i = 0; i <= fieldStr.length - 4; i++) {
      const substr4 = fieldStr.substring(i, i + 4);
      if (substr4[0] !== '0' && checkPerfectSquare(substr4)) {
          patterns.push('perfect_square_4');
          break;
      }
  }

  for (let i = 0; i <= fieldStr.length - 5; i++) {
      const substr5 = fieldStr.substring(i, i + 5);
      if (substr5[0] !== '0' && checkPerfectSquare(substr5)) {
          patterns.push('perfect_square_5');
          break;
      }
  }

  for (let i = 0; i <= fieldStr.length - 6; i++) {
      const substr6 = fieldStr.substring(i, i + 6);
      if (substr6[0] !== '0' && checkPerfectSquare(substr6)) {
          patterns.push('perfect_square_6');
          break;
      }
  }

  return patterns;
}

/**
 * Plays a camera sound
 */
function simulatePhotographFlash(element) {
  const originalBackgroundColor = element.style.backgroundColor;
  const originalFilter = element.style.filter;

  element.style.backgroundColor = 'white';
  element.style.filter = 'brightness(2)';
  element.style.transition = 'background-color 0.3s, filter 0.3s';

  setTimeout(() => {
      element.style.backgroundColor = originalBackgroundColor;
      element.style.filter = originalFilter;
      element.style.transition = '';
  }, 600);
}

/**
 * Estimates the block height for a given date
 * @param {Date} targetDate - The date to estimate the block height for
 * @returns {number} The estimated block height
 */
function estimateBlockHeight(targetDate) {
  // Block height at June 12, 2024 at 9:28 PDT
  const referenceBlockHeight = 847642;
  const referenceDate = new Date('2024-06-12T16:28:00Z'); // Convert to UTC
  const averageBlockTimeMinutes = 10;
  const timeDifferenceMinutes = (targetDate - referenceDate) / 60000;
  const estimatedBlockHeight = Math.floor(referenceBlockHeight + (timeDifferenceMinutes / averageBlockTimeMinutes));
  return estimatedBlockHeight;
}

/**
 * Fetches metadata from a given URL
 * @param {string} url - The URL to fetch metadata from
 * @param {boolean} retry - Whether to retry the fetch if it fails
 * @returns {Promise<Object>} The fetched metadata
 */
async function getMetadata(url, retry = false) {
  try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Error fetching metadata:', error);
      if (!retry) {
          const timestamp = Math.floor(Date.now() / (60000 * 10)); // 10 minutes
          const newUrl = `${url}?timestamp=${timestamp}`;
          return getMetadata(newUrl, true);
      }
      throw error;
  }   
}

/**
 * Converts traits to a string representation
 * @param {Array<string>} traits - Array of traits
 * @param {number} start - Start index for traits
 * @param {number} stop - Stop index for traits
 * @returns {string} String representation of traits
 */
function traitsToString(traits,start,stop) {
  let traitsString = '';
  let getRarityForTrait = (traitToFind) => {
      const item = categoryData.find(item => item.trait === traitToFind);
      return item ? item.rarity : null;
  };
  for (let i = start; i <= Math.min(stop,traits.length-1); i++) {
      const trait = traits[i];
      const category = categoryData.find(item => item.trait === trait)?.categoryName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || 'Unknown';
      let rarityString = '';
      if (i >= 10) {
          switch (getRarityForTrait(trait)) {
              case 1: rarityString = '(Uncommon)'; break;
              case 2: rarityString = '(Rare)'; break;
              case 3: rarityString = '(Legendary)'; break;
              case 9: rarityString = '(Epic)'; break;
              default: rarityString = '(Common)';
          }
      }
      traitsString += `<span class="bold">${category}</span>: <span class="normal">${trait} ${rarityString}</span>\n`;
  }
  return traitsString;
}

/**
 * Displays powers as a string
 * @param {Array<number>} totalScores - Array of power scores
 * @returns {string} HTML string representation of powers
 */
function displayPowers(totalScores,avgScore,maxScore) {
  const powers = ['Luck','Health','Stealth','Magic','Agility','Defense','Strength','Crafting'];
  let powersString = '';
  let totalScore = 0;

  for (let i = 0; i < powers.length; i++) {
      const powerName = powers[i];
      const powerScore = totalScores[i];
      totalScore += powerScore;
      powersString += `<div class="trait-container"><span class="bold">${powerName}:</span><span class="normal"> ${powerScore}</span></div>`;
  }
  powersString += `<div class="trait-container"><span class="bold">Total score</span><span class="normal"> ${totalScore} (Average = ${avgScore}  Max = ${maxScore})</span></div>`;

  return powersString;
}

/**
 * Converts moon stage to string representation
 * @param {number} stage - The moon stage
 * @returns {string} String representation of the moon stage
 */
function stageToString(stage) {
  const phases = [
      "New Moon",
      "Waxing Crescent",
      "First Quarter",
      "Waxing Gibbous",
      "Full Moon",
      "Waning Gibbous",
      "Third Quarter",
      "Waning Crescent"
  ];
  return phases[stage] || "Unknown";
}

/**
* Creates DNA from block information
* @param {Object} blockinfo - Object containing block information
* @returns {Array<number>} Array representing the DNA
*/
function createDNA(blockinfo) {
    const nonce = blockinfo.nonce.toString().padStart(8, '0').slice(-10).split('').reverse();
    const timestamp = blockinfo.timestamp.toString().slice(-5).split('').reverse();
    return [...nonce, ...timestamp].map(Number);      
}

/**
* Creates DNA from block information
* @param {number} seed - Number used to seed DNA 
* @returns {Array<number>} Array representing the DNA
*/
function createSeedDNA(seed) {
    const reversedDigits = seed.toString().split('').reverse().map(Number);
    const regularDigits = seed.toString().split('').map(Number);
    return [...reversedDigits, ...regularDigits];
}

/**
 * Converts patterns to a string representation
 * @param {Array<string>} patterns - Array of patterns
 * @returns {string} HTML string representation of patterns
 */
function patternsToString(patterns) {
  let patternsString = '';
  for (let i = 0; i < patterns.length; i++) {
    patternsString += `<span class="normal">${patterns[i]}</span>`;
    if (i < patterns.length - 1) {
      patternsString += ', ';
    }
  }
  return patternsString;
}

/**
 * Checks if a number is a power of another number
 * @param {number} powerNum - The base number
 * @param {number} num - The number to check
 * @returns {boolean} True if num is a power of powerNum, false otherwise
 */
function isPowerOf(powerNum, num) {
  if (num === 1) return true;
  while (num > 1) {
    if (num % powerNum !== 0) {
      return false;
    }
    num /= powerNum;
  }
  return num === 1;
}

/**
 * Finds Fibonacci numbers in a field
 * @param {number} field - The field to search in
 * @param {number} length - The length of Fibonacci numbers to find
 * @returns {Array<string>} Array of matching Fibonacci numbers
 */
function findFibonacci(field, length) {
  const field_str = field.toString();
  const fibonacci = [0, 1];
  let a = 0, b = 1;
  while (fibonacci[fibonacci.length - 1] < Math.pow(10, length)) {
      const c = a + b;
      fibonacci.push(c);
      a = b;
      b = c;
  }
  const matching_fields = [];
  for (let i = 0; i <= field_str.length - length; i++) {
      const substr = field_str.slice(i, i + length);
      if (fibonacci.includes(parseInt(substr)) && substr.length === length && substr[0] !== '0') {
          matching_fields.push(substr);
      }
  }
  return matching_fields;
}

// Function to find embedded perfect squares
function findEmbeddedPerfectSquares(field_str, length) {
    const embedded_squares = [];
    for (let i = 0; i <= field_str.length - length; i++) {
        const substr = field_str.slice(i, i + length);
        const num = parseInt(substr);
            if (isPerfectSquare(num)) {
                embedded_squares.push(num);
            }
        }
    return embedded_squares;
}

// Function to check if a number is a perfect square
function isPerfectSquare(n) {
const sqrt = Math.sqrt(n);
return sqrt === Math.floor(sqrt);
}

/**
 * Calculates Gematria value for a field
 * @param {number} field - The field to calculate Gematria for
 * @param {number} limit - The limit for Gematria calculation
 * @returns {number} The calculated Gematria value
 */
function calculateGematria(field, limit) {
const field_str = field.toString();
let sum_digits = 0;
for (let i = 0; i < field_str.length; i++) {
  sum_digits += parseInt(field_str[i]);
}

while (sum_digits >= 10) {
  sum_digits = sum_digits.toString().split('').reduce((a, b) => a + parseInt(b), 0);
}

return sum_digits;
}

/**
 * Performs Gematria calculation on a block number
 * @param {number} block - The block number
 * @param {number} limit - The limit for Gematria calculation
 * @returns {number} The calculated Gematria value
 */
function doGematria(block, limit = 10) {    
  const blockString = block.toString();
  let sumDigits = blockString.split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  
  // Reduce the sum to a two-digit number
  while (sumDigits >= limit) {
      sumDigits = sumDigits.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  }
  return sumDigits;
}

/**
 * Checks if patterns include a specific pattern
 * @param {Array<string>} patterns - Array of patterns to check
 * @param {string} p - The pattern to look for
 * @returns {boolean} True if the pattern is included, false otherwise
 */
function includesPattern(patterns, p) {
  return patterns.some(pattern => 
      pattern.toLowerCase().includes(p.toLowerCase())
  );
}

/**
 * Checks a block for perfect square
 * @param {string|number} numStr - The block number to check
 * @returns {Object} Object indicating if a perfect square was found and its value
 */
function CheckBlockforPerfectSquare(numStr) {
    numStr = numStr.toString(); 
    for (let i = 0; i <= numStr.length - 3; i++) {
        const threeDigitNum = numStr.substr(i, 3);
        const num = parseInt(threeDigitNum);
        
        if (num >= 100 && num <= 999) {
            const sqrt = Math.sqrt(num);
            if (Math.floor(sqrt) === sqrt) {
                return { found: true, perfectSquare: num };
            }
        }
  }
  return { found: false, perfectSquare: null };
}

/**
 * Replaces a trait for a specific category
 * @param {Array<string>} selectedTraits - Array of selected traits
 * @param {string} stdTrait - The standard trait to replace
 * @param {string} newTrait - The new trait to add
 * @returns {Array<string>} Updated array of selected traits
 */
function replaceTraitforCategory(selectedTraits, stdTrait, newTrait) {
  const category = categoryData.find(item => item.trait === stdTrait)?.category;
  if (category >=0) {
      const index = selectedTraits.findIndex(t => 
          categoryData.find(item => item.trait === t)?.category === category
      );
      if (index !== -1) {
          selectedTraits[index] = newTrait;
      } else {
          selectedTraits.push(newTrait);
      }
  }
  return selectedTraits;
}

/**
 * Converts block patterns to traits
 * @param {Array<string>} selectedTraits - Array of selected traits
 * @param {Array<string>} patterns - Array of patterns to convert
 * @returns {Array<string>} Updated array of selected traits
 */
function convertBlockPatternsToTraits(selectedTraits, patterns) {
  for (const pattern of patterns) {
      const traitName = patternToTrait[pattern];
      if (traitName) selectedTraits.push(traitName);
  }
  return selectedTraits;
}

/**
 * Groups traits by category
 * @param {Array} categoryData - Array of objects containing category, trait, and rarity information
 * @returns {Object} An object containing traitsByCategory and allTraitsByCategory
 */
function groupTraitsByCategory(categoryData) {
  const traitsByCategory = {};
  const allTraitsByCategory = {};

  for (const { category, trait, rarity } of categoryData) {
      if (!traitsByCategory[category]) traitsByCategory[category] = [];
      if (!allTraitsByCategory[category]) allTraitsByCategory[category] = [];
      if (rarity === 0) traitsByCategory[category].push(trait);
      allTraitsByCategory[category].push(trait);
  }

  return { traitsByCategory, allTraitsByCategory };
}

/**
 * Processes display traits, updates total scores, and draws traits
 * @param {Array} displayTraits - Array of traits to display
 * @param {Array} categoryData - Array of category data objects
 * @param {Array} totalScores - Array of total scores to update
 * @param {CanvasRenderingContext2D} ctx - Canvas context for drawing
 * @param {Array} traitCoordinates - Array of trait coordinates
 */
function processAndDrawDisplayTraits(displayTraits, categoryData, totalScores, ctx, traitCoordinates) {
  for (let i = 0; i < displayTraits.length; i++) {
      const trait = displayTraits[i];
      const categoryInfo = categoryData.find(c => c.trait === trait);
      
      if (categoryInfo && Array.isArray(categoryInfo.scores)) {
          for (let j = 0; j < totalScores.length; j++) {
              totalScores[j] += categoryInfo.scores[j];
          }
      }
      
      drawTrait(ctx, traitCoordinates, trait);
  }
  
  return totalScores;
}

window.DMT = {
  functions: new Map(),
  data: new Map(),
  main,
  initialize,
  fetchJson,
  createDNA,
  createSeedDNA,
  moonArray,
  getMoonCoordinates,
  calculateMoonPhase,
  drawMoon,
  findPatterns,
  estimateBlockHeight,
  getMetadata,
  traitsToString,
  displayPowers,
  stageToString,
  patternsToString,
  isPowerOf,
  findFibonacci,
  calculateGematria,
  doGematria,
  includesPattern,
  CheckBlockforPerfectSquare,
  replaceTraitforCategory,
  convertBlockPatternsToTraits,
  processAndDrawDisplayTraits,
  groupTraitsByCategory
};

// Example 1: Calculating moon phase
// const currentDate = new Date();
// const moonInfo = DMT.calculateMoonPhase(currentDate);
// console.log(`Current moon phase: ${moonInfo.phase}`);
// console.log(`Moon stage: ${DMT.stageToString(moonInfo.stage)}`);
// console.log(`Moon index: ${moonInfo.moonIndex}`);

// Example 2: Finding patterns in a block number
// const blockNumber = 789456;
// const patterns = DMT.findPatterns(blockNumber, 7, 9, [3, 5, 7], ['789', '456'], [2, 3]);
// console.log('Patterns found in block number:');
// patterns.forEach(pattern => console.log(`- ${pattern}`));

// Example 3: Creating DNA from block info
// const blockInfo = { nonce: 123456789, timestamp: 1620000000 };
// const dna = DMT.createDNA(blockInfo);
// console.log('DNA created from block info:', dna);

// Example 4: Displaying powers
// const powerScores = [8, 6, 7, 5, 3, 0, 9];
// const avgScore = 3.29;
// const maxScore = 72;
// const powersDisplay = DMT.displayPowers(powerScores,avgScore,maxScore);
// console.log('Character powers:', powersDisplay);

// Example 5: Estimating block height
// const targetDate = new Date('2024-12-31T23:59:59Z');
// const estimatedHeight = DMT.estimateBlockHeight(targetDate);
// console.log(`Estimated block height on ${targetDate.toISOString()}: ${estimatedHeight}`);

// Example 6: Converting traits to string
// const allTraits = ['Rare Eyes', 'Common Hair', 'Legendary Weapon', 'Uncommon Background'];
// const traitsString = DMT.traitsToString(allTraits, 0, 3);
// console.log('Traits description:', traitsString);

// Example 7: Checking for perfect square in block number
// const blockToCheck = '123456789';
// const perfectSquareResult = DMT.CheckBlockforPerfectSquare(blockToCheck);
// console.log('Perfect square check result:', perfectSquareResult);

// Example 8: Replacing trait for category
// let selectedTraits = ['Blue Eyes', 'Red Hair', 'Silver Sword'];
// selectedTraits = DMT.replaceTraitforCategory(selectedTraits, 'Blue Eyes', 'Green Eyes');
// console.log('Updated traits after replacement:', selectedTraits);

// Example 9: Converting block patterns to traits
// const blockPatterns = ['fibonacci_5', 'repeat_3_7', 'palindrome_6'];
// let traits = ['Base Trait'];
// traits = DMT.convertBlockPatternsToTraits(traits, blockPatterns);
// console.log('Traits after converting block patterns:', traits);

// Example 10: Simulating photograph flash
// const imageElement = document.getElementById('characterImage');
// DMT.simulatePhotographFlash(imageElement);
// console.log('Photograph flash effect applied to character image');