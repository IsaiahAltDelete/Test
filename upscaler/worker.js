// worker.js

self.onmessage = function(e) {
    let { imageData, effects } = e.data;
    let data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;

    // Apply effects sequentially
    imageData = applyBrightness(imageData, effects.brightness);
    imageData = applyContrast(imageData, effects.contrast);
    imageData = applySaturation(imageData, effects.saturation);
    imageData = applyHue(imageData, effects.hue);
    imageData = applyVibrancy(imageData, effects.vibrancy);
    imageData = addGrain(imageData, effects.grainIntensity);
    imageData = applyPaintingEffect(imageData, effects.paintingIntensity);
    imageData = applyBlur(imageData, effects.blurIntensity);
    imageData = applySharpness(imageData, effects.sharpnessIntensity);
    imageData = applySmoothing(imageData, effects.smoothingIntensity);

    // Return processed image data
    self.postMessage({ imageData });
};

// Clamp function to restrict values between 0 and 255
function clamp(value) {
    return Math.max(0, Math.min(255, value));
}

// Brightness Adjustment
function applyBrightness(imageData, brightness) {
    const data = imageData.data;
    const factor = brightness / 100;

    for(let i = 0; i < data.length; i +=4){
        data[i] = clamp(data[i] * factor);     // Red
        data[i+1] = clamp(data[i+1] * factor); // Green
        data[i+2] = clamp(data[i+2] * factor); // Blue
    }
    return imageData;
}

// Contrast Adjustment
function applyContrast(imageData, contrast) {
    const data = imageData.data;
    const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

    for(let i = 0; i < data.length; i +=4){
        data[i] = clamp(factor * (data[i] - 128) + 128);     // Red
        data[i+1] = clamp(factor * (data[i+1] - 128) + 128); // Green
        data[i+2] = clamp(factor * (data[i+2] - 128) + 128); // Blue
    }
    return imageData;
}

// Saturation Adjustment
function applySaturation(imageData, saturation) {
    const data = imageData.data;
    const sat = saturation / 100;

    for(let i = 0; i < data.length; i +=4){
        const r = data[i] / 255;
        const g = data[i+1] / 255;
        const b = data[i+2] / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const l = (max + min) / 2;

        let newR = r, newG = g, newB = b;

        if(max !== min){
            const d = max - min;
            let h = 0;
            if(max === r){
                h = (g - b) / d + (g < b ? 6 : 0);
            } else if(max === g){
                h = (b - r) / d + 2;
            } else{
                h = (r - g) / d + 4;
            }
            h /= 6;

            let s = 0;
            if(l > 0.5){
                s = d / (2 - max - min);
            } else{
                s = d / (max + min);
            }

            s *= sat;

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;

            newR = hueToRgb(p, q, h + 1/3) * 255;
            newG = hueToRgb(p, q, h) * 255;
            newB = hueToRgb(p, q, h - 1/3) * 255;
        }

        data[i] = clamp(newR);
        data[i+1] = clamp(newG);
        data[i+2] = clamp(newB);
    }
    return imageData;
}

function hueToRgb(p, q, t){
    if(t < 0) t += 1;
    if(t > 1) t -= 1;
    if(t < 1/6) return p + (q - p) * 6 * t;
    if(t < 1/2) return q;
    if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
}

