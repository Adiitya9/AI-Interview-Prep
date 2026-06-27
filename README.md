use these credentials to login:
- Email: admin@interviewprep.com
- Password: admin123

---

# AI Interview Prep

Master technical interviews with AI-powered practice, resume analysis, and real-time feedback.

<div align="center">

![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

[Live Demo](https://adiitya9.github.io/AI-Interview-Prep/) • [GitHub](https://github.com/Adiitya9/AI-Interview-Prep)

</div>

---

## What Can You Do?

- Upload Your Resume - Get ATS score & skill analysis
- Practice Questions - Pick domain & difficulty level
- Mock Interviews - Chat with AI interviewer, get scored & feedback
- Skill Gap Analysis - Paste job description, see what you're missing
- Track Progress - Watch your scores improve over time

---

## Quick Start

### Live Version (No Setup)
Just go here: https://adiitya9.github.io/AI-Interview-Prep/

Register, practice, improve. Done.

### Run Locally

**You need:**
- Java 21
- Node.js 20+
- (Optional) Docker

**Steps:**

```bash
# 1. Clone
git clone https://github.com/Adiitya9/AI-Interview-Prep.git
cd AI-Interview-Prep

# 2. Get Gemini API key (free)
# Go to: https://aistudio.google.com/apikey

# 3. Create .env file
cp .env.example .env
# Add your Gemini key to .env

# 4. Start with Docker
docker compose up

# Or manually:
# Terminal 1: cd backend && ./mvnw spring-boot:run
# Terminal 2: cd frontend && npm install && npm run dev

# 5. Open browser
# Frontend: http://localhost:5173
# API Docs: http://localhost:8080/swagger-ui.html
```

Test with the admin account above.

---

## How It Works

```
Frontend (React) ← API → Backend (Spring Boot) ← Database/AI → MySQL + Gemini
```

- **Frontend:** React with Material UI (beautiful, responsive interface)
- **Backend:** Java with Spring Boot (handles all business logic)
- **Database:** MySQL (stores your data)
- **AI:** Google Gemini (generates questions and evaluates answers)

---

## Features

| Feature | Description |
|---------|------------|
| Dashboard | View your stats and progress |
| Resume Analyzer | Upload PDF, get ATS score and skill analysis |
| Question Generator | Generate interview questions by topic and difficulty |
| Mock Interview | Real-time interview with AI, scoring and feedback |
| Skill Gap Analysis | Compare your resume against job descriptions |
| Progress Tracker | Charts showing your improvement over time |
| Admin Panel | Manage users and view platform analytics |

---

## Security

- JWT authentication for secure login
- Role-based access control (Student/Admin)
- Password hashing with BCrypt
- CORS enabled for frontend communication

---

## Deploy It

### Railway (Easiest)
1. Fork the repo
2. Go to https://railway.app
3. Click "New Project" then "Deploy from GitHub"
4. Select this repository
5. Add your Gemini API key as an environment variable
6. It's live in minutes

### AWS EC2
1. Launch an Ubuntu or Amazon Linux instance
2. Install Docker
3. Clone the repo
4. Run `docker compose up`
5. Done

---

## API Documentation

When the backend is running, access these:
- Swagger UI: http://localhost:8080/swagger-ui.html
- OpenAPI JSON: http://localhost:8080/v3/api-docs

---

## FAQ

**Q: Is it free?**
A: Yes. Gemini has a generous free tier.

**Q: Can I use this for interview prep?**
A: That's exactly what it's designed for.

**Q: Is my data safe?**
A: Yes. Passwords are hashed and data is encrypted.

**Q: Can multiple people use it?**
A: Yes, each person gets their own account.

**Q: How accurate is the AI scoring?**
A: Pretty accurate. It evaluates based on keywords, concepts, and explanation depth.

---

## Built With

- Java 21 and Spring Boot 3.5
- React 18 with Material UI
- MySQL 8.0 database
- Google Gemini API for AI features
- Docker for containerization

---

<div align="center">

**Ready to ace your interviews?**

[Try Now](https://adiitya9.github.io/AI-Interview-Prep/) | [View on GitHub](https://github.com/Adiitya9/AI-Interview-Prep)

</div>
