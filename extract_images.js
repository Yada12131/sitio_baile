const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

const pdfs = [
    'documentos/1b37f7cfd68d4e0e7ece7bcae9e67453.pdf',
    'documentos/550422d082b7427f47bc866b65fe09d2.pdf',
    'documentos/a6482e6edc5f43c965b01c8c14f1dfae.pdf'
];

const outputDir = path.join(__dirname, 'public', 'images', 'extracted');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function extractImages() {
    for (const pdfFile of pdfs) {
        const pdfPath = path.join(__dirname, pdfFile);
        if (!fs.existsSync(pdfPath)) {
            console.log(`Skipping ${pdfFile} (not found)`);
            continue;
        }

        console.log(`Processing ${pdfFile}...`);
        const dataBuffer = fs.readFileSync(pdfPath);

        try {
            const parser = new PDFParse({ data: dataBuffer });
            // Since pdf-parse 'getImage' might not be standard in all versions (v2 specific),
            // and based on the README read earlier:
            // "Extract embedded images : getImage(#getimage--extract-embedded-images)"
            // usage: const result = await parser.getImage();

            // Check if getImage exists
            if (typeof parser.getImage !== 'function') {
                console.log('getImage method not found on parser instance. Checking if standard text extract works...');
                // Fallback or skip if not supported.
                continue;
            }

            const result = await parser.getImage();

            if (result && result.pages) {
                result.pages.forEach((page, pageIndex) => {
                    if (page.images) {
                        page.images.forEach((img, imgIndex) => {
                            const extension = 'png'; // Assumptions based on README example
                            const filename = `${path.basename(pdfFile, '.pdf')}_p${pageIndex}_i${imgIndex}.${extension}`;
                            const filePath = path.join(outputDir, filename);

                            // img.data is likely the buffer
                            fs.writeFileSync(filePath, img.data);
                            console.log(`Saved: ${filename}`);
                        });
                    }
                });
            }
            await parser.destroy();
        } catch (e) {
            console.error(`Error extracting from ${pdfFile}:`, e);
        }
    }
}

extractImages();
