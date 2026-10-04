package com.portfolio.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SkillRequest {

    @NotBlank(message = "Yetenek adı boş olamaz")
    private String name;

    @NotBlank(message = "Seviye boş olamaz")
    private String level;
}