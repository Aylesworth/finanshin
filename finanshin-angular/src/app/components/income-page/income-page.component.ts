import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Income } from 'src/app/common/income';
import { IncomeService } from 'src/app/services/income.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-income-page',
  templateUrl: './income-page.component.html',
  styleUrls: ['./income-page.component.css']
})
export class IncomePageComponent implements OnInit {

  incomes: Income[] = [];

  pageNumber: number = 1;
  pageSize: number = 20;
  collectionSize: number = 0;
  
  email: string = localStorage.getItem("userEmail")!;

  searchKeyword: string = '';
  
  incomeFormGroup!: FormGroup;

  constructor(
    private incomeService: IncomeService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.incomeService.incomes.subscribe(
      data => this.incomes = data
    );
    this.handleIncomeList();
    
    this.incomeFormGroup = this.formBuilder.group({
      amount: new FormControl('', [Validators.required, Validators.min(0)]),
      description: new FormControl(''),
      date: new FormControl('', [Validators.required])
    });
  }

  handleIncomeList() {
    if (this.searchKeyword !== '') {
      this.search();
    } else if (this.year !== 0 || this.month !== 0) {
      this.filterByYearMonth();
    } else {
      this.getIncomes();
    }
  }

  getIncomes() {
    this.incomeService.getIncomes(this.email, this.pageNumber, this.pageSize).subscribe(
      this.processResult()
    );
  }

  deleteIncome(id: number) {
    this.incomeService.deleteIncome(this.email, id);
    this.resetYearMonth();
  }

  search() {
    this.incomeService.search(this.email, this.searchKeyword, this.pageNumber, this.pageSize).subscribe(
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
    this.getIncomes();
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
    this.incomeService.getIncomesByMonth(this.email, this.year, this.month, this.pageNumber, this.pageSize).subscribe(
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
  
  get amount() { return this.incomeFormGroup.get('amount')!; }
  get description() { return this.incomeFormGroup.get('description')!; }
  get date() { return this.incomeFormGroup.get('date')!; }

  formName: string = '';

  openForm(content: any, income?: Income) {
    this.formName = income ? 'Update Income' : 'New Income';

    this.incomeFormGroup.get('amount')!.setValue(income?.amount || '');
    this.incomeFormGroup.get('description')!.setValue(income?.description || '');
    this.incomeFormGroup.get('date')!.setValue(income?.date || '');

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) => {        
        if (income) {
          this.incomeService.updateIncome(this.email, income.id!, this.getFormOutput());
          this.resetYearMonth();
        } else {
				  this.incomeService.addIncome(this.email, this.getFormOutput());
          this.resetYearMonth();
        }
			},
			(reason) => {
				
			},
		);
	}

  getFormOutput(): Income {
    let income: Income = new Income();

    income.amount = this.incomeFormGroup.get('amount')?.value;
    income.description = this.incomeFormGroup.get('description')?.value;
    income.date = this.incomeFormGroup.get('date')?.value;

    return income;
  }
}
