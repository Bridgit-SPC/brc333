//  **********************************************************************************************************
//  brc333_router.js
//  Part of the BRC333 Dynamic Ordinals protocol
//  
//  This script routes to the sapplication on the passed in sat and gets the latest version of the script and 
//  the cutoff block after which time travel scripts can be executed 
//  
//  Created: Shiftshapr (2024-09-27)
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
 * @param {string} blk - Block number
 * @param {string} sapplication - Sat application number
 * @param {string} m - JSON string containing operation parameters
 * @returns {void} - Appends initialized script to the document
 */
async function router(blk, sapplication, m) {
    const { content: latestScript, height } = await fetchLatestScriptFromSat(sapplication);
    console.log('latestScript',latestScript);
    console.log('height',height);
    const params = JSON.parse(m);
    
    if (params.op === 'mint' && params.p === 'brc333') {
        const initializedScript = initializeScript(latestScript, blk, params.s);
        appendScript(initializedScript);
    } else {
        console.log('Unsupported operation or protocol');
    }
}

/**
 * @param {string} sat - Sat number to fetch the script from
 * @returns {Object} - Contains content (latest script) and height (block height)
 */
async function fetchLatestScriptFromSat(sat) {
    console.log('sat',sat);
    const response = await fetch(`https://ordinals.com/r/sat/${sat}/at/-1`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const inscription = await response.json();
    console.log('inscription', inscription);
    const inscriptionId = inscription.id;
    console.log('inscriptionId', inscriptionId);

    //const contentResponse = await fetch(`https://ordinals.com/content/${inscriptionId}`);
    const contentResponse = await fetch('https://natowls.xyz/fg_local_test.js');
    console.log('contentResponse.text',contentResponse.text);
    const inscriptionInfo = await fetch(`https://ordinals.com/inscription/${inscriptionId}`);
    console.log('inscriptionInfo',inscriptionInfo);
    if (!contentResponse.ok) {
        throw new Error(`HTTP error! status: ${contentResponse.status}`);
    }
    return {
        content: await contentResponse.text(),
        height: (await inscriptionInfo.json()).height
    };
}


/**
 * @param {string} script - The script to initialize
 * @param {string} blk - Block number
 * @param {string} slug - Collection slug
 * @returns {string} - Initialized script with blk and slug variables
 */
function initializeScript(script, blk, slug) {
    // Initialize the script with the blk and collection variables
    return `const blk = ${blk}; const slug = "${slug}"; ${script}`;
}

/**
 * @param {string} script - The script to append
 * @returns {void} - Appends the script to the document body
 */
function appendScript(script) {
    const scriptElement = document.createElement('script');
    scriptElement.textContent = script;
    document.body.appendChild(scriptElement);
}

// Extract parameters from the script tag
const scriptTag = document.currentScript;
const blk = scriptTag.getAttribute('blk');
const sapplication = scriptTag.getAttribute('sapplication');
const m = scriptTag.getAttribute('m');

console.log('blk', blk);
console.log('sapplication', sapplication);
console.log('m', m);

// Run the router
router(blk, sapplication, m);
