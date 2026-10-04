package com.portfolio.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "languages")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Language {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // Örn: Türkçe, İngilizce

    @Column(nullable = false)
    private String level; // Örn: Anadil, B2, C1

    @Column(name = "sort_order")
    private Integer sortOrder = 0;
}