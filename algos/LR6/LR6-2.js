function knapsack2(weights, values, capacity) {
    const dp = Array(capacity + 1).fill(0);

    for (let w = 0; w <= capacity; w++) {
        for (let i = 0; i < weights.length; i++) {
            if (weights[i] <= w) {
                dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
            }
        }
    }

    return dp[capacity];
}

const weightsUnbounded = [1, 2, 3, 3, 2, 2];
const valuesUnbounded = [10, 15, 40, 25, 90, 100];
const capacityUnbounded = 3;

const maxValueUnbounded = knapsack2(weightsUnbounded, valuesUnbounded, capacityUnbounded);
console.log("Максимальная стоимость (рюкзак с повторениями):", maxValueUnbounded);