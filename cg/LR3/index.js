const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let points = [];
let isDrawing = false;
let currentShape = "line";
let color = document.querySelector('input[name="color"]').value;
let rgb = [hexToRgb(color).r, hexToRgb(color).g, hexToRgb(color).b];

canvas.addEventListener("mousedown", (e) => {
    const x = e.offsetX;
    const y = e.offsetY;

    points.push({ x, y });

    // Определяем, сколько точек нужно для текущей фигуры
    const requiredPoints = getRequiredPoints(currentShape);

    if (points.length === requiredPoints) {
        drawShape();
        points = []; // Очищаем массив точек после отрисовки
        isDrawing = false;
    } else {
        isDrawing = true;
    }
});

canvas.addEventListener("click", (e) => {
    const x = e.offsetX;
    const y = e.offsetY;

    const fillType = document.querySelector('input[name="shape"]:checked').value;
    color = document.querySelector('input[name="color"]').value;
    rgb = [hexToRgb(color).r, hexToRgb(color).g, hexToRgb(color).b];
    if (fillType === "color") {
        fillColor(x, y, rgb);
    } else if (fillType === "pattern") {
        const pattern = [
            [1, 0, 0, 1],
            [1, 0, 0, 1],
            [1, 0, 0, 1],
            [1, 0, 0, 1],
        ];
        fillPatternColor(x, y, rgb, [0, 0, 0], pattern);
    }
});

document.querySelectorAll('input[name="shape"]').forEach((radio) => {
    radio.addEventListener("change", (e) => {
        currentShape = e.target.value;
        points = [];
        isDrawing = false;
    });
});

function getRequiredPoints(shape) {
    switch (shape) {
        case "line":
            return 2; // Для линии нужно 2 точки
        case "circle":
            return 2; // Для окружности нужно 2 точки (центр и радиус)
        case "bezier":
            return 3; // Для квадратичной кривой Безье нужно 3 точки
        default:
            return 0;
    }
}

function drawShape() {
    switch (currentShape) {
        case "line":
            if (points.length === 2) {
                naturalLine2(points[0].x, points[0].y, points[1].x, points[1].y, "black");
            }
            break;
        case "circle":
            if (points.length === 2) {
                const radius = Math.hypot(points[1].x - points[0].x, points[1].y - points[0].y);
                bresenhamCircle(points[0].x, points[0].y, radius, "black");
            }
            break;
        case "bezier":
            if (points.length >= 3) { // Для кривой Безье нужно минимум 3 точки
                bezierLine(points, 0.01, "black");
            }
            break;
    }
}

function naturalLine(x0, y0, x1, y1, color) {
    const dx = x1 - x0;
    const dy = y1 - y0;
    const steps = Math.max(Math.abs(dx), Math.abs(dy));

    const xIncrement = dx / steps;
    const yIncrement = dy / steps;

    let x = x0;
    let y = y0;

    for (let i = 0; i <= steps; i++) {
        drawPoint(Math.round(x), Math.round(y), color);
        x += xIncrement;
        y += yIncrement;
    }
}
function naturalLine2(x0, y0, x1, y1, color) {
    const dx = x1 - x0;
    const dy = y1 - y0;

    if (Math.abs(dx) < Math.abs(dy)) {
        if (y0 > y1) {
            [x0, x1] = [x1, x0];
            [y0, y1] = [y1, y0];
        }

        const a = (x1 - x0) / (y1 - y0);
        const b = x0 - a * y0;

        for (let y = y0; y <= y1; y++) {
            const x = Math.round(a * y + b);
            drawPoint(x, y, color);
        }
    } else {
        if (x0 > x1) {
            [x0, x1] = [x1, x0];
            [y0, y1] = [y1, y0];
        }

        const a = (y1 - y0) / (x1 - x0);
        const b = y0 - a * x0;

        for (let x = x0; x <= x1; x++) {
            const y = Math.round(a * x + b);
            drawPoint(x, y, color);
        }
    }
}

function bresenhamCircle(x0, y0, radius, color) {
    let x = 0;
    let y = radius;
    let d = 3 - 2 * radius;

    while (y >= x) {
        draw8Pixels(x0, y0, x, y, color);
        if (d <= 0) {
            d = d + 4 * x + 6;
        } else {
            d = d + 4 * (x - y) + 10;
            y--;
        }
        x++;
    }
}
function draw8Pixels(x0, y0, x, y, color) {
    drawPoint(x + x0, y + y0, color);
    drawPoint(x + x0, -y + y0, color);
    drawPoint(-x + x0, y + y0, color);
    drawPoint(-x + x0, -y + y0, color);
    drawPoint(y + x0, x + y0, color);
    drawPoint(y + x0, -x + y0, color);
    drawPoint(-y + x0, x + y0, color);
    drawPoint(-y + x0, -x + y0, color);
}
function bezierLine(points, step, color) {
    const bezierPoints = getBezierPoints(points, step);

    ctx.beginPath();
    ctx.moveTo(bezierPoints[0].x, bezierPoints[0].y);
    for (let i = 1; i < bezierPoints.length; i++) {
        ctx.lineTo(bezierPoints[i].x, bezierPoints[i].y);
    }
    ctx.strokeStyle = color;
    ctx.stroke();
}

function getBezierPoints(points, step) {
    const resultPoints = [];
    const n = points.length - 1;

    for (let t = 0; t <= 1; t += step) {
        let x = 0;
        let y = 0;

        for (let i = 0; i <= n; i++) {
            const factor = polinom(i, n, t);
            x += factor * points[i].x;
            y += factor * points[i].y;
        }

        resultPoints.push({ x: Math.round(x), y: Math.round(y) });
    }
    return resultPoints;
}
function polinom(i, n, t) {
    return (
        (factorial(n) / (factorial(i) * factorial(n - i))) *
        Math.pow(t, i) *
        Math.pow(1 - t, n - i)
    );
}
function factorial(n) {
    if (n === 0) return 1;
    return n * factorial(n - 1);
}


