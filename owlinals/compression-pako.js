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
        const decompressTemplate = `
            const pako = require('pako');
            const compressedBase64 = '${base64Compressed}';
            const compressed = Buffer.from(compressedBase64, 'base64').toString('binary');
            const decompressed = pako.inflate(compressed, { to: 'string' });
            eval(decompressed);
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

if (process.argv.length < 3) {
    console.log('Please provide a javascript logic file path.');
    process.exit(1);
}

// Get the image path from the second command line argument (index 2)
const image_path = process.argv[2];

// Compress 'image_path' and output to the '/decompress/decompress_image_path.js'
compressAndCreateJS(image_path, 'decompress');