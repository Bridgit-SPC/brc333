const fs = require('fs');
const path = require('path');
const pako = require('pako');

// Function to read, compress, and create a new JS file with the compressed content
function compressAndCreateJS(inputFilePath, outputDir) {
    fs.readFile(inputFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading the file:", err);
            return;
        }

        // Compressing the content
        const compressed = pako.deflate(data, { to: 'string' });
        const base64Compressed = Buffer.from(compressed).toString('base64');

        // JavaScript template to decompress and evaluate the code
        const decompressTemplate = `const compressedBase64 = '${base64Compressed}';
        `;

        // Ensure the output directory exists
        if (!fs.existsSync(outputDir)){
            fs.mkdirSync(outputDir);
        }

        // Creating the output file name based on the input file
        const outputFileName = 'decompress_' + path.basename(inputFilePath);

        // Writing the new JavaScript file
        const outputPath = path.join(outputDir, outputFileName);
        fs.writeFile(outputPath, decompressTemplate, 'utf8', (err) => {
            if (err) {
                console.error("Error writing new JavaScript file:", err);
            } else {
                console.log(`New JavaScript file with compressed content written successfully to ${outputPath}`);
            }
        });
    });
}

// Get the input file name from command line argument or use default
const inputFileName = process.argv[2] || 'UNAT_goblins.js';

// Compress the input file and output to the '/decompress/' directory
compressAndCreateJS(inputFileName, 'decompress');

