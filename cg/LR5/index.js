const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let A = 3, B = 3, C = 3, r = 1, t = 1;
let wireframeMode = false;

let translateX = 0, translateY = 0, translateZ = 0;
let scale = 1;
let rotateX = 0, rotateY = 0, rotateZ = 0;

const segments = 30;

const sizeMultiplier = 50;

function sgn(x) {
    return Math.sign(x);
}


// вспомогательные функции
function c(w, m) {
    return sgn(Math.cos(w)) * Math.pow(Math.abs(Math.cos(w)), m);
}

function s(w, m) {
    return sgn(Math.sin(w)) * Math.pow(Math.abs(Math.sin(w)), m);
}

// функция для вычисления точки на суперэллипсоиде
function getSuperellipsoidPoint(u, v) {
    const x = A * c(v, 2/t) * c(u, 2/r) * sizeMultiplier;
    const y = B * c(v, 2/t) * s(u, 2/r) * sizeMultiplier;
    const z = C * s(v, 2/t) * sizeMultiplier;
    return { x, y, z };
}

// функция для вращения точки вокруг осей
function rotatePoint(point, rx, ry, rz) {

    rx = rx * Math.PI / 180;
    ry = ry * Math.PI / 180;
    rz = rz * Math.PI / 180;
    
    const y1 = point.y * Math.cos(rx) - point.z * Math.sin(rx);
    const z1 = point.y * Math.sin(rx) + point.z * Math.cos(rx);
    
    const x2 = point.x * Math.cos(ry) + z1 * Math.sin(ry);
    const z2 = -point.x * Math.sin(ry) + z1 * Math.cos(ry);
    
    const x3 = x2 * Math.cos(rz) - y1 * Math.sin(rz);
    const y3 = x2 * Math.sin(rz) + y1 * Math.cos(rz);
    
    return { x: x3, y: y3, z: z2 };
}

// функция проекции 3D точки на 2D плоскость
function project(point) {

    let transformed = {
        x: point.x * scale,
        y: point.y * scale,
        z: point.z * scale
    };
    
    transformed = rotatePoint(transformed, rotateX, rotateY, rotateZ);
    
    transformed.x += translateX;
    transformed.y += translateY;
    transformed.z += translateZ;
    
    const distance = 2500;
    const factor = distance / (distance + transformed.z);
    const x2d = transformed.x * factor + canvas.width / 2;
    const y2d = -transformed.y * factor + canvas.height / 2;
    
    return { x: x2d, y: y2d, z: transformed.z };
}

// функция отрисовки суперэллипсоида
function drawSuperellipsoid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const points = [];
    for (let i = 0; i <= segments; i++) {
        const v = -Math.PI/2 + i * Math.PI / segments;
        points[i] = [];
        for (let j = 0; j <= segments; j++) {
            const u = -Math.PI + j * 2 * Math.PI / segments;
            points[i][j] = getSuperellipsoidPoint(u, v);
        }
    }
    
    if (wireframeMode) {
        ctx.strokeStyle = '#3498db';
        ctx.lineWidth = 1;
        
        for (let i = 0; i <= segments; i++) {
            ctx.beginPath();
            for (let j = 0; j <= segments; j++) {
                const projected = project(points[i][j]);
                if (j === 0) {
                    ctx.moveTo(projected.x, projected.y);
                } else {
                    ctx.lineTo(projected.x, projected.y);
                }
            }
            ctx.stroke();
        }
        
        for (let j = 0; j <= segments; j++) {
            ctx.beginPath();
            for (let i = 0; i <= segments; i++) {
                const projected = project(points[i][j]);
                if (i === 0) {
                    ctx.moveTo(projected.x, projected.y);
                } else {
                    ctx.lineTo(projected.x, projected.y);
                }
            }
            ctx.stroke();
        }
    } 

    else {

        const projectedPoints = [];
        for (let i = 0; i <= segments; i++) {
            projectedPoints[i] = [];
            for (let j = 0; j <= segments; j++) {
                projectedPoints[i][j] = project(points[i][j]);
            }
        }
        
        for (let i = 0; i < segments; i++) {
            for (let j = 0; j < segments; j++) {

                const p1 = projectedPoints[i][j];
                const p2 = projectedPoints[i][j+1];
                const p3 = projectedPoints[i+1][j+1];
                const p4 = projectedPoints[i+1][j];
                
                // вычисляем среднюю z-координату для определения видимости
                const avgZ = (p1.z + p2.z + p3.z + p4.z) / 4;
                
                // пропускаем полигоны, которые находятся сзади
                if (avgZ < -2000) continue;
                
                // вычисляем цвет в зависимости от z-координаты
                const colorIntensity = Math.min(255, Math.max(0, 150 + avgZ / 10));
                const color = `rgb(${colorIntensity}, ${colorIntensity}, 200)`;
                

                ctx.fillStyle = color;
                ctx.strokeStyle = '#aaa';
                ctx.lineWidth = 0.5;
                
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.lineTo(p3.x, p3.y);
                ctx.lineTo(p4.x, p4.y);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            }
        }
    }
}

