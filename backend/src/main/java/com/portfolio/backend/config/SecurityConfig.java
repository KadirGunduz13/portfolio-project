package com.portfolio.backend.config; // Kendi proje paket ismine göre burayı kontrol et

import com.portfolio.backend.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // JWT kullandığımız için CSRF korumasına ihtiyacımız yok
                .csrf(csrf -> csrf.disable())
                // Tarayıcıdaki React uygulamamızdan (localhost:5173) gelen isteklere izin verir
                .cors(Customizer.withDefaults())
                // Oturum (session) bilgilerini sunucuda tutmuyoruz (Stateless)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Login işlemine herkes erişebilir
                        .requestMatchers("/api/auth/**").permitAll()
                        // Spring Boot'un olası 404, 400 gibi hatalarını maskelemesini engeller
                        .requestMatchers("/error").permitAll()
                        // Tarayıcının CORS (Preflight - Ön Uçuş) denemelerine izin verir
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        // Frontend'in verileri (Hakkımda, Projeler) okuyabilmesi için tüm GET istekleri serbesttir
                        .requestMatchers(HttpMethod.GET, "/api/**").permitAll()

                        // YENİ EKLENEN KISIM: İletişim formu mesaj gönderimi için dışarıya (public) izin ver
                        .requestMatchers(HttpMethod.POST, "/api/contact").permitAll()

                        // Geri kalan tüm istekler (POST, PUT, DELETE) geçerli bir JWT token gerektirir
                        .anyRequest().authenticated()
                );

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // Giriş işlemini yönetecek ana Spring Security Bean'i
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    // Şifreleri BCrypt algoritmasıyla şifrelemek (ve doğrulamak) için gerekli Bean
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // React (localhost:5173) ile Backend (localhost:8080) arasındaki CORS ayarları
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}