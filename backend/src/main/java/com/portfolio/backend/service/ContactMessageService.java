package com.portfolio.backend.service;

import com.portfolio.backend.dto.ContactMessageRequest;
import com.portfolio.backend.entity.ContactMessage;
import com.portfolio.backend.repository.ContactMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ContactMessageService {

    private final ContactMessageRepository repository;

    public void processMessage(ContactMessageRequest request, String ipAddress) {
        // 24 saatlik IP (Spam) kontrolü
        LocalDateTime twentyFourHoursAgo = LocalDateTime.now().minusHours(24);
        if (repository.existsByIpAddressAndCreatedAtAfter(ipAddress, twentyFourHoursAgo)) {
            throw new RuntimeException("RATE_LIMIT_EXCEEDED");
        }

        // Sadece Veritabanına Kaydet (E-Posta atma işlemi Frontend'de EmailJS'e devredildi)
        ContactMessage contactMessage = ContactMessage.builder()
                .name(request.getName())
                .email(request.getEmail())
                .message(request.getMessage())
                .ipAddress(ipAddress)
                .build();

        repository.save(contactMessage);
    }
}