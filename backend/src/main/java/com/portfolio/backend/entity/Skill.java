package com.portfolio.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "skills")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // Örn: Java, React, Docker

    private String category; // Örn: "Backend", "Frontend", "DevOps", "Database"
    private Integer proficiency; // Seviye yüzdesi: Örn: 85
}