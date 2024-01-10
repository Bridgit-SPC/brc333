const compile = require('./flatCompileXrpLocal.js');

let canvasArray = [];

function generateRandomT() {
    const tArray = Array.from("362328057-3----731-6-0");
    const positionsToChange = [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 15, 16, 17, 19];
  
    for (const position of positionsToChange) {
      tArray[position] = Math.floor(Math.random() * 10).toString();
    }
  
    tArray[21] = Math.floor(Math.random() * 2).toString();
  
    return tArray.join("");
}
  
function callCompile(timestamp, t, nowStamp) {
  return new Promise((resolve, reject) => {
      try {
          // Call the compile function with the necessary parameters
          compile(timestamp, t, nowStamp)
              .then(() => {
                  resolve();
              })
              .catch((error) => {
                  console.error("Error in compile function:", error);
                  reject(error);
              });
      } catch (error) {
          console.error("Error calling compile function:", error);
          reject(error);
      }
  });
}

function processImages() {
  // Use DOMContentLoaded to ensure the entire DOM is ready
    const initialTimestamp = Math.floor(Date.now() / 60000); // Current Unix timestamp in minutes
    let currentTimestamp = initialTimestamp + 3600;

    for (let i = 0; i < 2000; i++) {
      let randomT = generateRandomT();
      //console.log('randomT:',randomT);
      callCompile(initialTimestamp,randomT,currentTimestamp);         
    }
}
  
  // Function to create a GIF from the resulting images (implement this separately)
  
  // Start the simulation
  processImages();
  
