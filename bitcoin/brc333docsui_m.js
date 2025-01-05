/**********************************************************************************************************
//  brc333docsui.js
//  The UI module for BRC333 Open Docs satplication
//  
//  This script provides UI functionality including styles, navigation, modals and event handling
//
//  Created: Shiftshapr (2024-11-1)
//  ********************************************************************************************************
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

/**
 * Applies core styles to the document
 * @returns {void}
 */
const loadStyles = async () => {
    executeHook('loadStyles.start', { stylesSat });
    const stylesId = await getInscriptionsForSat(stylesSat, true); 
    const cssText = await getInscriptionContent(stylesId[0].id, false);
        
    // Create theme variables CSS
    const themeCSS = `
        :root {
            --title-top-offset: ${window.titleTopOffset};
            --color-primary: ${window.primary};
            --color-primary-hover: ${window.primaryHover};
            --color-primary-visited: ${window.primaryVisited};
            --color-background: ${window.background};
            --color-border: ${window.border};
            --color-text: ${window.text};
            --color-accent: ${window.accent};
            --color-metadata-bg: ${window.metadataBg};
            --color-search-bg: ${window.searchBg};
            --color-title: ${window.titleColor};
        }
        body, .container, #preface, #content, .metadata-box, .article-links, .title, .tag-link, .author-link, .reply-link, .metadata-item, button {
            font-family: ${window.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto'};
        }
    `;

    const styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.textContent = themeCSS + cssText;
    document.head.appendChild(styleElement);
    executeHook('loadStyles.end', { styleElement });
};

/**
 * Handles mouse over events for initial display
 * @returns {void}
 */
function handleMouseOver(requireClick = true) {
    executeHook('handleMouseOver.start', { requireClick });

    function showPreface(title) {
        const initialImage = document.getElementById('initial-image');
        const preface = document.getElementById('preface');
        initialImage.style.opacity = '0';
        title.style.opacity = '0';
        
        setTimeout(() => {
            initialImage.style.display = 'none';
            title.style.display = 'none';
            preface.style.display = 'block';
            preface.scrollTop = 0;
            
            setTimeout(() => {
                preface.style.opacity = '1';
            }, 50);
        }, 500);
    }
        
    const container = document.querySelector('.container');    
    const initialImage = document.getElementById('initial-image');
    const title = document.querySelector('.title');
    
    if (initialImage && title) {
        initialImage.style.display = 'block';
        initialImage.style.opacity = '0.75';
        title.style.display = 'block';
        title.style.opacity = '1';
        
        if (!requireClick) {
            setTimeout(showPreface(title), 2000);
        } else {
            container.addEventListener('click', () => showPreface(title),{ once: true });
        }        
        container.removeEventListener('mouseover', handleMouseOver);
    }
    executeHook('handleMouseOver.end');
}        
    
    

/**
 * Displays a custom modal with the given message
 * @param {string} message - The message to display in the modal
 */
