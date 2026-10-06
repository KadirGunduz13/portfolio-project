package com.portfolio.backend.service;

import com.portfolio.backend.entity.VolunteerActivity;
import com.portfolio.backend.repository.VolunteerActivityRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VolunteerActivityService {

    private final VolunteerActivityRepository volunteerActivityRepository;

    public List<VolunteerActivity> getAllActivities() {
        return volunteerActivityRepository.findAllByOrderBySortOrderAsc();
    }

    public VolunteerActivity createActivity(VolunteerActivity activity) {
        long count = volunteerActivityRepository.count();
        activity.setSortOrder((int) count);
        return volunteerActivityRepository.save(activity);
    }

    public VolunteerActivity updateActivity(Long id, VolunteerActivity details) {
        VolunteerActivity activity = volunteerActivityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Faaliyet bulunamadı: " + id));
        activity.setOrganization(details.getOrganization());
        activity.setRole(details.getRole());
        activity.setStartDate(details.getStartDate());
        activity.setEndDate(details.getEndDate());
        activity.setDescription(details.getDescription());
        return volunteerActivityRepository.save(activity);
    }

    public void deleteActivity(Long id) {
        volunteerActivityRepository.deleteById(id);
    }

    @Transactional
    public void updateOrder(List<Long> activityIds) {
        for (int i = 0; i < activityIds.size(); i++) {
            Long id = activityIds.get(i);
            VolunteerActivity activity = volunteerActivityRepository.findById(id).orElse(null);
            if (activity != null) {
                activity.setSortOrder(i);
                volunteerActivityRepository.save(activity);
            }
        }
    }
}