function fillColor(x, y, fillColor) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixelStack = [[x, y]];
    const targetColor = getPixelColor(imageData, x, y);

    if (colorsEqual(targetColor, fillColor)) return;

    while (pixelStack.length) {
        const [px, py] = pixelStack.pop();
        if (px < 0 || px >= canvas.width || py < 0 || py >= canvas.height)
            continue;

        const currentColor = getPixelColor(imageData, px, py);
        if (!colorsEqual(currentColor, targetColor)) continue;

        setPixelColor(imageData, px, py, fillColor);

        pixelStack.push([px + 1, py]);
        pixelStack.push([px - 1, py]);
        pixelStack.push([px, py + 1]);
        pixelStack.push([px, py - 1]);
    }

    ctx.putImageData(imageData, 0, 0);
}
function fillPatternColor0(x, y, fillColor, patternColor, pattern) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixelStack = [[x, y]];
    const targetColor = getPixelColor(imageData, x, y);

    if (colorsEqual(targetColor, fillColor)) return;

    while (pixelStack.length) {
        const [px, py] = pixelStack.pop();
        if (px < 0 || px >= canvas.width || py < 0 || py >= canvas.height)
            continue;

        const currentColor = getPixelColor(imageData, px, py);
        if (!colorsEqual(currentColor, targetColor)) continue;

        const color = pattern[px % pattern.length][py % pattern[0].length]
            ? patternColor
            : fillColor;
        setPixelColor(imageData, px, py, color);

        pixelStack.push([px + 1, py]);
        pixelStack.push([px - 1, py]);
        pixelStack.push([px, py + 1]);
        pixelStack.push([px, py - 1]);
    }

    ctx.putImageData(imageData, 0, 0);
}

function fillPatternColor(x, y, fillColor, patternColor, pattern) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixelStack = [[x, y]];
    const targetColor = getPixelColor(imageData, x, y);

    if (colorsEqual(targetColor, fillColor)) return;

    while (pixelStack.length) {
        const [px, py] = pixelStack.pop();
        if (px < 0 || px >= canvas.width || py < 0 || py >= canvas.height) continue;

        const currentColor = getPixelColor(imageData, px, py);
        if (!colorsEqual(currentColor, targetColor)) continue;

        const color = pattern[px % pattern.length][py % pattern[0].length]
            ? patternColor
            : fillColor;
        setPixelColor(imageData, px, py, color);

        // закрашиваем вправо
        let xRight = px + 1;
        while (xRight < canvas.width && colorsEqual(getPixelColor(imageData, xRight, py), targetColor)) {
            const rightColor = pattern[xRight % pattern.length][py % pattern[0].length]
                ? patternColor
                : fillColor;
            setPixelColor(imageData, xRight, py, rightColor);
            xRight++;
        }

        // закрашиваем влево
        let xLeft = px - 1;
        while (xLeft >= 0 && colorsEqual(getPixelColor(imageData, xLeft, py), targetColor)) {
            const leftColor = pattern[xLeft % pattern.length][py % pattern[0].length]
                ? patternColor
                : fillColor;
            setPixelColor(imageData, xLeft, py, leftColor);
            xLeft--;
        }

        // строка ниже
        analyzeRow(px, py + 1, xLeft + 1, xRight - 1, targetColor, pixelStack, imageData, fillColor, patternColor, pattern);
        // строка выше
        analyzeRow(px, py - 1, xLeft + 1, xRight - 1, targetColor, pixelStack, imageData, fillColor, patternColor, pattern);
    }

    ctx.putImageData(imageData, 0, 0);
}

function analyzeRow(px, py, xLeft, xRight, targetColor, pixelStack, imageData, fillColor, patternColor, pattern) {
    let newLeft = xLeft;
    let newRight = xRight;

    while (newLeft <= newRight) {
        while (newLeft <= newRight && !colorsEqual(getPixelColor(imageData, newLeft, py), targetColor)) {
            newLeft++;
        }
        if (newLeft > newRight) break;

        // newLeft указывает на границу
        let fragmentStart = newLeft;
        while (newLeft <= newRight && colorsEqual(getPixelColor(imageData, newLeft, py), targetColor)) {
            newLeft++;
        }
        let fragmentEnd = newLeft - 1;

        // добавляем затравки для новых фрагментов
        pixelStack.push([fragmentStart, py]);
        pixelStack.push([fragmentEnd, py]);

        newLeft = fragmentEnd + 1;
    }
}




// вспомогательные функции
function drawPoint(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1);
}

function getPixelColor(imageData, x, y) {
    const index = (y * imageData.width + x) * 4;
    return [
        imageData.data[index],
        imageData.data[index + 1],
        imageData.data[index + 2],
        imageData.data[index + 3],
    ];
}

function setPixelColor(imageData, x, y, color) {
    const index = (y * imageData.width + x) * 4;
    imageData.data[index] = color[0];
    imageData.data[index + 1] = color[1];
    imageData.data[index + 2] = color[2];
    imageData.data[index + 3] = color[3] || 255;
}

function colorsEqual(color1, color2) {
    return (
        color1[0] === color2[0] &&
        color1[1] === color2[1] &&
        color1[2] === color2[2] &&
        color1[3] === color2[3]
    );
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
          }
        : null;
}