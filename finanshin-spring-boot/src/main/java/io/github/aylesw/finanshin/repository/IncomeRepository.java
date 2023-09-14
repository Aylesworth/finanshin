package io.github.aylesw.finanshin.repository;

import io.github.aylesw.finanshin.entity.Income;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface IncomeRepository extends JpaRepository<Income, Long> {
    Page<Income> findByUserEmail(String userEmail, Pageable pageable);

    @Query("SELECT i FROM Income i WHERE i.userEmail = ?1 AND i.date BETWEEN ?2 AND ?3")
    Page<Income> findByUserEmailInRange(String userEmail, LocalDate fromDate, LocalDate toDate, Pageable pageable);
}
