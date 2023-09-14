package io.github.aylesw.finanshin.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "expense_category")
@Data
public class ExpenseCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private Double weight;

    private String userEmail;
}
