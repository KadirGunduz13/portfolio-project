package com.portfolio.backend.service;

import com.portfolio.backend.entity.Certificate;
import com.portfolio.backend.repository.CertificateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CertificateService {

    private final CertificateRepository certificateRepository;

    public List<Certificate> getAllCertificates() {
        return certificateRepository.findAll();
    }

    public Certificate createCertificate(Certificate certificate) {
        return certificateRepository.save(certificate);
    }

    public Certificate updateCertificate(Long id, Certificate details) {
        Certificate certificate = certificateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sertifika bulunamadı: " + id));
        certificate.setTitle(details.getTitle());
        certificate.setIssuer(details.getIssuer());
        certificate.setIssueDate(details.getIssueDate());
        certificate.setCredentialUrl(details.getCredentialUrl());
        certificate.setImageUrl(details.getImageUrl());
        return certificateRepository.save(certificate);
    }

    public void deleteCertificate(Long id) {
        certificateRepository.deleteById(id);
    }
}