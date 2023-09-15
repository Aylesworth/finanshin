package io.github.aylesw.finanshin.service;

import io.github.aylesw.finanshin.entity.Expense;
import io.github.aylesw.finanshin.entity.ExpenseCategory;
import io.github.aylesw.finanshin.entity.Income;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ExpenseService {
    Page<Expense> getExpenses(String userEmail, int page, int size);

    Page<Expense> getExpensesByMonth(String userEmail, int year, int month, int page, int size);

    Page<Expense> search(String userEmail, String keyword, int page, int size);

    Expense getExpense(String userEmail, Long expenseId);

    Expense addExpense(String userEmail, Expense expense);

    Expense updateExpense(String userEmail, Long expenseId, Expense expense);

    Expense deleteExpense(String userEmail, Long expenseId);

    List<ExpenseCategory> getCategories(String userEmail);

    ExpenseCategory createCategory(String userEmail, ExpenseCategory category);

    ExpenseCategory deleteCategory(String userEmail, String categoryName);
}
