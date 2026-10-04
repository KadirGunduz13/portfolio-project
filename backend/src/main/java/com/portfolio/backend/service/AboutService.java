package com.portfolio.backend.service;

import com.portfolio.backend.entity.About;
import com.portfolio.backend.repository.AboutRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AboutService {

    private final AboutRepository aboutRepository;

    public About getAbout() {
        return aboutRepository.findAll().stream().findFirst().orElse(null);
    }

    public About updateAbout(About aboutDetails) {
        About existing = aboutRepository.findAll().stream().findFirst().orElse(null);

        if (existing != null) {
            existing.setFullName(aboutDetails.getFullName());
            existing.setTitle(aboutDetails.getTitle());
            existing.setBio(aboutDetails.getBio());
            existing.setAvatarUrl(aboutDetails.getAvatarUrl());
            existing.setCvUrl(aboutDetails.getCvUrl());
            existing.setEmail(aboutDetails.getEmail());
            existing.setPhone(aboutDetails.getPhone());
            existing.setLocation(aboutDetails.getLocation());
            existing.setGithubUrl(aboutDetails.getGithubUrl());
            existing.setLinkedinUrl(aboutDetails.getLinkedinUrl());
            return aboutRepository.save(existing);
        } else {
            return aboutRepository.save(aboutDetails);
        }
    }
}