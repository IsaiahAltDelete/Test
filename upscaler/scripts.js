// scripts.js

// Initialize Web Worker
const worker = new Worker('worker.js');

// Get DOM elements
const imageUpload = document.getElementById('imageUpload');
const dragDrop = document.getElementById('dragDrop');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const controls = document.getElementById('controls');
const preview = document.getElementById('preview');
const downloadSection = document.getElementById('downloadSection');
const downloadBtn = document.getElementById('downloadBtn');
const resizeSlider = document.getElementById('resizeSlider');
const grainSlider = document.getElementById('grainSlider');
const paintingSlider = document.getElementById('paintingSlider');
const blurSlider = document.getElementById('blurSlider');
const sharpnessSlider = document.getElementById('sharpnessSlider');
const smoothingSlider = document.getElementById('smoothingSlider');
const resetEffectsBtn = document.getElementById('resetEffects');
const standardButtons = document.querySelectorAll('.standard-resize button');
const toast = document.getElementById('toast');
const loading = document.getElementById('loading');
const formatSelect = document.getElementById('formatSelect');
const compressionSlider = document.getElementById('compressionSlider');
const presetButtons = document.querySelectorAll('.preset-buttons button');
const beforeAfterToggle = document.getElementById('beforeAfterToggle');
const beforeAfterContainer = document.getElementById('beforeAfterContainer');
const beforeCanvas = document.getElementById('canvasBefore');
const afterCanvas = document.getElementById('canvasAfter');
const beforeAfterSlider = document.getElementById('beforeAfterSlider');
const singlePreview = document.getElementById('singlePreview');
const brightnessSlider = document.getElementById('brightnessSlider');
const contrastSlider = document.getElementById('contrastSlider');
const saturationSlider = document.getElementById('saturationSlider');
const hueSlider = document.getElementById('hueSlider');
const vibrancySlider = document.getElementById('vibrancySlider');
const cropBtn = document.getElementById('cropBtn');
const rotateBtn = document.getElementById('rotateBtn');
const cropModal = document.getElementById('cropModal');
const closeCropModal = document.getElementById('closeCropModal');
const cropCanvas = document.getElementById('cropCanvas');
const applyCropBtn = document.getElementById('applyCropBtn');
const textInput = document.getElementById('textInput');
const addTextBtn = document.getElementById('addTextBtn');
const watermarkUpload = document.getElementById('watermarkUpload');
const addWatermarkBtn = document.getElementById('addWatermarkBtn');
const undoBtn = document.getElementById('undoBtn');
const redoBtn = document.getElementById('redoBtn');
const zoomInBtn = document.getElementById('zoomInBtn');
const zoomOutBtn = document.getElementById('zoomOutBtn');
const resetZoomBtn = document.getElementById('resetZoomBtn');

// History Stack for Undo/Redo
let historyStack = [];
let redoStack = [];

// Current Image State
let currentImage = null;

// Crop Variables
let isCropping = false;
let cropStartX, cropStartY, cropEndX, cropEndY;

// Zoom Variables
let scaleFactor = 1;
const scaleStep = 0.1;

// Debounce Function
function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

// Throttle Function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Handle Image Upload (Single and Batch)
imageUpload.addEventListener('change', (e) => {
    const files = e.target.files;
    if (files.length === 0) return;

    Array.from(files).forEach(file => {
        processImage(file);
    });
});

// Handle Drag and Drop
dragDrop.addEventListener('dragover', (e) => {
    e.preventDefault();
    dragDrop.classList.add('dragover');
});

dragDrop.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dragDrop.classList.remove('dragover');
});

dragDrop.addEventListener('drop', (e) => {
    e.preventDefault();
    dragDrop.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length === 0) return;

    Array.from(files).forEach(file => {
        processImage(file);
    });
});

