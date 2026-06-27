use these credentials to login:
- Email: admin@interviewprep.com
- Password: admin123

---

# 🎯 AI Interview Prep

Master technical interviews with AI-powered practice, resume analysis, and real-time feedback.

<div align="center">

![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

[Live Demo](https://adiitya9.github.io/AI-Interview-Prep/) • [GitHub](https://github.com/Adiitya9/AI-Interview-Prep)

</div>

---

## 🚀 What Can You Do?

✅ **Upload Your Resume** → Get ATS score & skill analysis  
✅ **Practice Questions** → Pick domain & difficulty level  
✅ **Mock Interviews** → Chat with AI interviewer, get scored & feedback  
✅ **Skill Gap Analysis** → Paste job description, see what you're missing  
✅ **Track Progress** → Watch your scores improve over time  

---

## ⚡ Quick Start

### Live Version (No Setup)
Just go here: **https://adiitya9.github.io/AI-Interview-Prep/**

Register → Practice → Improve. Done.

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

## 🏗️ How It Works

```
Frontend (React) ↔ Backend (Spring Boot) ↔ MySQL + AI APIs
```

- **Frontend:** React + Material UI (beautiful UI)
- **Backend:** Java + Spring Boot (handles everything)
- **Database:** MySQL (stores your data)
- **AI:** Google Gemini (generates questions & feedback)

---

## 📋 Features

| Feature | What It Does |
|---------|------------|
| 📊 Dashboard | See your stats & progress |
| 📄 Resume Analyzer | Upload PDF, get ATS score & skills |
| 💡 Question Generator | Generate questions by topic & level |
| 🎤 Mock Interview | Real interview with AI, scoring, feedback |
| 🔍 Skill Gap | Compare resume vs job description |
| 📈 Progress Tracker | Charts showing your improvement |
| 👨‍💼 Admin Panel | Manage users & view analytics |

---

## 🔐 Security

- JWT authentication (secure login)
- Role-based access (Student/Admin)
- Password hashing (BCrypt)
- CORS enabled for frontend

---

## 🌐 Deploy It

### Railway (Easiest)
1. Fork the repo
2. Go to [Railway.app](https://railway.app)
3. "New Project" → "Deploy from GitHub"
4. Pick this repo
5. Add Gemini API key to environment
6. Done! Live in minutes

### AWS EC2
1. Launch Ubuntu/Amazon Linux instance
2. Install Docker
3. Clone repo → `docker compose up`
4. Done!

---

## 📚 API Docs

When backend is running:
- Swagger: http://localhost:8080/swagger-ui.html
- OpenAPI: http://localhost:8080/v3/api-docs

---

## ❓ FAQ

**Q: Is it free?**  
A: Yes! Gemini has a free tier that's more than enough.

**Q: Can I use it for interview prep?**  
A: That's literally what it's for.

**Q: Is my data safe?**  
A: Yes. Passwords are hashed, data is encrypted.

**Q: Can others sign up too?**  
A: Yeah, multiple users can use the same instance.

---

## 🙌 Credits

Built to help developers ace interviews. If you land that dream job, mission accomplished! 🎉

---

<div align="center">

**[Try Now](https://adiitya9.github.io/AI-Interview-Prep/)** • **[GitHub](https://github.com/Adiitya9/AI-Interview-Prep)**

</div>
