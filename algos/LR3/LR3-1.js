class ListNode {
    constructor(val, next = null) {
        this.val = val;
        this.next = next;
    }
}

function partition(head, x) {
    // Создаём два временных списка
    let beforeHead = new ListNode(0); // Фиктивный узел для списка "меньше x"
    let afterHead = new ListNode(0);  // Фиктивный узел для списка "больше или равно x"
    let before = beforeHead;
    let after = afterHead;

    // Проходим по исходному списку
    while (head !== null) {
        if (head.val < x) {
            before.next = head; // Добавляем в список "меньше x"
            before = before.next;
        } else {
            after.next = head; // Добавляем в список "больше или равно x"
            after = after.next;
        }
        head = head.next;
    }

    // Соединяем два списка
    after.next = null; // Завершаем список "больше или равно x"
    before.next = afterHead.next; // Соединяем список "меньше x" с "больше или равно x"

    // Возвращаем новый список
    return beforeHead.next;
}

// Вспомогательная функция для создания связного списка из массива
function createLinkedList(arr) {
    let head = new ListNode(arr[0]);
    let current = head;
    for (let i = 1; i < arr.length; i++) {
        current.next = new ListNode(arr[i]);
        current = current.next;
    }
    return head;
}

// Вспомогательная функция для печати связного списка
function printLinkedList(head) {
    let result = [];
    while (head !== null) {
        result.push(head.val);
        head = head.next;
    }
    console.log(result.join(" -> "));
}

// Пример использования
let list = createLinkedList([3, 5, 8, 5, 10, 2, 1]);
let x = 5;
console.log("Исходный список:");
printLinkedList(list);

let partitionedList = partition(list, x);
console.log("Список после разбиения:");
printLinkedList(partitionedList);