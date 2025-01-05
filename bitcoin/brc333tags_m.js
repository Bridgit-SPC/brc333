//  **********************************************************************************************************
//  brc333tags.js
//  The Tags module for BRC333 Open Docs satplication
//  
//  This script handles tag cloud creation, tag filtering, and search functionality
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
 * Creates and configures the tag cloud interface
 * @returns {HTMLElement} Configured tag cloud container
 */
const selectedTags = new Set();
let toggleButton;

function createTagCloud() {
    executeHook('createTagCloud.start', { cachedArticles: window.cachedArticles });

    const tagFrequency = {};
    
    articles.forEach(article => {
        article.tags?.forEach(tag => {
            tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
        });
    });

    const maxFreq = Math.max(...Object.values(tagFrequency));
    const container = document.createElement('div');
    container.className = 'tag-cloud-container';

    const controls = document.createElement('div');
    controls.className = 'tag-cloud-controls';

    const tagCloud = document.createElement('div');
    tagCloud.className = 'tag-cloud';

    Object.entries(tagFrequency).forEach(([tag, freq]) => {
        const size = 0.8 + (freq / maxFreq) * 0.7;
        const tagElement = document.createElement('span');
        tagElement.className = 'tag-cloud-tag';
        tagElement.textContent = tag;
        tagElement.style.fontSize = `${size}em`;
        tagElement.dataset.tag = tag;
        
        tagElement.onclick = () => {
            tagElement.classList.toggle('selected');
            if (tagElement.classList.contains('selected')) {
                selectedTags.add(tag);
            } else {
                selectedTags.delete(tag);
            }
            
            filteredResults = articles.filter(article => 
                selectedTags.size === 0 || 
                article.tags?.some(t => selectedTags.has(t))
            );
            currentPage = 1;
            refreshArticleList();
        };
        
        tagCloud.appendChild(tagElement);
    });

    const actionButtons = document.createElement('div');
    actionButtons.className = 'tag-cloud-controls';
    actionButtons.style.display = 'none';
    actionButtons.style.display = 'flex';
    actionButtons.style.justifyContent = 'flex-end';
    
    createTagButtons(actionButtons);
    container.appendChild(controls);
    container.appendChild(tagCloud);
    container.appendChild(actionButtons);
    
    executeHook('createTagCloud.return', { container });
    return container;
}

function closeTagCloud() {
    const tagCloud = document.querySelector('.tag-cloud');
    const actionButtons = document.querySelector('.action-buttons');
    
    if (tagCloud) {
        tagCloud.remove();
    }
    if (actionButtons) {
        actionButtons.remove();
    }
}

/**
 * Creates clear and close buttons for tag cloud controls
 * @param {HTMLElement} actionButtons - Container element for tag cloud control buttons
 * @returns {void} - Appends clear and close buttons to the container
 */
let clearButton, closeButton;
function createTagButtons(actionButtons) {
    executeHook('createTagButtons.start', { actionButtons });

    const existingControls = document.getElementById('tag-controls');
    if (existingControls) {
        existingControls.remove();
    }

    actionButtons.id = 'tag-controls';

    clearButton = document.createElement('button');
    clearButton.className = 'clear-tags';
    clearButton.textContent = 'Clear';
    clearButton.onclick = () => {
        selectedTags.clear();
        document.querySelectorAll('.tag-cloud-tag').forEach(tag => {
            tag.classList.remove('selected');
        });
        filteredResults = articles;
        currentPage = 1;
        refreshArticleList();
    };

    closeButton = document.createElement('button');
    closeButton.className = 'close-tags';
    closeButton.textContent = 'Close';
    closeButton.onclick = () => {
        selectedTags.clear();
        filteredResults = articles;
        
        const tagCloud = document.querySelector('.tag-cloud');
        if (tagCloud) {
            tagCloud.querySelectorAll('.tag-cloud-tag').forEach(tag => {
                tag.classList.remove('selected');
            });
            tagCloud.classList.remove('open');
        }
        
        const controls = document.querySelector('.tag-cloud-controls');
        if (controls) {
            controls.remove();
        }
        
        const toggleButton = document.querySelector('.tag-cloud-toggle');
        if (toggleButton) {
            toggleButton.style.display = 'block';
        }        
        refreshArticleList();        
    };

    actionButtons.appendChild(clearButton);
    actionButtons.appendChild(closeButton);
    executeHook('createTagButtons.complete', { actionButtons });
}

/**
 * Filters articles based on search criteria
 * @param {Array} articles - Array of articles to filter
 * @param {string} searchTerm - Search term
 * @param {string} fromDate - Start date filter
 * @param {string} toDate - End date filter
 * @returns {Array} Filtered articles
 */

async function filterArticles(event) {
    executeHook('filterArticles.start', { event });

    const searchInterface = createSearchableInterface(sourceId);
   
    const searchTerm = document.querySelector('.search-input').value.toLowerCase();
    const selectedAuthor = document.querySelector('.author-select').value;
    const fromDate = document.querySelector('.date-filter').value;
    const toDate = document.querySelectorAll('.date-filter')[1].value;
    
    filteredResults = searchInterface.search({
        searchTerm,
        author: selectedAuthor,
        fromDate,
        toDate
    });
    
    refreshArticleList();
    executeHook('filterArticles.complete', { filteredResults });
}

