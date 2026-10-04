package com.portfolio.backend.service;

import com.portfolio.backend.entity.Education;
import com.portfolio.backend.repository.EducationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EducationService {

    private final EducationRepository educationRepository;

    public List<Education> getAllEducations() {
        return educationRepository.findAll();
    }

    public Education createEducation(Education education) {
        return educationRepository.save(education);
    }

    public Education updateEducation(Long id, Education details) {
        Education education = educationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Eğitim bulunamadı: " + id));
        education.setInstitution(details.getInstitution());
        education.setDegree(details.getDegree());
        education.setFieldOfStudy(details.getFieldOfStudy());
        education.setStartDate(details.getStartDate());
        education.setEndDate(details.getEndDate());
        education.setGpa(details.getGpa());
        return educationRepository.save(education);
    }

    public void deleteEducation(Long id) {
        educationRepository.deleteById(id);
    }
}