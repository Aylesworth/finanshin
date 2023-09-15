package io.github.aylesw.finanshin.repository;

import io.github.aylesw.finanshin.entity.ExpenseCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExpenseCategoryRepository extends JpaRepository<ExpenseCategory, Long> {
    Optional<ExpenseCategory> findByName(String name);

    List<ExpenseCategory> findByUserEmail(String userEmail);

    @Modifying
    @Transactional
    @Query("UPDATE ExpenseCategory c SET c.weight = c.weight * ?2 WHERE c.userEmail = ?1")
    void updateWeightsByRatio(String userEmail, double ratio);
}
