package com.interviewprep.service.impl;

import com.interviewprep.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Primary
@RequiredArgsConstructor
public class GeminiAiService implements AiService {

    private final RestClient geminiRestClient;

    @Value("${ai.gemini.api-key:demo-key}")
    private String apiKey;

    @Value("${ai.gemini.model:gemini-2.0-flash}")
    private String model;

    private boolean isDemoOrPlaceholder() {
        return apiKey == null || apiKey.trim().isEmpty() || 
               apiKey.contains("demo-key") || 
               apiKey.contains("api-key-here") || 
               apiKey.contains("your-gemini");
    }

    @Override
    public String analyzeResume(String resumeText) {
        if (isDemoOrPlaceholder()) {
            return generateFallbackResumeAnalysis(resumeText);
        }
        try {
            String prompt = "Analyze this resume and extract skills, missing skills, ATS score (0-100), feedback, and suggestions. Return JSON format with keys: skills (list of strings), missingSkills (list of strings), atsScore (int), feedback (string), suggestions (string). Resume: " + resumeText;
            String result = callGemini(prompt);
            if (result == null || result.trim().equals("{}")) {
                return generateFallbackResumeAnalysis(resumeText);
            }
            return result;
        } catch (Exception e) {
            System.err.println("Gemini AI failed, using fallback resume analysis: " + e.getMessage());
            return generateFallbackResumeAnalysis(resumeText);
        }
    }

    @Override
    public String generateQuestions(String domain, String difficulty, int count) {
        if (isDemoOrPlaceholder()) {
            return generateFallbackQuestions(domain, difficulty, count);
        }
        try {
            String prompt = "Generate " + count + " " + difficulty + " interview questions for " + domain + ". Return JSON format: a list of objects with keys 'question' and 'expectedAnswer'.";
            String result = callGemini(prompt);
            if (result == null || result.trim().equals("{}") || result.trim().equals("[]")) {
                return generateFallbackQuestions(domain, difficulty, count);
            }
            return result;
        } catch (Exception e) {
            System.err.println("Gemini AI failed, using fallback questions: " + e.getMessage());
            return generateFallbackQuestions(domain, difficulty, count);
        }
    }

    @Override
    public String evaluateAnswer(String question, String expectedAnswer, String userAnswer) {
        if (isDemoOrPlaceholder()) {
            return generateFallbackEvaluation(question, expectedAnswer, userAnswer);
        }
        try {
            String prompt = "Evaluate the user answer for the interview question. Question: '" + question + "'. Expected: '" + expectedAnswer + "'. User Answer: '" + userAnswer + "'. Return JSON format with keys 'score' (1-10) and 'feedback' (string).";
            String result = callGemini(prompt);
            if (result == null || result.trim().equals("{}")) {
                return generateFallbackEvaluation(question, expectedAnswer, userAnswer);
            }
            return result;
        } catch (Exception e) {
            System.err.println("Gemini AI failed, using fallback answer evaluation: " + e.getMessage());
            return generateFallbackEvaluation(question, expectedAnswer, userAnswer);
        }
    }

    @Override
    public String generateSkillGapAnalysis(String resumeSkills, String jdSkills) {
        if (isDemoOrPlaceholder()) {
            return generateFallbackSkillGap(resumeSkills, jdSkills);
        }
        try {
            String prompt = "Compare resume skills: " + resumeSkills + " with Job Description skills: " + jdSkills + ". Return JSON format with keys 'matchPercentage' (0-100), 'missingSkills' (list), 'strongAreas' (list), 'weakAreas' (list), 'learningRoadmap' (list of objects with 'week', 'topic', 'description', 'resourceLinks').";
            String result = callGemini(prompt);
            if (result == null || result.trim().equals("{}")) {
                return generateFallbackSkillGap(resumeSkills, jdSkills);
            }
            return result;
        } catch (Exception e) {
            System.err.println("Gemini AI failed, using fallback skill gap: " + e.getMessage());
            return generateFallbackSkillGap(resumeSkills, jdSkills);
        }
    }

    @Override
    public String generateInterviewReport(String interviewData) {
        if (isDemoOrPlaceholder()) {
            return generateFallbackInterviewReport(interviewData);
        }
        try {
            String prompt = "Analyze the following questions and answers from an interview. Generate a feedback report including strengths, weaknesses, recommendations, and a detailed overall report. Return JSON format with keys: strengths (list of strings), weaknesses (list of strings), recommendations (list of strings), detailedReport (string). Interview data: " + interviewData;
            String result = callGemini(prompt);
            if (result == null || result.trim().equals("{}")) {
                return generateFallbackInterviewReport(interviewData);
            }
            return result;
        } catch (Exception e) {
            System.err.println("Gemini AI failed, using fallback interview report: " + e.getMessage());
            return generateFallbackInterviewReport(interviewData);
        }
    }

