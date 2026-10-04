package com.portfolio.backend.controller;

import com.portfolio.backend.dto.SkillRequest;
import com.portfolio.backend.entity.Skill;
import com.portfolio.backend.service.SkillService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SkillController {

    private final SkillService service;

    @GetMapping
    public ResponseEntity<List<Skill>> getAllSkills() {
        return ResponseEntity.ok(service.getAllSkills());
    }

    @PostMapping
    public ResponseEntity<Skill> addSkill(@Valid @RequestBody SkillRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.addSkill(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Skill> updateSkill(@PathVariable Long id, @Valid @RequestBody SkillRequest request) {
        return ResponseEntity.ok(service.updateSkill(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSkill(@PathVariable Long id) {
        service.deleteSkill(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/reorder")
    public ResponseEntity<Void> updateOrder(@RequestBody List<Long> orderedIds) {
        service.updateOrder(orderedIds);
        return ResponseEntity.ok().build();
    }
}