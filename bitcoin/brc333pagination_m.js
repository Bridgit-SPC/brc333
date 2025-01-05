//  **********************************************************************************************************
//  brc333pagination.js
//  The Pagination module for BRC333 Open Docs satplication
//  
//  This script handles pagination controls, page size selection, and article list refreshing
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

/**
 * Creates pagination controls and LFG button
 * @param {Array} articles - The articles to paginate
 * @returns {HTMLElement} Container with pagination and button
 */
function addPaginationAndButton(articles) {
    executeHook('addPaginationAndButton.start', { articles });
    
    let controlsContainer = document.querySelector('.controls-container');
    if (!controlsContainer) {
        controlsContainer = document.createElement('div');
        controlsContainer.className = 'controls-container';
    }
    

    const totalPages = Math.ceil(articles.length / window.ITEMS_PER_PAGE);
    controlsContainer.innerHTML = '';

    const allNavigation = document.querySelectorAll('.navigation-buttons, .controls-container');
    allNavigation.forEach(nav => nav.remove());

    const existingNav = document.getElementById('nav-controls');
    if (existingNav) {
        existingNav.remove();
    }

    controlsContainer.innerHTML = '';

    controlsContainer.id = 'nav-controls';
    controlsContainer.style.display = 'flex';
    controlsContainer.style.alignItems = 'center';
    controlsContainer.style.gap = '10px';
    controlsContainer.style.marginTop = '5px';
    controlsContainer.style.width = '100%';

    const paginationDiv = document.createElement('div');
    paginationDiv.className = 'pagination';
    paginationDiv.style.display = 'flex';
    paginationDiv.style.gap = '10px';
  
  paginationDiv.style.alignItems = 'center';

    if (currentPage > 1) {
        const firstButton = document.createElement('button');
        firstButton.className = 'page-button';
        firstButton.textContent = '1';
        firstButton.onclick = () => {
            currentPage = 1;
            refreshArticleList();
        };
        paginationDiv.appendChild(firstButton);
    }

    if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.className = 'page-button';
        prevButton.textContent = '<';
        prevButton.onclick = () => {
            currentPage--;
            refreshArticleList();
        };
        paginationDiv.appendChild(prevButton);
    }

    const pageText = document.createElement('span');
    pageText.textContent = `Page ${currentPage} of ${totalPages}`;
    paginationDiv.appendChild(pageText);

    if (currentPage < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.className = 'page-button';
        nextButton.textContent = '>';
        nextButton.onclick = () => {
            currentPage++;
            refreshArticleList();
        };
        paginationDiv.appendChild(nextButton);

        const lastButton = document.createElement('button');
        lastButton.className = 'page-button';
        lastButton.textContent = totalPages;
        lastButton.onclick = () => {
            currentPage = totalPages;
            refreshArticleList();
        };
        paginationDiv.appendChild(lastButton);
    }

    const sizeSelector = document.createElement('select');
    sizeSelector.className = 'page-size-selector';
    [10, 25, 50].forEach(size => {
        const option = document.createElement('option');
        option.value = size;
        option.textContent = `${size} per page`;
        option.selected = size === window.ITEMS_PER_PAGE;
        sizeSelector.appendChild(option);
    });
    
    sizeSelector.addEventListener('change', (e) => {
        window.ITEMS_PER_PAGE = parseInt(e.target.value);
        currentPage = 1;
        refreshArticleList();
    });

    const lfgButton = document.createElement('button');
    lfgButton.id = 'lfgButton';
    const buttonText = window?.lfgButtonText ?? 'LFG!';
    lfgButton.textContent = buttonText;
    lfgButton.addEventListener('click', async (event) => {
        event.stopImmediatePropagation();
        const callForInputArticle = cachedArticles.find(a => a.id === window.callForInputId);
        preface.style.opacity = '0';
        setTimeout(() => {
            preface.style.display = 'none';
            content.style.display = 'block';
            displayArticle(callForInputArticle);
            content.scrollTop = 0;
            setTimeout(() => {
                content.style.opacity = '1';
                content.scrollIntoView({behavior: 'smooth'});
            }, 50);
        }, 500);
    });

    controlsContainer.appendChild(paginationDiv);
    controlsContainer.appendChild(sizeSelector);
    controlsContainer.appendChild(lfgButton);

    executeHook('addPaginationAndButton.return', { controlsContainer });
    return controlsContainer;
}