// Process Each Image
function processImage(file) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            // Limit maximum dimensions
            const maxDimension = 1000;
            let originalWidth = img.width;
            let originalHeight = img.height;
            if (img.width > maxDimension || img.height > maxDimension) {
                const ratio = Math.min(maxDimension / img.width, maxDimension / img.height);
                originalWidth = img.width * ratio;
                originalHeight = img.height * ratio;
            }

            // Draw image on canvas
            canvas.width = originalWidth;
            canvas.height = originalHeight;
            ctx.drawImage(img, 0, 0, originalWidth, originalHeight);

            // Save to history
            saveHistory();

            // Show controls and preview
            controls.style.display = 'flex';
            preview.style.display = 'block';
            downloadSection.style.display = 'flex';

            // Setup before canvas
            setupBeforeAfter();

            // Send to worker for initial processing
            sendToWorker();
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(file);
}

// Save Current Canvas to History
function saveHistory() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    historyStack.push(imageData);
    // Clear redo stack
    redoStack = [];
}

// Undo Function
undoBtn.addEventListener('click', () => {
    if (historyStack.length > 1) {
        redoStack.push(historyStack.pop());
        const previousImage = historyStack[historyStack.length - 1];
        ctx.putImageData(previousImage, 0, 0);
        sendToWorker();
    }
});

// Redo Function
redoBtn.addEventListener('click', () => {
    if (redoStack.length > 0) {
        const image = redoStack.pop();
        ctx.putImageData(image, 0, 0);
        historyStack.push(image);
        sendToWorker();
    }
});

// Preset Effects
presetButtons.forEach(button => {
    button.addEventListener('click', () => {
        const preset = button.getAttribute('data-preset');
        applyPreset(preset);
    });
});

// Apply Preset Effects
function applyPreset(preset) {
    switch(preset) {
        case 'none':
            brightnessSlider.value = 100;
            contrastSlider.value = 100;
            saturationSlider.value = 100;
            hueSlider.value = 0;
            vibrancySlider.value = 100;
            grainSlider.value = 0;
            paintingSlider.value = 0;
            blurSlider.value = 0;
            sharpnessSlider.value = 0;
            smoothingSlider.value = 0;
            break;
        case 'grayscale':
            brightnessSlider.value = 100;
            contrastSlider.value = 100;
            saturationSlider.value = 0;
            hueSlider.value = 0;
            vibrancySlider.value = 100;
            grainSlider.value = 25;
            paintingSlider.value = 0;
            blurSlider.value = 0;
            sharpnessSlider.value = 0;
            smoothingSlider.value = 0;
            break;
        case 'sepia':
            brightnessSlider.value = 100;
            contrastSlider.value = 100;
            saturationSlider.value = 150;
            hueSlider.value = 30;
            vibrancySlider.value = 120;
            grainSlider.value = 25;
            paintingSlider.value = 0;
            blurSlider.value = 0;
            sharpnessSlider.value = 0;
            smoothingSlider.value = 0;
            break;
        case 'invert':
            // Inversion requires a separate processing step
            invertImage();
            return;
        case 'blur':
            brightnessSlider.value = 100;
            contrastSlider.value = 100;
            saturationSlider.value = 100;
            hueSlider.value = 0;
            vibrancySlider.value = 100;
            grainSlider.value = 0;
            paintingSlider.value = 0;
            blurSlider.value = 10;
            sharpnessSlider.value = 0;
            smoothingSlider.value = 0;
            break;
        case 'brightness':
            brightnessSlider.value = 150;
            contrastSlider.value = 100;
            saturationSlider.value = 100;
            hue_slider.value = 0;
            vibrancySlider.value = 100;
            grain_slider.value = 0;
            painting_slider.value = 0;
            blur_slider.value = 0;
            sharpness_slider.value = 0;
            smoothing_slider.value = 0;
            break;
        default:
            break;
    }
    sendToWorker();
}

// Invert Image
function invertImage() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for(let i = 0; i < data.length; i +=4){
        data[i] = 255 - data[i];       // Red
        data[i+1] = 255 - data[i+1];   // Green
        data[i+2] = 255 - data[i+2];   // Blue
    }
    ctx.putImageData(imageData, 0, 0);
    saveHistory();
    sendToWorker();
}

// Aspect Ratio Lock
const aspectRatioLock = document.getElementById('aspectRatioLock');

// Resize Slider and Buttons
resizeSlider.addEventListener('input', throttle(updateImage, 100));
standardButtons.forEach(button => {
    button.addEventListener('click', () => {
        const selectedScale = button.getAttribute('data-scale');
        resizeSlider.value = selectedScale;
        updateImage();
    });
});

