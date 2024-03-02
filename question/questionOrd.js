const jsonColorData = {
    "p":"brc333",
    "op":"deploy",
    "collection":{
      "slug":"question",
      "name":"Glitchy Qs",
      "description":"",
      "creator":"Team Q",
      "supply":10000
    },
    "colors": {
      "0": ['#000000','#070707','#2F2F2F','#3C3C3C','#494949','#565656','#636363','#707070','#7D7D7D','#8A8A8A'],
      "1": ['#FFFFFF','#FFF7E7', '#FFE4E1','#F5FFFA','#E0FFFF','#FFEFD5','#F5F5F5','#F5F5DC','#FFF8DC','#FFE4E1'],
      "2": ['#4B0082','#0000FF','#FF0000','#FFA500','#DAA520','#008000','#FF69B4','#D2691E','#FFFF00','#00FF00'],
      "3":['#800080','#1E90FF','#FF4040','#FF7F50','#F4A460','#2E8B57','#FFC0CB','#FFA07A','#FFD700','#00FF7F'],
      "4":['#663399','#000080','#FF4500','#FF6347','#D2B48C','#9ACD32','#FFB6C1','#CD853F','#FFDE00','#98FB98'],
      "5":['#6A5ACD','#0000CD','#DC143C','#FF7F50','#FFE4B5','#3CB371','#DB7093','#8B4513','#F0E68C','#90EE90'],
      "6": ['#ffde00','#FF6347','#FF4040','#3CB371','#1E90FF','#C71585','#FF69B4','#8A2BE2','#20B2AA','#FFA07A','#800000','#008000','#0000FF','#FF0000','#000080','#FFC0CB','#A52A2A','#008080','#800080','#FFFF00','#FFC0CB','#DC143C','#A52A2A','#DEB887','#5F9EA0','#7FFF00','#D2691E','#FF7F50','#6495ED','#FFD700','#DAA520','#FFBF00','#ADFF2F','#FF69B4','#CD5C5C','#4B0082','#F0E68C','#7CFC00','#ADD8E6','#F08080','#90EE90','#FFB6C1','#FFA07A','#20B2AA','#87CEFA','#B0C4DE','#00FF00','#32CD32','#FF00FF','#800000','#66CDAA','#0000CD','#BA55D3','#9370DB','#3CB371','#7B68EE','#00FA9A','#48D1CC','#C71585','#191970','#FFE4B5','#000080','#808000','#6B8E23','#FFA500','#FF4500','#DA70D6','#EEE8AA','#98FB98','#AFEEEE','#DB7093','#CD853F','#FFC0CB','#DDA0DD','#800080','#663399','#FF0000','#BC8F8F','#4169E1','#8B4513','#FA8072','#F4A460','#2E8B57','#A0522D','#87CEEB','#6A5ACD','#00FF7F','#4682B4','#D2B48C','#008080','#D8BFD8','#FF6347','#40E0D0','#EE82EE','#9ACD32','#BF9B30'] 
    }, 
    "sounds": [
        {"name": "mario","id": "99c4ddcee118f4bfa32451efdc47ae97851a48aad9b38e26fda6bfc2f72fe495i0"},
        {"name": "Video game","id": "488c83414c3c31f7ff0359b4ea79ed9ed4ec2c28fe7ba7b7bf996c445f42db17i0"},
        {"name": "Crickets","id": "f49a91b1bc182ada8044811659c2281f42fe37c6f68126a7b7c01fb2c90bdf02i0"},
        {"name": "Gong","id": "3b291a48bbd558a71a7db368c3b445afecf96de3f618a183a1629dff6ed506bdi0"},
        {"name": "beat","id": "f77ec5a34417df8310db5bd359275ad31b336dd48b07dcec2a7ba1fcd26fb85bi0"},
        {"name": "beat","id": "e514b18eedb1b46884c24f8f087ccd5c955e3da0e87c5d22d473b08fd2fe1f5di0"},
        {"name": "beat","id": "1d21933ebd66445792f51976f55ae53aad09c6b26f40cc111d8b01651eeb49a4i0"}
    ]
  }  

//const collectionJsonUrl = '/content/669216280ed54fac887cac2a7f2bb9d25995a83423aaf78a37b39ea97550133bi0';
//const collectionJsonUrl = 'https://ordinals.com/content/669216280ed54fac887cac2a7f2bb9d25995a83423aaf78a37b39ea97550133bi0';

const displaySize = '600px';
const canvasSize = 100;