    private String callGemini(String prompt) throws Exception {
        Map<String, Object> requestBody = Map.of(
            "contents", List.of(
                Map.of("parts", List.of(
                    Map.of("text", prompt)
                ))
            )
        );
        
        return geminiRestClient.post()
                .uri("/models/" + model + ":generateContent")
                .body(requestBody)
                .retrieve()
                .body(String.class);
    }

    // --- FALLBACK MOCK GENERATORS ---

    private String generateFallbackResumeAnalysis(String resumeText) {
        List<String> allSkills = List.of("Java", "Spring Boot", "React", "JavaScript", "SQL", "Docker", "AWS", "TypeScript", "Git", "REST APIs", "Hibernate", "Microservices");
        List<String> foundSkills = new ArrayList<>();
        List<String> missingSkills = new ArrayList<>();
        
        String lowerText = resumeText != null ? resumeText.toLowerCase() : "";
        for (String skill : allSkills) {
            if (lowerText.contains(skill.toLowerCase())) {
                foundSkills.add(skill);
            } else {
                missingSkills.add(skill);
            }
        }
        if (foundSkills.isEmpty()) {
            foundSkills.addAll(List.of("Java", "SQL", "Git"));
        }
        if (missingSkills.isEmpty()) {
            missingSkills.addAll(List.of("Docker", "AWS"));
        }
        
        int score = 60 + (foundSkills.size() * 5);
        if (score > 98) score = 98;
        
        return String.format(
            "{\n" +
            "  \"skills\": [%s],\n" +
            "  \"missingSkills\": [%s],\n" +
            "  \"atsScore\": %d,\n" +
            "  \"feedback\": \"The resume has a clean layout with strong representation of %s. Good description of projects and responsibilities.\",\n" +
            "  \"suggestions\": \"Consider adding more details on cloud services like AWS or containerization with Docker. Add links to GitHub profile or personal portfolio.\"\n" +
            "}",
            foundSkills.stream().map(s -> "\"" + s + "\"").collect(Collectors.joining(", ")),
            missingSkills.stream().limit(3).map(s -> "\"" + s + "\"").collect(Collectors.joining(", ")),
            score,
            String.join(", ", foundSkills.subList(0, Math.min(3, foundSkills.size())))
        );
    }

