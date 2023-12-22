# BRC333

We propose a new standard for dynamic and interactive art collections that utilize recursive inscriptions to lower the cost of inscribing imagery on Bitcoin using the Ordinals protocol. Like its inspiration--BRC69, this standard supports on-chain features, such as pre-mint and on-chain reveals. This is accomplished by drawing the image on the Ordinals explorer, without the need for inscribing trait images or additional action. 

Currently the standard supports pixel-based collections. We anticipate supporting vector-based collections in the future. 

---

## Context

As the Ordinals protocol gains traction, fungible token inscriptions (most notably BRC-20) have greatly increased the demand for blockspace on the Bitcoin network. This has led to abnormally high fees, which disproportionally affect ordinals art creators and collectors, because image inscriptions are larger than text inscriptions such as those used to buy and sell fungible tokens. This has forcing ordinal collection creators to delay or cancel plans for ordinals collections, and discourages creators from entering the Bitcoin space. In order to continue encouraging creators to launch innovative collection on the Bitcoin blockchain, we propose a new approach for launching pixel art ordinal collections.

---

## Idea

We propose a new standard for launching non-fungible ordinals collections. This standard leverages recursion to separate the logic from the mint script, providing a 50% to 90%+ reduction of block space, depending on the size of the collection and network fees. The process involves three steps:

1. Inscribe the BRC333 collection deployment JSON
2. Inscribe the BRC333 collection compiler JavaScript
3. Inscribe the BRC333 asset with the mint operation

All these processes can be conducted without an external indexer, as long as the collection creators release the official list of color palelletes and trait coordinates for their collections, as currently required. Moreover, the images will be automatically rendered on all front-end interfaces that implement [Recursive Inscriptions](https://github.com/ordinals/ord/pull/2167), eliminating the need for additional steps.

---

## Operations

### Deploy BRC333

The Deploy operation is a JSON/Text inscription that contains general information about the collection and an array of color palettes for each trait. The deploy inscription serves as the reference and the definitive source for the color palette of traits. 

The deploy inscription can optionally include the coordinates of the traits, which describe the shapes inthe design and are used by the compiler to automatically render the traits on the front-end. If the creator wants to make it easy for others to use the coordinates in other contexts, they can inscribe the coordinates in a separate JSON or javascript inscription.

*Example of a collection deploy json:*

```javascript
{
    "p": "brc333",
    "op": "deploy",
    "collection": {
        "slug": "owlinals-test",
        "name": "Owlinals",
        "description": "Owlinals Testing Collection",
        "creator": "@shiftshapr",
        "supply": 333
    },
    "colors": {
        "0": ["#1E3E5F", "#5D374B", "#442746", "#0B5876"],
        "1": ["#8084CE", "#9A8DFA", "#9C66F1"],
        "2": ["#695025", "#6C4B09"],
        // more trait colors - each trait can have up to 10 colors 
        "13": ["#000000", "#FFFFFF", "#FF4040"]
    },
    "coordinates": [
        {
            "name": "beak",
            "coordinates": [
                {"x": 19, "y": 15}, {"x": 19, "y": 16}, {"x": 18, "y": 17}, {"x": 19, "y": 17}, {"x": 20, "y": 17}, {"x": 19, "y": 18}, {"x": 19, "y": 19}
            ]
        },
        {
            "name": "pupil right",
            "coordinates": [
                {"x": 15, "y": 15}
            ]
        },
        // and more trait coordinates to match the number of trait colors - each trait can have as many coordinates as necessary... 
        {
            "name": "pupil left",
            "coordinates": [
                {"x": 23, "y": 15}
            ]
        }
    ]
}
```

| Key        | Required | Description                                                  |
| ---------- | -------- | ------------------------------------------------------------ |
| p          | YES      | Protocol: Helps other systems identify and process brc69 events |
| op         | YES      | Operation: Type of event (Deploy, Compile, Mint)             |
| slug       | YES      | Slug: Identifier of the collection. Not enforced if no indexer implemented |
| name       | NO       | Name: Human readable name of the collection                  |
| supply     | NO       | Supply: Supply of the collection. Not enforced if no indexer implemented |
| colors | YES      | Array of the color palettes of the traits that will generate the final assets. Not this implementation supports 10 or less colors per trait |
| coordinates | NO      | Array of the coordinates of the traits that will generate the final assets. These can also be in a separate JSON file or the compile script. |


### Compile BRC69

The Compile operation stores the logic to render the final assets in a JavaScript inscription. The Compile inscription is a recursive inscription that points back to the Deploy inscription to receive the traits' color palettes and ultimately render the asset. The logic of the Compile inscription can be customized for collections that require more specific rendering features.

Again building on BRC69, we propose a versatile compile logic. 

``````javascript
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
``````

### Mint BRC69

The Mint operation uses an HTML inscription that stores the index of the traits used to generate the final asset and points back to the Compile inscription, in a single line. This approach allows any front-end that supports recursive inscriptions to automatically render the image using on-chain color palette data. These mint scripts can be created by a generator script, enabling users to choose their own traits and customize the image rendering.

``````html
<script t="9123312324423" src="/content/<compile inscription id>" m='{"p":"brc333" "op":"mint" "s":"owlinals" "id":"0"}' ></script>
``````

| Key  | Required | Description                                                  |
| ---- | -------- | ------------------------------------------------------------ |
| t    | YES      | Traits: string describing the traits used to generate the asset using trait colors and trait coordinates |
| src  | YES      | Source: Recursive inscription pointer to the Compile inscription |
| m    | NO       | Metadata: metadata used to track BRC333 operations. Optional if you want your mints operation to be stealth. |

---

## Impact

Implementing the BRC333 standard will enhance the efficiency of Bitcoin block space utilization and reduce the cost of minting art collections. As the unique trait coordinates and color palettes are inscribed only once in the Deploy inscription, the ordinals are composed by an HTML file referencing these traits in just a single line of about 200-250 bytes. Any front-end that implements recursive inscriptions can render the images without any additional steps, using the on-chain deploy and compile inscriptions. As mentioned above, we intend to extend the BRC333 standard to support vector-based art. 

---