// Create a new script element
var script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/qrcodejs/qrcode.min.js';
script.type = 'text/javascript';
script.async = true;
document.head.appendChild(script);

function appendStyles() {
    const style = document.createElement('style');
    style.innerHTML = `
    .image-container {
        display: grid; /* Or flex; both work */
        place-items: center; /* Centers the child SVG */
        width: 100%;
        max-width: 600px; /* Max size */
        max-height: 600px; /* Max size */
        margin: auto; /* Centering the container */
        aspect-ratio: 1 / 1; /* Maintains a 1:1 aspect ratio */
        overflow: hidden;
      }
      
      .image-container svg {
        max-width: 600;
        max-height: 600;
      }
 
        .firefly {
            position: absolute;
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background-color: yellow; /* Adjust color for your effect */
            opacity: 0.8; /* Make them slightly transparent */
            animation: moveAround 5s infinite alternate;
        }
        
        @keyframes moveAround {
            0% { transform: translate(0, 0); }
            25% { transform: translate(20px, 30px); }
            50% { transform: translate(-20px, 20px); }
            75% { transform: translate(20px, -20px); }
            100% { transform: translate(0, -30px); }
        }
        .modal-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 1050; /* Higher than the image and content */
          }
          
          .modal {
            display: none;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 1000;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            padding: 20px;
            width: auto;
            min-width: 300px;
          }
          
          .modal-content {
            background-color: #fefefe;
            margin: 15% auto; /* 15% from the top and centered */
            padding: 20px;
            border: 1px solid #888;
            width: 80%; /* Could be more or less, depending on screen size */
          }
          
          button {
            cursor: pointer;
          }
    `;
    document.head.appendChild(style);
}

function getColor(colors,artDigits,isFirst,index,isMario) {
    //console.log('colors in getColor', colors); 
    //console.log('artDigits',artDigits);
    //console.log('isFirst',isFirst);
    //console.log('isMario',isMario);
    let colorIndex;
    if (isMario){
        if (index <= 1) colorIndex = 0;
        else colorIndex = Math.floor(artDigits[index]/10*colors.length);
    } else if (isFirst) colorIndex = Math.floor(artDigits[index]/10 * colors.length);
    else colorIndex = Math.floor(((artDigits[index] + artDigits[index+1])/20 % 1) * colors.length);

    //console.log('colorIndex', colorIndex);
    //console.log('returns colors[colorIndex]', colors[colorIndex]);
    return colors[colorIndex];
}


function updatePathColors(svgElement, colors, artDigits, isMario, isFirst) {
    const paths = svgElement.querySelectorAll('path');
    //console.log('paths', paths);
    paths.forEach((path, index) => {
        //console.log('path', path, index);
        path.setAttribute('stroke', getColor(colors[index], artDigits,isFirst,index,isMario)); 
    });
}

function displaySVG(container, isFirst = false, now, artDigits) {
    try {
        let isMario = false;

        const svgElement = container.querySelector('svg');
        const background = document.querySelector('#background');
        const backgrounds = jsonColorData.colors[6];
        const dna = (artDigits[0]*100+artDigits[1]*10+artDigits[2])/1000;
        const dnaRandom = Math.floor((Math.random()+2*dna)/3*backgrounds.length);
        //console.log('dna', dna);
        //console.log('dnaRandom', dnaRandom);
        //console.log('backgrounds', backgrounds);
        //console.log('isFirst', isFirst);
        //console.log('isMario', isMario);
        if (isFirst && dna < 0.01) {  // if first image
            isMario = true;
            if (background) background.setAttribute('fill', backgrounds[0]); 
        } else if (dna < 0.30) {
            if (isFirst) background.setAttribute('fill', backgrounds[Math.floor(dna*backgrounds.length)]);
            else background.setAttribute('fill', backgrounds[dnaRandom]);
        } else {
            if (isFirst) applyRadialGradient(svgElement, backgrounds[artDigits[3]], backgrounds[artDigits[4]]);
            else {
                console.log('backgrounds[dnaRandom]', backgrounds[dnaRandom]);
                console.log('backgrounds[dnaRandom+1]', backgrounds[(dnaRandom+1)%backgrounds.length]);
                applyRadialGradient(svgElement, backgrounds[dnaRandom], backgrounds[(dnaRandom+1)%backgrounds.length]);
            }
        }  
        updatePathColors(svgElement, allColors, artDigits, isMario, isFirst);    
    } catch (e) {
        console.error(e);
    }
}

