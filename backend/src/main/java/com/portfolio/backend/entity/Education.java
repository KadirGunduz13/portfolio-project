package com.portfolio.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "educations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Education {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String institution; // Okul Adı

    @Column(nullable = false)
    private String degree;      // Örn: Lisans

    private String fieldOfStudy; // Bölüm
    private String startDate;
    private String endDate;
    private String gpa;
}