use these credential for login
Email: admin@interviewprep.com
Password: admin123


#  AI-Powered Interview Preparation Platform

<div align="center">

![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Material UI](https://img.shields.io/badge/MUI-5-0081CB?style=for-the-badge&logo=mui&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)

**A comprehensive, production-ready platform that leverages AI to help developers ace their technical interviews.**

[Features](#-features) • [Architecture](#-architecture) • [Getting Started](#-getting-started) • [API Docs](#-api-documentation) • [Deployment](#-deployment)

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Database Design](#-database-design)
- [Deployment](#-deployment)
- [Testing](#-testing)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based stateless authentication
- Role-based access control (Student / Admin)
- Secure password hashing (BCrypt)
- Forgot password flow

### 📊 Smart Dashboard
- Interview statistics & score tracking
- Skill progress visualization
- Recommended topics engine
- Recent activity timeline

### 📄 AI Resume Analyzer
- PDF resume upload & text extraction
- Automated ATS (Applicant Tracking System) scoring
- Technical skills identification
- Missing skills detection
- Personalized improvement suggestions

### 💡 Interview Question Generator
- 6 domains: Java, Spring Boot, React, SQL, DSA, System Design
- 3 difficulty levels: Easy, Medium, Hard
- AI-generated questions with detailed answers & explanations
- Customizable question count (5-30)

### 🎤 AI Mock Interview
- Real-time conversational interview experience
- Voice input support (Web Speech API)
- AI evaluates answers and provides per-question scoring (0-10)
- Detailed feedback with strengths & improvements
- Comprehensive final interview report

### 🔍 Skill Gap Analysis
- Compare your resume against any job description
- Match percentage calculation
- Personalized learning roadmap with time estimates
- Resource recommendations per skill

### 📈 Progress Tracker
- Interview score trends over time
- Domain-wise performance analytics
- Daily/weekly progress reports
- Interactive charts & visualizations

### 🛡️ Admin Panel
- User management (CRUD)
- Platform analytics dashboard
- AI API usage monitoring

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React 18)                   │
│          Material UI • React Router • Axios              │
│              Port 5173 (dev) / 80 (prod)                │
└───────────────────────┬─────────────────────────────────┘
                        │ REST API (JSON)
                        ▼
┌─────────────────────────────────────────────────────────┐
│                 Backend (Spring Boot 3.5)                │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │Controller│→ │ Service  │→ │Repository│→ MySQL        │
│  └──────────┘  └────┬─────┘  └──────────┘              │
│                     │                                    │
│                     ▼                                    │
│              ┌─────────────┐                            │
│              │  AI Service │→ Gemini / OpenAI API       │
│              └─────────────┘                            │
│                                                         │
│  Security: JWT Filter Chain (Spring Security 6)         │
│  Port 8080                                              │
└─────────────────────────────────────────────────────────┘
```

### Design Patterns
- **MVC Architecture** — Clear separation of concerns
- **Layered Architecture** — Controller → Service → Repository
- **DTO Pattern** — Request/Response DTOs, never expose entities
- **Strategy Pattern** — Swappable AI providers (Gemini/OpenAI)
- **Builder Pattern** — Lombok @Builder for entities and DTOs
- **Global Exception Handling** — @RestControllerAdvice

---

## 🛠 Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Backend** | Java | 21 (LTS) |
| | Spring Boot | 3.5.15 |
| | Spring Security | 6.x |
| | Spring Data JPA | 3.x |
| | JJWT | 0.13.0 |
| | Apache PDFBox | 3.0.3 |
| | springdoc-openapi | 2.8.5 |
| | Lombok | Latest |
| **Frontend** | React | 18.3.x |
| | Material UI | 5.16.x |
| | React Router | 6.26.x |
| | Axios | 1.7.x |
| | Recharts | 2.15.x |
| | Framer Motion | 11.x |
| **Database** | MySQL | 8.0 |
| **AI** | Google Gemini API | 2.0 Flash |
| | OpenAI API | GPT-4o-mini |
| **DevOps** | Docker | Multi-stage |
| | GitHub Actions | CI/CD |
| | Nginx | Alpine |

---

## 🚀 Getting Started

### Prerequisites

- **Java 21** — [Download](https://adoptium.net/)
- **Node.js 20+** — [Download](https://nodejs.org/)
- **MySQL 8.0** — [Download](https://dev.mysql.com/downloads/) or use Docker
- **Maven 3.9+** — [Download](https://maven.apache.org/) (or use the included wrapper `mvnw`)
- **AI API Key** — [Gemini (free)](https://aistudio.google.com/apikey) or [OpenAI](https://platform.openai.com/api-keys)

### Quick Start (Local Development)

#### 1. Clone the repository
```bash
git clone https://github.com/yourusername/interview-prep-platform.git
cd interview-prep-platform
```

#### 2. Set up the database
```bash
# Option A: Using Docker (recommended)
docker run -d --name interview-mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=interview_prep_db \
  -p 3306:3306 \
  mysql:8.0

# Option B: Using local MySQL
mysql -u root -p
CREATE DATABASE interview_prep_db;
```

#### 3. Configure environment
```bash
# Backend
cd backend
cp src/main/resources/application.yml src/main/resources/application-local.yml
# Edit application-local.yml with your database and AI API key settings
```

#### 4. Start the backend
```bash
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
# Server starts at http://localhost:8080
# Swagger UI: http://localhost:8080/swagger-ui.html
```

#### 5. Start the frontend
```bash
cd frontend
npm install
npm run dev
# App opens at http://localhost:5173
```

### Quick Start (Docker Compose)

```bash
# Copy and configure environment
cp .env.example .env
# Edit .env with your API keys

# Start all services
docker compose up -d

# App: http://localhost
# API: http://localhost:8080
# Swagger: http://localhost:8080/swagger-ui.html
```

### Default Admin Credentials
```
Email: admin@interviewprep.com
Password: admin123
```

---

## 🔑 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_USERNAME` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | `root` |
| `JWT_SECRET` | JWT signing key (min 64 chars) | Auto-generated |
| `AI_PROVIDER` | AI backend: `gemini` or `openai` | `gemini` |
| `GEMINI_API_KEY` | Google Gemini API key | — |
| `OPENAI_API_KEY` | OpenAI API key | — |

---

## 📖 API Documentation

Interactive API documentation is available via **Swagger UI** when the backend is running:

- **Swagger UI**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **OpenAPI JSON**: [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

### Key API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/register` | Register new user | No |
| `POST` | `/api/auth/login` | Login & get JWT | No |
| `POST` | `/api/auth/forgot-password` | Request password reset | No |
| `GET` | `/api/dashboard` | Get dashboard data | JWT |
| `POST` | `/api/resume/upload` | Upload & analyze resume | JWT |
| `GET` | `/api/resume` | Get user's resumes | JWT |
| `POST` | `/api/questions/generate` | Generate interview questions | JWT |
| `POST` | `/api/interview/start` | Start mock interview | JWT |
| `POST` | `/api/interview/answer` | Submit answer for evaluation | JWT |
| `POST` | `/api/interview/{id}/complete` | Complete & get report | JWT |
| `POST` | `/api/skill-gap/analyze` | Analyze skill gap | JWT |
| `GET` | `/api/progress` | Get progress data | JWT |
| `GET` | `/api/admin/users` | List all users | Admin |
| `GET` | `/api/admin/analytics` | Platform analytics | Admin |

---

## 🗃 Database Design

### Entity-Relationship Diagram

The platform uses **10 tables** with the following relationships:

| Table | Description | Key Relationships |
|-------|-------------|-------------------|
| `users` | User accounts | Has roles, resumes, interviews |
| `roles` | STUDENT, ADMIN | Many-to-many with users |
| `resumes` | Uploaded resumes & analysis | Belongs to user |
| `interviews` | Mock interview sessions | Has questions, result |
| `interview_questions` | Individual questions | Belongs to interview |
| `interview_results` | Final interview reports | One-to-one with interview |
| `skill_analysis` | Skill gap comparisons | Belongs to user |
| `progress_reports` | Daily/weekly progress | Belongs to user |
| `job_descriptions` | Saved job descriptions | Belongs to user |
| `ai_logs` | AI API call logs | Belongs to user |

---

## 🐳 Deployment

### Docker Compose (Recommended)

```bash
# Production deployment
cp .env.example .env
# Edit .env with production values

docker compose up -d --build
```

### AWS EC2 Deployment

#### 1. Launch EC2 Instance
- AMI: Amazon Linux 2023 or Ubuntu 22.04
- Instance type: t3.medium (minimum)
- Security group: Open ports 80, 443, 22

#### 2. Install Docker
```bash
# Amazon Linux 2023
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### 3. Deploy
```bash
# Clone and configure
git clone https://github.com/yourusername/interview-prep-platform.git
cd interview-prep-platform
cp .env.example .env
nano .env  # Configure production values

# Start services
docker compose up -d --build

# Verify
docker compose ps
curl http://localhost:8080/actuator/health
```

#### 4. Set up CI/CD
Configure these GitHub secrets:
- `DOCKER_USERNAME`, `DOCKER_PASSWORD`
- `EC2_HOST`, `EC2_USERNAME`, `EC2_SSH_KEY`

---

## 🧪 Testing

### Backend Tests
```bash
cd backend

# Run all tests
./mvnw test

# Run specific test class
./mvnw test -Dtest=AuthServiceImplTest

# Run with coverage
./mvnw test jacoco:report
# Report: target/site/jacoco/index.html
```

### Test Coverage
| Layer | Test Type | Framework |
|-------|-----------|-----------|
| Service | Unit Tests | JUnit 5 + Mockito |
| Security | Unit Tests | JUnit 5 |
| Controller | Integration | Spring MockMvc |
| Repository | Integration | @DataJpaTest + H2 |

---

## 📁 Project Structure

```
interview-prep-platform/
├── backend/
│   ├── src/main/java/com/interviewprep/
│   │   ├── config/          # OpenAPI, Web, AI configs
│   │   ├── controller/      # REST controllers (8)
│   │   ├── dto/
│   │   │   ├── request/     # Request DTOs
│   │   │   └── response/    # Response DTOs
│   │   ├── entity/          # JPA entities (10)
│   │   ├── enums/           # Domain, Difficulty, etc.
│   │   ├── exception/       # Global exception handler
│   │   ├── repository/      # JPA repositories (10)
│   │   ├── security/        # JWT + Spring Security
│   │   ├── service/
│   │   │   └── impl/        # Service implementations
│   │   └── util/            # PDF extractor, helpers
│   ├── src/main/resources/
│   │   └── application.yml
│   ├── src/test/java/
│   ├── pom.xml
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios API clients
│   │   ├── components/
│   │   │   ├── common/      # Reusable components
│   │   │   └── layout/      # App layout, sidebar
│   │   ├── contexts/        # Auth context
│   │   ├── pages/           # All page components
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── resume/
│   │   │   ├── interview/
│   │   │   ├── questions/
│   │   │   ├── skillgap/
│   │   │   ├── progress/
│   │   │   ├── admin/
│   │   │   └── profile/
│   │   ├── theme/           # MUI theme config
│   │   └── utils/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── nginx.conf
│   └── Dockerfile
├── docker-compose.yml
├── .github/workflows/ci-cd.yml
├── .env.example
├── .gitignore
└── README.md
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

---

<div align="center">


</div>
