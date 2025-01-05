//  **********************************************************************************************************
//  brc333data.js
//  The Data module for BRC333 Open Docs satplication
//  
//  This script handles data fetching, layout content, timestamps and markdown processing
//
//  Created: Shiftshapr (2024-11-1)
//  **********************************************************************************************************
//  About the BRC333 Protocol and Satplications:
//  The BRC333 Dynamic Ordinals protocol, developed by Bridgit DAO, revolutionizes Bitcoin by introducing 
//  satplications—modular, decentralized applications (dApps) built directly on the blockchain. Satplications 
//  harness Bitcoin's unmatched security and permanence to create immutable, future-proof systems without 
//  relying on smart contracts or gas fees.
//
//  What are Satplications?
//  Satplications are dynamic stacks of satoshis that integrate logic and data through recursive inscriptions. 
//  This innovative design enables:
//  - Immutable applications that endure as long as Bitcoin exists.
//  - Continuous adaptability, allowing seamless updates over time.
//  - A decentralized foundation, free from censorship and scalable for global adoption.
//
//  Key Features of BRC333 Satplications:
//  - Reinscription-based updates, enabling dynamic state changes and evolvable behavior.
//  - Time-sensitive triggers tied to specific block heights for scheduling updates and events.
//  - Modular architecture for structured information management across code, data, and configuration sats.
//  - Immutable data preservation combined with adaptive logic for future-proof applications.
//  - Multi-layered interaction systems, supporting complex relationships between state, data, and logic sats.
//  - Cross-blockchain synchronization for integrating and connecting distributed information networks.
//
//  Why BRC333 Matters:
//  BRC333 transforms Bitcoin from a passive ledger into an active, decentralized platform for innovation. 
//  Satplications empower developers to create interactive, self-sustaining systems that redefine what’s 
//  possible on Bitcoin, without the constraints of traditional smart contract platforms.
//
//  For more information on BRC333 and satplications, visit https://brc333.xyz
//  *********************************************************************************************************/

const hooks = new Map();

/**
 * Registers a callback function for a specific hook identifier
 * @param {string} hookId - Unique identifier for the hook
 * @param {Function} callback - Function to execute when hook is triggered
 */

function registerHook(hookId, callback) {
    //if (testing) console.log(`Registering hook for code word: ${hookId}`);
    hooks.set(hookId, callback);
}

/**
 * Executes a registered hook with provided context
 * @param {string} hookId - Identifier of hook to execute
 * @param {Object} context - Data passed to hook callback
 */
function executeHook(hookId, context) {
    if (hooks.has(hookId)) {
        const hookFn = hooks.get(hookId);
        hookFn(context);
    }
}

/**
 * Processes inscriptions for hooks and registers them
 * @param {number} sat - Satoshi number to fetch inscriptions from
 * @returns {Promise<void>} 
 */
async function processHookInscriptions(sat) {
    const inscriptionIds = await getInscriptionsForSat(sat);
    const hookUrls = inscriptionIds.map(id => `${baseUrl}/content/${id}`);
    for (const url of hookUrls) {
        const code = await getMetadata(url);
        const executableCode = code
            .split('\n')
            .filter(line => !line.trim().startsWith('//') || !line.trim().startsWith('/*' || !line.trim().startsWith('**')))
            .join('\n')
            .trim();
        const locationMatch = executableCode.match(/const\s+hookId\s*=\s*"(\w+)"/);
        if (locationMatch) {
            const hookId = locationMatch[1];
            const hookFunction = new Function('context', executableCode);
            registerHook(hookId, hookFunction);
        }
    }
}

/**
 * Fetches and processes layout content
 * @returns {Promise<void>}
 */
