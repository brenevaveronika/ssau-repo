// Обнулите столбец N и строку M матрицы, если элемент в ячейке (N, M) нулевой. Затраты
// памяти и времени работы должны быть минимизированы.

function setZeroes(matrix) {
    const m = matrix.length;
    const n = matrix[0].length;
    let row0HasZero = false;
    let col0HasZero = false;

    for (let j = 0; j < n; j++) {
        if (matrix[0][j] === 0) {
            row0HasZero = true;
            break;
        }
    }

    for (let i = 0; i < m; i++) {
        if (matrix[i][0] === 0) {
            col0HasZero = true;
            break;
        }
    }

    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            if (matrix[i][j] === 0) {
                matrix[i][0] = 0;
                matrix[0][j] = 0;
            }
        }
    }


    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            if (matrix[i][0] === 0 || matrix[0][j] === 0) {
                matrix[i][j] = 0;
            }
        }
    }


    if (row0HasZero) {
        for (let j = 0; j < n; j++) {
            matrix[0][j] = 0;
        }
    }


    if (col0HasZero) {
        for (let i = 0; i < m; i++) {
            matrix[i][0] = 0;
        }
    }
}


const matrix = [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1]
];
setZeroes(matrix);
console.log(matrix);