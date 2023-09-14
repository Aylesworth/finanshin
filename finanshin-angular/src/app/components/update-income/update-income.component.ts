import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Income } from 'src/app/common/income';
import { IncomeService } from 'src/app/services/income.service';

@Component({
  selector: 'app-update-income',
  templateUrl: './update-income.component.html',
  styleUrls: ['./update-income.component.css']
})
export class UpdateIncomeComponent {
  @Input() id?: number;

  incomeFormGroup!: FormGroup;
  income?: Income;

	constructor(
    private modalService: NgbModal,
    private incomeService: IncomeService,
    private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    const email = localStorage.getItem('userEmail')!;
    this.incomeService.getIncome(email, this.id!).subscribe(
      data => {
        this.income = data;
        this.incomeFormGroup = this.formBuilder.group({
          amount: new FormControl(this.income?.amount, [Validators.required, Validators.min(0)]),
          description: new FormControl(this.income?.description),
          date: new FormControl(this.income?.date, [Validators.required])
        });
      }
    );
  }

  get amount() { return this.incomeFormGroup.get('amount')!; }
  get description() { return this.incomeFormGroup.get('description')!; }
  get date() { return this.incomeFormGroup.get('date')!; }

	open(content: any) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) => {        
				this.onSubmit();
			},
			(reason) => {
				
			},
		);
	}

  onSubmit() {
    let email: string = localStorage.getItem('userEmail')!;
    let income: Income = new Income();

    income.amount = this.incomeFormGroup.get('amount')?.value;
    income.description = this.incomeFormGroup.get('description')?.value;
    income.date = this.incomeFormGroup.get('date')?.value;

    this.incomeService.updateIncome(email, this.id!, income);
  }
}