function playSound(soundId,volume) {
    const audioPath = `https://ordinals.com/content/${jsonColorData.sounds[soundId].id}`; // Adjust the file extension as needed
    const audio = new Audio(audioPath);
    audio.volume = volume;
    audio.currentTime = 0; // Reset audio to start for consecutive plays
    audio.play().catch(error => console.error("Audio play failed:", error));
}

function applyRadialGradient(svg, color1, color2) {
    const svgNS = "http://www.w3.org/2000/svg";
    let defs = svg.querySelector('defs');
    let radialGradient = svg.querySelector('#backgroundGradient');

    // If the gradient already exists, update its stops
    if (radialGradient) {
        let stops = radialGradient.querySelectorAll('stop');
        stops[0].setAttribute("stop-color", color1); // Update start color
        stops[1].setAttribute("stop-color", color2); // Update end color
    } else {
        // If <defs> or the gradient doesn't exist, create them
        if (!defs) {
            defs = document.createElementNS(svgNS, "defs");
            svg.insertBefore(defs, svg.firstChild);
        }
        radialGradient = document.createElementNS(svgNS, "radialGradient");
        radialGradient.setAttribute("id", "backgroundGradient");
        defs.appendChild(radialGradient);

        // Create and append the gradient stops
        const startStop = document.createElementNS(svgNS, "stop");
        startStop.setAttribute("offset", "0%");
        startStop.setAttribute("stop-color", color1);
        radialGradient.appendChild(startStop);

        const endStop = document.createElementNS(svgNS, "stop");
        endStop.setAttribute("offset", "100%");
        endStop.setAttribute("stop-color", color2);
        radialGradient.appendChild(endStop);
    }

    // Ensure the background rectangle uses the gradient
    let background = svg.querySelector('#background') || document.createElementNS(svgNS, "rect");
    if (!svg.querySelector('#background')) {
        background.setAttribute("id", "background");
        background.setAttribute("width", "45");
        background.setAttribute("height", "45");
        svg.appendChild(background);
    }
    background.setAttribute("fill", "url(#backgroundGradient)");
}

function applyGlitchEffectOnSVG(svgElement, triggerElement) {
    const glitchEffects = [
        () => {
            svgElement.style.filter = `hue-rotate(${Math.random() * 360}deg)`;
        },
        () => {
            svgElement.style.transform = `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px)`;
        },
        () => {
            if (Math.random() < 0.3) { // 30% chance to lower opacity
                svgElement.style.opacity = `${0.7 + Math.random() * 0.3}`; // Opacity between 0.5 and 1
            } else {
                svgElement.style.opacity = `1`; // Reset to full opacity otherwise
            }
        }
    ];

    const applyRandomEffect = () => {
        glitchEffects[Math.floor(Math.random() * glitchEffects.length)]();
    };

    let glitchInterval;

    // Starting the glitch effect when mouse enters the triggerElement
    triggerElement.addEventListener('mouseenter', () => {
        glitchInterval = setInterval(applyRandomEffect, 200); // Adjust the interval as needed
        // Stop any currently playing audio
        if (!window.currentlyPlayingAudio) {
            playSound(1,0.5);
        }
    });

    // Stopping and resetting the glitch effect when mouse leaves the triggerElement
    triggerElement.addEventListener('mouseleave', () => {
        clearInterval(glitchInterval);
        // Stop any currently playing audio
        if (window.currentlyPlayingAudio) {
            window.currentlyPlayingAudio.pause();
            window.currentlyPlayingAudio = null;
        }
        svgElement.style.filter = '';
        svgElement.style.transform = '';
        svgElement.style.opacity = '';
    });
}

function extractDigitsFromHash(selectedColorIndexes) {
    const inputString = selectedColorIndexes.join(',');
    const hashString = simpleHash(inputString);
    const digits = [];
    for (let i = 0; i < 20; i++) {
        digits.push(parseInt(hashString[i]) % 10);
    }
    return digits;
}

function simpleHash(input,mintdatetime) {
    const combinedInput = input + mintdatetime;
    let combinedHash = '';

    for (let j = 0; j < 5; j++) {
        let hash = 0;
        for (let i = 0; i < combinedInput.length; i++) {
            const char = combinedInput.charCodeAt(i) + j;
            hash = ((hash << 5) - hash) + char;
            hash |= 0;
        }
        combinedHash += Math.abs(hash).toString();
    }
    return combinedHash.substring(0,Math.max(20,combinedHash.length));
}

