import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject, map } from 'rxjs';
import { Income } from '../common/income';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IncomeService {

  incomes: Subject<Income[]> = new BehaviorSubject<Income[]>([]);

  lastPageNumber: number = 1;
  lastPageSize: number = 20;

  constructor(private http: HttpClient) { }

  getIncomes(email: string, pageNumber: number, pageSize: number): Observable<IncomesResponse> {
    const url = `${environment.apiUrl}/users/${email}/incomes?page=${pageNumber - 1}&size=${pageSize}`;
    this.lastPageNumber = pageNumber;
    this.lastPageSize = pageSize;

    const res = this.http.get<IncomesResponse>(url);

    res.subscribe(
      data => this.incomes.next(data.content)
    );

    return res;
  }

  getIncome(email: string, incomeId: number): Observable<Income> {
    const url = `${environment.apiUrl}/users/${email}/incomes/${incomeId}`;
    return this.http.get<Income>(url);
  }

  addIncome(email: string, income: Income) {
    const url = `${environment.apiUrl}/users/${email}/incomes`;
    this.http.post(url, income).subscribe(
      () => this.getIncomes(email, this.lastPageNumber, this.lastPageSize)
    );
  }

  updateIncome(email: string, incomeId: number, income: Income) {
    const url = `${environment.apiUrl}/users/${email}/incomes/${incomeId}`;
    this.http.put(url, income).subscribe(
      () => this.getIncomes(email, this.lastPageNumber, this.lastPageSize)
    );
  }

  deleteIncome(email: string, incomeId: number) {
    const url = `${environment.apiUrl}/users/${email}/incomes/${incomeId}`;
    this.http.delete(url).subscribe(
      () => this.getIncomes(email, this.lastPageNumber, this.lastPageSize)
    );
  }
}

interface IncomesResponse {
  content: Income[],
  number: number,
  size: number,
  totalElements: number
}
