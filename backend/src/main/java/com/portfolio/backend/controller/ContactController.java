package com.portfolio.backend.controller;

import com.portfolio.backend.dto.ContactMessageRequest;
import com.portfolio.backend.service.ContactMessageService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ContactController {

    private final ContactMessageService contactMessageService;

    @PostMapping
    public ResponseEntity<?> sendMessage(@Valid @RequestBody ContactMessageRequest request, HttpServletRequest httpRequest) {
        try {
            String clientIp = httpRequest.getRemoteAddr();

            contactMessageService.processMessage(request, clientIp);

            return ResponseEntity.status(HttpStatus.CREATED).body("Mesaj başarıyla gönderildi.");

        } catch (RuntimeException e) {
            if (e.getMessage().equals("RATE_LIMIT_EXCEEDED")) {
                return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body("LIMIT");
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Sunucu hatası.");
        }
    }
}