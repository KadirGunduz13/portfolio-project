package com.portfolio.backend.service;

import com.portfolio.backend.dto.ContactMessageRequest;
import com.portfolio.backend.entity.ContactMessage;
import com.portfolio.backend.repository.ContactMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ContactMessageService {

    private final ContactMessageRepository repository;
    private final JavaMailSender mailSender;

    public void processMessage(ContactMessageRequest request, String ipAddress) {

        // 1. 24 SAAT KURALI KONTROLÜ
        LocalDateTime twentyFourHoursAgo = LocalDateTime.now().minusHours(24);
        if (repository.existsByIpAddressAndCreatedAtAfter(ipAddress, twentyFourHoursAgo)) {
            throw new RuntimeException("RATE_LIMIT_EXCEEDED"); // Custom Exception fırlatıyoruz
        }

        // 2. VERİTABANINA KAYDET
        ContactMessage contactMessage = ContactMessage.builder()
                .name(request.getName())
                .email(request.getEmail())
                .message(request.getMessage())
                .ipAddress(ipAddress)
                .build();
        repository.save(contactMessage);

        // 3. E-POSTA GÖNDER (Kendi e-postana bildirim at)
        sendEmailNotification(contactMessage);
    }

    private void sendEmailNotification(ContactMessage message) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo("kdrgndz203@gmail.com"); // E-postanın kime gideceği
        mailMessage.setSubject("Portfolyodan Yeni Mesaj: " + message.getName());
        mailMessage.setText(
                "Gönderen: " + message.getName() + "\n" +
                        "E-Posta: " + message.getEmail() + "\n\n" +
                        "Mesaj İçeriği:\n" + message.getMessage()
        );

        mailSender.send(mailMessage);
    }
}