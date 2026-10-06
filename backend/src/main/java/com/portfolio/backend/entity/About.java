package com.portfolio.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "about")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class About {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;
    private String title;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private String avatarUrl;
    private String cvUrl;

    private String email;
    private String phone;
    private String location;
    private String githubUrl;
    private String linkedinUrl;
}