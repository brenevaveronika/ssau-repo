// считаем частоты
function countFrequencies(text) {
    const freq = {};
    for (const char of text) {
        freq[char] = (freq[char] || 0) + 1;
    }
    return freq;
}

class HuffmanNode {
    constructor(char, freq, left = null, right = null) {
        this.char = char;
        this.freq = freq;
        this.left = left;
        this.right = right;
    }
}

// строим дерево Хаффмана
function buildHuffmanTree(freq) {
    const nodes = [];
    for (const [char, frequency] of Object.entries(freq)) {
        nodes.push(new HuffmanNode(char, frequency));
    }

    while (nodes.length > 1) {
        nodes.sort((a, b) => a.freq - b.freq); // сортируем по возрастанию частот
        const left = nodes.shift();
        const right = nodes.shift();
        const newNode = new HuffmanNode(null, left.freq + right.freq, left, right);
        nodes.push(newNode);
    }
    return nodes[0];
}

// генерация кодов Хаффмана
function generateCodes(root, path = "", codes = {}) {
    if (root.char !== null) {
        codes[root.char] = path;
        return;
    }
    generateCodes(root.left, path + "0", codes);
    generateCodes(root.right, path + "1", codes);
    return codes;
}

// кодирование текста
function encodeText(text, codes) {
    let encoded = "";
    for (const char of text) {
        encoded += codes[char];
    }
    return encoded;
}

// декодирование текста
function decodeText(encoded, root) {
    let decoded = "";
    let node = root;
    for (const bit of encoded) {
        node = bit === "0" ? node.left : node.right;
        if (node.char !== null) {
            decoded += node.char;
            node = root; // возвращаемся в корень
        }
    }
    return decoded;
}

const text = "abracadabra";
const freq = countFrequencies(text); // { a:5, b:2, r:2, c:1, d:1 }
const tree = buildHuffmanTree(freq);
const codes = generateCodes(tree);   // { a: "0", b: "10", r: "110", c: "1110", d: "1111" }
const encoded = encodeText(text, codes);
console.log("Закодированный текст:", encoded);
const decoded = decodeText(encoded, tree);
console.log("Декодированный текст:", decoded); // "abracadabra"

// Этап	                Сложность
// Подсчёт частот	    O(n)
// Построение дерева	O(m log m)*
// Генерация кодов	    O(m)
// Кодирование текста	O(n)