class ListNode {
    constructor(val, next = null) {
        this.val = val;
        this.next = next;
    }
}

function findKthFromEnd(head, k) {
    let fast = head;
    let slow = head;

    // перемещаем fast на k шагов вперёд
    for (let i = 0; i < k; i++) {
        if (fast === null) {
            return null;
        }
        fast = fast.next;
    }

    // перемещаем fast и slow одновременно
    while (fast !== null) {
        fast = fast.next;
        slow = slow.next;
    }

    return slow;
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


let list = createLinkedList([1, 2, 3, 4, 5, 6, 7]);
let k = 3;
console.log("Исходный список:");
printLinkedList(list);

let kthNode = findKthFromEnd(list, k);
if (kthNode !== null) {
    console.log(`Элемент с конца под номером ${k}: ${kthNode.val}`);
} else {
    console.log(`Элемент с номером ${k} с конца не найден.`);
}