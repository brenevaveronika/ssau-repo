let originalImageData = null;
let grayscaleImageData = null;

document.getElementById('imageInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const originalCanvas = document.getElementById('originalCanvas');
                const grayscaleCanvas = document.getElementById('grayscaleCanvas');
                const contrastCanvas = document.getElementById('contrastCanvas');
                const maskCanvas = document.getElementById('maskCanvas');
                
                originalCanvas.width = grayscaleCanvas.width = contrastCanvas.width = maskCanvas.width = img.width;
                originalCanvas.height = grayscaleCanvas.height = contrastCanvas.height = maskCanvas.height = img.height;
                
                const originalCtx = originalCanvas.getContext('2d');
                originalCtx.drawImage(img, 0, 0);
                originalImageData = originalCtx.getImageData(0, 0, originalCanvas.width, originalCanvas.height);
                grayscaleImageData = convertToGrayscale(originalImageData);
                const grayscaleCtx = grayscaleCanvas.getContext('2d');
                grayscaleCtx.putImageData(grayscaleImageData, 0, 0);
                
                applyContrast();
                applyMaskFilter();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});


function convertToGrayscale(imageData) {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const avg = 0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2];
        data[i] = data[i + 1] = data[i + 2] = avg;
    }
    return imageData;
}


function applyContrast() {
    if (!grayscaleImageData) return;

    const minBrightness = parseInt(document.getElementById('minBrightness').value);
    const maxBrightness = parseInt(document.getElementById('maxBrightness').value);

    const contrastCanvas = document.getElementById('contrastCanvas');
    const contrastCtx = contrastCanvas.getContext('2d');

    const contrastImageData = new ImageData(
        new Uint8ClampedArray(grayscaleImageData.data),
        grayscaleImageData.width,
        grayscaleImageData.height
    );

    const data = contrastImageData.data;

    let minVal = 255;
    let maxVal = 0;
    for (let i = 0; i < data.length; i += 4) {
        const brightness = data[i];
        if (brightness < minVal) minVal = brightness;
        if (brightness > maxVal) maxVal = brightness;
    }

    // главная функция линейного контрастирвоания
    for (let i = 0; i < data.length; i += 4) {
        const brightness = data[i];
        const newBrightness = ((brightness - minVal) / (maxVal - minVal)) * (maxBrightness - minBrightness) + minBrightness;
        data[i] = data[i + 1] = data[i + 2] = newBrightness;
    }

    contrastCtx.putImageData(contrastImageData, 0, 0);
}


function applyMaskFilter() {
    if (!grayscaleImageData) return;

    const maskCanvas = document.getElementById('maskCanvas');
    const maskCtx = maskCanvas.getContext('2d');

    const maskImageData = new ImageData(
        new Uint8ClampedArray(grayscaleImageData.data),
        grayscaleImageData.width,
        grayscaleImageData.height
    );

    const data = maskImageData.data;
    const width = maskImageData.width;
    const height = maskImageData.height;

    const tempData = new Uint8ClampedArray(data.length);

    const mask = [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1]
    ];
    const maskSum = 9;


    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let sum = 0;

            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    const nx = x + dx;
                    const ny = y + dy;

                    // клонирование пикселей выходящих за границу
                    const clampedX = Math.max(0, Math.min(width - 1, nx));
                    const clampedY = Math.max(0, Math.min(height - 1, ny));

                    const index = (clampedY * width + clampedX) * 4;
                    const brightness = data[index];

                    sum += brightness * mask[dy + 1][dx + 1];
                }
            }

            const newBrightness = sum / maskSum;

            const index = (y * width + x) * 4;
            tempData[index] = tempData[index + 1] = tempData[index + 2] = newBrightness;
            tempData[index + 3] = data[index + 3];
        }
    }

    const resultImageData = new ImageData(tempData, width, height);
    
    maskCtx.putImageData(resultImageData, 0, 0);
}