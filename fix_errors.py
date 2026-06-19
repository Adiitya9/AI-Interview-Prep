import os

AUTH_FILE = '/Users/adityamacbook/Documents/Resume Project/backend/src/main/java/com/interviewprep/service/impl/AuthServiceImpl.java'
with open(AUTH_FILE, 'r') as f:
    auth_content = f.read()

auth_content = auth_content.replace('RoleName.ROLE_USER', 'RoleName.ROLE_STUDENT')

with open(AUTH_FILE, 'w') as f:
    f.write(auth_content)


PDF_FILE = '/Users/adityamacbook/Documents/Resume Project/backend/src/main/java/com/interviewprep/util/PdfExtractor.java'

pdf_content = """package com.interviewprep.util;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.pdfbox.Loader;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Component
public class PdfExtractor {

    public String extractText(MultipartFile file) throws IOException {
        try (PDDocument document = Loader.loadPDF(file.getBytes())) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }
}
"""

with open(PDF_FILE, 'w') as f:
    f.write(pdf_content)
