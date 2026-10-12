package com.portfolio.backend.repository;

import com.portfolio.backend.entity.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {

    // IP yerine kullanıcının formda girdiği e-posta adresine göre kontrol sağlayan metot
    boolean existsByEmailAndCreatedAtAfter(String email, LocalDateTime date);
}