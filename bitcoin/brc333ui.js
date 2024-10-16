//  **********************************************************************************************************
//  brc333_ui.js
//  Utility functions for BRC333 Dynamic Ordinals protocol
//  
//  This script provides essential user interaction functions for working with BRC333 ordinals, including 
//  setting up the canvas, styles, a custom modal, etc...
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
 * Initializes a canvas element and appends it to the document body
 * @returns {HTMLCanvasElement} The created canvas element
 */
function initCanvas() {
    container = document.createElement('div');
    container.className = 'image-container';
    const canvas = document.createElement('canvas');
    canvas.id = 'image-canvas';
    container.appendChild(canvas);
    document.body.appendChild(container);
    return canvas;
  }
  
/**
 * Appends necessary styles to the document head
 */
function appendStyles() {
const style = document.createElement('style');
style.innerHTML = `
    body, html {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
    }
    .image-container {
        position: relative;
        width: 100vmin;
        height: 100vmin;
    }
    canvas {
        width: 100%;
        height: 100%;
        object-fit: contain;
        image-rendering: pixelated;
        z-index: 1;
    }
    .hidden {
        display: none;
    }
    .modal {
        display: none;
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(to bottom, 
            red 0%, red 33%, 
            yellow 33%, yellow 66%, 
            green 66%, green 100%);
    }
    .modalContent {
        background-color: green;
        margin: 15% auto;
        padding: 20px;
        border: 1px solid #888;
        width: 80%;
        max-width: 500px;
        max-height: 60vh;
        overflow-y: auto;
        border-radius: 5px;
        font-family: 'Helvetica', monospace;
        color: #ffffff;
    }
    .inscription-id {
        white-space: nowrap;
        overflow-x: auto;
    }
    .close {
        color: #aaa;
        float: right;
        font-size: 28px;
        font-weight: bold;
        cursor: pointer;
    }
    .copy-icon {
        cursor: pointer;
        margin-left: 5px;
    }
    .copy-icon:hover {
        opacity: 0.7;
    }
    .bold {
        font-weight: bold;
    }
    .normal {
        font-weight: normal;
    }
`;
document.head.appendChild(style);
}

/**
 * Displays a custom modal with the given message
 * @param {string} message - The message to display in the modal
 */
function showCustomModal(message) {
    const modal = document.getElementById('customModal');
    const modalContent = document.getElementById('modalContent');
    const modalText = document.getElementById('modalText');

    modalText.innerHTML = message.replace(/\n/g, '<br>');
    modal.style.display = 'block';

    modalText.innerHTML = message.replace(/\n/g, '<br>');
    modal.style.display = 'block';

    const closeBtn = modal.querySelector('.close');
    closeBtn.onclick = function() {
        modal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
}

/**
 * Simulates a camera flash effect on the given element
 * @param {HTMLElement} element - The element to apply the flash effect to
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
 * Plays a camera shutter sound effect
 */
function playSound(audio) {
    const audioElement = document.getElementById(audio);
    audioElement.currentTime = 0;
    audioElement.play();
}

/**
 * Sets the canvas as the favicon
 * @param {HTMLCanvasElement} canvas - The canvas to use as favicon
 */
function setCanvasAsFavicon(canvas) {
    // Convert canvas to PNG data URL
    const pngData = canvas.toDataURL('image/png');
    
    // Create or get the existing favicon link element
    let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/png';
    link.rel = 'shortcut icon';
    link.href = pngData;
    
    // Add or update the favicon link in the document head
    document.getElementsByTagName('head')[0].appendChild(link);
}

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
  

window.UI = {
    initCanvas,
    appendStyles,
    showCustomModal,
    simulatePhotographFlash,
    playSound,
    setCanvasAsFavicon,
    generateAudioAndModal
};

// Usage examples:
// Initialize canvas:
// const canvas = UI.initCanvas();

// Show a custom modal:
// UI.showCustomModal('Welcome to BRC333!');

// Simulate a camera flash:
// UI.simulatePhotographFlash(document.body);