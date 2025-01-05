//  **********************************************************************************************************
//  brc333articles.js
//  The Articles module for BRC333 Open Docs satplication
//  
//  This script handles article fetching, processing, display and linking functionality
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
 * Fetches and processes all articles
 * @returns {Promise<Array>} Array of processed articles
 */
let cachedArticles = [];
async function fetchArticles() {
    executeHook('fetchArticles.start', { });
    
    if (cachedArticles.length > 0) {
        return Promise.resolve(cachedArticles);
    }

    const inscriptionIds = await getInscriptionsForSat(articleSat.sat);
    let activeArticles = new Map();
    let modifications = [];
    
    for (const id of inscriptionIds) {
        const manifestResponse = await getInscriptionContent(id, true);  
        manifestResponse.articles.forEach(article => {
            if (article.replace) {
                modifications.push({
                    p: manifestResponse.p,
                    op: 'modify',
                    project: manifestResponse.project,
                    updates: [{
                        id: article.id,
                        author: article.author,
                        replace: article.replace
                    }]
                });
            }
        });
           
        if (manifestResponse?.p === 'brc333' && manifestResponse.op === 'activate') {
            for (const article of manifestResponse.articles) {
                let articleContent = await getInscriptionContent(article.id);
                if (testing === true) 
                    articleContent = articleContent.replace(/src="\//g, 'src="https://ordinals.com/');
                
                articleContent = articleContent.replace(/PLACEHOLDER/g, inscriptionId);

                let processedContent = await processArticleContent(articleContent);
                
                article.html = processedContent.html;
                article.title = article.title || processedContent.title;
                activeArticles.set(article.id, article);
            }
        } else if (manifestResponse?.p === 'brc333' && manifestResponse.op === 'modify') {
            modifications.push(manifestResponse);
        }
    }

    if (testing === true && typeof testMods !== 'undefined') {
        modifications.push(testMods);
    }
    
    for (const modification of modifications) {
        
        if (modification.updates) {
            for (const update of modification.updates) {
                const existingArticle = activeArticles.get(update.id);
                if (existingArticle) {
                    updateArticles (existingArticle, update);        
                }
            }
        }
        
        if (modification.deletes) {
            for (const deleteId of modification.deletes) {
                activeArticles.delete(deleteId);
            }
        }
    }
    cachedArticles = Array.from(activeArticles.values());

    executeHook('fetchArticles.return', { cachedArticles });
    return cachedArticles;
}

function updateArticles (existingArticle, update) {
    executeHook('updateArticles.start', { article: existingArticle, update });

    Object.assign(existingArticle, update);                    
    Object.keys(update).forEach(key => {
        if (key !== 'id' && key !== 'content' && key !== 'lines' && key !== 'replace') {
            existingArticle[key] = update[key];
        }
    });

    if (update.lines && update.content) {
        const lines = existingArticle.html.split('\n');
        lines.splice(
            update.lines.start - 1,
            update.lines.end - update.lines.start + 1,
            ...update.content
        );
        existingArticle.html = lines.join('\n');
    }
    if (update.replace) {
        if (Array.isArray(update.replace)) {
            update.replace.forEach(replacement => {
                existingArticle.html = existingArticle.html.replace(
                    replacement.this,
                    replacement.with
                );
            });
        } else {
            existingArticle.html = existingArticle.html.replace(
                update.replace.this,
                update.replace.with
            );
        }
    }
    executeHook('updateArticles.complete', { article: existingArticle });
}

/* Handles clicks on metadata links (tags, replies, authors) from both article and modal contexts
* @param {string} type - Type of metadata link ('tag', 'reply', or 'author')
* @param {string} value - The value to filter by (tag name, reply ID, or author name)
* @param {string} sourceContext - Context the link was clicked from ('article' or 'modal')
* @returns {void} Updates DOM and filtered results
*/
let isRefreshing = false;
function handleMetadataLink(type, value, sourceContext = 'article') {
    executeHook('handleMetadataLink.start', { type, value, sourceContext: 'article' });

    const existingNav = document.getElementById('nav-controls');
    if (existingNav) {
        existingNav.remove();
    }

    const preface = document.querySelector('.preface');

    switch(type) {
        case 'tag':
            document.querySelectorAll('.tag-cloud-controls').forEach(control => control.remove());
            
            const toggleButton = document.querySelector('.tag-cloud-toggle');  // maybe needs to change
            if (toggleButton) {
                toggleButton.style.display = 'none';
            }
            
            filteredResults = articles.filter(article => 
                article.tags && article.tags.includes(value)
            );
            currentPage = 1;
            
            content.style.display = 'none';
            preface.style.display = 'block';
            preface.style.opacity = '1';
            
            setTimeout(() => {
                const tagCloud = document.querySelector('.tag-cloud');
                const articleLinks = document.querySelector('.article-links');
                if (tagCloud) {
                    tagCloud.classList.add('open');
                    const tagCloudControls = document.createElement('div');
                    tagCloudControls.className = 'tag-cloud-controls';
                    tagCloudControls.style.display = 'flex';
                    createTagButtons(tagCloudControls);
                    articleLinks.parentNode.insertBefore(tagCloudControls, articleLinks);
                }
                
                const tagElement = document.querySelector(`.tag-cloud-tag[data-tag="${value}"]`);
                if (tagElement) {
                    tagElement.classList.add('selected');
                }
            }, 0);
            refreshArticleList();
            break;
        case 'reply':
        case 'reply-to':
            const targetArticle = articles.find(article => article.id === value);
            if (targetArticle) {
                content.style.display = 'block';
                preface.style.display = 'none';
                displayArticle(targetArticle);
                return;
            }
            break;
        case 'author':
            filteredResults = cachedArticles.filter(article => article.author === value);
            currentPage = 1;

            const authorSelect = document.querySelector('.author-select');
            if (authorSelect) {
                authorSelect.value = value;
            }
            
            content.style.display = 'none';
            preface.style.display = 'block';
            preface.style.opacity = '1';
            
            refreshArticleList();
            break;        
    }

    currentPage = 1;

    content.style.display = 'none';
    preface.style.display = 'block';
    preface.style.opacity = '1';

    if (type === 'tag') {
        const tagCloud = document.querySelector('.tag-cloud');
        tagCloud.classList.add('open');
        
        const tagCloudControls = document.createElement('div');
        tagCloudControls.className = 'tag-cloud-controls';
        tagCloudControls.style.display = 'flex';
        createTagButtons(tagCloudControls);
        
        const articleList = document.querySelector('.article-links');
        articleList.after(tagCloudControls);
        
        const tagElement = document.querySelector(`.tag-cloud-tag[data-tag="${value}"]`);
        if (tagElement) {
            tagElement.classList.add('selected');
        }
    }

    refreshArticleList();
    
    if (sourceContext === 'modal') {
        closeModal();
    }
    executeHook('handleMetadataLink.complete');
}

/**
 * Creates metadata box element for an article
 * @param {Object} article - Article object containing metadata fields
 * @param {string} article.author - Author name
 * @param {string} article.date - Optional date string
 * @param {string} article['reply-to'] - Optional ID of article being replied to
 * @param {string} article.medium - Optional medium type
 * @param {string} article.source - Optional source name
 * @param {string} article.subject - Optional subject line
 * @param {Array} article.tags - Optional array of tag strings
 * @returns {Promise<HTMLElement>} Metadata box div element with formatted content
 */
async function createMetadataBox(article) {
    executeHook('createMetadataBox.start', { article });

    const metadataBox = document.createElement('div');
    metadataBox.className = 'metadata-box';

    metadataBox.addEventListener('click', (e) => {

        if (e.target.classList.contains('author-link')) {
            e.preventDefault();
            handleMetadataLink('author', article.author, 'article');
        }
        
        if (e.target.classList.contains('reply-link')) {
            e.preventDefault();
            e.stopPropagation();
            const metadataItem = e.target.closest('.metadata-item');
            if (metadataItem.textContent.startsWith('IN REPLY TO:')) {
                handleMetadataLink('reply-to', article['reply-to'], 'article');
            } else if (metadataItem.textContent.startsWith('REPLIES:')) {
                handleMetadataLink('reply', e.target.dataset.replyId, 'article');
            }
        }        
        
        if (e.target.classList.contains('tag-link')) {
            e.preventDefault();
            handleMetadataLink('tag', e.target.dataset.tag, 'article');
        }
    });

    if (article.title) {
        metadataBox.innerHTML += `<div class="metadata-item">TITLE: ${article.title}</div>`;
    }

    const timestamp = await processArticleDate(article);
    const date = new Date(timestamp);
    const localDate = date.toLocaleString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    metadataBox.innerHTML += `<div class="metadata-item">PUBLISHED: ${localDate}</div>`;

    const authorDiv = document.createElement('div');
    authorDiv.className = 'metadata-item';
    authorDiv.textContent = 'AUTHOR: ';
    
    const authorLink = document.createElement('a');
    authorLink.href = '#';
    authorLink.className = 'author-link';
    authorLink.textContent = article.author;
    authorLink.addEventListener('click', (e) => {
        e.preventDefault();
        handleMetadataLink('author', article.author, 'article');
    });
    
    authorDiv.appendChild(authorLink);
    metadataBox.appendChild(authorDiv);
    
    if (article.medium) {
        metadataBox.innerHTML += `<div class="metadata-item">MEDIUM: ${article.medium}</div>`;
    }
    if (article.source) {
        metadataBox.innerHTML += `<div class="metadata-item">SOURCE: ${article.source}</div>`;
    }
    if (article.subject) {
        metadataBox.innerHTML += `<div class="metadata-item">SUBJECT: ${article.subject}</div>`;
    }

    if (article['reply-to']) {
        const replyToArticle = articles.find(a => a.id === article['reply-to']);
        const replyTitle = replyToArticle ? replyToArticle.title : article['reply-to'];
        const replyDiv = document.createElement('div');
        replyDiv.className = 'metadata-item';
        replyDiv.textContent = 'IN REPLY TO: ';
        const replyLink = document.createElement('a');
        replyLink.href = '#';
        replyLink.className = 'reply-link';
        replyLink.textContent = replyTitle;
        replyDiv.appendChild(replyLink);
        metadataBox.appendChild(replyDiv);
    }

    const repliesTo = articles.filter(a => a['reply-to'] === article.id);
    if (repliesTo.length > 0) {
        const repliesDiv = document.createElement('div');
        repliesDiv.className = 'metadata-item';
        repliesDiv.textContent = 'REPLIES: ';

        repliesTo.forEach((reply, index) => {
            const replyLink = document.createElement('a');
            replyLink.href = '#';
            replyLink.className = 'reply-link';
            replyLink.textContent = reply.title;
            replyLink.dataset.replyId = reply.id; 
            replyLink.addEventListener('click', (e) => {
                e.preventDefault();
                handleMetadataLink('reply', reply.id, 'article');
            });
            repliesDiv.appendChild(replyLink);
            if (index < repliesTo.length - 1) {
                repliesDiv.appendChild(document.createTextNode('|'));
            }
        });
        metadataBox.appendChild(repliesDiv);
    }

    if (article.tags && article.tags.length > 0) {
        const tagItem = document.createElement('div');
        tagItem.className = 'metadata-item';
        tagItem.textContent = 'TAGS: ';
        
        article.tags.forEach((tag, index) => {
            const tagLink = document.createElement('a');
            tagLink.href = '#';
            tagLink.className = 'tag-link';
            tagLink.dataset.tag = tag;
            tagLink.textContent = tag;
            tagLink.addEventListener('click', (e) => {
                e.preventDefault();
                handleMetadataLink('tag', tag, 'article');
            });
            tagItem.appendChild(tagLink);
            if (index < article.tags.length - 1) {
                tagItem.appendChild(document.createTextNode('|'));
            }
        });
        metadataBox.appendChild(tagItem);
    }
    executeHook('createMetadataBox.return', { metadataBox });
    return metadataBox;
}

/**
 * Processes article content into standardized format
 * @param {string} content - Raw article content
 * @returns {Object} - Processed article with title and html
 */
async function processArticleContent(content) {
    executeHook('processArticleContent.start', { content }); 

    const container = document.querySelector('.article-container');
    if (container) {
        container.style.whiteSpace = 'pre-wrap';
        container.style.wordWrap = 'break-word';
        container.style.maxWidth = '100%';
    }

    try {
        const jsonContent = JSON.parse(content);
        return {
            title: jsonContent.title || 'Untitled',
            html: jsonContent.content || jsonContent.html || content
        };
    } catch {
        if (content.trim().startsWith('<')) {
            const tempContainer = document.createElement('div');
            tempContainer.innerHTML = content;
            const titleElement = tempContainer.querySelector('h1, h2') || tempContainer.querySelector('div');
            
            return {
                title: titleElement ? titleElement.textContent : 'Untitled',
                html: content
            };
        }

        if (content.split('\n').some(line => line.startsWith('#') || line.startsWith('##')) 
            || (content.match(/\*\*/g)?.length % 2 === 0 && content.match(/\*\*/g)?.length > 0)
            || content.includes('```') ) {
            
            const contentDiv = document.getElementById('content');
            
            let html = marked.parse(content);
            const title = content.split('\n')[0].replace(/#/g, '').trim();
            
            executeHook('processArticleContent.return1', { title, html }); 
            return {
                title: title || 'Untitled',
                html: html
            };
        }
        executeHook('processArticleContent.return2', { content   });
        return {
            title: 'Text Document',
            html: `<div id="article-text" style="white-space: pre-wrap; word-wrap: break-word;">${content}</div>`
        };
    }
}

/**
 * Creates article link element with event handlers
 * @param {Object} article - Article data object
 * @param {number} index - Article index
 * @param {number} startIndex - Starting index for pagination
 * @returns {HTMLElement} Configured link element
 */
async function createArticleLink(article, index, startIndex) {
    executeHook('createArticleLink.start', { article, index, startIndex }); 
    
    const globalIndex = startIndex + index + 1;

    const linkContainer = document.createElement('div');
    linkContainer.style.display = 'block';  
    linkContainer.style.marginBottom = '10px';  

    const link = document.createElement('a');
    link.href = '#';
    link.textContent = `${startIndex + index + 1}. ${article.title} `;
    
    linkContainer.appendChild(link);

    const timestamp = await processArticleDate(article);
    const date = new Date(timestamp);
    const localDate = date.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const replyToArticle = article['reply-to'] ? cachedArticles.find(a => a.id === article['reply-to']) : null;
    const replyToText = replyToArticle ? replyToArticle.title : article['reply-to'];

    const replies = cachedArticles.filter(a => a['reply-to'] === article.id);
    const repliesText = replies.length > 0 ? 
        `${replies.map(r => r.title).join('|')}` : '';

    link.href = '#';
    link.dataset.info = `AUTHOR: ${article.author}\nPUBLISHED: ${localDate}` + 
        (article['reply-to'] ? `\nIN REPLY TO: ${replyToText}` : '') +
        ((replies.length > 0) ? `\nREPLIES: ${repliesText}` : '') +
        (article.medium ? `\nMEDIUM: ${article.medium}` : '') +
        (article.source ? `\nSOURCE: ${article.source}` : '') +
        (article.subject ? `\nSUBJECT: ${article.subject}` : '') +
        (article.tags ? `\nTAGS: ${article.tags.join(', ')}` : '');
        


    link.className = 'article-link';
    link.style.display = 'grid';
    link.style.gridTemplateColumns = '40px 1fr';
    link.style.gap = '5px';

    link.innerHTML = `
        <span class="article-number">${startIndex + index + 1}.</span>
        <span class="article-title">${article.title}</span>
    `;
    
    link.onclick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        preface.style.opacity = '0';
        preface.style.display = 'none';
        content.style.display = 'block';
        await displayArticle(article);
        
        content.scrollTop = 0;
        content.style.opacity = '1';
        content.scrollIntoView({behavior: 'smooth'});
    };
    
    executeHook('createArticleLink.return', { linkContainer }); 
    return linkContainer;
}

/**
 * Displays an article in the content area with navigation
 * @param {Object} article - The article object containing html content
 * @returns {void}
 */
async function displayArticle(articleToDisplay) {
    if (!articleToDisplay) {
        console.log('No article to display');
        return;
    }
    executeHook('displayArticle.start', { articleToDisplay });
    
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = '';

    const fullArticle = articles.find(a => a?.id === articleToDisplay?.id) || articleToDisplay;
    
    const articleContainer = document.createElement('div');
    articleContainer.className = 'article-content';
    articleContainer.innerHTML = fullArticle.html || fullArticle['article-text'] || '';
    
    window.currentArticle = fullArticle;
    const preface = document.getElementById('preface');
    const title = document.querySelector('.title');
    
    if (title) {
        title.style.display = 'none';
        title.style.opacity = '0';
    }
    
    preface.style.display = 'none';
    contentDiv.style.display = 'block';
    contentDiv.style.opacity = '1';
    contentDiv.style.visibility = 'visible';

    const metadataBox = await createMetadataBox(fullArticle);
    contentDiv.appendChild(metadataBox);

    const metadataSeparator = document.createElement('hr');
    metadataSeparator.style.margin = '20px 0';
    metadataSeparator.style.border = '0';
    metadataSeparator.style.borderTop = '1px solid rgba(255, 69, 0, 0.2)';
    contentDiv.appendChild(metadataSeparator);

    let cleanContent = fullArticle.html;
    if (typeof cleanContent === 'string') {
        const lines = cleanContent.split('\n');
        if (lines[0] && lines[0].trim().startsWith('On')) {
            lines.shift();
            cleanContent = lines.join('\n');
        }
    }

    articleContainer.className = 'article-content';
    articleContainer.innerHTML = cleanContent;

    if (fullArticle.bypassTheme) {
        articleContainer.classList.add('bypassTheme');
        const styleMatch = cleanContent.match(/<style>([\s\S]*?)<\/style>/);
        if (!styleMatch) {
            console.log('No style tag found in content');
            return;
        }
        
        const originalStyles = styleMatch ? styleMatch[1] : '';
        const bodyStyles = originalStyles.match(/body\s*{([^}]*)}/)[1];
        const textColorMatch = bodyStyles.match(/(?<!background-)color:\s*((?:rgb\(\d+,\s*\d+,\s*\d+\)|#[0-9a-f]{6}))/i);

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = cleanContent;
        const bodyContent = tempDiv.querySelector('body')?.innerHTML || cleanContent;

        contentDiv.parentElement.style.cssText = `
            display: flex !important;
            justify-content: center !important;
            width: 100% !important;
        `;
        
        contentDiv.style.cssText += `
            width: 520px !important;
            margin: 0 auto !important;
            padding: 0 !important;
            background-color: transparent !important;
            position: relative !important;
            box-sizing: border-box !important;
        `;
        metadataBox.style.cssText = `
            width: 520px !important;
            margin: 0 auto !important;
            padding: 20px !important;
            box-sizing: border-box !important;
            background-color: var(--color-background) !important;
        `;

        articleContainer.style.cssText = `
            width: 520px !important;
            margin: 0 auto !important;
            box-sizing: border-box !important;
            color: ${textColorMatch[1]} !important;
        `;

        articleContainer.innerHTML = bodyContent;

        contentDiv.innerHTML = '';
        contentDiv.appendChild(metadataBox);
        contentDiv.appendChild(metadataSeparator);
        contentDiv.appendChild(articleContainer);

        const styleElement = document.createElement('style');
        const featureBoxMatch = originalStyles.match(/\.feature-box\s*{([^}]*)}/);
        const featureBoxP = originalStyles.match(/\.feature-box\s+p\s*{([^}]*)}/);
        const pStyles = featureBoxP ? featureBoxP[1] : 'width: 100%; margin: 8px 0;';

        styleElement.textContent = `
            ${originalStyles}
            #content .article-content.bypassTheme .feature-box p {
                width: 100% !important;
                margin: 8px 0 !important;
                box-sizing: border-box !important;
                ${featureBoxP ? featureBoxP[1] : ''}
            }
        `;
        document.head.appendChild(styleElement);
    } else {
        contentDiv.style.color = window.textColor;
        contentDiv.style.backgroundColor = window.backgroundColor;
        
        const elements = articleContainer.querySelectorAll('*');
        elements.forEach(el => {
            el.style.color = '';
            el.style.backgroundColor = '';
        });
    } 

    contentDiv.appendChild(articleContainer);  
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                const lists = contentDiv.querySelectorAll('ol, ul');
                if (lists.length) {
                    lists.forEach((list, index) => {
                        if (list.tagName === 'OL') {
                            list.style.cssText = 'width: 480px !important; margin-left: 0 !important;';
                            const paragraphs = list.querySelectorAll('p');
                            paragraphs.forEach(p => {
                                p.style.cssText = 'width: 480px !important; max-width: 480px !important;';
                            });
                        } else if (list.tagName === 'UL') {
                            list.style.cssText = 'width: 460px !important; margin-left: 0 !important;';
                            const paragraphs = list.querySelectorAll('p');
                            paragraphs.forEach(p => {
                                p.style.cssText = 'width: 460px !important; max-width: 460px !important;';
                            });
                        }
                    });
                }
            }
        });
    });
    
    observer.observe(contentDiv, { childList: true, subtree: true });

    if (typeof window.spansToArticles !== 'undefined') {
        for (let i = 0; i < window.spansToArticles.length; i++) {
            const mapping = window.spansToArticles[i];
            const targetArticle = articles.find(a => a.id === mapping.articleId);
            if (targetArticle) {
                const span = document.getElementById(mapping.spanId);
                if (span) {
                    span.classList.add('inline-link');
                    span.style.cursor = 'pointer';
                    span.innerHTML = span.innerHTML.trim();
                    span.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.displayArticle(targetArticle);
                    });
                }
            }
        }
    }
    
    const navSeparator = document.createElement('hr');
    navSeparator.style.margin = '20px 0';
    navSeparator.style.border = '0';
    navSeparator.style.borderTop = '1px solid rgba(255, 69, 0, 0.2)';
    contentDiv.appendChild(navSeparator);

    addNavigationButtons(contentDiv);
    executeHook('displayArticle.complete', { articleToDisplay });
}

