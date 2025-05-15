function knapsack(weights, values, capacity) {
    const n = weights.length;
    const dp = Array(n + 1).fill(0).map(() => Array(capacity + 1).fill(0));

    for (let i = 1; i <= n; i++) {
        for (let w = 0; w <= capacity; w++) {
            if (weights[i - 1] <= w) {
                dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - weights[i - 1]] + values[i - 1]);
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }

    return dp[n][capacity];
}

const weights = [1, 2, 3, 3, 2, 2];
const values = [10, 15, 40, 25, 90, 100];
const capacity = 3;

const maxValue = knapsack(weights, values, capacity);
console.log("Максимальная стоимость (рюкзак без повторений):", maxValue);