function showModal() {
    const container = document.querySelector('.image-container');
    const rect = container.getBoundingClientRect();
    const modal = document.getElementById('modal');
  
    // Position modal in the center of the container
    modal.style.position = 'absolute';
    modal.style.top = `${window.scrollY + rect.top + (rect.height / 2) - (modal.offsetHeight / 2)}px`;
    modal.style.left = `${window.scrollX + rect.left + (rect.width / 2) - (modal.offsetWidth / 2)}px`;
    modal.style.display = 'block';
  }

  function createDynamicModal(contentHTML, modalId) {
    // Check if the modal already exists, if so, remove it
    let existingModal = document.getElementById(modalId);
    if (existingModal) {
      existingModal.remove();
    }
  
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = modalId + '-overlay';
  
    // Create modal container
    const modal = document.createElement('div');
    modal.id = modalId;
    modal.className = 'modal';
  
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.innerHTML = contentHTML;
  
    // Append modal content to modal, then modal to overlay, and overlay to body
    modal.appendChild(modalContent);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  
    // Display the modal
    overlay.style.display = 'block';
    modal.style.display = 'block';
  
    // Hide modal on overlay click
    overlay.addEventListener('click', function() {
      overlay.style.display = 'none';
    });
  }

  function showReadyModal() {
    const contentHTML = '<p>Are you ready?</p><button id="lfgButton">LFG!</button>';
    createDynamicModal(contentHTML, 'readyModal');
  
    // Add event listener for the LFG button
    document.getElementById('lfgButton').addEventListener('click', function() {
      // Logic for LFG button click
      console.log('LFG button clicked');
      document.getElementById('readyModal-overlay').style.display = 'none';
    });
  }
  
  // Modal for displaying QR Code
  function showQRCodeModal(inputString) {
    console.log('showQRCodeModal',inputString);
    const contentHTML = '<p>Scan this QR code to answer the question:</p><div id="qrcode"></div>';
    createDynamicModal(contentHTML, 'qrCodeModal');
  
    // Generate QR Code here, using 'qrcode' element
    // Example using a QR Code library
    new QRCode(document.getElementById("qrcode"), {
      text: `http://metawebpunks.com/${inputString}`,
      width: 128,
      height: 128,
      colorDark : "#000000",
      colorLight : "#ffffff",
    });
    //document.getElementById('modal').style.display = 'block';
    //document.getElementById('modal-overlay').style.display = 'block';
  }

  function showQuestionModal(question) {
    console.log('showQuestionModal',question);
    const contentHTML = `<p>${question}</p><div id="qrcode"></div>`;
    createDynamicModal(contentHTML, 'qrCodeModal');
    //document.getElementById('modal').style.display = 'block';
    //document.getElementById('modal-overlay').style.display = 'block';
}


