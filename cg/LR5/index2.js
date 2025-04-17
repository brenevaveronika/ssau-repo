
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


let A = 3, B = 3, C = 3, r = 1, t = 1;
let wireframeMode = false;


const segments = 40;

const sizeMultiplier = 150;


let transformMatrix = createIdentityMatrix();


function createIdentityMatrix() {
    return [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];
}

function multiplyMatrices(a, b) {
    const result = createIdentityMatrix();
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            result[i][j] = 0;
            for (let k = 0; k < 4; k++) {
                result[i][j] += a[i][k] * b[k][j];
            }
        }
    }
    return result;
}


function createTranslationMatrix(tx, ty, tz) {
    return [
        [1, 0, 0, tx],
        [0, 1, 0, ty],
        [0, 0, 1, tz],
        [0, 0, 0, 1]
    ];
}


function createScaleMatrix(sx, sy, sz) {
    return [
        [sx, 0, 0, 0],
        [0, sy, 0, 0],
        [0, 0, sz, 0],
        [0, 0, 0, 1]
    ];
}


function createRotationXMatrix(angle) {
    const rad = angle * Math.PI / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    return [
        [1, 0, 0, 0],
        [0, cos, -sin, 0],
        [0, sin, cos, 0],
        [0, 0, 0, 1]
    ];
}

function createRotationYMatrix(angle) {
    const rad = angle * Math.PI / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    return [
        [cos, 0, sin, 0],
        [0, 1, 0, 0],
        [-sin, 0, cos, 0],
        [0, 0, 0, 1]
    ];
}

function createRotationZMatrix(angle) {
    const rad = angle * Math.PI / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    return [
        [cos, -sin, 0, 0],
        [sin, cos, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];
}

function applyTransform(point, matrix) {
    const x = point.x * matrix[0][0] + point.y * matrix[0][1] + point.z * matrix[0][2] + matrix[0][3];
    const y = point.x * matrix[1][0] + point.y * matrix[1][1] + point.z * matrix[1][2] + matrix[1][3];
    const z = point.x * matrix[2][0] + point.y * matrix[2][1] + point.z * matrix[2][2] + matrix[2][3];
    return { x, y, z };
}


function sgn(x) {
    return Math.sign(x);
}


function c(w, m) {
    return sgn(Math.cos(w)) * Math.pow(Math.abs(Math.cos(w)), m);
}

function s(w, m) {
    return sgn(Math.sin(w)) * Math.pow(Math.abs(Math.sin(w)), m);
}


function getSuperellipsoidPoint(u, v) {
    const x = A * c(v, 2/t) * c(u, 2/r) * sizeMultiplier;
    const y = B * c(v, 2/t) * s(u, 2/r) * sizeMultiplier;
    const z = C * s(v, 2/t) * sizeMultiplier;
    return { x, y, z };
}


function project(point) {
    const transformed = applyTransform(point, modelViewMatrix);

    // перспективная проекция
    const zk = 500; // координата z камеры
    const Zna = 0; // координата z плоскости проецирования
    const X = transformed.x * (zk - Zna) / (zk - transformed.z);
    const Y = transformed.y * (zk - Zna) / (zk - transformed.z);
    const Z = transformed.z;

    return {
        x: X + canvas.width / 2,
        y: -Y + canvas.height / 2,
        z: Z
    };
}


function updateTransformMatrix() {
    let matrix = createIdentityMatrix();
    

    const scale = parseFloat(document.getElementById('scale').value);
    matrix = multiplyMatrices(matrix, createScaleMatrix(scale, scale, scale));
    

    const rotateX = parseFloat(document.getElementById('rotateX').value);
    const rotateY = parseFloat(document.getElementById('rotateY').value);
    const rotateZ = parseFloat(document.getElementById('rotateZ').value);
    
    matrix = multiplyMatrices(matrix, createRotationXMatrix(rotateX));
    matrix = multiplyMatrices(matrix, createRotationYMatrix(rotateY));
    matrix = multiplyMatrices(matrix, createRotationZMatrix(rotateZ));
    

    const translateX = parseFloat(document.getElementById('translateX').value);
    const translateY = parseFloat(document.getElementById('translateY').value);
    const translateZ = parseFloat(document.getElementById('translateZ').value);
    
    matrix = multiplyMatrices(matrix, createTranslationMatrix(translateX, translateY, translateZ));
    
    transformMatrix = matrix;
}

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
    
    // Преобразования
    document.getElementById('translateX').addEventListener('input', function() {
        updateValue('translateX-value', this.value);
        drawSuperellipsoid();
    });
    
    document.getElementById('translateY').addEventListener('input', function() {
        updateValue('translateY-value', this.value);
        drawSuperellipsoid();
    });
    
    document.getElementById('translateZ').addEventListener('input', function() {
        updateValue('translateZ-value', this.value);
        drawSuperellipsoid();
    });
    
    document.getElementById('scale').addEventListener('input', function() {
        updateValue('scale-value', this.value);
        drawSuperellipsoid();
    });
    
    document.getElementById('rotateX').addEventListener('input', function() {
        updateValue('rotateX-value', this.value);
        drawSuperellipsoid();
    });
    
    document.getElementById('rotateY').addEventListener('input', function() {
        updateValue('rotateY-value', this.value);
        drawSuperellipsoid();
    });
    
    document.getElementById('rotateZ').addEventListener('input', function() {
        updateValue('rotateZ-value', this.value);
        drawSuperellipsoid();
    });
    
    // Кнопки
    document.getElementById('reset').addEventListener('click', function() {
        // Сброс параметров формы
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
        
        // Сброс преобразований
        document.getElementById('translateX').value = 0;
        updateValue('translateX-value', 0);
        document.getElementById('translateY').value = 0;
        updateValue('translateY-value', 0);
        document.getElementById('translateZ').value = 0;
        updateValue('translateZ-value', 0);
        document.getElementById('scale').value = 1;
        updateValue('scale-value', 1);
        document.getElementById('rotateX').value = 0;
        updateValue('rotateX-value', 0);
        document.getElementById('rotateY').value = 0;
        updateValue('rotateY-value', 0);
        document.getElementById('rotateZ').value = 0;
        updateValue('rotateZ-value', 0);
        
        drawSuperellipsoid();
    });
    
    document.getElementById('wireframe').addEventListener('click', function() {
        wireframeMode = !wireframeMode;
        this.textContent = wireframeMode ? "Поверхность/Каркас" : "Каркас/Поверхность";
        drawSuperellipsoid();
    });
}


window.onload = function() {
    initEventListeners();
    drawSuperellipsoid();
};