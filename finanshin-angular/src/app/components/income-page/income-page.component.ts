import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Income } from 'src/app/common/income';
import { IncomeService } from 'src/app/services/income.service';
import { UpdateIncomeComponent } from '../update-income/update-income.component';

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

  constructor(
    private incomeService: IncomeService,
    private modalService: NgbModal) {}

  ngOnInit(): void {
    this.incomeService.incomes.subscribe(
      data => this.incomes = data
    );
    this.getIncomes();
  }

  getIncomes() {
    this.incomeService.getIncomes(this.email, this.pageNumber, this.pageSize).subscribe(
      data => {
        this.pageNumber = data.number + 1;
        this.pageSize = data.size;
        this.collectionSize = data.totalElements;
        console.log(this.incomes);
      }
    );
  }

  deleteIncome(id: number) {
    this.incomeService.deleteIncome(this.email, id);
  }
}