/**
 * Displays article links with pagination
 * @param {Array} articles - The articles to display
 * @returns {void}
 */
async function displayArticleLinks(articles) {
    executeHook('displayArticleLinks.start', articles);
    
    const preface = document.querySelector('#preface');
    const tagCloud = createTagCloud();

    setTimeout(() => {
        const controls = document.getElementById('tag-controls');
        
        if (tagCloud && controls) {
            controls.remove();
        }
    }, 0);
    
    if (!currentPage) currentPage = 1;
    const startIndex = (currentPage - 1) * window.ITEMS_PER_PAGE;
    
    const endIndex = startIndex + window.ITEMS_PER_PAGE;
    const pageArticles = articles.slice(startIndex, endIndex);

    if (!document.getElementById('content')) {
        const contentDiv = document.createElement('div');
        contentDiv.id = 'content';
        contentDiv.className = 'content';
        document.querySelector('.container').appendChild(contentDiv);
    }

    const navButtons = document.createElement('div');
    navButtons.className = 'navigation-buttons';
    const prefaceButton = document.createElement('button');
    prefaceButton.id = 'prefaceButton';
    prefaceButton.textContent = prefaceButtonText;
    const restartButton = document.createElement('button');
    restartButton.id = 'restartButton';
    restartButton.textContent = restartButtonText;
    navButtons.appendChild(prefaceButton);
    navButtons.appendChild(restartButton);
    document.getElementById('content').appendChild(navButtons);

    const linkList = document.createElement('div');
    linkList.className = 'article-links';
    preface.appendChild(linkList);

    const existingSearchControls = document.querySelector('.search-controls');
    if (!existingSearchControls) {
        addSearchControls();
    }
    const searchControls = document.querySelector('.search-controls');
    searchControls.after(createTagCloud());
    
    for (const [index, article] of pageArticles.entries()) {

        const link = await createArticleLink(article, index, startIndex);
        linkList.appendChild(link);
    }

    const controlsContainer = addPaginationAndButton(articles);
    preface.appendChild(controlsContainer);

    executeHook('displayArticleLinks.complete', controlsContainer);
}

window.BRC333Articles = {
    fetchArticles,
    processArticleContent,
    createArticleLink,
    displayArticle,
    displayArticleLinks
};

/* Usage examples:
const articles = await BRC333Articles.fetchArticles();
const processedContent = await BRC333Articles.processArticleContent(rawContent);
const link = await BRC333Articles.createArticleLink(article, 0, 0);
await BRC333Articles.displayArticle(article);
*/
