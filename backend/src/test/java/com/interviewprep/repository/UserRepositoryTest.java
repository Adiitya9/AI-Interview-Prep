package com.interviewprep.repository;

import com.interviewprep.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    void testFindByEmail() {
        User user = new User();
        user.setEmail("testrepo@example.com");
        user.setPassword("password");
        user.setFullName("Test Repo User");
        userRepository.save(user);

        Optional<User> foundUser = userRepository.findByEmail("testrepo@example.com");
        assertTrue(foundUser.isPresent());
        assertEquals("Test Repo User", foundUser.get().getFullName());
    }

    @Test
    void testExistsByEmail() {
        User user = new User();
        user.setEmail("testrepo@example.com");
        user.setPassword("password");
        user.setFullName("Test Repo User");
        userRepository.save(user);

        boolean exists = userRepository.existsByEmail("testrepo@example.com");
        assertTrue(exists);
        
        boolean notExists = userRepository.existsByEmail("nonexistent@example.com");
        assertFalse(notExists);
    }
}
