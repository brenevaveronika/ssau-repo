// Дан массив размера n+1. Элементы массива числа из множества {1, 2, 3 … n}. Найдите
// повторяющееся число за время О(n), не используя дополнительной памяти.
// Повторяющихся элементов может быть несколько.

function findDuplicates(nums) {
    const duplicates = [];
    for (let i = 0; i < nums.length; i++) {
        const index = Math.abs(nums[i]) - 1;
        if (nums[index] < 0) {
            duplicates.push(Math.abs(nums[i]));
        } else {
            nums[index] *= -1;
        }
    }
    for (let i = 0; i < nums.length; i++) {
        nums[i] = Math.abs(nums[i]);
    }
    return duplicates;
}

console.log(findDuplicates([4, 3, 2, 7, 8, 2, 3, 1]));
console.log(findDuplicates([1, 1, 2]));
console.log(findDuplicates([1, 2, 3]));

// Время: O(n) — два прохода по массиву (один для поиска повторов, второй для восстановления знаков).
// Память: O(1) — не используем дополнительных структур, только модифицируем исходный массив.