const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let angle = Math.PI / 2;
let currentDepth = 0;
const maxDepth = 20;
let axiom = "F+F+F+F";
let rules = {F: "F+F-F-FF+F+F-F"};
let length = 10;
let offsetX = 0;
let offsetY = 0;
let scale = 1;
const scaleFactor = 0.1;


// ГЛАВНАЯ ФУНКЦИЯ
function drawLSystem(axiom, rules, depth, x, y, length) {
    let currentString = axiom;
    // итерации по глубине рекурсии
    for (let i = 0; i < depth; i++) {
        let newString = "";
        // проходим по символам текущей строки
        for (let j = 0; j < currentString.length; j++) {
            const char = currentString[j];
            if (rules.hasOwnProperty(char)) {
                newString += rules[char];
            } else {
                newString += char;
            }
        }
        currentString = newString;
    }

    ctx.beginPath();
    ctx.moveTo(x, y);

    let currentX = x;
    let currentY = y;
    let currentAngle = Math.PI / 2;

    for (let i = 0; i < currentString.length; i++) {
        const char = currentString[i];
        switch (char) {
            case 'F':
                const nextX = currentX + length * Math.cos(currentAngle);
                const nextY = currentY + length * Math.sin(currentAngle);
                ctx.lineTo(nextX, nextY);
                currentX = nextX;
                currentY = nextY;
                break;
            case '+':
                currentAngle += angle;
                break;
            case '-':
                currentAngle -= angle;
                break;
            default:
                break;
        }
    }
    ctx.stroke();
}

// РИСОВАНИЕ В КАНВЕ
function render() {
    const container = document.getElementById('canvas-container');
    const width = container.clientWidth;
    const height = container.clientHeight;
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(width / 2 + offsetX, height / 2 + offsetY);
    ctx.scale(scale, scale);
    drawLSystem(axiom, rules, currentDepth, 0, 0, length);
    ctx.restore();
}

// ИЗМЕНЕНИЕ КОЛИЧЕСТВА ИТЕРАЦИЙ
document.addEventListener('keydown', (event) => {

    if (event.key === '=') {
        if (currentDepth < maxDepth) {
            currentDepth++;
            render();
        }
    }
    if (event.key === '-') {
        if (currentDepth > 0) {
            currentDepth--;
            render();
        }
    }
});


// дальше код только для масштабирования и перетаскивания canvas
function handleWheel(event) {
    event.preventDefault();

    if (event.deltaY < 0) {
        scale += scaleFactor;
    } else {
        scale -= scaleFactor;
    }

    // ограничиваем масштаб
    scale = Math.min(Math.max(0.5, scale), 3);
    canvas.style.transform = `scale(${scale})`;
}
canvas.addEventListener('wheel', handleWheel, { passive: false });

// ПАНОРАМИРОВАНИЕ
canvas.addEventListener('mousedown', (event) => {
    const startX = event.clientX;
    const startY = event.clientY;

    function onMouseMove(event) {
        const dx = (event.clientX - startX) * 0.5;
        const dy = (event.clientY - startY) * 0.5;
        offsetX += dx;
        offsetY += dy;
        render();
    }

    function onMouseUp() {
        canvas.removeEventListener('mousemove', onMouseMove);
        canvas.removeEventListener('mouseup', onMouseUp);
    }

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
});

// ОБРАБОТЧИК ФОРМЫ
document.getElementById('l-system-form').addEventListener('submit', (event) => {
    event.preventDefault(); // Предотвращаем отправку формы

    axiom = document.getElementById('axiom').value;
    const ruleInput = document.getElementById('rules').value;
    const angleInput = document.getElementById('angle').value;

    rules = {};
    if (ruleInput) {
        const ruleParts = ruleInput.split(',');
        ruleParts.forEach(part => {
            const [key, value] = part.split('->');
            if (key && value) {
                rules[key.trim()] = value.trim();
            }
        });
    }
    angle = Math.PI / angleInput;

    console.log(axiom, rules, angle);
    currentDepth = 0;
    render();
});

render();