function showCustomModal(message) {
    executeHook('showCustomModal.start', { message });
    let modal = document.getElementById('customModal');
    const modalContent = document.getElementById('modalContent');
    let modalText = document.getElementById('modalText');

    if (!modal) {
        const modalHtml = `
            <div id="customModal" class="modal">
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <p id="modalText"></p>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        modal = document.getElementById('customModal');
        modalText = document.getElementById('modalText');
    }

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
    executeHook('showCustomModal.end', { modal });
}

/**
 * Sets up click handlers for author, tag and reply links in the article modal
 * Links author clicks to author filter dropdown
 * Links tag clicks to tag selection and filtering
 * Links reply-to clicks to display of referenced article
 * @param {void} No parameters
 * @returns {void} No return value
 */
function handleModalLinks(article) {
    executeHook('handleModalLinks.start', { article });
    const modalContent = document.querySelector('.modal-content-text');
    modalContent.addEventListener('click', (e) => {
        executeHook('modalContent.click', { currentArticle: window.currentArticle, e });
        
        if (e.target.classList.contains('author-link')) {
            e.preventDefault();
            handleMetadataLink('author', e.target.textContent, 'article');
            closeModal();
        }
        
        if (e.target.classList.contains('reply-link')) {
            console.log('reply-link clicked', e.target.dataset.id);
            e.preventDefault();
            const replyId = e.target.dataset.id;
            handleMetadataLink('reply-to', replyId, 'article');
            closeModal();
        }
        
        if (e.target.classList.contains('tag-link')) {
            e.preventDefault();
            handleMetadataLink('tag', e.target.dataset.tag, 'article');
            closeModal();
        }
        executeHook('modalContent.click.end', { currentArticle: window.currentArticle, e });
    });
}

/**
 * Hides the custom modal by setting its display style to 'none'
 * @param {void} No parameters
 * @returns {void} No return value
 */
function closeModal() {
    executeHook('closeModal.start', { currentArticle: window.currentArticle });
    const modal = document.getElementById('customModal');
    modal.style.display = 'none';
    executeHook('closeModal.end', { currentArticle: window.currentArticle });
}

/**
 * Creates keyboard event listener for displaying article metadata
 * Triggers modal display when 'i' key is pressed
 * Shows current article's provenance and metadata
 * @param {void} No parameters
 * @returns {void} No return value
 */
async function createListeners() {
    executeHook('createListeners.start', { currentArticle: window.currentArticle });
    
    window.addEventListener('keydown', async function(event) {
        executeHook('keydown.start', { currentArticle: window.currentArticle, event });

        const preface = document.getElementById('preface');
        const content = document.getElementById('content');

        const isPreface = preface.style.display === 'block';
        const isArticle = content.style.display === 'block';

        if (event.key === 'i' && !document.activeElement.classList.contains('search-input')) {
            executeHook('keydown.i.start', { isPreface, isArticle, event, inscriptionId });
            if (isPreface) {
                executeHook('keydown.i.preface.start', { event, inscriptionId });
                let inscriptionText = "";
                if (inscriptionId) 
                    inscriptionText = `<span class="inscription-id"><span class=\"bold\">Inscription Id:</span> ${inscriptionId}`;
                
                const inscriptionData = await getMetadata(`${baseUrl}/r/inscription/${inscriptionId}`);
                height = inscriptionData.height;
                timestamp = inscriptionData.timestamp;
                const localDate = new Date(timestamp * 1000).toLocaleString();
                sat = inscriptionData.sat;
                number = inscriptionData.number;
                blockheight = await getMetadata(`${baseUrl}/r/blockheight`);

                const message = `${window.description}<span class=\"bold\">Current Blockheight</span>: ${blockheight}
                    <span class=\"bold\">Chain</span>: ${window.chain}\n<span class=\"bold\">Medium</span>: ${window.medium}\n<span class=\"bold\">Protocol</span>: ${window.protocol}
                    ${inscriptionText}\n<span class=\"bold\">Height</span>: ${height}\n<span class=\"bold\">Timestamp</span>: ${timestamp} (${localDate})\n<span class=\"bold\">Sat</span>: ${sat}\n<span class=\"bold\">Number</span>: ${number}\n
                    ${window.brc333message}`;

                showCustomModal(message);
                event.stopImmediatePropagation();
                executeHook('keydown.i.preface.end', { message, event, inscriptionId });
            } else if (isArticle) {
                executeHook('keydown.i.article.start', { event, currentArticle: window.currentArticle });
                const currentArticle = window.currentArticle;
                let inscriptionText = "";
                if (currentArticle.id) 
                    inscriptionText = `<span class="inscription-id"><span class=\"bold\">Inscription Id:</span> ${currentArticle.id}`;

                const inscriptionData = await getMetadata(`${baseUrl}/r/inscription/${currentArticle.id}`);
                height = inscriptionData.height;
                timestamp = inscriptionData.timestamp;
                address = inscriptionData.address;
                const localDate = new Date(timestamp * 1000).toLocaleString();
                
                sat = inscriptionData.sat;
                number = inscriptionData.number;
                blockheight = await getMetadata(`${baseUrl}/r/blockheight`);

                const replyToArticle = currentArticle['reply-to'] ? cachedArticles.find(a => a.id === currentArticle['reply-to']) : null;
                const replyToText = replyToArticle ? replyToArticle.title : currentArticle['reply-to'];
        
                const repliesTo = cachedArticles.filter(a => a['reply-to'] === currentArticle.id);
                const repliesHtml = repliesTo.length > 0 ? 
                    `${repliesTo.map(reply => 
                        `<a href="#" class="reply-link" data-id="${reply.id}">${reply.title}</a>`
                    ).join('|')}` : '';

                if (currentArticle) {
                    const message = `
                        <div class=\"article-modal-title\">Provenance & Metadata</div> 
                        <div class=modal-content-text>
                            <span class=\"bold\">Title</span>: ${currentArticle.title}</span>
                            
                            <span class=\"bold\">Chain</span>: ${window.chain}
                            <span class=\"bold\">Medium</span>: ${window.medium}
                            <span class=\"bold\">Protocol</span>: ${window.protocol}
                            <span class=\"bold\">Current Blockheight</span>: ${blockheight}
                            <span class=\"bold\">Number</span>: ${number}
                            <span class=\"bold\">Inscription ID</span>:  <div class="inscription-info">${currentArticle.id}</div>
                            <span class=\"bold\">Height</span>: ${height}
                            <span class=\"bold\">Timestamp</span>: ${timestamp} (${localDate})
                            <span class=\"bold\">Sat</span>: ${sat}

                            <span class=\"bold\">Author</span>: <a href="#" class="author-link" data-author="${currentArticle.author}">${currentArticle.author}</a>
                            <span class=\"bold\">Inscriptor</span>:  <div class="inscription-info">${address}</div>
                            <span class=\"bold\">Published</span>: ${currentArticle.date || new Date(currentArticle.timestamp * 1000).toLocaleString()}
                            ${currentArticle.medium ? `<span class=\"bold\">Medium</span>: ${currentArticle.medium}` : ''}
                            ${currentArticle.source ? `<span class=\"bold\">Source</span>: ${currentArticle.source}` : ''}
                            ${currentArticle.subject ? `<span class=\"bold\">Subject</span>: ${currentArticle.subject}` : ''}
                            ${currentArticle.tags ? `<span class=\"bold\">Tags</span>: ${currentArticle.tags.map(tag => `<a href="#" class="tag-link" data-tag="${tag}">${tag}</a>`).join('|')}` : ''}
                            ${currentArticle['reply-to'] ? `<span class=\"bold\">In Reply To</span>: <a href="#" class="reply-link" data-id="${currentArticle['reply-to']}">${replyToText}</a>` : ''}
                            ${repliesTo.length > 0 ? `<span class=\"bold\">Replies</span>: ${repliesHtml}` : ''}
                        </div>
                        `;
                    console.log('Message:', message);
                    showCustomModal(message);
                    handleModalLinks(currentArticle);
                    executeHook('keydown.i.article.end', { message, event, currentArticle });
                }
                event.stopImmediatePropagation();
            }
        }
    });
    executeHook('createListeners.complete', { currentArticle: window.currentArticle });
}

/**
 * Adds navigation buttons to content
 * @param {HTMLElement} contentDiv - Content container element
 * @param {Function} onBack - Back button callback
 * @param {Function} onRefresh - Refresh button callback
 */
function addNavigationButtons(contentDiv) {
    executeHook('addNavigationButtons.start', { contentDiv });
    const navButtons = document.createElement('div');
    navButtons.className = 'navigation-buttons';
    
    const prefaceButton = document.createElement('button');
    prefaceButton.id = 'prefaceButton';
    prefaceButton.textContent = prefaceButtonText;
    prefaceButton.addEventListener('click', (event) => {
        executeHook('prefaceButton.click', { event, currentArticle: window.currentArticle });
        
        const preface = document.getElementById('preface');
        const embeddedStyles = document.getElementsByTagName('style');
        Array.from(embeddedStyles).forEach(style => {
            const newStyles = style.textContent.replace(
                /body\s*{[^}]*background-color:\s*#ffffff[^}]*}/,
                match => match.replace('background-color: #ffffff', '')
            );
            style.textContent = newStyles;
        });
        
        content.style.opacity = '0';
        content.style.display = 'none';
        preface.style.display = 'block';
        preface.style.opacity = '0';
        preface.scrollTop = 0;

        console.log('xxx about to refresharticle list');
        refreshArticleList();

        setTimeout(() => {
            preface.style.opacity = '1';
        }, 50);

        //executeHook('prefaceButton.complete', { event });
        event.stopPropagation();
    });
    
    const restartButton = document.createElement('button');
    restartButton.id = 'restartButton';
    restartButton.textContent = restartButtonText;
    restartButton.addEventListener('click', (event) => {
        executeHook('restart.click', { event , currentArticle: window.currentArticle});
        
        document.body.style.padding = '0';
        document.body.style.margin = '0';
        
        const embeddedStyles = document.getElementsByTagName('style');
        Array.from(embeddedStyles).forEach(style => {
            const newStyles = style.textContent.replace(
                /body\s*{[^}]*background-color:\s*#ffffff[^}]*}/,
                match => match.replace('background-color: #ffffff', '')
            );
            style.textContent = newStyles;
        });
        const content = document.getElementById('content');
        const preface = document.getElementById('preface');
        const initialImage = document.getElementById('initial-image');
        const container = document.querySelector('.container');
        
        content.style.display = 'none';
        preface.style.display = 'none';
        initialImage.style.display = 'block';
        initialImage.style.opacity = '1';
        
        setTimeout(() => {
            container.addEventListener('mouseover', handleMouseOver);
        }, 100);
        
        executeHook('restart.complete', { event });
        event.stopPropagation();
    });
    
    navButtons.appendChild(prefaceButton);
    navButtons.appendChild(restartButton);
    contentDiv.appendChild(navButtons);
    executeHook('addNavigationButtons.complete', { contentDiv, navButtons });
}

/**
 * Sets the canvas as the favicon
 * @param {string} url - The canvas to use as favicon
 */
async function setFavicon(id) {
    executeHook('setFavicon.start', { id });
    const url = `${baseUrl}/content/${id}`;
    const response = await fetch(url);
    const blob = await response.blob();
    const faviconCanvas = document.createElement('canvas');
    const ctx = faviconCanvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
        faviconCanvas.width = img.width;
        faviconCanvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const favicon = document.createElement('link');
        favicon.rel = 'icon';
        favicon.href = faviconCanvas.toDataURL();
        document.head.appendChild(favicon);
    };
    
    img.src = URL.createObjectURL(blob);
    executeHook('setFavicon.complete', { img });
}


window.UI = {
    loadStyles,
    handleMouseOver, 
    showCustomModal,
    handleModalLinks,
    createListeners,
    addNavigationButtons,
    setFavicon
};

/* Usage examples:
BRC333UI.applyStyles();
BRC333UI.handleMouseOver();
BRC333UI.showCustomModal('Hello World');
BRC333UI.addNavigationButtons(document.getElementById('content'));
*/
