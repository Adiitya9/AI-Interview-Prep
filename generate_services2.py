import os

BASE_DIR_IMPL = '/Users/adityamacbook/Documents/Resume Project/backend/src/main/java/com/interviewprep/service/impl'

impls = {
    "GeminiAiService.java": """package com.interviewprep.service.impl;

import com.interviewprep.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import java.util.Map;
import java.util.List;

@Service
@Primary
@RequiredArgsConstructor
public class GeminiAiService implements AiService {

    private final RestClient geminiRestClient;

    @Override
    public String analyzeResume(String resumeText) {
        String prompt = "Analyze this resume and extract skills, missing skills, ATS score (0-100), feedback, and suggestions. Return JSON format with keys: skills (list of strings), missingSkills (list of strings), atsScore (int), feedback (string), suggestions (string). Resume: " + resumeText;
        return callGemini(prompt);
    }

    @Override
    public String generateQuestions(String domain, String difficulty, int count) {
        String prompt = "Generate " + count + " " + difficulty + " interview questions for " + domain + ". Return JSON format: a list of objects with keys 'question' and 'expectedAnswer'.";
        return callGemini(prompt);
    }

    @Override
    public String evaluateAnswer(String question, String expectedAnswer, String userAnswer) {
        String prompt = "Evaluate the user answer for the interview question. Question: '" + question + "'. Expected: '" + expectedAnswer + "'. User Answer: '" + userAnswer + "'. Return JSON format with keys 'score' (1-10) and 'feedback' (string).";
        return callGemini(prompt);
    }

    @Override
    public String generateSkillGapAnalysis(String resumeSkills, String jdSkills) {
        String prompt = "Compare resume skills: " + resumeSkills + " with Job Description skills: " + jdSkills + ". Return JSON format with keys 'matchPercentage' (0-100), 'missingSkills' (list), 'strongAreas' (list), 'weakAreas' (list), 'learningRoadmap' (list of objects with 'week', 'topic', 'description', 'resourceLinks').";
        return callGemini(prompt);
    }

    private String callGemini(String prompt) {
        try {
            Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                    Map.of("parts", List.of(
                        Map.of("text", prompt)
                    ))
                )
            );
            
            String response = geminiRestClient.post()
                    .uri("?key=API_KEY") // The RestClient base URL will have the key configured or handled in config
                    .body(requestBody)
                    .retrieve()
                    .body(String.class);
            return response != null ? response : "{}";
        } catch(Exception e) {
            return "{}";
        }
    }
}
""",
    "OpenAiService.java": """package com.interviewprep.service.impl;

import com.interviewprep.service.AiService;
import org.springframework.stereotype.Service;

@Service
public class OpenAiService implements AiService {
    @Override
    public String analyzeResume(String resumeText) {
        return "{}";
    }

    @Override
    public String generateQuestions(String domain, String difficulty, int count) {
        return "[]";
    }

    @Override
    public String evaluateAnswer(String question, String expectedAnswer, String userAnswer) {
        return "{}";
    }

    @Override
    public String generateSkillGapAnalysis(String resumeSkills, String jdSkills) {
        return "{}";
    }
}
""",
    "AuthServiceImpl.java": """package com.interviewprep.service.impl;

import com.interviewprep.dto.request.LoginRequest;
import com.interviewprep.dto.request.RegisterRequest;
import com.interviewprep.dto.response.AuthResponse;
import com.interviewprep.dto.response.UserResponse;
import com.interviewprep.entity.Role;
import com.interviewprep.entity.User;
import com.interviewprep.enums.RoleName;
import com.interviewprep.exception.BadRequestException;
import com.interviewprep.repository.RoleRepository;
import com.interviewprep.repository.UserRepository;
import com.interviewprep.security.JwtTokenProvider;
import com.interviewprep.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtTokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found"));

        return AuthResponse.builder()
                .token(token)
                .user(mapToUserResponse(user))
                .build();
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already taken!");
        }

        Role userRole = roleRepository.findByName(RoleName.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("User Role not set."));

        Set<Role> roles = new HashSet<>();
        roles.add(userRole);

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .enabled(true)
                .roles(roles)
                .build();

        userRepository.save(user);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtTokenProvider.generateToken(authentication);

        return AuthResponse.builder()
                .token(token)
                .user(mapToUserResponse(user))
                .build();
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .roles(user.getRoles().stream().map(r -> r.getName().name()).collect(Collectors.toSet()))
                .build();
    }
}
"""
}

for filename, content in impls.items():
    with open(os.path.join(BASE_DIR_IMPL, filename), 'w') as f:
        f.write(content)

print("Auth and AI Impls created.")