async function fetchLayoutContent() {
    executeHook('fetchLayoutContent.start');
    const inscriptionIds = await getInscriptionsForSat(layoutSat.sat, null, true);
    if (!inscriptionIds || inscriptionIds.length === 0) return;
    
    let layoutHTML = await getInscriptionContent(inscriptionIds[0]);

    if (testing === true)
        layoutHTML = layoutHTML.replace(/src="\//g, 'src="https://ordinals.com/');

    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = layoutHTML;
    
    const elements = ['initial-image', 'title', 'preface'].forEach(id => {
        const newElement = tempContainer.querySelector(`#${id}, .${id}`);
        const currentElement = document.querySelector(`#${id}, .${id}`);
        if (newElement && currentElement) {
            currentElement.outerHTML = newElement.outerHTML;
        }
    });
    executeHook('fetchLayoutContent.end');
}

/**
 /**
 * Processes the date for an article, handling both explicit dates and inscription timestamps
 * @param {Object} article - The article object containing either date string or inscription id
 * @param {string} article.date - Optional date string in format "DD MMM YYYY HH:mm:ss Z" 
 * @param {string} article.id - The inscription id to get timestamp from if no date provided
 * @returns {number} Timestamp in milliseconds
 */
async function processArticleDate(article) {
    executeHook('processArticleDate.start', { article });
    if (article.date) {
        executeHook('processArticleDate.return1', { date: article.date });
        return new Date(article.date).getTime();
    } else {
        const inscriptionTimestamp = await getInscriptionTimestamp(article.id);
        executeHook('processArticleDate.return2', { article, timestamp: inscriptionTimestamp });
        return inscriptionTimestamp * 1000; 
    }
}

/**
 * Retrieves timestamp from inscription metadata
 * @param {string} inscriptionId - The inscription ID to lookup
 * @returns {number} Unix timestamp in seconds
 */
async function getInscriptionTimestamp(inscriptionId) {
    try {
        const data = await getMetadata(`${baseUrl}/r/inscription/${inscriptionId}`);
        return data.timestamp;
    } catch (error) {
        console.log(`Error fetching timestamp for inscription ${inscriptionId}:`, error);
        return Date.now() / 1000;
    }
}

/**
 * Loads and configures the marked markdown parser
 * @returns {Promise<void>} Resolves when marked is loaded and configured
 */
async function loadMarked() {
    executeHook('loadMarked.start');
    let markedText = await getMetadata(`${baseUrl}/content/fbac58f3425e1f087aafde7aeeb04c9620f8df56b46e4e1299c03aa97211ba04i0`, false);
    markedText = markedText.replace(/export\s*{[\s\S]*?};/, 'window.marked = marked;');
    
    const script = document.createElement('script');
    script.textContent = markedText;
    document.head.appendChild(script);
    executeHook('loadMarked.end');
}

/**
 * Extracts inscription ID from various URL formats
 * @param {string} url - URL containing inscription ID in either content/[ID] or ord.io/[number] format
 * @returns {Promise<string|null>} The extracted inscription ID or null if not found
 * @example
 * // Returns "abc123..." from "domain/content/abc123..."
 * // Returns "xyz789..." from "ord.io/12345" by fetching page
 */
async function getInscriptionId(url, testingId = null) {
    executeHook('getInscriptionId.start', { url, testingId });
    let inscriptionId = null;
    const contentPattern = /(.+)\/content\/([a-zA-Z0-9]+)$/;
    const ordPattern = /ord\.io\/(\d+)$/;

    const contentMatch = url.match(contentPattern);
    if (contentMatch) {
        inscriptionId = contentMatch[2];
    } else {
        const ordMatch = url.match(ordPattern);
        if (ordMatch) {
            inscriptionId = await window.getOrdIoInscriptionId(url);
        } else {
            inscriptionId = testingId;
        }
    }
    executeHook('getInscriptionId.return', { url, inscriptionId });
    return inscriptionId;
}

window.BRC333Data = {
    registerHook,
    executeHook,
    processHookInscriptions,
    fetchLayoutContent,
    processArticleDate,
    getInscriptionTimestamp,
    loadMarked,
    getInscriptionId
};

/* Usage examples:
await BRC333Data.fetchLayoutContent();
const timestamp = await BRC333Data.processArticleDate(article);
const inscriptionTime = await BRC333Data.getInscriptionTimestamp('abc123');
await BRC333Data.loadMarked();
*/
