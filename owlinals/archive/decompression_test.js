const fs = require('fs');
const path = require('path');
const pako = require('pako');

function decompressAndWriteToFile(compressedFilePath, outputFilePath) {
    // Import the compressed data
    const { compressedBase64 } = require(compressedFilePath);

    try {
        const compressedData = Buffer.from(compressedBase64, 'base64').toString('binary');
        
        // Decompressing the content
        const decompressed = pako.inflate(compressedData, { to: 'string' });

        // Writing the decompressed content to a new file
        fs.writeFile(outputFilePath, decompressed, 'utf8', (err) => {
            if (err) {
                console.error("Error writing decompressed file:", err);
            } else {
                console.log(`Decompressed content written to file: ${outputFilePath}`);
            }
        });
    } catch (err) {
        console.error("Decompression error:", err);
    }
}

// Adjust the paths as necessary
const compressedScriptPath = path.join(__dirname, 'decompress', 'decompress_compile_mint.js');
const outputFilePath = path.join(__dirname, 'decompress', 'decompressed_content.js');

// Decompress and write to file
decompressAndWriteToFile(compressedScriptPath, outputFilePath);

