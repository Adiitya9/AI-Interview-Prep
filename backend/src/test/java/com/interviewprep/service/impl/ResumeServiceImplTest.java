package com.interviewprep.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.interviewprep.dto.response.ResumeAnalysisResponse;
import com.interviewprep.entity.Resume;
import com.interviewprep.entity.User;
import com.interviewprep.repository.ResumeRepository;
import com.interviewprep.repository.UserRepository;
import com.interviewprep.service.AiService;
import com.interviewprep.util.PdfExtractor;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ResumeServiceImplTest {

    @Mock
    private ResumeRepository resumeRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PdfExtractor pdfExtractor;

    @Mock
    private AiService aiService;

    @Spy
    private ObjectMapper objectMapper = new ObjectMapper();

    @InjectMocks
    private ResumeServiceImpl resumeService;

    private User user;
    private MultipartFile file;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");

        file = new MockMultipartFile("file", "resume.pdf", "application/pdf", "dummy pdf content".getBytes());
    }

    @Test
    void testUploadAndAnalyze() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        
        String dummyJson = "{\"technicalSkills\":[\"Java\"],\"missingSkills\":[\"Python\"],\"atsScore\":85,\"weaknesses\":[],\"suggestions\":[],\"overallFeedback\":\"Good\"}";
        when(aiService.analyzeResume(anyString())).thenReturn(dummyJson);
        
        Resume savedResume = new Resume();
        savedResume.setId(1L);
        savedResume.setFileName("resume.pdf");
        savedResume.setAtsScore(85);
        when(resumeRepository.save(any(Resume.class))).thenReturn(savedResume);

        try (MockedStatic<PdfExtractor> mockedPdfExtractor = Mockito.mockStatic(PdfExtractor.class)) {
            mockedPdfExtractor.when(() -> PdfExtractor.extractText(any(MultipartFile.class))).thenReturn("extracted text");

            ResumeAnalysisResponse response = resumeService.uploadAndAnalyze(file, 1L);

            assertNotNull(response);
            assertEquals("resume.pdf", response.getFileName());
            assertEquals(85, response.getAtsScore());
            verify(resumeRepository, times(1)).save(any(Resume.class));
            verify(aiService, times(1)).analyzeResume(anyString());
        }
    }
}
