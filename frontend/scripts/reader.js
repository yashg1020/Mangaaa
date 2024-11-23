// Example Google Drive link: https://drive.google.com/file/d/FILE_ID/preview
const pdfUrl = "https://drive.google.com/drive/folders/1nD4juuX6dcXB4DzwP"
;

const pdfContainer = document.getElementById('pdf-container');

// Initialize PDF.js
const loadPdf = async (url) => {
    const loadingTask = pdfjsLib.getDocument(url);
    const pdf = await loadingTask.promise;
    
    // Loop through all pages
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        renderPage(page);
    }
};

// Render a single page
const renderPage = async (page) => {
    const scale = 1.5;
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // Render the page onto the canvas
    await page.render({ canvasContext: context, viewport }).promise;
    pdfContainer.appendChild(canvas);
};

// Load the PDF when the page loads
window.onload = () => {
    loadPdf(pdfUrl);
};
