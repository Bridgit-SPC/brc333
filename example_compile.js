/*
{
  "p": "brc33",
  "op": "compile",
  "s": "owlinals_test"
}
*/


// EDIT
const collectionJsonUrl = '/content/<deploy inscription id>';
const baseJsonUrl = '/content/<coordinates inscription id>';
const imageRendering = 'pixelated';
const renderSize = { width: 500, height: 500 }; // select image render size

function generateArt(imageEl, traitColors, baseCoordinates, allColors) {
    const canvas = document.createElement('canvas');
    canvas.width = 30;
    canvas.height = 30;

    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    for (const [traitIndex, colorValue] of Object.entries(traitColors)) {
        let color = colorValue;
        if (baseCoordinates[traitIndex] && Array.isArray(baseCoordinates[traitIndex].coordinates) && color !== undefined) {
            ctx.fillStyle = color;
            for (const pixel of baseCoordinates[traitIndex].coordinates) {
                ctx.fillRect(pixel.x - 1, pixel.y - 1, 1, 1);
            }
        }
    }

    imageEl.src = canvas.toDataURL("image/png");
    console.log(imageEl.src);

    // Set the image size to renderSize
    imageEl.style.width = renderSize.width + 'px';
    imageEl.style.height = renderSize.height + 'px';
}

function createInitialImage () {
    // Manipulate the <body> tag
    document.body.style.margin = '0px';
    document.body.style.padding = '0px';

    // Create and set properties of the <img> tag
    const img = document.createElement('img');
    img.id = 'img';
    img.style.height = '100%';
    img.style.width = '100%';
    img.style.objectFit = 'contain';
    img.style.imageRendering = imageRendering;

    // Append the image to the body
    document.body.appendChild(img);

    return img
}

async function getMetadata(url, retry = false) {
    try {
        const collectionMetadataRes = await fetch(url);
        return await collectionMetadataRes.json();
    } catch (e) {
        if (!retry) {
            const timestamp = Math.floor(Date.now() / (60000 * 10)) // 10 minutes
            const newUrl = `${url}?timestamp=${timestamp}`
            return getMetadata(newUrl, true)
        }
        throw e
    }
}

window.onload = async function() {
    const imageEl = createInitialImage();

    try {
        const jsonColorData = await getMetadata(collectionJsonUrl);
        const allColors = jsonColorData.colors;
        const jsonCoordinateData = await getMetadata(baseJsonUrl);
        const baseCoordinates = jsonCoordinateData.coordinates;
        
        const inputString = document.querySelector('script[t]').getAttribute('t');
        
        const selectedColorIndexes = Array.from(inputString).map(char => Number(char));
        const traitColors = selectedColorIndexes.map((selectedColor, i) => allColors[i] ? allColors[i][selectedColor] : null);

        generateArt(imageEl,traitColors,baseCoordinates,allColors);

    } catch (e) {
        console.error(e);
    }
};
