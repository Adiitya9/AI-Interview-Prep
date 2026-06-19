package com.interviewprep.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Domain {
    JAVA("Java"),
    SPRING_BOOT("Spring Boot"),
    REACT("React"),
    SQL("SQL"),
    DSA("Data Structures & Algorithms"),
    SYSTEM_DESIGN("System Design");

    private final String displayName;
}