// Color Adjustment Sliders
brightnessSlider.addEventListener('input', throttle(updateImage, 100));
contrastSlider.addEventListener('input', throttle(updateImage, 100));
saturationSlider.addEventListener('input', throttle(updateImage, 100));
hueSlider.addEventListener('input', throttle(updateImage, 100));
vibrancySlider.addEventListener('input', throttle(updateImage, 100));

// Other Adjustment Sliders
grainSlider.addEventListener('input', throttle(updateImage, 100));
paintingSlider.addEventListener('input', throttle(updateImage, 100));
blurSlider.addEventListener('input', throttle(updateImage, 100));
sharpnessSlider.addEventListener('input', throttle(updateImage, 100));
smoothingSlider.addEventListener('input', throttle(updateImage, 100));

// Debounced Draw Image
const debouncedDrawImage = debounce(sendToWorker, 100);

// Update Image based on Sliders
function updateImage() {
    sendToWorker();
}

// Send Image and Parameters to Worker
function sendToWorker() {
    loading.style.display = 'block';
    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.getImageData(0, 0, width, height);

    // Collect effect parameters
    const effects = {
        brightness: parseInt(brightnessSlider.value, 10),
        contrast: parseInt(contrastSlider.value, 10),
        saturation: parseInt(saturationSlider.value, 10),
        hue: parseInt(hueSlider.value, 10),
        vibrancy: parseInt(vibrancySlider.value, 10),
        grainIntensity: parseInt(grainSlider.value, 10),
        paintingIntensity: parseInt(paintingSlider.value, 10),
        blurIntensity: parseInt(blurSlider.value, 10),
        sharpnessIntensity: parseInt(sharpnessSlider.value, 10),
        smoothingIntensity: parseInt(smoothingSlider.value, 10)
    };

    worker.postMessage({ imageData, effects });
}

// Listen for messages from the worker
worker.onmessage = function(e) {
    const { imageData } = e.data;
    ctx.putImageData(imageData, 0, 0);
    loading.style.display = 'none';
    saveHistory();
};

// Reset All Effects
resetEffectsBtn.addEventListener('click', () => {
    brightnessSlider.value = 100;
    contrastSlider.value = 100;
    saturationSlider.value = 100;
    hueSlider.value = 0;
    vibrancySlider.value = 100;
    grainSlider.value = 0;
    paintingSlider.value = 0;
    blurSlider.value = 0;
    sharpnessSlider.value = 0;
    smoothingSlider.value = 0;
    resizeSlider.value = 100;
    aspectRatioLock.checked = true;
    sendToWorker();
});

// Download Image with Selected Format and Compression
downloadBtn.addEventListener('click', () => {
    const format = formatSelect.value;
    let quality = 0.8; // Default quality

    if(format === 'jpeg' || format === 'webp') {
        quality = compressionSlider.value / 100;
    }

    canvas.toBlob(function(blob) {
        const link = document.createElement('a');
        link.download = `enhanced-image.${format}`;
        link.href = URL.createObjectURL(blob);
        link.click();
        showToast('Image Downloaded Successfully!');
    }, `image/${format}`, quality);
});

// Show Toast Notification
function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Setup Before/After Comparison
function setupBeforeAfter() {
    const beforeCtx = beforeCanvas.getContext('2d');
    beforeCanvas.width = canvas.width;
    beforeCanvas.height = canvas.height;
    beforeCtx.drawImage(canvas, 0, 0, beforeCanvas.width, beforeCanvas.height);

    const afterCtx = afterCanvas.getContext('2d');
    afterCanvas.width = canvas.width;
    afterCanvas.height = canvas.height;
    afterCtx.drawImage(canvas, 0, 0, afterCanvas.width, afterCanvas.height);
}

// Before/After Slider
beforeAfterSlider.addEventListener('input', () => {
    const sliderValue = beforeAfterSlider.value;
    afterCanvas.style.clip = `rect(0, ${sliderValue}%, ${canvas.height}px, 0)`;
});

// Toggle Before/After Comparison
beforeAfterToggle.addEventListener('change', () => {
    if(beforeAfterToggle.checked) {
        beforeAfterContainer.style.display = 'block';
        singlePreview.style.display = 'none';
    } else {
        beforeAfterContainer.style.display = 'none';
        singlePreview.style.display = 'block';
    }
});