    private String generateFallbackQuestions(String domain, String difficulty, int count) {
        List<Map<String, String>> pool = new ArrayList<>();
        String dom = domain.toUpperCase();
        String diff = difficulty.toUpperCase();
        
        if (dom.contains("JAVA") && !dom.contains("SPRING")) {
            if (diff.contains("EASY")) {
                pool.add(Map.of("question", "What is the difference between JVM, JRE, and JDK?", "expectedAnswer", "JDK is the development kit containing compiler and tools. JRE is the runtime environment that runs the compiled code. JVM is the abstract machine that executes bytecodes."));
                pool.add(Map.of("question", "What are the access modifiers in Java?", "expectedAnswer", "Java access modifiers are private (within class), default (within package), protected (package and subclasses), and public (everywhere)."));
                pool.add(Map.of("question", "What is the difference between equals() and == in Java?", "expectedAnswer", "== compares object references (memory locations), while equals() compares the actual values/content of the objects if overridden."));
            } else if (diff.contains("HARD")) {
                pool.add(Map.of("question", "How would you design a custom thread pool in Java?", "expectedAnswer", "A custom thread pool requires a BlockingQueue to hold tasks, a set of Worker threads executing Runnable tasks in a loop, and synchronization/locks to manage state changes safely."));
                pool.add(Map.of("question", "Explain the memory layout of Java objects and how G1 garbage collector optimizes pause times.", "expectedAnswer", "Java objects have a header (Mark Word + Class Word) followed by instance data. G1 divides the heap into equal-sized regions and performs incremental reclamation based on garbage density, keeping pause times within a configured limit."));
            } else { // MEDIUM
                pool.add(Map.of("question", "Explain the difference between HashMap and ConcurrentHashMap.", "expectedAnswer", "HashMap is not thread-safe. ConcurrentHashMap achieves high concurrency by partitioning the map into segments or using CAS operations with synchronized blocks on bucket nodes."));
                pool.add(Map.of("question", "What is the Java Memory Model and how does garbage collection work?", "expectedAnswer", "JMM defines how threads interact through memory. Garbage collection automatically reclaims heap memory by identifying unreachable objects using algorithms like Mark-Sweep-Compact."));
            }
        } else if (dom.contains("SPRING")) {
            if (diff.contains("EASY")) {
                pool.add(Map.of("question", "What is Spring Boot and how does it differ from Spring Framework?", "expectedAnswer", "Spring Framework requires manual configuration and dependency wiring. Spring Boot provides auto-configuration, starter POMs, and embedded servers (like Tomcat) for rapid development."));
                pool.add(Map.of("question", "What is the purpose of @RestController annotation?", "expectedAnswer", "@RestController is a convenience annotation that combines @Controller and @ResponseBody, meaning every method returns a domain object directly serialized into JSON/XML."));
            } else if (diff.contains("HARD")) {
                pool.add(Map.of("question", "Explain the internal working of transactional propagation and transactional isolation in Spring Boot.", "expectedAnswer", "Propagation defines how transactions behave relative to existing ones (e.g. REQUIRED, REQUIRES_NEW). Isolation defines visibility of changes to other concurrent transactions (e.g., READ_COMMITTED)."));
                pool.add(Map.of("question", "How does Spring Boot autoconfiguration work under the hood?", "expectedAnswer", "Spring Boot checks for classes on the classpath, properties, and beans using @Conditional annotations defined in META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports."));
            } else { // MEDIUM
                pool.add(Map.of("question", "Explain Bean scopes in Spring. How does singleton bean scope handle concurrent requests?", "expectedAnswer", "Spring supports Singleton (default), Prototype, Request, Session, etc. Singleton beans are stateless; concurrent requests share the same instance, so any mutable state must be synchronized."));
                pool.add(Map.of("question", "What is the difference between Constructor injection and Field injection in Spring?", "expectedAnswer", "Constructor injection is recommended because it allows beans to be immutable, enforces required dependencies at creation, and facilitates testing. Field injection uses reflection and makes testing harder."));
            }
        } else if (dom.contains("REACT")) {
            if (diff.contains("EASY")) {
                pool.add(Map.of("question", "What is the Virtual DOM and how does React reconciliation work?", "expectedAnswer", "The Virtual DOM is an in-memory representation of the real DOM. When state changes, React creates a new virtual tree, diffs it with the old one, and batches the minimum updates to the real DOM."));
                pool.add(Map.of("question", "Explain the difference between functional components and class components.", "expectedAnswer", "Class components use ES6 classes, manage state via this.state, and have lifecycle methods. Functional components are simpler, use React Hooks to manage state/effects, and are now standard."));
            } else if (diff.contains("HARD")) {
                pool.add(Map.of("question", "How would you implement custom state management using Context API and useReducer, avoiding unnecessary re-renders?", "expectedAnswer", "You can split state and dispatch into separate context providers, wrap child components in React.memo, or use selector libraries to avoid re-rendering children on unrelated state updates."));
                pool.add(Map.of("question", "Explain concurrent features in React 18, like useTransition and useDeferredValue.", "expectedAnswer", "useTransition lets you mark state updates as non-blocking transitions (e.g., searches). useDeferredValue lets you defer updating a slow part of the UI, keeping the main interface responsive."));
            } else { // MEDIUM
                pool.add(Map.of("question", "What is the difference between useEffect and useLayoutEffect?", "expectedAnswer", "useEffect runs asynchronously after the render paint, which is ideal for standard side effects. useLayoutEffect runs synchronously after DOM mutations but before the screen paints, preventing flicker."));
                pool.add(Map.of("question", "How does React fiber architecture optimize rendering performance?", "expectedAnswer", "React Fiber is a rewrite of React's reconciliation engine. It enables incremental rendering, allowing React to split rendering work into chunks, pause it, and resume it based on priority."));
            }
        } else if (dom.contains("SQL")) {
            if (diff.contains("EASY")) {
                pool.add(Map.of("question", "What is the difference between INNER JOIN and LEFT JOIN?", "expectedAnswer", "INNER JOIN returns records that have matching values in both tables. LEFT JOIN returns all records from the left table, and the matched records from the right table (returning NULL if no match)."));
                pool.add(Map.of("question", "What are primary keys and foreign keys?", "expectedAnswer", "A primary key uniquely identifies a record in a table. A foreign key is a field in one table that refers to the primary key of another table, establishing a relationship."));
            } else if (diff.contains("HARD")) {
                pool.add(Map.of("question", "Explain transaction isolation levels and how they prevent dirty reads, non-repeatable reads, and phantom reads.", "expectedAnswer", "Isolation levels are READ UNCOMMITTED, READ COMMITTED, REPEATABLE READ, and SERIALIZABLE. They use locks or multi-version concurrency control (MVCC) to control data visibility and prevent anomalies."));
                pool.add(Map.of("question", "How do database locking mechanisms (optimistic vs pessimistic) handle high concurrency?", "expectedAnswer", "Optimistic locking assumes conflicts are rare, using a version column to check for changes at write time. Pessimistic locking locks the records (e.g. SELECT FOR UPDATE) to prevent edits by others."));
            } else { // MEDIUM
                pool.add(Map.of("question", "Explain database normalization and the difference between 2NF and 3NF.", "expectedAnswer", "Normalization removes redundancy. 2NF removes partial dependencies (non-key columns must depend on the whole primary key). 3NF removes transitive dependencies (non-key depends on non-key)."));
                pool.add(Map.of("question", "What are index types in SQL databases? How does a B-tree index work?", "expectedAnswer", "Indexes speed up lookups. B-tree indexes store data in a balanced tree structure where search, insertion, and deletion take logarithmic time by navigating nodes containing ranges of keys."));
            }
        } else if (dom.contains("DSA")) {
            if (diff.contains("EASY")) {
                pool.add(Map.of("question", "How do you reverse a singly linked list?", "expectedAnswer", "Reversing a singly linked list requires tracking three pointers: current, prev, and next. In each step, next stores current.next, current.next points to prev, prev moves to current, and current moves to next."));
                pool.add(Map.of("question", "Explain the difference between Array and ArrayList.", "expectedAnswer", "Array is a fixed-size, primitive data structure. ArrayList is a dynamic-size collection wrapper that automatically resizes by allocating a larger array when it becomes full."));
            } else if (diff.contains("HARD")) {
                pool.add(Map.of("question", "How do you find the longest common subsequence of two strings using Dynamic Programming?", "expectedAnswer", "Create a 2D table where dp[i][j] represents LCS of prefix strings. If characters match, dp[i][j] = 1 + dp[i-1][j-1]. If not, dp[i][j] = max(dp[i-1][j], dp[i][j-1]). The bottom-right cell contains the length."));
                pool.add(Map.of("question", "Explain Dijkstra's shortest path algorithm and its time complexity.", "expectedAnswer", "Dijkstra finds the shortest path from a source to all nodes in a weighted graph. It uses a priority queue to repeatedly select the closest unvisited node and relaxes its neighbors. Time complexity is O((V+E) log V)."));
            } else { // MEDIUM
                pool.add(Map.of("question", "Explain how to find the middle element of a linked list in a single pass.", "expectedAnswer", "Use a fast pointer and a slow pointer. Move fast by two nodes and slow by one node in each step. When fast reaches the end, slow will point to the middle element."));
                pool.add(Map.of("question", "What is the time complexity of QuickSort in worst and best scenarios?", "expectedAnswer", "Best and average time complexity is O(N log N) when pivot splits the array evenly. Worst case is O(N^2) when pivot is always the smallest or largest element (e.g. sorted array)."));
            }
        } else { // SYSTEM_DESIGN or general
            if (diff.contains("EASY")) {
                pool.add(Map.of("question", "What is the difference between vertical scaling and horizontal scaling?", "expectedAnswer", "Vertical scaling (scaling up) means adding more power (CPU, RAM) to an existing server. Horizontal scaling (scaling out) means adding more servers to handle the load."));
                pool.add(Map.of("question", "What is a Load Balancer and why is it used?", "expectedAnswer", "A load balancer distributes incoming network traffic across multiple servers, preventing overload, ensuring high availability, and optimizing response times."));
            } else if (diff.contains("HARD")) {
                pool.add(Map.of("question", "How would you design a distributed rate limiter that handles millions of requests per second?", "expectedAnswer", "Use Redis to store bucket tokens or requests timestamp sliding window. Implement local in-memory token buckets for low latency and sync count asynchronously to Redis."));
                pool.add(Map.of("question", "Design a real-time notification system like Slack or WhatsApp with WebSocket connections.", "expectedAnswer", "The system uses a WebSocket gateway layer to hold open connections, a message broker (Kafka/RabbitMQ) for pub-sub messaging, database clustering (Redis + Cassandra) for messages, and push notification services."));
            } else { // MEDIUM
                pool.add(Map.of("question", "How does consistent hashing work and where is it used?", "expectedAnswer", "Consistent hashing maps both servers and data keys to a circular ring. A key is assigned to the first server found moving clockwise, minimizing key relocation when nodes join or leave."));
                pool.add(Map.of("question", "Explain the CAP theorem and its implications in distributed systems.", "expectedAnswer", "CAP theorem states that a distributed system can only guarantee two out of three: Consistency, Availability, and Partition Tolerance. In the presence of partition, one must choose C or A."));
            }
        }
        
        List<Map<String, String>> selected = new ArrayList<>();
        for (int i = 0; i < Math.min(count, pool.size()); i++) {
            selected.add(pool.get(i));
        }
        if (selected.isEmpty()) {
            selected.add(Map.of("question", "Tell me about your technical background and experience.", "expectedAnswer", "Brief introduction to projects, key skills, and engineering philosophy."));
        }
        
        StringBuilder sb = new StringBuilder();
        sb.append("[\n");
        for (int i = 0; i < selected.size(); i++) {
            Map<String, String> q = selected.get(i);
            sb.append("  {\n")
              .append("    \"question\": \"").append(q.get("question").replace("\"", "\\\"")).append("\",\n")
              .append("    \"expectedAnswer\": \"").append(q.get("expectedAnswer").replace("\"", "\\\"")).append("\"\n")
              .append("  }");
            if (i < selected.size() - 1) {
                sb.append(",");
            }
            sb.append("\n");
        }
        sb.append("]");
        return sb.toString();
    }

