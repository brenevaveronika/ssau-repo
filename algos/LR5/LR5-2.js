function findAllPalindromes(s) {
    const result = [];
    const n = s.length;

    function expandAroundCenter(left, right) {
        while (left >= 0 && right < n && s[left] === s[right]) {
            result.push(s.slice(left, right + 1));
            left--;
            right++;
        }
    }

    for (let i = 0; i < n; i++) {
        expandAroundCenter(i, i);
        expandAroundCenter(i, i + 1);
    }

    return result;
}

console.log(findAllPalindromes("abba"));
console.log(findAllPalindromes("abc"));