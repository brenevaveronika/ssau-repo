// Дана строка со скобками. Проверьте правильность расстановки скобок за время О(n).
// а) в строке содержатся только круглые скобки;
// б) скобки могут быть любые


function isValidParentheses(s) {
    let balance = 0;
    for (const char of s) {
        if (char === '(') balance++;
        else if (char === ')') balance--;
        if (balance < 0) return false;
    }
    return balance === 0;
}

console.log("()", isValidParentheses("()"));
console.log("(()())", isValidParentheses("(()())"));
console.log("())", isValidParentheses("())"));

function isValidAllParentheses(s) {
    const stack = [];
    const pairs = { '(': ')', '[': ']', '{': '}' };

    for (const char of s) {
        if (pairs[char]) {
            stack.push(char);
        } else {
            const last = stack.pop();
            if (pairs[last] !== char) {
                return false;
            }
        }
    }
    return stack.length === 0;
}

console.log("()[]{}", isValidAllParentheses("()[]{}"));
console.log("([{}])", isValidAllParentheses("([{}])"));
console.log("({[}]", isValidAllParentheses("({[}]"));