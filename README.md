use these credentials to login:
- Email: admin@interviewprep.com
- Password: admin123

---

# 🚀 AI Interview Prep - Master Your Technical Interviews

Welcome to **AI Interview Prep**, your all-in-one platform for crushing technical interviews. Whether you're preparing for your first dev role or aiming to land that dream position at a top tech company, this platform has everything you need.

Built with modern technologies and powered by AI, it's designed to help you practice, learn, and get confidence before the real interview.

<div align="center">

![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Material UI](https://img.shields.io/badge/MUI-5-0081CB?style=for-the-badge&logo=mui&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

</div>

---

## ✨ What Can You Do Here?

### 📄 **Upload & Analyze Your Resume**
Wondering if your resume is ATS-friendly? Upload your PDF and get an instant ATS score, see which technical skills you have, and get suggestions on what's missing. It's like having a career coach review your resume in seconds.

### 💡 **Practice Interview Questions**
Pick a domain (Java, Spring Boot, React, SQL, DSA, System Design), select a difficulty level, and get AI-generated interview questions with detailed answers. Perfect for brushing up on the fundamentals.

### 🎤 **Have a Real Mock Interview**
This is the big one. Have a real-time conversation with AI acting as your interviewer. You can speak or type, the AI will ask follow-up questions, and you'll get scored on each answer with honest feedback. It's like having a mock interview partner available 24/7.

### 🔍 **See What Skills You're Missing**
Paste a job description and let the platform compare it with your resume. It'll show you what you need to learn, what you're already good at, and give you a roadmap to bridge the gap.

### 📊 **Track Your Progress**
Watch yourself improve over time. See how your interview scores trend, what domains you're getting better at, and celebrate your wins with interactive charts and reports.

---

## 🏗️ How It Works (Under the Hood)

The platform is split into two parts:

1. **Backend (Spring Boot)** — Handles all the heavy lifting: user authentication, resume parsing, question generation, AI integration, and storing your progress
2. **Frontend (React)** — Beautiful, interactive UI where you do all the interviewing, uploading, and tracking

They talk to each other via REST APIs. The backend connects to Google's Gemini AI (or OpenAI if you prefer) to generate questions and evaluate your answers.

```
Your Browser (React App)
        ↓ (REST API)
    Spring Boot Server
        ↓ (PDF parsing, AI calls, Database)
    MySQL Database + AI APIs
```

---

## 🛠️ What's Inside?

| Part | Tech | Why? |
|------|------|------|
| **Backend** | Java 21 + Spring Boot 3.5 | Fast, reliable, production-ready |
| **Frontend** | React 18 + Material UI | Beautiful, responsive, smooth UX |
| **Database** | MySQL 8.0 | Robust, familiar, scales well |
| **AI** | Google Gemini API | Free tier, super powerful |
| **Deployment** | Docker + Railway | One-click deploy, always online |

---

## 🚀 Get Started in 2 Minutes

### Option 1: Live Version (Easiest)
Just visit: **https://adiitya9.github.io/AI-Interview-Prep/**

No setup needed. Register, log in, and start practicing.

### Option 2: Run Locally

**Requirements:**
- Java 21
- Node.js 20+
- (Optional) Docker

**Steps:**

1. **Clone the repo**
   ```bash
   git clone https://github.com/Adiitya9/AI-Interview-Prep.git
   cd AI-Interview-Prep
   ```

2. **Get an AI API key**
   - Free: Go to [Google AI Studio](https://aistudio.google.com/apikey) and grab a Gemini key
   - Copy your key, you'll need it in the next step

3. **Create `.env` file**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_key_here
   ```

4. **Start everything with Docker**
   ```bash
   docker compose up
   ```
   Or run manually:
   - **Backend**: `cd backend && ./mvnw spring-boot:run`
   - **Frontend**: `cd frontend && npm install && npm run dev`

5. **Open in browser**
   - Frontend: http://localhost:5173
   - API Docs: http://localhost:8080/swagger-ui.html

6. **Test it out**
   - Register a new account, OR
   - Use the default admin account above

---

## 🔐 Auth & Security

- **JWT tokens** keep you logged in securely
- **Role-based access** — Students get the practice features, Admins get the dashboard
- **Passwords are hashed** — We never store plain text
- **CORS enabled** — Safe API access from the frontend

---

## 📊 Features Breakdown

| Feature | What It Does |
|---------|------------|
| **Dashboard** | See your stats: total interviews taken, average score, skill breakdown |
| **Resume Analyzer** | Upload PDF → Get ATS score, skills detected, missing skills, tips to improve |
| **Question Generator** | Pick topic & level → Get 5-30 questions with answers |
| **Mock Interview** | Real interview simulation with AI, voice support, scoring & feedback |
| **Skill Gap Analysis** | Paste job description → See what skills you need to learn |
| **Progress Tracker** | Charts showing your improvement over time |
| **Admin Panel** | See how many users signed up, manage accounts, view analytics |

---

## 🗄️ The Database

We store everything you need to track your journey:
- **Your profile** — Name, email, phone, role
- **Resumes** — PDFs you upload + analysis results
- **Interviews** — Every mock interview session, questions asked, your answers, scores
- **Progress** — Daily records of your interviews and scores
- **Skills** — What you're good at, what you need to learn

---

## 🌐 Deploy It Yourself

Want to host your own version?

### On Railway (Easiest)
1. Fork this repo on GitHub
2. Go to [Railway.app](https://railway.app)
3. Click "New Project" → "Deploy from GitHub"
4. Select this repo
5. Add your Gemini API key to the environment variables
6. Done! Your app is live in minutes

### On AWS EC2
1. Launch an EC2 instance (Ubuntu/Amazon Linux)
2. Install Docker
3. Clone this repo
4. Run `docker compose up`
5. Set up a domain name + SSL certificate (optional but recommended)

---

## 🧪 Tests

The backend has solid test coverage:

```bash
cd backend
./mvnw test
```

Tests include:
- Authentication & authorization
- Resume analysis logic
- Question generation
- Mock interview scoring
- API endpoint checks

---

## 🤔 FAQ

**Q: Is it really free?**
A: Yes! The platform is free. Gemini API has a free tier that's super generous. If you hit the limit, you can use OpenAI or your own API keys.

**Q: Can I use this for interview prep?**
A: Absolutely. This is designed exactly for that. Practice questions, get feedback, improve.

**Q: How accurate is the AI scoring?**
A: Pretty accurate. The AI evaluates based on keywords, concepts, depth of explanation, and structure. It's not perfect but it's honest feedback.

**Q: Can multiple people use this?**
A: Yes! Anyone can sign up. If you deploy it, each person gets their own account.

**Q: Is my data safe?**
A: Yes. Passwords are hashed, API calls are encrypted, and your resumes are stored securely.

---

## 📚 API Docs

When the backend is running, check out:
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/v3/api-docs

All endpoints are documented with request/response examples.

---

## 🙌 Made With ❤️

This project was built to help developers like you ace interviews. If it helps you land your dream job, that's the best reward.

**Built by:** A developer who's been in your shoes
**For:** Everyone preparing for technical interviews

---

## 📝 License

Open source. Use it, modify it, share it. All good.

---

<div align="center">

**Ready to crush your interviews?** 

[Get Started](https://adiitya9.github.io/AI-Interview-Prep/) • [GitHub](https://github.com/Adiitya9/AI-Interview-Prep) • [Report Bug](https://github.com/Adiitya9/AI-Interview-Prep/issues)

</div>
