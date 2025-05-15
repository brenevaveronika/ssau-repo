function naiveSearch(text, pattern) {
    const n = text.length;
    const m = pattern.length;

    for (let i = 0; i <= n - m; i++) {
        let j = 0;
        while (j < m && text[i + j] === pattern[j]) {
            j++;
        }
        if (j === m) {
            return i;
        }
    }
    return -1;
}

console.log(naiveSearch("abacabadabacaba", "daba"));
console.log(naiveSearch("hello world", "xyz"));

function computeLPS(pattern) {
    const lps = Array(pattern.length).fill(0);
    let len = 0;
    let i = 1;

    while (i < pattern.length) {
        if (pattern[i] === pattern[len]) {
            len++;
            lps[i] = len;
            i++;
        } else {
            if (len !== 0) {
                len = lps[len - 1];
            } else {
                lps[i] = 0;
                i++;
            }
        }
    }
    return lps;
}

function kmpSearch(text, pattern) {
    const n = text.length;
    const m = pattern.length;
    const lps = computeLPS(pattern);

    let i = 0;
    let j = 0

    while (i < n) {
        if (text[i] === pattern[j]) {
            i++;
            j++;
        }
        if (j === m) {
            return i - j;
        } else if (i < n && text[i] !== pattern[j]) {
            if (j !== 0) {
                j = lps[j - 1];
            } else {
                i++;
            }
        }
    }
    return -1;
}

console.log(kmpSearch("abacabadabacaba", "daba"));
console.log(kmpSearch("hello world", "xyz"));

// Алгоритм	    Худший случай	    Лучший случай	    Память  
// Наивный	    O(n * m)	        O(n)	            O(1) 
// KMP	        O(n + m)	        O(n + m)	        O(m)