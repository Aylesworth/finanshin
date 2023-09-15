package io.github.aylesw.finanshin.service.impl;

import io.github.aylesw.finanshin.entity.Expense;
import io.github.aylesw.finanshin.entity.ExpenseCategory;
import io.github.aylesw.finanshin.exception.ResourceNotFoundException;
import io.github.aylesw.finanshin.exception.UnauthorizedResourceAccessException;
import io.github.aylesw.finanshin.repository.ExpenseCategoryRepository;
import io.github.aylesw.finanshin.repository.ExpenseRepository;
import io.github.aylesw.finanshin.service.ExpenseService;
import io.github.aylesw.finanshin.util.Utils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final ExpenseCategoryRepository expenseCategoryRepository;

    private static final List<ExpenseCategory> defaultCategories = List.of(
            ExpenseCategory.builder().name("Necessities").weight(0.55).build(),
            ExpenseCategory.builder().name("Long-term Savings").weight(0.10).build(),
            ExpenseCategory.builder().name("Play").weight(0.10).build(),
            ExpenseCategory.builder().name("Education").weight(0.10).build(),
            ExpenseCategory.builder().name("Financial Freedom").weight(0.10).build(),
            ExpenseCategory.builder().name("Give").weight(0.05).build()
    );

    @Override
    public Page<Expense> getExpenses(String userEmail, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("date").descending());
        return expenseRepository.findByUserEmail(userEmail, pageable);
    }

    @Override
    public Page<Expense> getExpensesByMonth(String userEmail, int year, int month, int page, int size) {
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate fromDate = yearMonth.atDay(1);
        LocalDate toDate = yearMonth.atEndOfMonth();

        Pageable pageable = PageRequest.of(page, size, Sort.by("date").descending());
        return expenseRepository.findByUserEmailInRange(userEmail, fromDate, toDate, pageable);
    }

    @Override
    public Page<Expense> search(String userEmail, String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("date").descending());
        keyword = Utils.normalizeString(keyword);
        return expenseRepository.findByUserEmailWithDescriptionContaining(userEmail, keyword, pageable);
    }

    @Override
    public Expense getExpense(String userEmail, Long expenseId) {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new ResourceNotFoundException(Expense.class, expenseId));

        if (!userEmail.equals(expense.getUserEmail())) {
            throw new UnauthorizedResourceAccessException();
        }

        return expense;
    }

    @Override
    public Expense addExpense(String userEmail, Expense expense) {
        ExpenseCategory category = expenseCategoryRepository.findByName(expense.getCategory().getName())
                .orElseGet(() -> {
                    ExpenseCategory newCategory = expense.getCategory();
                    newCategory.setUserEmail(userEmail);
                    return createCategory(userEmail, newCategory);
                });

        expense.setId(null);
        expense.setUserEmail(userEmail);
        expense.setCategory(category);
        return expenseRepository.save(expense);
    }

    @Override
    public Expense updateExpense(String userEmail, Long expenseId, Expense expense) {
        Expense existingExpense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new ResourceNotFoundException(Expense.class, expenseId));

        if (!userEmail.equals(existingExpense.getUserEmail())) {
            throw new UnauthorizedResourceAccessException();
        }

        existingExpense.setAmount(expense.getAmount());
        existingExpense.setDescription(expense.getDescription());
        existingExpense.setDate(expense.getDate());

        String oldCategoryName = existingExpense.getCategory().getName();
        String newCategoryName = expense.getCategory().getName();

        if (!newCategoryName.equals(oldCategoryName)) {
            ExpenseCategory category = expenseCategoryRepository.findByName(newCategoryName)
                    .orElseGet(() -> {
                        ExpenseCategory newCategory = expense.getCategory();
                        newCategory.setUserEmail(userEmail);
                        return createCategory(userEmail, newCategory);
                    });
            existingExpense.setCategory(category);

            if (expenseRepository.countByUserEmailAndCategoryName(userEmail, oldCategoryName) == 1
                    && defaultCategories.stream().noneMatch(c -> c.getName().equals(oldCategoryName))) {
                
                deleteCategory(userEmail, oldCategoryName);
            }
        }

        return expenseRepository.save(existingExpense);
    }

    @Override
    public Expense deleteExpense(String userEmail, Long expenseId) {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new ResourceNotFoundException(Expense.class, expenseId));

        if (!userEmail.equals(expense.getUserEmail())) {
            throw new UnauthorizedResourceAccessException();
        }

        expenseRepository.delete(expense);

        String categoryName = expense.getCategory().getName();
        if (expenseRepository.countByUserEmailAndCategoryName(userEmail, categoryName) == 0
                && defaultCategories.stream().noneMatch(category -> category.getName().equals(categoryName))) {

            deleteCategory(userEmail, categoryName);
        }

        return expense;
    }

    @Override
    public List<ExpenseCategory> getCategories(String userEmail) {
        List<ExpenseCategory> categories = expenseCategoryRepository.findByUserEmail(userEmail);

        if (categories.isEmpty()) {
            categories = defaultCategories.stream().peek(category -> category.setUserEmail(userEmail)).toList();

            expenseCategoryRepository.saveAll(categories);
            categories = expenseCategoryRepository.findByUserEmail(userEmail);
        }

        return categories;
    }

    @Override
    public ExpenseCategory createCategory(String userEmail, ExpenseCategory category) {
        double ratio = 1 - category.getWeight();
        expenseCategoryRepository.updateWeightsByRatio(userEmail, ratio);

        category.setUserEmail(userEmail);
        return expenseCategoryRepository.save(category);
    }

    @Override
    public ExpenseCategory deleteCategory(String userEmail, String categoryName) {
        ExpenseCategory category = expenseCategoryRepository.findByName(categoryName)
                .orElseThrow(() -> new ResourceNotFoundException(ExpenseCategory.class, "name", categoryName));

        double ratio = 1 / (1 - category.getWeight());

        expenseCategoryRepository.delete(category);
        expenseCategoryRepository.updateWeightsByRatio(userEmail, ratio);

        return category;
    }
}
