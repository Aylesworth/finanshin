import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Income } from 'src/app/common/income';
import { IncomeService } from 'src/app/services/income.service';

@Component({
  selector: 'app-add-income',
  templateUrl: './add-income.component.html',
  styleUrls: ['./add-income.component.css']
})
export class AddIncomeComponent implements OnInit {

  incomeFormGroup!: FormGroup;

	constructor(
    private modalService: NgbModal,
    private incomeService: IncomeService,
    private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.incomeFormGroup = this.formBuilder.group({
      amount: new FormControl('', [Validators.required, Validators.min(0)]),
      description: new FormControl(''),
      date: new FormControl('', [Validators.required])
    });
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

    this.incomeService.addIncome(email, income);

    this.incomeFormGroup.get('amount')?.setValue('');
    this.incomeFormGroup.get('description')?.setValue('');
    this.incomeFormGroup.get('date')?.setValue('');
  }
}
