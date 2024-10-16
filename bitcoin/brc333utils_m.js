//  **********************************************************************************************************
//  brc333_utils.js
//  Utility functions for BRC333 Dynamic Ordinals protocol
//  
//  This script provides essential utility functions for working with
//  BRC333 ordinals, including fetching inscription data and creating DNA.
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
 * Loads a script dynamically
 * @param {string} url - The URL of the script to load
 * @returns {Promise} Resolves when the script is loaded
 */
function loadScript(url) {
    return new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = url;
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
    });
}

/**
 * Retrieves inscriptions for a specific sat
 * @param {number} sat - The sat number to check
 * @param {string} backup - Backup inscription number in case the API is not working as expected
 * @param {boolean} last - Only return the last inscription on the sat, defaults to false
 * @param {Object} options - Additional options for fetching inscriptions
 * @returns {Promise<Array>} Array of inscription IDs
 */
async function getInscriptionsForSat(sat, backup = null, last = false, options = {}) {
    const { replace = false, processInscriptions = false, skip = 0 } = options;

    if (sat === undefined) {
        console.error('Invalid sat: undefined');
        return [];
    }

    let allInscriptionIds = [];
    let totalSkipped = 0;
    let totalFetched = 0;

    if (last) {
        const url = `/r/sat/${sat}/at/-1`;
        try {
            const response = await getMetadata(url);
            allInscriptionIds = [response];
        } catch (error) {
            console.error(`Error fetching last inscription for sat ${sat}:`, error);
        }
    } else {
        let page = 0;
        let reachedEnd = false;
        while (!reachedEnd) {
            const url = page === 0
                ? `/r/sat/${sat}`
                : `/r/sat/${sat}/${page}`;

            try {
                const response = await getMetadata(url);
                if (response && Array.isArray(response.ids)) {
                    const remainingToSkip = Math.max(skip - totalSkipped, 0);
                    const newIds = response.ids.slice(remainingToSkip);
                    totalSkipped += Math.min(remainingToSkip, response.ids.length);
                    totalFetched += newIds.length;

                    allInscriptionIds = allInscriptionIds.concat(newIds);
                    
                    if (response.ids.length < 100) {
                        reachedEnd = true; // We've reached the last page
                        break;
                    }
                    page++;
                } else {
                    console.warn(`Unexpected response format for sat ${sat}:`, response);
                    reachedEnd = true;
                }
            } catch (error) {
                console.error(`Error fetching inscription IDs for sat ${sat}:`, error);
                reachedEnd = true;
            }
        }
    }

    // If allInscriptionIds is empty and a backup is provided, use the backup
    if (allInscriptionIds.length === 0 && backup && totalFetched == 0 && (!skip || skip === 0)) {
        allInscriptionIds = [backup];
    }

    if (processInscriptions && allInscriptionIds.length >= 0) {
        await processInscriptions(allInscriptionIds, replace);
    }

    return allInscriptionIds;

    /**
     * Options for getInscriptionsForSat:
     * @param {boolean} options.replace - If true, replace existing inscriptions data
     * @param {Function} options.processInscriptions - A callback function to process fetched inscription IDs
     * @param {number} options.skip - Number of initial inscriptions to skip
     * 
     * Example usage:
     * getInscriptionsForSat(1742692208397618, false, { skip: 5 })
     *   .then(inscriptions => console.log(inscriptions));
     */
}

/**
 * Gets the content of a specific inscription
 * @param {isSat} - true if it is a satoshi
 * @param {string} field - The satoshi number or the inscriptionId 
 * @returns {Promise<Object|null>} The inscription content or null if not found
 */
async function getInscriptionContent( isSat, field ) {
    if ( !field  ) {
        console.error('Invalid input', field, 'iSsat:', isSat);
        return null;
    }

    let url;
    if (isSat) {
        const mostRecent = await getLastInscriptionForSat(parseInt(field));
        url = `/content/${mostRecent}`;
    } else {
        url = `/content/${field}`;
    }

    try {
        return await getMetadata(url);
    } catch (error) {
        console.error(`Error fetching content for inscription ${field}, ${sat}:`, error);
        return null;
    }
}

/**
 * @param {string} sat - Sat number to fetch the script from
 * @returns {Object} - Contains content (latest script) and height (block height)
 */
async function fetchLatestScriptFromSat(sat) {
    const response = await fetch(`/r/sat/${sat}/at/-1`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const inscription = await response.json();
    const inscriptionId = inscription.id;
    
    const contentResponse = await fetch(`/content/${inscriptionId}`);
    if (!contentResponse.ok) {
        throw new Error(`HTTP error! status: ${contentResponse.status}`);
    }
    return await contentResponse.text();
}

/**
 * Creates a DNA sequence from block information
 * @param {Object} blockinfo - The block information
 * @returns {Array} The generated DNA sequence
 */
function createDNA(blockinfo) {
    const nonce = blockinfo.nonce.toString().padStart(8, '0').slice(-10).split('').reverse();
    const timestamp = blockinfo.timestamp.toString().slice(-5).split('').reverse();
    const dna = [...nonce, ...timestamp].map(Number);
    return dna;
}

/**
 * Converts a Unix timestamp to a formatted date string in the browser's timezone
 * @param {number} date - Unix timestamp in seconds
 * @returns {string} Formatted date string in local timezone
 */
function displayDate(date) {
    return new Date(date).toLocaleString(undefined, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short'
    });
}

/**
 * Converts a decimal number to its hexadecimal representation
 * @param {number} number - The decimal number to convert
 * @returns {string} The hexadecimal representation with '0x' prefix
 */
function displayHex(number) {
    return '0x' + number.toString(16).toUpperCase();
}

/**
 * Copies the given text to the clipboard
 * @param {string} text - The text to be copied to the clipboard
 */
function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            alert("Inscription ID copied to clipboard!");
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand("copy");
            alert("Inscription ID copied to clipboard!");
        } catch (err) {
            console.error("Unable to copy to clipboard", err);
        }
        document.body.removeChild(textArea);
    }
}

window.Utils = {
    loadScript,
    getInscriptionsForSat,
    getInscriptionContent,
    fetchLatestScriptFromSat,
    createDNA,
    displayDate,
    displayHex,
    copyToClipboard
};

// Examples:

// Load a script dynamically
//Utils.loadScript('https://example.com/script.js').then(() => console.log('Script loaded'));

// Get inscriptions for a sat
//Utils.getInscriptionsForSat(1742692208397618, { skip: 5 }).then(inscriptions => console.log(inscriptions));

// Get inscription content
//Utils.getInscriptionContent('6fb976ab49dcec017f1e201e84395983204ae1a7c2f9d8d4cd3c88189486ffb3i0').then(content => console.log(content));

// Create DNA from block info
//const blockInfo = { nonce: 123456789, timestamp: 1620000000 };
//const dna = Utils.createDNA(blockInfo);
//console.log(dna);
