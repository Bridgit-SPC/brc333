//  **********************************************************************************************************
//  brc333_timetravel.js
//  Part of the BRC333 Dynamic Ordinals protocol
//  
//  This script handles time travel functionality for BRC333 ordinals.
//  It processes inscriptions, manages timeline entries, and executes
//  various operations based on inscription content.
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
 * Initializes the time travel functionality
 * @param {string} inscriptionId - The ID of the ordinal
 * @param {Object} testContent - Test content for processing (optional)
 * @param {string} project - the name of the project
 * @returns {Promise<Array>} Array of inscription IDs
 */
async function initializeTimeTravel(thisSat,project,testContent = null) {
  const systemIds = await getInscriptionsForSat(sysTimeTravel.sat, sysTimeTravel.backup, false, { replace: true, processInscriptions: false, skip: sysTimeTravel.skip || 0 }); 
  const myIds = await getInscriptionsForSat(thisSat, null, false,  { replace: true, processInscriptions: false });
  const inscriptionIds = [...systemIds, ...myIds];

  try {
      if (testContent) {
          await TimeTravel.processInscriptions(inscriptionIds, true, project,testContent);
      } else {
          await TimeTravel.processInscriptions(inscriptionIds, true, project);
      }
  } catch (error) {
      console.error('Error processing time travel Inscriptions', error);
  }    
  return inscriptionIds;
}

/**
 * Processes multiple inscriptions
 * @param {Array} inscriptionIds - Array of inscription IDs to process
 * @param {boolean} replaceLines - Whether to replace lines in the inscriptions
 * @param {Object} testContent - Test content for processing (optional)
 * @param {string} project - the name of the project
 */
async function processInscriptions(inscriptionIds, replaceLines, project, testContent) {
  
  if (testContent) {
    this.processInscription(null, replaceLines,project,testContent);
  } else 
    for (const id of inscriptionIds) {
      await this.processInscription(id, replaceLines, project );
    }
}

/**
 * Retrieves information about a specific inscription
 * @param {string} inscriptionId - The mint text of the inscription
 * @returns {Promise<Object>} Inscription information
 */
async function getInscriptionInfo(inscriptionId) {
    let inscriptionInfo;
    try {
        inscriptionInfo = await getMetadata(`/r/inscription/${inscriptionId}`);
    } catch (error) {
        inscriptionInfo = { height: 864805, sat: 1743575836499975, nonce: 4071902504, timestamp: 1728417398, bits: 386084628 };  
    }
    return inscriptionInfo;
}

/**
 * Extracts the inscription ID from the current URL.
 * Works with URLs containing either 'inscription' or 'content' in the path.
 * @returns {string|null} The extracted inscription ID or null if not found.
 */
function getInscriptionIdFromUrl() {
  try {
      const fullUrl = window.location.href;
      const urlParts = fullUrl.split('/');
      const inscriptionIndex = urlParts.indexOf('inscription');
      const contentIndex = urlParts.indexOf('content');
      
      // Use whichever index is found (inscription takes precedence)
      const index = inscriptionIndex !== -1 ? inscriptionIndex : contentIndex;
      
      if (index !== -1 && index < urlParts.length - 1) {
          return urlParts[index + 1];
      } else {
          throw new Error('Invalid URL format');
      }
  } catch (error) {
      console.error('Error extracting inscriptionId:', error.message);
      return '264e8a2a4a2dd75d44a3e603717ab0dd0c67c36510bf25c5bf0316dc32c82590i0';  // placeholder for testing 
  }
}

/**
 * Fetches the current block height from the blockchain
 * @returns {Promise<number>} The current block height
 */
async function getCurrentBlockHeight() {
  const url = '/r/blockheight';
  return getMetadata(url);
}    

/**
 * Processes a single inscription
 * @param {string} inscriptionId - The ID of the inscription to process
 * @param {boolean} replaceLines - Whether to replace lines in the inscription
 * @param {Object} testContent - Test content for processing (optional)
 * @param {string} project - the name of the project
 */
async function processInscription(inscriptionId, replaceLines = false, project, testContent = null) {
  let content;
  if (testContent) {
    content = testContent;
  } else {
    content = await getInscriptionContent(false, inscriptionId);
  }
  if (content && content.protocol === 'BRC333' && content.operation === 'timetravel') {
    const currentBlockHeight = await this.getCurrentBlockHeight(); 

    if (replaceLines) {
      content.entries.filter(entry => entry.type === 'replaceLines' && (!entry.height || currentBlockHeight >= entry.height) && entry.project === project).forEach(entry => {
        this.handleLineReplace(entry.payload);
      });
    } else {
      content.entries.filter(entry => entry.type === 'replace' && (!entry.height || currentBlockHeight >= entry.height) && entry.project === project).forEach(entry => {
        this.handleReplace(entry.payload);
      });
      content.entries.filter(entry => entry.type === 'data' && (!entry.height || currentBlockHeight >= entry.height) && entry.project === project).forEach(entry => {
        this.handleData(entry.payload);
      });
      content.entries.filter(entry => entry.type === 'code' && (!entry.height || currentBlockHeight >= entry.height) && entry.project === project).forEach(entry => {
        this.handleCode(entry.payload);
      });
      content.entries.filter(entry => entry.type === 'command' && (!entry.height || currentBlockHeight >= entry.height) && entry.project === project).forEach(entry => {
        this.handleCommand(entry.payload);
      });      
    }
  }
  // Note: This function handles different types of timeline entries:
  // - replaceLines: Replaces specific lines in the script
  // - replace: Replaces entire functions
  // - data: Sets global variables
  // - code: Executes custom code
  // - command: Executes custom commands
}

