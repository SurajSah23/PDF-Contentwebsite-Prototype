pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

let pdfDoc = null;
let pageNum = 1;
const scale = 1.5;
const scrollContainer = document.getElementById('scroll-container');

const pdfUrl = 'News.pdf';


function renderAllPages() {
    for (let i = 1; i <= pdfDoc.numPages; i++) {
        const pageCanvas = document.createElement('canvas');
        pageCanvas.className = 'pdf-page';
        pageCanvas.setAttribute('data-page-number', i); 
        scrollContainer.appendChild(pageCanvas);

        renderSinglePage(i, pageCanvas);
    }
}


function renderSinglePage(pageNumber, canvasElement) {
    pdfDoc.getPage(pageNumber).then(function(page) {
        const viewport = page.getViewport({ scale: scale });
        canvasElement.height = viewport.height;
        canvasElement.width = viewport.width;

        const renderContext = {
            canvasContext: canvasElement.getContext('2d'),
            viewport: viewport
        };

        page.render(renderContext);
    });
}


function scrollToPage(num) {
    const targetCanvas = document.querySelector(`canvas[data-page-number="${num}"]`);
    if (targetCanvas) {
        targetCanvas.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}


function updateButtonStates() {
    document.getElementById('prev').disabled = pageNum <= 1;
    document.getElementById('next').disabled = pageNum >= pdfDoc.numPages;
}


function onPrevPage() {
    if (pageNum > 1) {
        pageNum--;
        scrollToPage(pageNum);
        updatePageInfo();
    }
}


function onNextPage() {
    if (pageNum < pdfDoc.numPages) {
        pageNum++;
        scrollToPage(pageNum);
        updatePageInfo();
    }
}


function updatePageInfo() {
    document.getElementById('current-page').textContent = pageNum;
    updateButtonStates();
}


pdfjsLib.getDocument(pdfUrl).promise.then(function(pdfDoc_) {
    pdfDoc = pdfDoc_;
    document.getElementById('total-pages').textContent = pdfDoc.numPages;

    renderAllPages();

    scrollToPage(pageNum);
    updatePageInfo();
}).catch(function(error) {
    console.error('Error loading PDF:', error);
    scrollContainer.innerHTML = '<p class="error">Error loading PDF. Please try again later.</p>';
});

document.getElementById('prev').addEventListener('click', onPrevPage);
document.getElementById('next').addEventListener('click', onNextPage);
