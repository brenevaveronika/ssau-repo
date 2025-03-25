class ListNode {
    constructor(val, next = null) {
        this.val = val;
        this.next = next;
    }
}

function partition(head, x) {
    let beforeHead = new ListNode(0);
    let afterHead = new ListNode(0);
    let before = beforeHead;
    let after = afterHead;

    // проходим по исходному списку
    while (head !== null) {
        if (head.val < x) {
            before.next = head;
            before = before.next;
        } else {
            after.next = head;
            after = after.next;
        }
        head = head.next;
    }

    // соединяем два списка
    after.next = null; 
    before.next = afterHead.next;

    return beforeHead.next;
}

function createLinkedList(arr) {
    let head = new ListNode(arr[0]);
    let current = head;
    for (let i = 1; i < arr.length; i++) {
        current.next = new ListNode(arr[i]);
        current = current.next;
    }
    return head;
}

function printLinkedList(head) {
    let result = [];
    while (head !== null) {
        result.push(head.val);
        head = head.next;
    }
    console.log(result.join(" -> "));
}

let list = createLinkedList([3, 5, 8, 5, 10, 2, 1]);
let x = 10;
console.log("Исходный список:");
printLinkedList(list);

let partitionedList = partition(list, x);
console.log("Список после разбиения:");
printLinkedList(partitionedList);