/**
 * Handles data type timeline entries
 * @param {Object} payload - The data payload to process
 */
function handleData(payload) {
  Object.entries(payload).forEach(([key, value]) => {
    window[key] = value;
  });
}

/**
 * Handles code type timeline entries
 * @param {string} payload - The code payload to process
 */
function handleCode(payload) {
  const functionName = payload.match(/function\s+(\w+)/)[1];
  const content = this.data; 
  window[functionName] = new Function('content', `return ${payload}`)(content);
}

/**
 * Handles replace type timeline entries
 * @param {string} payload - The replace payload to process
 */
function handleReplace(payload) {
  try {
    const payloadObj = JSON.parse(payload);
    const { funcName, funcBody, inputs = [], isAsync = false } = payloadObj;
    
    if (isAsync) {
      window[funcName] = new AsyncFunction(...inputs, funcBody);
    } else {
      window[funcName] = new Function(...inputs, funcBody);
    }
    
  } catch (error) {
    console.error('Error parsing payload:', error);
  }
}

/**
 * Handles replaceLines type timeline entries
 * @param {string} payload - The replaceLines payload to process
 */
function handleLineReplace(payload) {
  const payloadObject = eval(`(${payload})`);
  const { scriptName, start, stop, code } = payloadObject;

  if (script) {
    let scriptLines = script.textContent.split('\n');
    if (stop === -1) {
      scriptLines.splice(start - 1, 0, code);
    } else {
      scriptLines.splice(start - 1, stop - start + 1, code);
    }
    script.textContent = scriptLines.join('\n');
  } else {
    console.log(`Script with id ${scriptName} not found`);
  }
}

/**
 * Handles command type timeline entries
 * @param {string} payload - The command payload to execute
 */
async function handleCommand(payload) {
  const executeCommand = new Function(payload);
  executeCommand();
}

window.TimeTravel = {
  functions: new Map(),
  data: new Map(),
  initializeTimeTravel,
  processInscriptions,
  getInscriptionInfo,
  getInscriptionIdFromUrl,
  getCurrentBlockHeight,
  processInscription,
  handleData,
  handleCode,
  handleReplace,
  handleLineReplace,
  handleCommand
};

// Initialize time travel for a specific ordinal and process inscriptions
//const inscriptionId = '37040fe9e6543892fd04c192cfa4a5c60b1fa710fe66545b3d026ddd674159fci0';
//const inscriptionIds = await TimeTravel.initializeTimeTravel(inscriptionId);
//console.log('Processed inscriptions:', inscriptionIds);

// Check a specific sat for inscriptions with custom options
//const sysTimeTravelSat = 1742692208397618;
//const skip = 5;
//const inscriptions = await TimeTravel.checkSatForInscriptions(sysTimeTravelSat, last, { skip });
//console.log('Inscriptions found:', inscriptions);

// Process an inscription with specific content
//const testContent = {
//    protocol: 'BRC333',
//    operation: 'timetravel',
//    timelineEntries: [
//        { type: 'data', payload: { key: 'value' } },
//        { type: 'code', payload: 'function newFunc() { console.log("New function"); }' },
//        { type: 'replace', payload: JSON.stringify({ funcName: 'existingFunc', funcBody: 'console.log("Updated function");' }) },
//        { type: 'command', payload: 'console.log("Executing command");' }
//    ]
//};
//await TimeTravel.processInscription('inscriptionId123', false, testContent);

// Handle different types of timeline entries
//TimeTravel.handleData({ globalVar: 'newValue' });
//TimeTravel.handleCode('function addedFunc() { return "Added via code"; }');
//TimeTravel.handleReplace('{"funcName": "replacedFunc", "funcBody": "return \'Replaced function\';" }');
//TimeTravel.handleLineReplace('{"scriptName": "mainScript", "start": 10, "stop": 15, "code": "console.log(\'New lines\');" }');
//TimeTravel.handleCommand('alert("Command executed");');


// Performance note: This script interacts with the blockchain and processes inscriptions.
// Be mindful of potential performance impacts when processing large numbers of inscriptions.
