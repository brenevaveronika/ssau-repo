function bubbleSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
}
// функция для "сливания" массивов
function merging(arr, left, mid, right) {
    const n1 = mid - left + 1;
    const n2 = right - mid;

    const L = new Array(n1);
    const R = new Array(n2);
    for (let i = 0; i < n1; i++) L[i] = arr[left + i];
    for (let j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];

    let i = 0, j = 0, k = left;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }
    // копируем оставшиеся элементы  L[] (если они есть)
    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
    }
    // копируем оставшиеся элементы R[] (если они есть)
    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
    }
}

function mergeSort(arr, left, right) {
    if (left < right) {
        const mid = Math.floor(left + (right - left) / 2);

        // сортируем две половины (!здесь рекурсия)
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        // сливаем отсортированнные половины
        merging(arr, left, mid, right);
    }
}

function fillArray(n) {
    const arr = new Array(n);
    for (let i = 0; i < n; i++) {
        arr[i] = Math.floor(Math.random() * 100000);
    }
    return arr;
}

function copyArray(src) {
    return [...src];
}

function main() {
    const sizes = [1000, 5000, 10000, 25000, 50000, 75000, 100000];
    const results = {
        "Пузырьковая сортировка": {},
        "Сортировка слиянием": {},
    };

    for (const n of sizes) {
        const arr = fillArray(n);
        const arrCopy = copyArray(arr);

        let start = performance.now();
        bubbleSort(arr);
        let end = performance.now();
        const bubbleTime = (end - start) / 1000;
        results["Пузырьковая сортировка"][n] = bubbleTime.toFixed(6);

        start = performance.now();
        mergeSort(arrCopy, 0, arrCopy.length - 1);
        end = performance.now();
        const mergeTime = (end - start) / 1000;
        results["Сортировка слиянием"][n] = mergeTime.toFixed(6);

    }
    console.table(results);
}
main();