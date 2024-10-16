const fs = require('fs');
const readline = require('readline');  

async function getMetadata(url, retry = false) {
    try {
        // console.log(`Fetching metadata from ${url}`);
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Failed to fetch metadata: ${response.status} ${response.statusText}`);
            throw new Error(`Failed to fetch metadata: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        //console.log('Metadata fetched successfully');
        return data;
    } catch (error) {
        console.error('Error fetching metadata:', error);
        if (!retry) {
            const timestamp = Math.floor(Date.now() / (60000 * 10)); // 10 minutes
            const newUrl = `${url}?timestamp=${timestamp}`;
            console.log(`Retrying with new URL: ${newUrl}`);
            return getMetadata(newUrl, true);
        }
        throw error;
    }   
}

async function getBlockInfo(blk) {
    const metadata = await getMetadata(`https://ordinals.com/r/blockinfo/${blk}`);
    return metadata;
}


async function analyzeNonces() {
    console.log('Starting analysis...');
    const fileStream = fs.createReadStream('./data/blocks_0x0.txt');
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let distribution = Array(10).fill().map(() => Array(10).fill(0));
    let totalCount = 0;
    let processedCount = 0;

    for await (const line of rl) {
        const blockNumber = parseInt(line.trim());
        console.log(`Processing block ${blockNumber}`);
        
        try {
            const blockInfo = await Promise.race([
                getBlockInfo(blockNumber),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 10000))
            ]);
            
            const nonce = blockInfo.nonce.toString();
            totalCount++;

            for (let i = 0; i < nonce.length; i++) {
                const digit = parseInt(nonce[nonce.length - 1 - i]);
                distribution[i][digit]++;
            }
            
            processedCount++;
            if (processedCount % 10 === 0) {
                console.log(`Processed ${processedCount} blocks`);
            }
        } catch (error) {
            console.error(`Error processing block ${blockNumber}:`, error.message);
        }
    }

    console.log(`Analysis complete. Processed ${processedCount} blocks.`);
    
    let csvContent = 'Position,0,1,2,3,4,5,6,7,8,9\n';
    for (let i = 0; i < distribution.length; i++) {
        const row = distribution[i].map(count => (count / totalCount * 100).toFixed(2));
        csvContent += `${i},${row.join(',')}\n`;
    }

    fs.writeFileSync('./data/nonce.csv', csvContent);
    console.log('Distribution analysis complete. Results written to ./data/distribution.csv');
}



analyzeNonces();