function initializeSVG(inputString,question) {
    const container = document.createElement('div');
    container.classList.add('image-container'); 

    const svg = document.createElement('div');
    svg.classList.add('svg');
    svg.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 45 45" shape-rendering="crispEdges" class="svg">
        <rect id="background" width="45" height="45" fill="#ffde03" />
        <metadata>Made with Pixels to Svg https://codepen.io/shshaw/pen/XbxvNj</metadata>
        <path id="shadow" stroke="#000000" d="M18 9h9M18 10h9M18 11h2M33 11h2M18 12h2M33 12h2M18 13h2M33 13h2M18 14h2M33 14h2M18 15h2M33 15h2M18 16h2M33 16h2M18 17h2M33 17h2M14 18h6M33 18h2M14 19h6M33 19h2M33 20h2M27 21h8M27 22h8M27 23h2M27 24h2M27 25h2M27 26h2M23 27h6M23 28h6M27 32h2M27 33h2M27 34h2M27 35h2M23 36h6M23 37h6" />
        <path id="question" stroke="#FFFFFF" d="M15 6h15M15 7h15M15 8h15M12 9h6M27 9h6M12 10h6M27 10h6M12 11h6M27 11h6M12 12h6M27 12h6M12 13h6M27 13h6M12 14h6M27 14h6M12 15h6M27 15h6M12 16h6M27 16h6M12 17h6M27 17h6M24 18h9M24 19h9M24 20h9M21 21h6M21 22h6M21 23h6M21 24h6M21 25h6M21 26h6M21 30h6M21 31h6M21 32h6M21 33h6M21 34h6M21 35h6" />
        <path id="bullet1" class="bullet" stroke="#808080" d="M3 3h3M3 4h3M3 5h3" />
        <path id="bullet2" class="bullet" stroke="#808080" d="M39 3h3M39 4h3M39 5h3" />
        <path id="bullet3" class="bullet" stroke="#808080" d="M3 39h3M3 40h3M3 41h3" />
        <path id="bullet4" class="bullet" stroke="#808080" d="M39 39h3M39 40h3M39 41h3" />
        </svg>`;
    
    container.appendChild(svg);
    document.body.appendChild(container); 

    document.getElementById('bullet2').addEventListener('mouseenter', () => showQuestionModal(question), { once: true });
    document.getElementById('bullet3').addEventListener('mouseenter', () => showQRCodeModal(inputString), { once: true });
        
    /*** 
    const fireflies = document.querySelector('.fireflies-container');
    const numFireflies = 10;

    for (let i = 0; i < numFireflies; i++) {
        let firefly = document.createElement('div');
        firefly.classList.add('firefly');
        fireflies.appendChild(firefly);

        // Randomize starting position
        firefly.style.left = `${Math.random() * 100}%`;
        firefly.style.top = `${Math.random() * 100}%`;
    }
    ***/

    svg.addEventListener('mouseenter', function() {
        console.log('mouseenter svg');
        showReadyModal();
      }, { once: true });

    // Applying the glitch effect on the entire SVG when hovering over bullet1
    applyGlitchEffectOnSVG(svg, svg.querySelector('#bullet1')); 
    
    const questionMark = document.querySelector('#question');

    document.querySelector('#bullet4').addEventListener('mouseenter', () => {
        questionMark.style.transform = "scale(1.07)";
        questionMark.style.transformOrigin = "50% 50%";
        if (!window.currentlyPlayingAudio) {
            playSound(4,1);
        }
    });
    
    document.querySelector('#bullet4').addEventListener('mouseleave', () => {
        questionMark.style.transform = "scale(1)";
        if (window.currentlyPlayingAudio) {
            window.currentlyPlayingAudio.pause();
            window.currentlyPlayingAudio = null;
        }
    });

    document.querySelector('#background').addEventListener('click', () => {
        console.log("Clicked background");
        displaySVG(container, false, new Date(), artDigits);
        if (!window.currentlyPlayingAudio) {
            playSound(4,1);
        }
    });

    questionMark.addEventListener('mouseenter', function() {
        if (!window.currentlyPlayingAudio) {
            playSound(2,1);
        }
    });
    questionMark.addEventListener('mouseleave', function() {
        if (window.currentlyPlayingAudio) {
            window.currentlyPlayingAudio.pause();
            window.currentlyPlayingAudio = null;
        }
    });
}

async function getMetadata(url,retry = false) {
    try {
        const collectionMetadataRes = await fetch(url);
        return await collectionMetadataRes.json();
    } catch (e) {
        if (!retry) {
            const timestamp = Math.floor(Date.now() / (60000 * 10)) //10 minutes
            const newUrl = `${url}?timestamp=${timestamp}`
            return getMetadata(newUrl,true)
        }
        throw e
    }
}

//let jsonColorData;

window.onload = async function() {

    //jsonColorData = await getMetadata(collectionJsonUrl);
    allColors = jsonColorData.colors;
    //console.log('allColors',allColors);

    const inputString = document.querySelector('script[t]').getAttribute('t');

    let question = 'wen $100k BTC?';
    if (document.querySelector('script[t]').getAttribute('q')) {
        question = document.querySelector('script[t]').getAttribute('q');
    }
    console.log('question',question);

    const selectedColorIndexes = Array.from(inputString).map(char => Number(char));
    traitColors = selectedColorIndexes.map((selectedColor,i) => allColors[i] ? allColors[i][selectedColor] : null);
    
    const extractedDigits = extractDigitsFromHash(selectedColorIndexes);
    //numberOfExtraTraits = determineNumberOfExtraTraits((extractedDigits[0]*10 + extractedDigits[1]*10)/2);
    
    artDigits = extractedDigits.slice(1);

    let now;
    if (document.querySelector('script[t]').getAttribute('d')) {
        const mintDateTime = document.querySelector('script[t]').getAttribute('d');
        now = new Date(mintDateTime * 1000 * 60);
    } else {
        now = new Date();
    }

    let repeat = false;
    if (document.querySelector('script[t]').getAttribute('r')) {
        repeat = true;
    } 

    initializeSVG(inputString,question);
    const container = document.querySelector('.svg'); 
    displaySVG(container, true, now, artDigits);
    if (repeat) {
        refreshIntervalId = setInterval(() => {
            displaySVG(container,false, now, artDigits);
        }, 1000 * Math.random() * 5);
    }
};