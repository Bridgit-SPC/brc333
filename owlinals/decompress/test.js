const fs = require('fs');
const pako = require('pako');

// Function to decompress data
function decompressData(compressedBase64) {
    try {
        const compressed = Buffer.from(compressedBase64, 'base64');
        const decompressed = pako.inflate(compressed, { to: 'string' });
        return decompressed;
    } catch (error) {
        console.error('Decompression error:', error.message);
        return null;
    }
}

// Read the compressed data from the file
fs.readFile('decomp_test.txt', 'utf8', (err, compressedBase64) => {
    if (err) {
        return console.error('Error reading the file:', err.message);
    }

    // Decompress the data
    const decompressedData = decompressData(compressedBase64);

    // Write the decompressed data to a new file
    if (decompressedData) {
        fs.writeFile('decompression_output.txt', decompressedData, 'utf8', (err) => {
            if (err) {
                console.error('Error writing the decompressed data:', err.message);
            } else {
                console.log('Decompression completed successfully. Output written to decompression_output.txt');
            }
        });
    }
});
