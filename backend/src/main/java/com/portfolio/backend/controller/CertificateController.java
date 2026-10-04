package com.portfolio.backend.controller;

import com.portfolio.backend.entity.Certificate;
import com.portfolio.backend.service.CertificateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/certificates")
@RequiredArgsConstructor
public class CertificateController {

    private final CertificateService certificateService;

    @GetMapping
    public ResponseEntity<List<Certificate>> getAll() {
        return ResponseEntity.ok(certificateService.getAllCertificates());
    }

    @PostMapping
    public ResponseEntity<Certificate> create(@RequestBody Certificate certificate) {
        return ResponseEntity.ok(certificateService.createCertificate(certificate));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Certificate> update(@PathVariable Long id, @RequestBody Certificate certificate) {
        return ResponseEntity.ok(certificateService.updateCertificate(id, certificate));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        certificateService.deleteCertificate(id);
        return ResponseEntity.noContent().build();
    }
}