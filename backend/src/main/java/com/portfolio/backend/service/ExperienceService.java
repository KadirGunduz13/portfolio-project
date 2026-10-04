package com.portfolio.backend.service;

import com.portfolio.backend.entity.Experience;
import com.portfolio.backend.repository.ExperienceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExperienceService {

    private final ExperienceRepository experienceRepository;

    public List<Experience> getAllExperiences() {
        return experienceRepository.findAllByOrderBySortOrderAsc();
    }

    public Experience createExperience(Experience experience) {
        return experienceRepository.save(experience);
    }

    public Experience updateExperience(Long id, Experience details) {
        Experience experience = experienceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Deneyim bulunamadı: " + id));
        experience.setCompany(details.getCompany());
        experience.setRole(details.getRole());
        experience.setLocation(details.getLocation());
        experience.setStartDate(details.getStartDate());
        experience.setEndDate(details.getEndDate());
        experience.setDescription(details.getDescription());
        return experienceRepository.save(experience);
    }

    public void deleteExperience(Long id) {
        experienceRepository.deleteById(id);
    }

    @Transactional
    public void updateOrder(List<Long> ids) {
        for (int i = 0; i < ids.size(); i++) {
            Experience exp = experienceRepository.findById(ids.get(i)).orElse(null);
            if (exp != null) {
                exp.setSortOrder(i);
                experienceRepository.save(exp);
            }
        }
    }
}