/**
 * Adds search and date filter controls to the interface
 * @returns {void} 
 */
function addSearchControls() {
    executeHook('addSearchControls.start');

    const searchDiv = document.createElement('div');
    searchDiv.className = 'search-controls';

    const titleRow = document.createElement('div');
    titleRow.className = 'title-row';
    titleRow.appendChild(document.createTextNode(window.linkListTitle));

    const searchAuthorRow = document.createElement('div');
    searchAuthorRow.className = 'search-author-filter-row';
    
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'search-input';
    searchInput.placeholder = window.searchPlaceholder;
    searchInput.addEventListener('input', filterArticles);

    const authorSelect = document.createElement('select');
    authorSelect.className = 'author-select';
    
    const authors = [...new Set(articles.map(article => article.author))].sort();
    
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'All Authors';
    authorSelect.appendChild(defaultOption);
    
    authors.forEach(author => {
        const option = document.createElement('option');
        option.value = author;
        option.textContent = author;
        authorSelect.appendChild(option);
    });
    authorSelect.addEventListener('change', filterArticles);
    
    searchAuthorRow.append(searchInput, authorSelect);

    const dateRow = document.createElement('div');
    dateRow.className = 'date-filter-row';
    dateRow.style.display = 'flex';
    dateRow.style.alignItems = 'center';

    const fromDate = document.createElement('input');
    fromDate.type = 'date';
    fromDate.className = 'date-filter';
    fromDate.addEventListener('change', filterArticles);
    
    const toDate = document.createElement('input');
    toDate.type = 'date';
    toDate.className = 'date-filter';
    toDate.addEventListener('change', filterArticles);

    const dateContainer = document.createElement('div');
    dateContainer.className = 'date-container';
    dateContainer.style.width = '380px'; 
    dateContainer.style.display = 'flex';
    dateContainer.style.gap = '10px';
    dateContainer.style.alignItems = 'center';
    dateContainer.append('From:', fromDate, 'To:', toDate);

    toggleButton = document.createElement('button');
    toggleButton.className = 'tag-cloud-toggle';
    toggleButton.textContent = 'Show Tags';
    
    dateRow.append(dateContainer, toggleButton);

    toggleButton.onclick = () => {
        const tagCloudControls = document.createElement('div');
        tagCloudControls.className = 'tag-cloud-controls';
        tagCloudControls.style.display = 'flex';
        tagCloudControls.style.justifyContent = 'flex-end';
        tagCloudControls.style.width = '100%';
        
        const tagCloud = document.querySelector('.tag-cloud');
        tagCloud.classList.add('open');
        toggleButton.style.display = 'none';
        
        createTagButtons(tagCloudControls);
        tagCloud.appendChild(tagCloudControls);
    };

    const tagCloud = document.getElementById('tag-cloud');
    if (tagCloud && tagCloud.classList.contains('open')) {
        toggleButton.style.display = 'none';
    }

    searchDiv.append(titleRow, searchAuthorRow, dateRow);
    document.querySelector('.article-links').before(searchDiv);
    executeHook('addSearchControls.complete', { searchDiv });
}

/**
 * Creates a searchable interface for article data
 * @param {string} sourceId - Unique identifier for the data source
 * @returns {Object} Search interface with methods:
 *   - search({Object} filters) - Searches articles with specified filters
 *     - searchTerm {string} - Text to search for
 *     - fromDate {string} - Start date filter
 *     - toDate {string} - End date filter  
 *     - author {string} - Author filter
 *     - limit {number} - Max results to return
 *     - offset {number} - Number of results to skip
 */
window.brc333Search = new Map();

function createSearchableInterface(sourceId) {
    executeHook('createSearchableInterface.start', { sourceId });
    const searchInterface = {
        search: (filters = {}) => {
            const {
                searchTerm = '',
                fromDate = null,
                toDate = null,
                author = '',
                limit = 50,
                offset = 0
            } = filters;
                        
            return articles.filter(article => {
                const matchesSearch = !searchTerm || 
                    article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    article.html.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    article.author.toLowerCase().includes(searchTerm.toLowerCase());
                
                const articleDate = new Date(article.timestamp * 1000);
                const matchesDate = (!fromDate || articleDate >= new Date(fromDate)) && 
                                  (!toDate || articleDate <= new Date(toDate));
                
                const matchesAuthor = !author || 
                    article.author.toLowerCase().includes(author.toLowerCase());
                
                return matchesSearch && matchesDate && matchesAuthor;
            })
            .slice(offset, offset + limit)
            .map(article => ({
                id: article.id,
                title: article.title,
                author: article.author,
                timestamp: article.timestamp,
                preview: article.html.replace(/<[^>]*>/g, '').substring(0, 200) + '...'
            }));
        }
    };

    window.brc333Search.set(sourceId, searchInterface);  
    executeHook('createSearchableInterface.return', { sourceId, searchInterface });
    return searchInterface;
}


window.BRC333Tags = {
    createTagCloud,
    closeTagCloud,
    createTagButtons,
    filterArticles,
    addSearchControls,
    createSearchableInterface
};

/* Usage examples:
const tagCloud = BRC333Tags.createTagCloud();
BRC333Tags.filterArticles(event);
const searchInterface = BRC333Tags.createSearchableInterface('my-source');
*/
