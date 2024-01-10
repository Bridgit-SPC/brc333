async function decompressAndExecute() {
    console.log('decompressAndExecute');
    const compressedBase64Js = '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';

    const binaryStringJs = atob(compressedBase64Js);

    // Convert the binary string to a Uint8Array
    const bytesJs = new Uint8Array(binaryStringJs.length);
    for (let i = 0; i < binaryStringJs.length; i++) {
        bytesJs[i] = binaryStringJs.charCodeAt(i);
    }
    console.log(`bytesJs = ${bytesJs}`);

    try {
        const pako = await import('/content/93c0f3d76d98eb43e70c5595eefafd90732d7b712113dc8cb10ad940430cff40i0');

        // Decompress using pako
        const decompressedJs = pako.inflate(bytesJs, { to: 'string' });
        console.log(`decompressedJs = ${decompressedJs}`);

        const blob = new Blob([decompressedJs], { type: 'text/javascript' });

        // Create a URL for the Blob
        const scriptURL = URL.createObjectURL(blob);

        // Create a new script element and set its type to module
        const script = document.createElement('script');
        script.type = 'module';
        script.src = scriptURL;

        // Append the script to the document
        console.log(`script.src = ${script.src}`);
        document.body.appendChild(script);
        console.log('script appended');
    } catch (error) {
        console.error('Error during script execution:', error);
    }
}

decompressAndExecute();