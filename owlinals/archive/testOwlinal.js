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
        const script = document.createElement("script");
        script.setAttribute("t", t);
        script.setAttribute("d", timestamp.toString()); // Set the Unix timestamp in minutes
        script.setAttribute("n", nowStamp.toString());
        script.setAttribute("src", "testCompile.js");
        script.setAttribute("m", '{"p":"brc333", "op":"mint", "s":"owlinals"}');

        window.currentScriptId = nowStamp;
        script.dataset.uniqueId = nowStamp;
        script.onload = function () {
            //console.log("compileTest.js loaded and executed.");
            //console.log('script:',script);
            window.dispatchEvent(new Event('load'));
            resolve(); // Resolve the promise when script is loaded
        };

        script.onerror = function () {
            console.error("Error loading compileTest.js.");
            reject(new Error("Script load error")); // Reject the promise on error
        };

        document.body.appendChild(script);
        //console.log("Script appended to DOM:", script);
        //console.log('window.currentScriptId:',window.currentScriptId);
    });
}

function simulateOneMonth() {
  // Use DOMContentLoaded to ensure the entire DOM is ready
  document.addEventListener("DOMContentLoaded", function () {
    const initialTimestamp = Math.floor(Date.now() / 60000); // Current Unix timestamp in minutes
    let currentTimestamp = initialTimestamp;

    const interval = setInterval(() => {
      currentTimestamp += 360; // Increment by one hour (60 minutes)
      const randomT = generateRandomT();
      callCompile(initialTimestamp,randomT,currentTimestamp);         
        // Stop the simulation after one month (30 days)
        if (currentTimestamp >= initialTimestamp + 30 * 24 * 60) {
          clearInterval(interval);
        }
    }, 1000); // Call every second
  });
}
  
  // Function to create a GIF from the resulting images (implement this separately)
  
  // Start the simulation
  simulateOneMonth();
  