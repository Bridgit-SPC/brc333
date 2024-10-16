const { window } = require('./globalSetup.js');

const { generateImages, saveAllAsCSV } = require('../bitcoin/brc333io.js');
const { loadAndModify } = require('./ng_local_exports.js');

//const { block } = require("sharp");
const urlStem = "https://ordinals.com";

let canvas;
const blocksToProcess = 10;

document.addEventListener('DOMContentLoaded', function() {
    //generateAudioAndModal(audioSources);
    console.log('got here');
    window.UI.appendStyles();
    canvas =  window.UI.initCanvas();
    let allGoblinData = [];
    const blocks = [479808, 479809, 479810, 479811, 479812, 479813, 479814, 479815, 479816, 479817, 479818];
    const imageDirName = __dirname + "/images";
    
    async function generateImagesPromise() {
        await generateImages(canvas, loadAndModify, blocksToProcess, blocks, allGoblinData, true, imageDirName);
        //console.log('allGoblinData', allGoblinData);
        const dataDirName = __dirname + '/data';
        saveAllAsCSV(allGoblinData, powers, true, dataDirName);
    }

    generateImagesPromise().catch(error => console.error('Error in generateImagesPromise:', error));
});