    private String generateFallbackEvaluation(String question, String expectedAnswer, String userAnswer) {
        int score = 4;
        String feedback = "The answer is too brief or did not address the core concepts.";
        
        String lowerUser = userAnswer != null ? userAnswer.toLowerCase() : "";
        if (lowerUser.length() > 50) {
            score += 2;
            feedback = "Good attempt. Your answer covers some relevant points but lacks specific depth.";
        }
        if (lowerUser.length() > 150) {
            score += 1;
        }
        
        String[] keywords = expectedAnswer.toLowerCase().split("\\s+");
        int matches = 0;
        for (String kw : keywords) {
            kw = kw.replaceAll("[^a-zA-Z]", "");
            if (kw.length() > 3 && lowerUser.contains(kw)) {
                matches++;
            }
        }
        if (matches > 3) {
            score += 3;
            feedback = "Very good answer! You mentioned key technical concepts correctly.";
        }
        if (score > 10) score = 10;
        
        return String.format("{\n  \"score\": %d,\n  \"feedback\": \"%s\"\n}", score, feedback);
    }

    private String generateFallbackSkillGap(String resumeSkills, String jdSkills) {
        return "{\n" +
               "  \"matchPercentage\": 75,\n" +
               "  \"missingSkills\": [\"Docker\", \"Kubernetes\"],\n" +
               "  \"strongAreas\": [\"Java\", \"SQL\"],\n" +
               "  \"weakAreas\": [\"DevOps\", \"Cloud Deployments\"],\n" +
               "  \"learningRoadmap\": [\n" +
               "    {\n" +
               "      \"week\": \"Week 1\",\n" +
               "      \"topic\": \"Docker Basics\",\n" +
               "      \"description\": \"Learn containerization concepts, write Dockerfiles, and manage volumes.\",\n" +
               "      \"resourceLinks\": [\"https://docs.docker.com/get-started/\", \"https://www.youtube.com/watch?v=3c-iKn5qMo0\"]\n" +
               "    },\n" +
               "    {\n" +
               "      \"week\": \"Week 2\",\n" +
               "      \"topic\": \"CI/CD Pipelines\",\n" +
               "      \"description\": \"Set up GitHub Actions to automate build and test pipelines.\",\n" +
               "      \"resourceLinks\": [\"https://docs.github.com/en/actions\"]\n" +
               "    }\n" +
               "  ]\n" +
               "}";
    }

    private String generateFallbackInterviewReport(String interviewData) {
        return "{\n" +
               "  \"strengths\": [\n" +
               "    \"Strong comprehension of core computer science fundamentals.\",\n" +
               "    \"Good explanation of coding trade-offs and logic.\"\n" +
               "  ],\n" +
               "  \"weaknesses\": [\n" +
               "    \"Could provide more concrete architectural/system design examples.\",\n" +
               "    \"Some answers lacked specific metric optimization results.\"\n" +
               "  ],\n" +
               "  \"recommendations\": [\n" +
               "    \"Review transactional scopes and bean lifecycles.\",\n" +
               "    \"Practice whiteboard designs for rate limiters and notification systems.\"\n" +
               "  ],\n" +
               "  \"detailedReport\": \"The candidate showed good competence overall, solving easy and medium questions successfully. Areas of improvement lie in detailing scalability and distributed design concepts under stress.\"\n" +
               "}";
    }
}
