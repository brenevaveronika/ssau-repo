class Node {
    constructor(val, next = null, random = null) {
        this.val = val;
        this.next = next;
        this.random = random;
    }
}

function copyRandomList(head) {
    if (!head) return null;

    // 1. Создаём копии узлов и вставляем их после оригинальных узлов
    let current = head;
    while (current) {
        let copy = new Node(current.val);
        copy.next = current.next;
        current.next = copy;
        current = copy.next;
    }

    // 2. Корректируем указатели random у копий
    current = head;
    while (current) {
        if (current.random) {
            current.next.random = current.random.next;
        }
        current = current.next.next;
    }

    // 3. Разделяем исходный и скопированный список
    let original = head;
    let copied = head.next;
    let result = copied;

    while (original) {
        original.next = original.next.next;
        copied.next = copied.next ? copied.next.next : null;
        original = original.next;
        copied = copied.next;
    }

    // 4. Возвращаем скопированный список
    return result;
}

// Вспомогательная функция для создания списка с random указателями
function createRandomList(arr) {
    if (arr.length === 0) return null;
    let nodes = arr.map((val) => new Node(val));
    for (let i = 0; i < nodes.length; i++) {
        if (i < nodes.length - 1) {
            nodes[i].next = nodes[i + 1];
        }
        if (Math.random() < 0.5) {
            nodes[i].random = nodes[Math.floor(Math.random() * nodes.length)];
        }
    }
    return nodes[0];
}

// Вспомогательная функция для печати списка с random указателями
function printRandomList(head) {
    let current = head;
    let result = [];
    while (current) {
        let randomVal = current.random ? current.random.val : "null";
        result.push(`[val: ${current.val}, random: ${randomVal}]`);
        current = current.next;
    }
    console.log(result.join(" -> "));
}

// Пример использования
let list = createRandomList([1, 2, 3, 4]);
console.log("Исходный список:");
printRandomList(list);

let copiedList = copyRandomList(list);
console.log("Скопированный список:");
printRandomList(copiedList);