package com.portfolio.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LanguageRequest {

    @NotBlank(message = "Dil adı boş olamaz")
    private String name;

    @NotBlank(message = "Seviye boş olamaz")
    private String level;
}