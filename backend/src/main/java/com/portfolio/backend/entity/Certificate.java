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
    private String credentialUrl;
    private String imageUrl; // Cloudinary'ye yüklenecek sertifika görseli
}