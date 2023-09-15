package io.github.aylesw.finanshin.repository;

import io.github.aylesw.finanshin.entity.Expense;
import io.github.aylesw.finanshin.entity.Income;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    Page<Expense> findByUserEmail(String userEmail, Pageable pageable);

    @Query("SELECT e FROM Expense e WHERE e.userEmail = ?1 AND e.date BETWEEN ?2 AND ?3")
    Page<Expense> findByUserEmailInRange(String userEmail, LocalDate fromDate, LocalDate toDate, Pageable pageable);

    @Query("SELECT e FROM Expense e WHERE e.userEmail = ?1 AND e.description LIKE %?2%")
    Page<Expense> findByUserEmailWithDescriptionContaining(String userEmail, String keyword, Pageable pageable);

    long countByUserEmailAndCategoryName(String userEmail, String categoryName);
}
