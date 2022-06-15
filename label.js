// This class simply return a sequence of characters like
// A, B, C .. Z, AA, AB, ... BA, ...

class LabelRetriever {
    constructor() {
        this.num = 1;
    }
    getNewLabel() {
        let label = "";
        let copyNum = this.num++;
        do {
            --copyNum;
            label = String.fromCharCode(65 + (copyNum % 26)) + label;
            copyNum = Math.floor(copyNum/26);
        } while (copyNum > 0);

        return label;
    }
}


