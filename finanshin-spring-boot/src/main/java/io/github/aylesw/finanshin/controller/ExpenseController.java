package io.github.aylesw.finanshin.controller;

import io.github.aylesw.finanshin.entity.Expense;
import io.github.aylesw.finanshin.entity.ExpenseCategory;
import io.github.aylesw.finanshin.entity.Income;
import io.github.aylesw.finanshin.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.DateTimeException;
import java.time.YearMonth;
import java.util.List;

import static io.github.aylesw.finanshin.config.AppConstants.DEFAULT_PAGE;
import static io.github.aylesw.finanshin.config.AppConstants.DEFAULT_SIZE;

@RestController
@RequestMapping(path = "", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ExpenseController {

    private final ExpenseService expenseService;

    @GetMapping("/users/{userEmail}/expenses")
    public ResponseEntity<Page<Expense>> getExpenses(
            @PathVariable("userEmail") String userEmail,
            @RequestParam(value = "page", defaultValue = DEFAULT_PAGE, required = false) int page,
            @RequestParam(value = "size", defaultValue = DEFAULT_SIZE, required = false) int size,
            @RequestParam(value = "year", defaultValue = "0", required = false) int year,
            @RequestParam(value = "month", defaultValue = "0", required = false) int month
    ) {
        try {
            YearMonth.of(year, month);
            return ResponseEntity.ok(expenseService.getExpensesByMonth(userEmail, year, month, page, size));
        } catch (DateTimeException e) {
            return ResponseEntity.ok(expenseService.getExpenses(userEmail, page, size));
        }
    }

    @GetMapping("/users/{userEmail}/expenses/search")
    public ResponseEntity<Page<Expense>> search(
            @PathVariable("userEmail") String userEmail,
            @RequestParam("q") String keyword,
            @RequestParam(value = "page", defaultValue = DEFAULT_PAGE, required = false) int page,
            @RequestParam(value = "size", defaultValue = DEFAULT_SIZE, required = false) int size
    ) {
        return ResponseEntity.ok(expenseService.search(userEmail, keyword, page, size));
    }

    @GetMapping("/users/{userEmail}/expenses/{id}")
    public ResponseEntity<Expense> getExpense(
            @PathVariable("userEmail") String userEmail,
            @PathVariable("id") Long expenseId
    ) {
        return ResponseEntity.ok(expenseService.getExpense(userEmail, expenseId));
    }

    @PostMapping("/users/{userEmail}/expenses")
    public ResponseEntity<Expense> addExpense(
            @PathVariable("userEmail") String userEmail,
            @RequestBody Expense expense
    ) {
        return ResponseEntity.ok(expenseService.addExpense(userEmail, expense));
    }

    @PutMapping("/users/{userEmail}/expenses/{id}")
    public ResponseEntity<Expense> updateExpense(
            @PathVariable("userEmail") String userEmail,
            @PathVariable("id") Long expenseId,
            @RequestBody Expense expense
    ) {
        return ResponseEntity.ok(expenseService.updateExpense(userEmail, expenseId, expense));
    }

    @DeleteMapping("/users/{userEmail}/expenses/{id}")
    public ResponseEntity<Expense> deleteExpense(
            @PathVariable("userEmail") String userEmail,
            @PathVariable("id") Long expenseId
    ) {
        return ResponseEntity.ok(expenseService.deleteExpense(userEmail, expenseId));
    }

    @GetMapping("/users/{userEmail}/expenses/categories")
    public ResponseEntity<List<ExpenseCategory>> getCategories(@PathVariable String userEmail) {
        return ResponseEntity.ok(expenseService.getCategories(userEmail));
    }

    @PostMapping("/users/{userEmail}/expenses/categories")
    public ResponseEntity<ExpenseCategory> createCategory(
            @PathVariable String userEmail,
            @RequestBody ExpenseCategory category
    ) {
        return ResponseEntity.ok(expenseService.createCategory(userEmail, category));
    }

    @DeleteMapping("/users/{userEmail}/expenses/categories")
    public ResponseEntity<ExpenseCategory> deleteCategory(
            @PathVariable String userEmail,
            @RequestParam("name") String categoryName
    ) {
        return ResponseEntity.ok(expenseService.deleteCategory(userEmail, categoryName));
    }
}
