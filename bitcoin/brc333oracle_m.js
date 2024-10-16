//  **********************************************************************************************************
//  brc333_oracle.js
//  Protocol: BRC333
//  Utility: Oracle 
//  Description: This script is used to check sats for reinscriptions with messages after load and process
//  accordingly.
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

// Global configuration
const messageElements = new Map();
/**
 * Initializes the oracle functionality
 * @param {Function} displayTraits - Function to display traits
 */
async function initializeOracle(displayTraits, inscriptionId = null) {

  let inscriptionInfo;
  if (inscriptionId && inscriptionId != "MINT_INSCRIPTION_ID") {
    try {
      inscriptionInfo = await getMetadata(`/r/inscription/${inscriptionId}`);
    } catch (error) {
      inscriptionInfo = { height: 859750 };
      console.error('Error fetching inscriptionInfo:', error);
    }
  } else inscriptionInfo = { height: 859750 };
  
  try {
      ({ messages, stopDisplay } = await processMessages(oracleSats, false, 5000, true, container,true,inscriptionInfo.height,blockheight));
  } catch (error) {
      console.error('Error processing messages:', error);
  }
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
      return null;
  }
}

/**
 * Cleans up oracle-related DOM elements
 */
function cleanup() {
  const container = document.querySelector('.image-container');
  if (container) {
      container.querySelectorAll('[style*="position: absolute; bottom: 0px;"]').forEach(div => div.remove());
      container.querySelectorAll('[style*="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%;"]').forEach(container => container.remove());
  }
  messageElements.clear();
}

/**
 * Retrieves inscription IDs for a specific sat
 * @param {number} sat - The sat number to check
 * @param {number} page - Page number for pagination
 * @param {number} skip - Number of inscriptions to skip
 * @returns {Promise<Array>} Array of inscription IDs
 */
const rateLimiter = new Map();
async function getInscriptionIds(sat, page = 0, skip = 0) {
  const key = `${sat}-${page}`;
  if (rateLimiter.has(key) && Date.now() - rateLimiter.get(key) < 1000) {
      throw new Error('Rate limit exceeded');
  }
rateLimiter.set(key, Date.now());
  if (sat === undefined) {
    console.error('Invalid sat: undefined');
    return [];
  }
  const url = page === 0 
    ? `/r/sat/${sat}`
    : `/r/sat/${sat}/${page}`;
  try {
    const response = await getMetadata(url);
    //console.log('response',response);
    if (response && Array.isArray(response.ids)) {
      return response.ids.slice(skip);
    } else {
      console.warn(`Unexpected response format for sat ${sat}:`, response);
      return [];
    }
  } catch (error) {
    console.error(`Error fetching inscription IDs for sat ${sat}:`, error);
    return [];
  }
}

/**
 * Retrieves a specific inscription ID for a given sat and index
 * @param {number} sat - The sat number to check
 * @param {number} index - The index of the inscription to retrieve
 * @param {number} skip - Number of inscriptions to skip (default: 0)
 * @returns {Promise<Object>} The inscription ID object
 */
