const fs = require('fs');

function generateUniqueRandomNumbers(count, min, max) {
    const numbers = new Set();
    while (numbers.size < count) {
        const randomNumber = Math.floor(min + Math.random() * (max - min + 1));
        numbers.add(randomNumber);
    }
    return Array.from(numbers);
}

const count = 10000;
const minNumber = 100000;
const maxNumber = 999999;

const randomNumbers = generateUniqueRandomNumbers(count, minNumber, maxNumber);

const outputFile = 'random_numbers.txt';
fs.writeFileSync(outputFile, randomNumbers.join('\n'));

console.log(`Generated ${count} unique random numbers and saved them to ${outputFile}`);
