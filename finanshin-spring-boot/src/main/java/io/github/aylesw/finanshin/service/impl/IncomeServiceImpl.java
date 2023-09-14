package io.github.aylesw.finanshin.service.impl;

import io.github.aylesw.finanshin.entity.Income;
import io.github.aylesw.finanshin.exception.ResourceNotFoundException;
import io.github.aylesw.finanshin.exception.UnauthorizedResourceAccessException;
import io.github.aylesw.finanshin.repository.IncomeRepository;
import io.github.aylesw.finanshin.service.IncomeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;

@Service
@RequiredArgsConstructor
public class IncomeServiceImpl implements IncomeService {
    private final IncomeRepository incomeRepository;

    @Override
    public Page<Income> getIncomes(String userEmail, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("date").descending());
        return incomeRepository.findByUserEmail(userEmail, pageable);
    }

    @Override
    public Page<Income> getIncomesByMonth(String userEmail, int year, int month, int page, int size) {
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate fromDate = yearMonth.atDay(1);
        LocalDate toDate = yearMonth.atEndOfMonth();

        Pageable pageable = PageRequest.of(page, size, Sort.by("date").descending());
        return incomeRepository.findByUserEmailInRange(userEmail, fromDate, toDate, pageable);
    }

    @Override
    public Income getIncome(String userEmail, Long incomeId) {
        Income income = incomeRepository.findById(incomeId)
                .orElseThrow(() -> new ResourceNotFoundException(Income.class, incomeId));

        if (!userEmail.equals(income.getUserEmail())) {
            throw new UnauthorizedResourceAccessException();
        }

        return income;
    }

    @Override
    public Income addIncome(String userEmail, Income income) {
        income.setId(null);
        income.setUserEmail(userEmail);
        return incomeRepository.save(income);
    }

    @Override
    public Income updateIncome(String userEmail, Long incomeId, Income income) {
        Income existingIncome = incomeRepository.findById(incomeId)
                .orElseThrow(() -> new ResourceNotFoundException(Income.class, incomeId));

        if (!userEmail.equals(existingIncome.getUserEmail())) {
            throw new UnauthorizedResourceAccessException();
        }

        existingIncome.setAmount(income.getAmount());
        existingIncome.setDescription(income.getDescription());
        existingIncome.setDate(income.getDate());
        return incomeRepository.save(existingIncome);
    }

    @Override
    public Income deleteIncome(String userEmail, Long incomeId) {
        Income income = incomeRepository.findById(incomeId)
                .orElseThrow(() -> new ResourceNotFoundException(Income.class, incomeId));

        if (!userEmail.equals(income.getUserEmail())) {
            throw new UnauthorizedResourceAccessException();
        }

        incomeRepository.delete(income);
        return income;
    }
}
