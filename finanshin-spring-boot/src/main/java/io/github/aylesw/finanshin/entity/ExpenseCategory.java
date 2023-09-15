package io.github.aylesw.finanshin.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "expense_category")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpenseCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private Double weight;

    private String userEmail;
}
