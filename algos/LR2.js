function mult(a, b) {
    return a * b;
}

function rec(a, b) {
    if (b > 0) {
        return a + rec(a, b - 1);
    }
    if (b < 0) {
        return -rec(a, -b);
    }
    return 0;
}

function add(a, b) {
    let result = 0;
    const positiveB = Math.abs(b);
    for (let i = 0; i < positiveB; i++) {
        result += a;
    }
    return b < 0 ? -result : result;
}

function measureTime(func, a, b, iterations = 1000) {
    if ((func === rec) && ((a > 10000) || (b > 10000))) {
        return -1
    }
    let totalTime = 0;
    for (let i = 0; i < iterations; i++) {
        const start = performance.now();
        func(a, b);
        const end = performance.now();
        totalTime += end - start;
    }
    return (totalTime / iterations) / 1000;
}

function main() {
    const tests = [
        { a: 5, b: 3 },
        { a: 10, b: 100 },
        { a: 123, b: 456 },
        { a: 1000, b: 1000 },
        { a: 10000, b: 10000 },
        { a: 100000, b: 100000 },
        { a: 1000000, b: 1000000 },
    ];

    const results = {
        "Традиционное умножение": {},
        "Умножение сложением (!итеративно)": {},
        "Умножение сложением (!рекурсия)": {},
    };
    const iterations = 1000;
    for (const test of tests) {
        const { a, b } = test;

        const multTime = measureTime(mult, a, b, iterations);
        results["Традиционное умножение"][`${a} * ${b}`] = multTime.toFixed(8);

        const addTime = measureTime(add, a, b, iterations);
        results["Умножение сложением (!итеративно)"][`${a} * ${b}`] = addTime.toFixed(8);

        const recTime = measureTime(rec, a, b, iterations);
        results["Умножение сложением (!рекурсия)"][`${a} * ${b}`] = recTime.toFixed(8);
    }
    console.table(results);
}
main();