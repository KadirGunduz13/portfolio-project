package com.portfolio.backend.controller;

import com.portfolio.backend.dto.LanguageRequest;
import com.portfolio.backend.entity.Language;
import com.portfolio.backend.service.LanguageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/languages")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class LanguageController {

    private final LanguageService service;

    @GetMapping
    public ResponseEntity<List<Language>> getAllLanguages() {
        return ResponseEntity.ok(service.getAllLanguages());
    }

    @PostMapping
    public ResponseEntity<Language> addLanguage(@Valid @RequestBody LanguageRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.addLanguage(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Language> updateLanguage(@PathVariable Long id, @Valid @RequestBody LanguageRequest request) {
        return ResponseEntity.ok(service.updateLanguage(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLanguage(@PathVariable Long id) {
        service.deleteLanguage(id);
        return ResponseEntity.noContent().build();
    }
}