function updateValue(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value.toFixed(1);
    }
}

// обработчики событий
function initEventListeners() {

    document.getElementById('A').addEventListener('input', function() {
        A = parseFloat(this.value);
        updateValue('A-value', A);
        drawSuperellipsoid();
    });
    
    document.getElementById('B').addEventListener('input', function() {
        B = parseFloat(this.value);
        updateValue('B-value', B);
        drawSuperellipsoid();
    });
    
    document.getElementById('C').addEventListener('input', function() {
        C = parseFloat(this.value);
        updateValue('C-value', C);
        drawSuperellipsoid();
    });
    
    document.getElementById('r').addEventListener('input', function() {
        r = parseFloat(this.value);
        updateValue('r-value', r);
        drawSuperellipsoid();
    });
    
    document.getElementById('t').addEventListener('input', function() {
        t = parseFloat(this.value);
        updateValue('t-value', t);
        drawSuperellipsoid();
    });
    
    document.getElementById('translateX').addEventListener('input', function() {
        translateX = parseFloat(this.value);
        updateValue('translateX-value', translateX);
        drawSuperellipsoid();
    });
    
    document.getElementById('translateY').addEventListener('input', function() {
        translateY = parseFloat(this.value);
        updateValue('translateY-value', translateY);
        drawSuperellipsoid();
    });
    
    document.getElementById('translateZ').addEventListener('input', function() {
        translateZ = parseFloat(this.value);
        updateValue('translateZ-value', translateZ);
        drawSuperellipsoid();
    });
    
    document.getElementById('scale').addEventListener('input', function() {
        scale = parseFloat(this.value);
        updateValue('scale-value', scale);
        drawSuperellipsoid();
    });
    
    document.getElementById('rotateX').addEventListener('input', function() {
        rotateX = parseFloat(this.value);
        updateValue('rotateX-value', rotateX);
        drawSuperellipsoid();
    });
    
    document.getElementById('rotateY').addEventListener('input', function() {
        rotateY = parseFloat(this.value);
        updateValue('rotateY-value', rotateY);
        drawSuperellipsoid();
    });
    
    document.getElementById('rotateZ').addEventListener('input', function() {
        rotateZ = parseFloat(this.value);
        updateValue('rotateZ-value', rotateZ);
        drawSuperellipsoid();
    });
    
    // кнопки
    document.getElementById('reset').addEventListener('click', function() {

        A = B = C = 3;
        r = t = 1;
        document.getElementById('A').value = A;
        updateValue('A-value', A);
        document.getElementById('B').value = B;
        updateValue('B-value', B);
        document.getElementById('C').value = C;
        updateValue('C-value', C);
        document.getElementById('r').value = r;
        updateValue('r-value', r);
        document.getElementById('t').value = t;
        updateValue('t-value', t);
        
        translateX = translateY = translateZ = 0;
        scale = 1;
        rotateX = rotateY = rotateZ = 0;
        document.getElementById('translateX').value = translateX;
        updateValue('translateX-value', translateX);
        document.getElementById('translateY').value = translateY;
        updateValue('translateY-value', translateY);
        document.getElementById('translateZ').value = translateZ;
        updateValue('translateZ-value', translateZ);
        document.getElementById('scale').value = scale;
        updateValue('scale-value', scale);
        document.getElementById('rotateX').value = rotateX;
        updateValue('rotateX-value', rotateX);
        document.getElementById('rotateY').value = rotateY;
        updateValue('rotateY-value', rotateY);
        document.getElementById('rotateZ').value = rotateZ;
        updateValue('rotateZ-value', rotateZ);
        
        drawSuperellipsoid();
    });
    
    document.getElementById('wireframe').addEventListener('click', function() {
        wireframeMode = !wireframeMode;
        this.textContent = wireframeMode ? "Поверхность/Каркас" : "Каркас/Поверхность";
        drawSuperellipsoid();
    });
}

// инициализация при загрузке страницы
window.onload = function() {
    initEventListeners();
    drawSuperellipsoid();
};