/**
 * Creates pagination controls
 * @param {number} currentPage - Current page number
 * @param {number} totalPages - Total number of pages
 * @param {Function} onPageChange - Page change callback
 * @returns {HTMLElement} Pagination controls container
 */
function createPaginationControls(currentPage, totalPages, onPageChange) {
    executeHook('createPaginationControls.start', { currentPage, totalPages, onPageChange });
    const paginationDiv = document.createElement('div');
    paginationDiv.className = 'pagination';

    if (currentPage > 1) {
        addPageButton(paginationDiv, '1', () => onPageChange(1));
        addPageButton(paginationDiv, '<', () => onPageChange(currentPage - 1));
    }

    const pageText = document.createElement('span');
    pageText.textContent = `Page ${currentPage} of ${totalPages}`;
    paginationDiv.appendChild(pageText);

    if (currentPage < totalPages) {
        addPageButton(paginationDiv, '>', () => onPageChange(currentPage + 1));
        addPageButton(paginationDiv, totalPages.toString(), () => onPageChange(totalPages));
    }

    executeHook('createPaginationControls.return', { paginationDiv });
    return paginationDiv;
}

/**
 * Refreshes the article list for current page
 * @returns {void}
 */
async function refreshArticleList() {
    executeHook('refreshArticleList.start', { currentPage, filteredResults });
    const existingNav = document.querySelector('.navigation-buttons');
    if (existingNav) {
        existingNav.remove();
    }
    
    const startIndex = (currentPage - 1) * window.ITEMS_PER_PAGE;
    const endIndex = startIndex + window.ITEMS_PER_PAGE;
    const pageArticles = filteredResults.slice(startIndex, endIndex);

    const linkList = document.createElement('div');
    linkList.className = 'article-links';
    for (const [index, article] of pageArticles.entries()) {
        const link = await createArticleLink(article, index, startIndex);
        linkList.appendChild(link);
    }

    const oldLinkList = document.querySelector('.article-links');
    oldLinkList.replaceWith(linkList);

    const newControlsContainer = addPaginationAndButton(filteredResults);
    const preface = document.getElementById('preface');
    preface.appendChild(newControlsContainer);

    const existingFirstMessage = document.querySelector('#firstEndMessage');
    if (existingFirstMessage) existingFirstMessage.remove();
    const existingSubsequentMessage = document.querySelector('#subsequentEndMessage');
    if (existingSubsequentMessage) {
        existingSubsequentMessage.remove();
    }

    if (typeof window.endMessage !== 'undefined' && window.endMessage) {
        const iMessage = document.createElement('p');
        iMessage.id = 'subsequentEndMessage';
        iMessage.className = 'end-message';
        iMessage.innerHTML = window.endMessage;
        iMessage.style.color = 'var(--color-text)';
        iMessage.style.marginTop = '1em';
        iMessage.style.fontSize = '0.93em'; 
        preface.appendChild(iMessage);
    }

    executeHook('refreshArticleList.complete', { currentPage, filteredResults });
}

window.BRC333Pagination = {
    addPaginationAndButton,
    createPaginationControls,
    refreshArticleList
};

/* Usage examples:
const controls = BRC333Pagination.addPaginationAndButton(articles);
const pagination = BRC333Pagination.createPaginationControls(1, 10, pageNum => console.log(pageNum));
await BRC333Pagination.refreshArticleList();
*/
