package com.interviewprep.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;

class JwtTokenProviderTest {

    private JwtTokenProvider jwtTokenProvider;
    private final String secret = "mySecretKey2024InterviewPrepPlatformSecureKeyThatIsLongEnoughForHS512";
    private final long expiration = 86400000;

    @BeforeEach
    void setUp() {
        jwtTokenProvider = new JwtTokenProvider();
        // Since fields are injected via @Value in the real app, we use reflection or setter here
        // For simplicity, assuming JwtTokenProvider has setters or package-private fields
        org.springframework.test.util.ReflectionTestUtils.setField(jwtTokenProvider, "jwtSecret", secret);
        org.springframework.test.util.ReflectionTestUtils.setField(jwtTokenProvider, "jwtExpirationDate", expiration);
    }

    @Test
    void testGenerateToken() {
        CustomUserDetails userDetails = new CustomUserDetails(1L, "test@example.com", "password", Collections.singletonList(new SimpleGrantedAuthority("ROLE_STUDENT")));
        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

        String token = jwtTokenProvider.generateToken(authentication);

        assertNotNull(token);
        assertTrue(token.length() > 0);
    }

    @Test
    void testGetEmailFromToken() {
        CustomUserDetails userDetails = new CustomUserDetails(1L, "test@example.com", "password", Collections.singletonList(new SimpleGrantedAuthority("ROLE_STUDENT")));
        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

        String token = jwtTokenProvider.generateToken(authentication);
        String email = jwtTokenProvider.getUsername(token);

        assertEquals("test@example.com", email);
    }

    @Test
    void testValidateToken() {
        CustomUserDetails userDetails = new CustomUserDetails(1L, "test@example.com", "password", Collections.singletonList(new SimpleGrantedAuthority("ROLE_STUDENT")));
        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

        String token = jwtTokenProvider.generateToken(authentication);
        boolean isValid = jwtTokenProvider.validateToken(token);

        assertTrue(isValid);
    }
}
