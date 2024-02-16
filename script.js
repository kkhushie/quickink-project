const canvas = document.getElementById('signatureCanvas');
const clearButton = document.getElementById('clearButton');
const copyButton = document.getElementById('copyButton');
const downloadButton = document.getElementById('downloadButton');
const shareButton = document.getElementById('shareButton');
const colorOptions = document.getElementById('colorOptions');
const ctx = canvas.getContext('2d');

let isDrawing = false;
let currentColor = 'black'; // Default color

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', endDrawing);

canvas.addEventListener('touchstart', startDrawingTouch);
canvas.addEventListener('touchmove', drawTouch);
canvas.addEventListener('touchend', endDrawing);

clearButton.addEventListener('click', clearCanvas);
copyButton.addEventListener('click', copySignatureLink);
downloadButton.addEventListener('click', downloadSignature);
shareButton.addEventListener('click', shareSignature);
colorOptions.addEventListener('click', changeColor);

function startDrawing(e) {
    isDrawing = true;
    draw(e);
}

function draw(e) {
    if (!isDrawing) return;

    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = currentColor;

    const { offsetX, offsetY } = e;
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
}

function endDrawing() {
    isDrawing = false;
    ctx.beginPath();
}

function startDrawingTouch(e) {
    e.preventDefault();
    startDrawing(e.touches[0]);
}

function drawTouch(e) {
    e.preventDefault();
    draw(e.touches[0]);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function copySignatureLink() {
    const signatureImage = canvas.toDataURL('image/png');
    const tempInput = document.createElement('input');
    tempInput.value = signatureImage;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    alert('Signature link copied to clipboard!');
}

function downloadSignature() {
    const signatureImage = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.href = signatureImage;
    downloadLink.download = 'signature.png';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

function changeColor(e) {
    if (e.target.classList.contains('colorOption')) {
        currentColor = e.target.dataset.color;
    }
}

function shareSignature() {
    if (navigator.share) {
        canvas.toBlob(blob => {
            const file = new File([blob], 'signature.png', { type: blob.type });
            navigator.share({
                files: [file],
            }).then(() => {
                console.log('Share successful');
            }).catch(error => {
                console.error('Share failed:', error);
            });
        }, 'image/png');
    } else {
        console.log('Web Share API not supported');
    }
}
