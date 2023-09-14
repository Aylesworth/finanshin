package io.github.aylesw.finanshin.controller;

import io.github.aylesw.finanshin.entity.Income;
import io.github.aylesw.finanshin.service.IncomeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.DateTimeException;
import java.time.YearMonth;

@RestController
@RequestMapping(path = "", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class IncomeController {

    private final IncomeService incomeService;

    @GetMapping("/users/{userEmail}/incomes")
    public ResponseEntity<Page<Income>> getIncomes(
            @PathVariable("userEmail") String userEmail,
            @RequestParam(value = "page", defaultValue = "0", required = false) int page,
            @RequestParam(value = "size", defaultValue = "20", required = false) int size,
            @RequestParam(value = "year", defaultValue = "0", required = false) int year,
            @RequestParam(value = "month", defaultValue = "0", required = false) int month
    ) {
        try {
            YearMonth.of(year, month);
            return ResponseEntity.ok(incomeService.getIncomesByMonth(userEmail, year, month, page, size));
        } catch (DateTimeException e) {
            return ResponseEntity.ok(incomeService.getIncomes(userEmail, page, size));
        }
    }

    @GetMapping("/users/{userEmail}/incomes/{id}")
    public ResponseEntity<Income> getIncome(
            @PathVariable("userEmail") String userEmail,
            @PathVariable("id") Long incomeId
    ) {
        return ResponseEntity.ok(incomeService.getIncome(userEmail, incomeId));
    }

    @PostMapping("/users/{userEmail}/incomes")
    public ResponseEntity<Income> addIncome(
            @PathVariable("userEmail") String userEmail,
            @RequestBody Income income
    ) {
        return ResponseEntity.ok(incomeService.addIncome(userEmail, income));
    }

    @PutMapping("/users/{userEmail}/incomes/{id}")
    public ResponseEntity<Income> updateIncome(
            @PathVariable("userEmail") String userEmail,
            @PathVariable("id") Long incomeId,
            @RequestBody Income income
    ) {
        return ResponseEntity.ok(incomeService.updateIncome(userEmail, incomeId, income));
    }

    @DeleteMapping("/users/{userEmail}/incomes/{id}")
    public ResponseEntity<Income> deleteIncome(
            @PathVariable("userEmail") String userEmail,
            @PathVariable("id") Long incomeId
    ) {
        return ResponseEntity.ok(incomeService.deleteIncome(userEmail, incomeId));
    }
}
