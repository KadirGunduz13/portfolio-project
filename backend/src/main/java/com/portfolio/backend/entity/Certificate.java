package com.portfolio.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "certificates")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Certificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String issuer; // Veren Kurum

    private String issueDate;

    // Karakter sınırını kaldırdığımız alanlar:
    @Column(columnDefinition = "TEXT")
    private String credentialUrl;

    @Column(columnDefinition = "TEXT")
    private String imageUrl; // Cloudinary'ye yüklenecek sertifika görseli
}