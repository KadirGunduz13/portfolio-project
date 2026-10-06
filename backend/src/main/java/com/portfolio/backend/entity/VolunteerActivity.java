package com.portfolio.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "volunteer_activities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VolunteerActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String organization;

    @Column(nullable = false)
    private String role;

    private String startDate;
    private String endDate;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "sort_order")
    private Integer sortOrder;

    @ElementCollection
    @CollectionTable(name = "volunteer_images", joinColumns = @JoinColumn(name = "activity_id"))
    @Column(name = "image_base64", columnDefinition = "TEXT")
    private List<String> images;
}