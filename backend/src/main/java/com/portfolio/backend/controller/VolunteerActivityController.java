package com.portfolio.backend.controller;

import com.portfolio.backend.entity.VolunteerActivity;
import com.portfolio.backend.service.VolunteerActivityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/volunteer-activities")
@RequiredArgsConstructor
public class VolunteerActivityController {

    private final VolunteerActivityService volunteerActivityService;

    @GetMapping
    public ResponseEntity<List<VolunteerActivity>> getAll() {
        return ResponseEntity.ok(volunteerActivityService.getAllActivities());
    }

    @PostMapping
    public ResponseEntity<VolunteerActivity> create(@RequestBody VolunteerActivity activity) {
        return ResponseEntity.ok(volunteerActivityService.createActivity(activity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<VolunteerActivity> update(@PathVariable Long id, @RequestBody VolunteerActivity activity) {
        return ResponseEntity.ok(volunteerActivityService.updateActivity(id, activity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        volunteerActivityService.deleteActivity(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/update-order")
    public ResponseEntity<Void> updateOrder(@RequestBody List<Long> activityIds) {
        volunteerActivityService.updateOrder(activityIds);
        return ResponseEntity.ok().build();
    }
}