package com.interviewprep.config;

import com.interviewprep.entity.Role;
import com.interviewprep.entity.User;
import com.interviewprep.enums.RoleName;
import com.interviewprep.repository.RoleRepository;
import com.interviewprep.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Seed Roles
        if (roleRepository.count() == 0) {
            Role studentRole = new Role();
            studentRole.setName(RoleName.ROLE_STUDENT);
            roleRepository.save(studentRole);

            Role adminRole = new Role();
            adminRole.setName(RoleName.ROLE_ADMIN);
            roleRepository.save(adminRole);
        }

        // Seed Admin User
        if (!userRepository.existsByEmail("admin@interviewprep.com")) {
            User admin = new User();
            admin.setFullName("Platform Admin");
            admin.setEmail("admin@interviewprep.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setEnabled(true);
            
            Set<Role> roles = new HashSet<>();
            roleRepository.findByName(RoleName.ROLE_ADMIN).ifPresent(roles::add);
            admin.setRoles(roles);

            userRepository.save(admin);
        }
    }
}
