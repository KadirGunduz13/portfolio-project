package com.portfolio.backend.controller;

import com.portfolio.backend.entity.About;
import com.portfolio.backend.service.AboutService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/about")
@RequiredArgsConstructor
public class AboutController {

    private final AboutService aboutService;

    @GetMapping
    public ResponseEntity<About> getAbout() {
        return ResponseEntity.ok(aboutService.getAbout());
    }

    @PutMapping
    public ResponseEntity<About> updateAbout(@RequestBody About about) {
        return ResponseEntity.ok(aboutService.updateAbout(about));
    }
}