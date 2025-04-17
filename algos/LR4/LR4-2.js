// Реализуйте «вручную» стек со стандартными функциями push/pop и дополнительной
// функцией min, возвращающей минимальный элемент стека. Все эти функции должны
// работать за O(1). Память должна быть оптимальна.

class MinStack {
    constructor() {
        this.stack = [];
        this.minStack = []; 
    }


    push(x) {
        this.stack.push(x);
        if (this.minStack.length === 0 || x <= this.minStack[this.minStack.length - 1]) {
            this.minStack.push(x);
        }
    }

    pop() {
        if (this.stack.length === 0) return undefined;
        const popped = this.stack.pop();
        if (popped === this.minStack[this.minStack.length - 1]) {
            this.minStack.pop();
        }
        return popped;
    }

    peek() {
        return this.stack[this.stack.length - 1];
    }

    min() {
        return this.minStack[this.minStack.length - 1];
    }
}

const stack = new MinStack();
stack.push(3);
stack.push(5);
stack.push(2);
stack.push(1);

console.log(stack.min()); //
stack.pop();             //
console.log(stack.min()); //