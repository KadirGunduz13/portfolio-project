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
            // GERÇEK IP'Yİ BULAN YENİ YARDIMCI METODU ÇAĞIRIYORUZ
            String clientIp = extractRealIp(httpRequest);

            contactMessageService.processMessage(request, clientIp);

            return ResponseEntity.status(HttpStatus.CREATED).body("Mesaj başarıyla gönderildi.");

        } catch (RuntimeException e) {
            if (e.getMessage().equals("RATE_LIMIT_EXCEEDED")) {
                return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body("LIMIT");
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Sunucu hatası.");
        }
    }

    // RENDER'IN TAMPON SUNUCUSUNU AŞIP GERÇEK KULLANICI IP'SİNİ YAKALAYAN METOT
    private String extractRealIp(HttpServletRequest request) {
        String forwardedFor = request.getHeader("X-Forwarded-For");

        // Eğer istek bir proxy (Render) üzerinden gelmişse, gerçek IP bu başlığın içindedir
        if (forwardedFor != null && !forwardedFor.isEmpty()) {
            // Birden fazla yönlendirme varsa ilk IP her zaman asıl kullanıcıdır
            return forwardedFor.split(",")[0].trim();
        }

        // Eğer yerelde (localhost) çalışıyorsa standart metodu kullan
        return request.getRemoteAddr();
    }
}