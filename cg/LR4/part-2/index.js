let originalImageData = null;
let grayscaleImageData = null;

// Загрузка изображения
document.getElementById('imageInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const originalCanvas = document.getElementById('originalCanvas');
                const skeletonCanvas = document.getElementById('skeletonCanvas');
                
                // Устанавливаем размеры canvas
                originalCanvas.width = skeletonCanvas.width = img.width;
                originalCanvas.height = skeletonCanvas.height = img.height;
                
                // Рисуем исходное изображение
                const originalCtx = originalCanvas.getContext('2d');
                originalCtx.drawImage(img, 0, 0);
                
                // Получаем данные изображения
                originalImageData = originalCtx.getImageData(0, 0, originalCanvas.width, originalCanvas.height);
                
                // Переводим изображение в оттенки серого
                grayscaleImageData = convertToGrayscale(originalImageData);
                
                // Бинаризация изображения
                const binaryImageData = binarizeImage(grayscaleImageData);
                
                // Применяем скелетизацию
                const skeletonImageData = skeletonize(binaryImageData);
                
                // Отображаем результат скелетизации
                const skeletonCtx = skeletonCanvas.getContext('2d');
                skeletonCtx.putImageData(skeletonImageData, 0, 0);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Функция для перевода изображения в оттенки серого
function convertToGrayscale(imageData) {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = data[i + 1] = data[i + 2] = avg;
    }
    return imageData;
}

// Функция для бинаризации изображения
function binarizeImage(imageData, threshold = 128) {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const brightness = data[i];
        data[i] = data[i + 1] = data[i + 2] = brightness > threshold ? 255 : 0;
    }
    return imageData;
}

// Функция для скелетизации
function skeletonize(imageData) {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;

    // Создаем копию данных для работы
    const skeletonData = new Uint8ClampedArray(data.length);
    skeletonData.set(data);

    // Функция для проверки, является ли пиксель граничным
    function isBoundary(x, y) {
        const index = (y * width + x) * 4;
        if (skeletonData[index] === 255) return false; // Белый пиксель

        // Проверяем соседей (8-связность)
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dx === 0 && dy === 0) continue; // Пропускаем текущий пиксель
                const nx = x + dx;
                const ny = y + dy;
                if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                    const neighborIndex = (ny * width + nx) * 4;
                    if (skeletonData[neighborIndex] === 255) {
                        return true; // Есть белый сосед
                    }
                }
            }
        }
        return false;
    }

    // Функция для проверки, можно ли удалить пиксель
    function canRemove(x, y) {
        const index = (y * width + x) * 4;
        if (skeletonData[index] === 255) return false; // Белый пиксель

        // Подсчитываем количество черных соседей (8-связность)
        let blackNeighbors = 0;
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dx === 0 && dy === 0) continue; // Пропускаем текущий пиксель
                const nx = x + dx;
                const ny = y + dy;
                if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                    const neighborIndex = (ny * width + nx) * 4;
                    if (skeletonData[neighborIndex] === 0) {
                        blackNeighbors++;
                    }
                }
            }
        }

        // Условие удаления: пиксель должен иметь от 2 до 6 черных соседей
        return blackNeighbors >= 2 && blackNeighbors <= 6;
    }

    // Итеративное удаление граничных пикселей
    let changed = true;
    while (changed) {
        changed = false;
        const pixelsToRemove = [];

        // Первый проход: отмечаем пиксели для удаления
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                if (isBoundary(x, y) && canRemove(x, y)) {
                    pixelsToRemove.push({ x, y });
                }
            }
        }

        // Второй проход: удаляем отмеченные пиксели
        for (const { x, y } of pixelsToRemove) {
            const index = (y * width + x) * 4;
            skeletonData[index] = 255; // Удаляем пиксель (делаем белым)
            changed = true;
        }
    }

    // Создаем изображение скелета
    const skeletonImageData = new ImageData(width, height);
    for (let i = 0; i < skeletonData.length; i += 4) {
        if (skeletonData[i] === 0) {
            skeletonImageData.data[i] = 0; // Черный цвет для скелета
            skeletonImageData.data[i + 1] = 0;
            skeletonImageData.data[i + 2] = 0;
            skeletonImageData.data[i + 3] = 255; // Непрозрачный
        } else {
            skeletonImageData.data[i] = 255; // Белый цвет для фона
            skeletonImageData.data[i + 1] = 255;
            skeletonImageData.data[i + 2] = 255;
            skeletonImageData.data[i + 3] = 255;
        }
    }

    return skeletonImageData;
}