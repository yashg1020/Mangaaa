const folderId = "1nD4juuX6dcXB4DzwPmwkFnXEWhZ4zVG4"; // Your Google Drive folder ID
const apiKey = "AIzaSyBpVf1EMXLU4x5lbSSb5EG5n5RljcQa8Ww"; // Your provided API key

// Function to fetch PDF files from the Google Drive folder
async function fetchPdfs() {
    const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${apiKey}&fields=files(id,name,mimeType)`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const pdfs = data.files.filter(file => file.mimeType === 'application/pdf');
        displayPdfs(pdfs);
    } catch (error) {
        console.error("Error fetching PDFs:", error);
    }
}

// Render the PDFs using PDF.js
async function displayPdfs(pdfs) {
    const pdfContainer = document.getElementById('pdf-container');

    pdfs.forEach(async (pdf) => {
        const pdfDiv = document.createElement('div');
        pdfDiv.className = "pdf-wrapper mb-8";

        const canvas = document.createElement('canvas');
        canvas.className = "pdf-page";
        pdfDiv.appendChild(canvas);

        const pdfUrl = `https://drive.google.com/uc?export=download&id=${pdf.id}`;
        await renderPdf(pdfUrl, canvas);

        pdfContainer.appendChild(pdfDiv);
    });
}

// Function to render a single PDF page using PDF.js
async function renderPdf(pdfUrl, canvas) {
    const loadingTask = pdfjsLib.getDocument(pdfUrl);
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);
    
    const context = canvas.getContext('2d');
    const viewport = page.getViewport({ scale: 1.5 });
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: context, viewport }).promise;
}

window.onload = fetchPdfs;
