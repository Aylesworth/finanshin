package io.github.aylesw.finanshin.service;

import io.github.aylesw.finanshin.entity.Income;
import org.springframework.data.domain.Page;

public interface IncomeService {

    Page<Income> getIncomes(String userEmail, int page, int size);

    Page<Income> getIncomesByMonth(String userEmail, int year, int month, int page, int size);

    Page<Income> search(String userEmail, String keyword, int page, int size);

    Income getIncome(String userEmail, Long incomeId);

    Income addIncome(String userEmail, Income income);

    Income updateIncome(String userEmail, Long incomeId, Income income);

    Income deleteIncome(String userEmail, Long incomeId);

}
