import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject, map } from 'rxjs';
import { Expense } from '../common/expense';
import { environment } from 'src/environments/environment';
import { ExpenseCategory } from '../common/expense-category';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  expenses: Subject<Expense[]> = new BehaviorSubject<Expense[]>([]);

  lastPageNumber: number = 1;
  lastPageSize: number = 20;

  constructor(private http: HttpClient) { }

  getExpenses(email: string, pageNumber: number, pageSize: number): Observable<ExpensesResponse> {
    const url = `${environment.apiUrl}/users/${email}/expenses?page=${pageNumber - 1}&size=${pageSize}`;
    this.lastPageNumber = pageNumber;
    this.lastPageSize = pageSize;

    const res = this.http.get<ExpensesResponse>(url);

    res.subscribe(
      data => this.expenses.next(data.content)
    );

    return res;
  }

  getExpensesByMonth(email: string, year: number, month: number, pageNumber: number, pageSize: number): Observable<ExpensesResponse> {
    const url = `${environment.apiUrl}/users/${email}/expenses?page=${pageNumber - 1}&size=${pageSize}&year=${year}&month=${month}`;
    this.lastPageNumber = pageNumber;
    this.lastPageSize = pageSize;

    const res = this.http.get<ExpensesResponse>(url);

    res.subscribe(
      data => this.expenses.next(data.content)
    );

    return res;
  }

  getExpense(email: string, expenseId: number): Observable<Expense> {
    const url = `${environment.apiUrl}/users/${email}/expenses/${expenseId}`;
    return this.http.get<Expense>(url);
  }

  addExpense(email: string, expense: Expense) {
    const url = `${environment.apiUrl}/users/${email}/expenses`;
    this.http.post(url, expense).subscribe(
      () => this.getExpenses(email, this.lastPageNumber, this.lastPageSize)
    );
  }

  updateExpense(email: string, expenseId: number, expense: Expense) {
    const url = `${environment.apiUrl}/users/${email}/expenses/${expenseId}`;
    this.http.put(url, expense).subscribe(
      () => this.getExpenses(email, this.lastPageNumber, this.lastPageSize)
    );
  }

  deleteExpense(email: string, expenseId: number) {
    const url = `${environment.apiUrl}/users/${email}/expenses/${expenseId}`;
    this.http.delete(url).subscribe(
      () => this.getExpenses(email, this.lastPageNumber, this.lastPageSize)
    );
  }

  search(email: string, keyword: string, pageNumber: number, pageSize: number): Observable<ExpensesResponse> {
    const url = `${environment.apiUrl}/users/${email}/expenses/search?q=${keyword}`;
    
    const res = this.http.get<ExpensesResponse>(url);
    res.subscribe(data => this.expenses.next(data.content));
    return res;
  }

  getCategories(email: string): Observable<ExpenseCategory[]> {
    const url = `${environment.apiUrl}/users/${email}/expenses/categories`;
    return this.http.get<ExpenseCategory[]>(url);
  }

  createCategory(email: string, category: ExpenseCategory): Observable<any> {
    const url = `${environment.apiUrl}/users/${email}/expenses/categories`;
    return this.http.post(url, category);
  }
}

interface ExpensesResponse {
  content: Expense[],
  number: number,
  size: number,
  totalElements: number
}
