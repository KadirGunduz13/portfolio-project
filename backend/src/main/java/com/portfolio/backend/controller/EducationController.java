package com.portfolio.backend.controller;

import com.portfolio.backend.entity.Education;
import com.portfolio.backend.service.EducationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/educations")
@RequiredArgsConstructor
public class EducationController {

    private final EducationService educationService;

    @GetMapping
    public ResponseEntity<List<Education>> getAll() {
        return ResponseEntity.ok(educationService.getAllEducations());
    }

    @PostMapping
    public ResponseEntity<Education> create(@RequestBody Education education) {
        return ResponseEntity.ok(educationService.createEducation(education));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Education> update(@PathVariable Long id, @RequestBody Education education) {
        return ResponseEntity.ok(educationService.updateEducation(id, education));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        educationService.deleteEducation(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/update-order")
    public ResponseEntity<Void> updateOrder(@RequestBody List<Long> orderedIds) {
        educationService.updateOrder(orderedIds);
        return ResponseEntity.ok().build();
    }
}