async function getInscriptionIdAt(sat, index, skip = 0) {
  const adjustedIndex = index >= 0 ? index + skip : index;
  const url = `/r/sat/${sat}/at/${adjustedIndex}`;
  return getMetadata(url);
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
 * Displays scrolling messages in the UI
 * @param {Array} messages - Array of message objects to display
 * @param {number} interval - Interval between message changes
 * @param {boolean} repeat - Whether to repeat messages
 * @param {HTMLElement} container - Container element for messages
 * @param {boolean} scrollText - Whether to scroll text
 * @returns {Function} Function to stop message display
 */
function displayScrollingMessages(messages, interval = 5000, repeat = true, container = document.body, scrollText = true) {
  cleanup();
  const lowerThirds = document.createElement('div');
  lowerThirds.style.cssText = `
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 40px;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    font-size: 18px;
    overflow: hidden;
    white-space: nowrap;
    z-index: 2;
    display: flex;
    align-items: center;
    pointer-events: auto;
  `;

  const scrollContainer = document.createElement('div');
  
  scrollContainer.style.cssText = `
    display: inline-block;
    white-space: nowrap;
    padding-left: 100%;
    font-family: 'Helvetica', monospace;
    color: #ffffff;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
    z-index: 3;
    pointer-events: none;
  `;
  scrollContainer.style.width = `${messages.length * 100}vw`;

  const imageContainer = document.createElement('div');
  imageContainer.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    z-index: 1;
    display: none;
  `;

  lowerThirds.appendChild(scrollContainer);
  container.appendChild(imageContainer);
  container.appendChild(lowerThirds);

  const style = document.createElement('style');
  style.textContent = `
    @keyframes scrollText {
      0% { transform: translateX(100%); }
      100% { transform: translateX(-100%); }
    }
  `;
  document.head.appendChild(style);

  const fragment = document.createDocumentFragment();
  messages.forEach(msg => {
      const messageSpan = document.createElement('span');
      messageSpan.textContent = msg.message;
      messageSpan.id = `message-${Math.random().toString(36).substr(2, 9)}`;
      messageSpan.style.cssText = `
          display: inline-block;
          padding: 0 20vw;
          line-height: 40px;
          color: #ffffff !important;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
      `;
      fragment.appendChild(messageSpan);  
  });
  scrollContainer.appendChild(fragment);

  let index = 0;
  function showNextMessage() {
    const currentMessage = messages[index];
    if (currentMessage.image) {
      const imageUrl = `/content/${currentMessage.image}`;
      fetch(imageUrl)
        .then(response => {
          const contentType = response.headers.get('content-type');
          if (contentType.startsWith('image/')) {
            return `<img src="${imageUrl}" style="max-width: 100%; max-height: 100%; object-fit: contain;">`;
          } else {
            return response.text();
          }
        })
        .then(content => {
          imageContainer.innerHTML = `<div style="max-width: 100%; max-height: 100%; overflow: auto;">${content}</div>`;
          lowerThirds.onmouseover = () => imageContainer.style.display = 'block';
          lowerThirds.onmouseout = () => imageContainer.style.display = 'none';
        })
        .catch(error => console.error('Error fetching image content:', error));
    } else {
      imageContainer.innerHTML = '';
      lowerThirds.onmouseover = null;
      lowerThirds.onmouseout = null;
    }
    if (currentMessage.link) {
      lowerThirds.style.cursor = 'pointer';
      lowerThirds.onclick = () => {
        navigator.clipboard.writeText(currentMessage.link)
          .then(() => alert('Link copied to clipboard: ' + currentMessage.link))
          .catch(err => console.error('Failed to copy link: ', err));
      };
    } else {
      lowerThirds.style.cursor = 'default';
      lowerThirds.onclick = null;
    }
    index = (index + 1) % messages.length;
    if (index === 0 && !repeat) {
      clearInterval(intervalId);
    }
  }

  if (scrollText) {
    const totalWidth = scrollContainer.scrollWidth;
    let scrollPosition = 0;
    const scrollSpeed = 2; // Adjust for desired speed
  
    function animate() {
      scrollPosition -= scrollSpeed;
      if (scrollPosition <= -scrollContainer.scrollWidth) {
        scrollPosition = 0;
      }
      scrollContainer.style.transform = `translateX(${scrollPosition}px)`;
      requestAnimationFrame(animate);
    }
  
    requestAnimationFrame(animate);
  }

  showNextMessage();
  const intervalId = setInterval(showNextMessage, interval);

  return () => {
    clearInterval(intervalId);
    container.removeChild(lowerThirds);
    container.removeChild(imageContainer);
    messageElements.clear(); // Clear the map when stopping the display
  };
}

/**
 * Processes messages from inscriptions
 * @param {Array} oracleSats - Array of sat numbers to check
 * @param {boolean} allMessages - Whether to process all messages
 * @param {number} displayInterval - Interval for message display
 * @param {boolean} repeat - Whether to repeat messages
 * @param {HTMLElement} container - Container for message display
 * @param {boolean} scrollText - Whether to scroll text
 * @param {number} launchBlock - Launch block number
 * @param {number} currentBlock - Current block number
 * @returns {Promise<Object>} Object containing messages and stop function
 */
async function processMessages(oracleSats, allMessages = false, displayInterval = 5000, repeat = true, container = document.body, scrollText = true, launchBlock = null, currentBlock = null) {
  let currentHeight = currentBlock || await this.getCurrentBlockHeight();
  let messageMap = new Map();
  let messageId = 0;

  for (const { sat, skip = 0, filter = null } of oracleSats) {
    let filterArray = null;
    
    if (filter) {
        const evalResult = eval(filter);
        filterArray = Array.isArray(evalResult) ? [...new Set(evalResult)] : evalResult;
    }
    
    const inscriptionIds = await getInscriptionIds(sat, 0, skip);

    for (const inscriptionId of inscriptionIds) {
      const content = await getInscriptionContent(false,inscriptionId);
      
      if (content && content.protocol === 'BRC333' && content.operation === 'oracle') {
        content.messages.forEach(msg => {
          const { id = `msg_${messageId++}`, action = 'add', message, block, offset, stop, image, msgFilter, link } = msg;
          const effectiveBlock = block || launchBlock + offset;
          const effectiveStop = offset && stop ? (stop + launchBlock) : (stop || effectiveBlock);

          if (filterArray && msgFilter) { 
            if (Array.isArray(filterArray) && !filter.includes(msgFilter)) {
              return;
            } else if (typeof filterArray === 'string' && filterArray !== msgFilter) {
              return; 
            }
          } else if (!filterArray && msgFilter) {
            return;
          } else if (filterArray && !msgFilter) {
            return;
          }

          if (!allMessages && (effectiveBlock > currentHeight || currentHeight > effectiveStop)) {
            return;
          }

          switch (action) {
            case 'add':
              messageMap.set(id, { message, image, link });
            case 'update':
              messageMap.set(id, { message, image, link });
              break;
            case 'delete':
              messageMap.delete(id);
              break;
          }
        });
      }
    }
  }

  const currentMessages = Array.from(messageMap.values());

  if (currentMessages.length > 0) {
    const stopDisplay = displayScrollingMessages(currentMessages, displayInterval, repeat, container, scrollText);
    return { messages: currentMessages, stopDisplay };
  } else {
    return { messages: null, stopDisplay: null };
  }
}

// Expose Oracle functions globally
window.Oracle = {
  messageElements: new Map(),
  initializeOracle,
  getInscriptionIdFromUrl,
  getInscriptionIds,
  getInscriptionIdAt,
  getCurrentBlockHeight,
  processMessages,
  displayScrollingMessages,
  cleanup
};

// Initialize oracle with custom display function
// await Oracle.initializeOracle(traits => console.log('Displaying traits:', traits));

// Process messages for multiple sats with custom settings
// const oracleSats = [{ sat: 1234567, skip: 5 }, { sat: 7654321, filter: '[1,2,3]' }];
// const { messages, stopDisplay } = await Oracle.processMessages(oracleSats, true, 3000, false, document.getElementById('messageContainer'), true, 800000, 850000);

// Display scrolling messages with custom container and interval
// const customContainer = document.createElement('div');
// document.body.appendChild(customContainer);
// Oracle.displayScrollingMessages(messages, 2000, true, customContainer, false);

// Get specific inscription at index
// const inscriptionId = await Oracle.getInscriptionIdAt(1234567, 3, 2);
// console.log('Inscription ID:', inscriptionId);

// Fetch current block height and log
// const currentHeight = await Oracle.getCurrentBlockHeight();
// console.log('Current block height:', currentHeight);

// Cleanup oracle elements
// Oracle.cleanup();
