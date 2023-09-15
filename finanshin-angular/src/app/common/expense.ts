import { ExpenseCategory } from "./expense-category";

export class Expense {
    constructor(
        public id?: number,
        public category?: ExpenseCategory,
        public amount?: number,
        public description?: string,
        public date?: Date
    ) {}
}