// Hue Adjustment
function applyHue(imageData, hue) {
    const data = imageData.data;
    const angle = hue; // degrees
    const rad = angle * Math.PI / 180;
    const cosA = Math.cos(rad);
    const sinA = Math.sin(rad);

    for(let i = 0; i < data.length; i +=4){
        let r = data[i];
        let g = data[i+1];
        let b = data[i+2];

        // Convert to HSL
        let max = Math.max(r, g, b);
        let min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if(max === min){
            h = s = 0; // achromatic
        } else{
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch(max){
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        // Apply hue rotation
        h += hue / 360;
        if(h < 0) h += 1;
        if(h > 1) h -= 1;

        // Convert back to RGB
        let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        let p = 2 * l - q;

        let rgb = [hueToRgb(p, q, h + 1/3), hueToRgb(p, q, h), hueToRgb(p, q, h - 1/3)];
        data[i] = clamp(rgb[0] * 255);
        data[i+1] = clamp(rgb[1] * 255);
        data[i+2] = clamp(rgb[2] * 255);
    }
    return imageData;
}

// Vibrancy Adjustment (Simulated)
function applyVibrancy(imageData, vibrancy) {
    // Simulate vibrancy by increasing saturation
    return applySaturation(imageData, vibrancy);
}

// Add Grain Effect
function addGrain(imageData, intensity) {
    const data = imageData.data;
    const grainAmount = intensity;

    for(let i = 0; i < data.length; i +=4){
        const rand = (Math.random() * 2 - 1) * (grainAmount / 2);
        data[i] = clamp(data[i] + rand);       // Red
        data[i+1] = clamp(data[i+1] + rand);   // Green
        data[i+2] = clamp(data[i+2] + rand);   // Blue
    }
    return imageData;
}

// Apply Painting Effect (Simplified)
function applyPaintingEffect(imageData, intensity) {
    const data = imageData.data;
    const radius = Math.ceil(intensity / 10);
    if(radius === 0) return imageData;

    const tempData = new Uint8ClampedArray(data);

    for(let y = radius; y < imageData.height - radius; y++){
        for(let x = radius; x < imageData.width - radius; x++){
            const idx = (y * imageData.width + x) *4;
            let r = 0, g = 0, b = 0, count = 0;

            for(let dy = -radius; dy <= radius; dy++){
                for(let dx = -radius; dx <= radius; dx++){
                    const pixelIdx = ((y + dy) * imageData.width + (x + dx)) *4;
                    r += tempData[pixelIdx];
                    g += tempData[pixelIdx +1];
                    b += tempData[pixelIdx +2];
                    count++;
                }
            }

            data[idx] = clamp(r / count);
            data[idx+1] = clamp(g / count);
            data[idx+2] = clamp(b / count);
        }
    }

    return imageData;
}

// Apply Blur Effect
function applyBlur(imageData, intensity) {
    if(intensity === 0) return imageData;
    const data = imageData.data;
    const radius = Math.ceil(intensity / 5);
    const tempData = new Uint8ClampedArray(data);

    for(let y = radius; y < imageData.height - radius; y++){
        for(let x = radius; x < imageData.width - radius; x++){
            let r = 0, g = 0, b = 0, a = 0, count = 0;
            for(let dy = -radius; dy <= radius; dy++){
                for(let dx = -radius; dx <= radius; dx++){
                    const px = (y + dy) * imageData.width + (x + dx);
                    r += tempData[px *4];
                    g += tempData[px *4 +1];
                    b += tempData[px *4 +2];
                    a += tempData[px *4 +3];
                    count++;
                }
            }
            const idx = (y * imageData.width + x) *4;
            data[idx] = clamp(r / count);
            data[idx+1] = clamp(g / count);
            data[idx+2] = clamp(b / count);
            data[idx+3] = clamp(a / count);
        }
    }

    return imageData;
}

// Apply Sharpness Effect (Unsharp Mask)
function applySharpness(imageData, intensity) {
    if(intensity === 0) return imageData;
    const data = imageData.data;
    const factor = 1 + (intensity / 100);
    const tempData = new Uint8ClampedArray(data);

    for(let y =1; y < imageData.height -1; y++){
        for(let x =1; x < imageData.width -1; x++){
            const idx = (y * imageData.width + x) *4;
            for(let rgb=0; rgb <3; rgb++){
                const current = tempData[idx + rgb];
                const neighbors = [
                    tempData[((y-1) * imageData.width + x) *4 + rgb], // top
                    tempData[((y+1) * imageData.width + x) *4 + rgb], // bottom
                    tempData[(y * imageData.width + (x-1)) *4 + rgb], // left
                    tempData[(y * imageData.width + (x+1)) *4 + rgb]  // right
                ];
                const avg = (neighbors[0] + neighbors[1] + neighbors[2] + neighbors[3]) /4;
                const diff = current - avg;
                data[idx + rgb] = clamp(current + diff * factor);
            }
        }
    }

    return imageData;
}

// Apply Smoothing Effect
function applySmoothing(imageData, intensity) {
    if(intensity === 0) return imageData;
    const data = imageData.data;
    const factor = intensity / 100;
    const tempData = new Uint8ClampedArray(data);

    for(let y =1; y < imageData.height -1; y++){
        for(let x =1; x < imageData.width -1; x++){
            const idx = (y * imageData.width + x) *4;
            for(let rgb=0; rgb <3; rgb++){
                const neighbors = [
                    tempData[((y-1) * imageData.width + x) *4 + rgb], // top
                    tempData[((y+1) * imageData.width + x) *4 + rgb], // bottom
                    tempData[(y * imageData.width + (x-1)) *4 + rgb], // left
                    tempData[(y * imageData.width + (x+1)) *4 + rgb]  // right
                ];
                const avg = (neighbors[0] + neighbors[1] + neighbors[2] + neighbors[3]) /4;
                data[idx + rgb] = clamp(tempData[idx + rgb] * (1 - factor) + avg * factor);
            }
        }
    }

    return imageData;
}

// Apply Zoom
// Note: Zoom is handled on the main thread via CSS transforms

// Text and Annotations
// Note: Handled on the main thread

// Watermarking
// Note: Handled on the main thread

// Before/After Comparison
// Note: Handled on the main thread

// Crop and Rotate Tools
// Note: Handled on the main thread

// Integration with Cloud Storage
// To be implemented using APIs (e.g., Google Drive API, Dropbox API)
// Requires authentication and handling API requests

// Batch Processing
// Already handled by processing multiple files in the upload event

