package com.portfolio.backend.service;

import com.portfolio.backend.dto.LanguageRequest;
import com.portfolio.backend.entity.Language;
import com.portfolio.backend.repository.LanguageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LanguageService {

    private final LanguageRepository repository;

    public List<Language> getAllLanguages() {
        return repository.findAllByOrderBySortOrderAsc();
    }

    public Language addLanguage(LanguageRequest request) {
        Language language = Language.builder()
                .name(request.getName())
                .level(request.getLevel())
                .build();
        return repository.save(language);
    }

    public Language updateLanguage(Long id, LanguageRequest request) {
        Language language = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dil bulunamadı: " + id));
        language.setName(request.getName());
        language.setLevel(request.getLevel());
        return repository.save(language);
    }

    public void deleteLanguage(Long id) {
        repository.deleteById(id);
    }

    @org.springframework.transaction.annotation.Transactional
    public void updateOrder(List<Long> ids) {
        for (int i = 0; i < ids.size(); i++) {
            Language lang = repository.findById(ids.get(i)).orElse(null);
            if (lang != null) {
                lang.setSortOrder(i);
                repository.save(lang);
            }
        }
    }
}