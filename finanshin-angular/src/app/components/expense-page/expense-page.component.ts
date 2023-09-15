import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Expense } from 'src/app/common/expense';
import { ExpenseService } from 'src/app/services/expense.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ExpenseCategory } from 'src/app/common/expense-category';

@Component({
  selector: 'app-expense-page',
  templateUrl: './expense-page.component.html',
  styleUrls: ['./expense-page.component.css']
})
export class ExpensePageComponent implements OnInit {

  expenses: Expense[] = [];

  pageNumber: number = 1;
  pageSize: number = 20;
  collectionSize: number = 0;
  
  email: string = localStorage.getItem("userEmail")!;

  searchKeyword: string = '';
  
  expenseFormGroup!: FormGroup;

  constructor(
    private expenseService: ExpenseService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.expenseService.expenses.subscribe(
      data => this.expenses = data
    );
    this.handleExpenseList();
    
    this.expenseFormGroup = this.formBuilder.group({
      category: new FormControl('', [Validators.required]),
      newCategoryWeight: new FormControl(5, [Validators.min(0), Validators.max(100)]),
      amount: new FormControl('', [Validators.required, Validators.min(0)]),
      description: new FormControl(''),
      date: new FormControl('', [Validators.required])
    });
  }

  handleExpenseList() {
    if (this.searchKeyword !== '') {
      this.search();
    } else if (this.year !== 0 || this.month !== 0) {
      this.filterByYearMonth();
    } else {
      this.getExpenses();
    }
  }

  getExpenses() {
    this.expenseService.getExpenses(this.email, this.pageNumber, this.pageSize).subscribe(
      this.processResult()
    );
  }

  deleteExpense(id: number) {
    this.expenseService.deleteExpense(this.email, id);
    this.resetYearMonth();
  }

  search() {
    this.expenseService.search(this.email, this.searchKeyword, this.pageNumber, this.pageSize).subscribe(
      this.processResult()
    )
    this.resetYearMonth();
  }

  processResult() {
    return (data: any) => {
      this.pageNumber = data.number + 1;
      this.pageSize = data.size;
      this.collectionSize = data.totalElements;
    };
  }

  changePageSize(newPageSize: number) {
    this.pageSize = newPageSize;
    this.pageNumber = 1;
    this.resetYearMonth();
    this.getExpenses();
  }

  
  // Year month filter

  yearMonthDisplay: string = 'All';
  year: number = 0;
  month: number = 0;
  
  prevMonth() {
    if (this.year === 0 && this.month === 0) {
      const today: Date = new Date();
      this.year = today.getFullYear();
      this.month = today.getMonth() + 1;
    } else {
      this.month--;
      if (this.month === 0) {
        this.month = 12;
        this.year--;
      }
    }
    this.filterByYearMonth();
    this.updateYearMonthDisplay();
  }

  nextMonth() {
    if (this.year === 0 && this.month === 0) return;
    
    this.month++;
    if (this.month === 13) {
      this.month = 1;
      this.year++;
    }

    const today: Date = new Date();
    if (this.year > today.getFullYear() || (this.year === today.getFullYear() && this.month > today.getMonth() + 1)) {
      this.year = 0;
      this.month = 0;
    }
    this.filterByYearMonth();
    this.updateYearMonthDisplay();
  }

  filterByYearMonth() {    
    this.expenseService.getExpensesByMonth(this.email, this.year, this.month, this.pageNumber, this.pageSize).subscribe(
      this.processResult()
    );
  }

  updateYearMonthDisplay() {
    if (this.year === 0 && this.month === 0) {
      this.yearMonthDisplay = 'All';
    } else {
      this.yearMonthDisplay = `${this.month}/${this.year}`;
    }
  }

  resetYearMonth() {
    this.year = 0;
    this.month = 0;
    this.updateYearMonthDisplay();
  }


  // Form events 
  
  get category() { return this.expenseFormGroup.get('category')!; }
  get amount() { return this.expenseFormGroup.get('amount')!; }
  get description() { return this.expenseFormGroup.get('description')!; }
  get date() { return this.expenseFormGroup.get('date')!; }

  formName: string = '';
  categories: ExpenseCategory[] = [];
  isNewCategory: boolean = false;

  getCategories() {
    this.expenseService.getCategories(this.email).subscribe(
      data => this.categories = data
    );
  }

  checkCategory(value: string) {
    this.isNewCategory = this.categories.find(c => c.name === value) == undefined;
  }

  openForm(content: any, expense?: Expense) {
    this.formName = expense ? 'Update Expense' : 'New Expense';

    this.getCategories();

    this.expenseFormGroup.get('category')!.setValue(expense?.category?.name || '');
    this.expenseFormGroup.get('amount')!.setValue(expense?.amount || '');
    this.expenseFormGroup.get('description')!.setValue(expense?.description || '');
    this.expenseFormGroup.get('date')!.setValue(expense?.date || '');
    this.isNewCategory = false;

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) => {        
        if (expense) {
          this.expenseService.updateExpense(this.email, expense.id!, this.getFormOutput());
          this.resetYearMonth();
        } else {
				  this.expenseService.addExpense(this.email, this.getFormOutput());
          this.resetYearMonth();
        }
			},
			(reason) => {
				
			},
		);
	}

  getFormOutput(): Expense {
    let expense: Expense = new Expense();

    expense.category = new ExpenseCategory();
    expense.category.name = this.expenseFormGroup.get('category')?.value;
    expense.category.weight = this.expenseFormGroup.get('newCategoryWeight')?.value / 100;
    expense.amount = this.expenseFormGroup.get('amount')?.value;
    expense.description = this.expenseFormGroup.get('description')?.value;
    expense.date = this.expenseFormGroup.get('date')?.value;

    return expense;
  }
}
