package com.portfolio.backend.service;

import com.portfolio.backend.entity.Project;
import com.portfolio.backend.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;

    public List<Project> getAllProjects() {
        return projectRepository.findAllByOrderBySortOrderAsc();
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Proje bulunamadı: " + id));
    }

    public Project createProject(Project project) {
        return projectRepository.save(project);
    }

    public Project updateProject(Long id, Project projectDetails) {
        Project project = getProjectById(id);
        project.setTitle(projectDetails.getTitle());
        project.setDescription(projectDetails.getDescription());
        project.setTechnologies(projectDetails.getTechnologies());
        project.setGithubUrl(projectDetails.getGithubUrl());
        project.setLiveUrl(projectDetails.getLiveUrl());
        project.setImageUrl(projectDetails.getImageUrl());
        return projectRepository.save(project);
    }

    public void deleteProject(Long id) {
        Project project = getProjectById(id);
        projectRepository.delete(project);
    }

    @Transactional
    public void updateOrder(List<Long> ids) {
        for (int i = 0; i < ids.size(); i++) {
            Project project = projectRepository.findById(ids.get(i)).orElse(null);
            if (project != null) {
                project.setSortOrder(i);
                projectRepository.save(project);
            }
        }
    }
}