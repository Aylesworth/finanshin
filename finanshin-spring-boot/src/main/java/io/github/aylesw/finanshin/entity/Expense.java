package io.github.aylesw.finanshin.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "expense")
@Data
public class Expense {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userEmail;

    private Double amount;

    private String description;

    private LocalDate date;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private ExpenseCategory category;
}