// Crop Functionality
cropBtn.addEventListener('click', () => {
    isCropping = true;
    cropModal.style.display = 'block';
    cropCanvas.width = canvas.width;
    cropCanvas.height = canvas.height;
    const cropCtx = cropCanvas.getContext('2d');
    cropCtx.drawImage(canvas, 0, 0, cropCanvas.width, cropCanvas.height);
});

// Close Crop Modal
closeCropModal.addEventListener('click', () => {
    cropModal.style.display = 'none';
    isCropping = false;
});

// Apply Crop
applyCropBtn.addEventListener('click', () => {
    const cropCtx = cropCanvas.getContext('2d');
    const imageData = cropCtx.getImageData(0, 0, cropCanvas.width, cropCanvas.height);
    ctx.putImageData(imageData, 0, 0);
    cropModal.style.display = 'none';
    isCropping = false;
    saveHistory();
    sendToWorker();
});

// Rotate Functionality
rotateBtn.addEventListener('click', () => {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = canvas.height;
    tempCanvas.height = canvas.width;
    tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
    tempCtx.rotate(90 * Math.PI / 180);
    tempCtx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);
    canvas.width = tempCanvas.width;
    canvas.height = tempCanvas.height;
    ctx.drawImage(tempCanvas, 0, 0);
    saveHistory();
    sendToWorker();
});

// Add Text Annotations
addTextBtn.addEventListener('click', () => {
    const text = textInput.value;
    if(text === '') return;
    ctx.font = '30px Arial';
    ctx.fillStyle = 'red';
    ctx.fillText(text, 50, 50);
    textInput.value = '';
    saveHistory();
    sendToWorker();
});

// Add Watermark
let watermarkImage = null;

watermarkUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = function(event) {
        watermarkImage = new Image();
        watermarkImage.onload = function() {
            showToast('Watermark Loaded. Click "Add Watermark" to apply.');
        }
        watermarkImage.src = event.target.result;
    }
    reader.readAsDataURL(file);
});

addWatermarkBtn.addEventListener('click', () => {
    if(!watermarkImage) {
        showToast('Please upload a watermark image first.');
        return;
    }
    const scale = 0.2; // Adjust watermark size
    const wmWidth = watermarkImage.width * scale;
    const wmHeight = watermarkImage.height * scale;
    ctx.drawImage(watermarkImage, canvas.width - wmWidth - 10, canvas.height - wmHeight - 10, wmWidth, wmHeight);
    saveHistory();
    sendToWorker();
});

// Zoom and Pan Functionality
zoomInBtn.addEventListener('click', () => {
    scaleFactor += scaleStep;
    applyZoom();
});

zoomOutBtn.addEventListener('click', () => {
    if(scaleFactor > scaleStep) {
        scaleFactor -= scaleStep;
        applyZoom();
    }
});

resetZoomBtn.addEventListener('click', () => {
    scaleFactor = 1;
    applyZoom();
});

function applyZoom() {
    canvas.style.transform = `scale(${scaleFactor})`;
}

// Image Format Selection & Compression
formatSelect.addEventListener('change', () => {
    if(formatSelect.value === 'jpeg' || formatSelect.value === 'webp') {
        compressionSlider.parentElement.style.display = 'block';
    } else {
        compressionSlider.parentElement.style.display = 'none';
    }
});

// Drag and Drop Upload Enhancement (Drag Over Effect)
document.addEventListener('dragover', (e) => {
    e.preventDefault();
});
document.addEventListener('drop', (e) => {
    e.preventDefault();
});

// Initialize Format Selection Display
if(formatSelect.value === 'jpeg' || formatSelect.value === 'webp') {
    compressionSlider.parentElement.style.display = 'block';
} else {
    compressionSlider.parentElement.style.display = 'none';
}

// Worker Error Handling
worker.onerror = function(e) {
    console.error('Worker error:', e);
    showToast('An error occurred during processing.');
};

// Click outside modal to close
window.onclick = function(event) {
    if (event.target == cropModal) {
        cropModal.style.display = "none";
        isCropping = false;
    }
};
