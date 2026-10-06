package com.portfolio.backend.service;

import com.portfolio.backend.dto.SkillRequest;
import com.portfolio.backend.entity.Skill;
import com.portfolio.backend.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SkillService {

    private final SkillRepository repository;

    public List<Skill> getAllSkills() {
        return repository.findAllByOrderBySortOrderAsc();
    }

    public Skill addSkill(SkillRequest request) {
        Skill skill = Skill.builder()
                .name(request.getName())
                .level(request.getLevel())
                .build();
        return repository.save(skill);
    }

    public Skill updateSkill(Long id, SkillRequest request) {
        Skill skill = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Yetenek bulunamadı: " + id));
        skill.setName(request.getName());
        skill.setLevel(request.getLevel());
        return repository.save(skill);
    }

    public void deleteSkill(Long id) {
        repository.deleteById(id);
    }

    @org.springframework.transaction.annotation.Transactional
    public void updateOrder(List<Long> ids) {
        for (int i = 0; i < ids.size(); i++) {
            Skill skill = repository.findById(ids.get(i)).orElse(null);
            if (skill != null) {
                skill.setSortOrder(i);
                repository.save(skill);
            }
        }
    }
}