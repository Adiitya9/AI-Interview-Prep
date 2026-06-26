# Deploy to Railway

**Railway.app is recommended over Render** — it has better free tier Docker support and faster builds.

## Step 1: Create a Railway Account
1. Go to https://railway.app
2. Click **Create Account** and sign in with GitHub (recommended)
3. Give Railway permission to access your repository

## Step 2: Deploy the Backend
1. Click **New Project** on the Railway dashboard
2. Click **Deploy from GitHub repo**
3. Select your repository: `Adiitya9/AI-Interview-Prep`
4. Click **Deploy**

Railway will automatically:
- Detect the Dockerfile
- Build the Spring Boot backend
- Run it on `https://YOUR-PROJECT.railway.app`

## Step 3: Set Environment Variables
Once the backend is running:
1. Click on the **Backend** service in Railway
2. Go to **Variables** tab
3. Add these environment variables:

```
SPRING_DATASOURCE_URL=jdbc:h2:mem:interviewdb;DB_CLOSE_DELAY=-1
SPRING_DATASOURCE_DRIVER_CLASS_NAME=org.h2.Driver
DB_USERNAME=sa
DB_PASSWORD=
SPRING_JPA_DATABASE_PLATFORM=org.hibernate.dialect.H2Dialect
JWT_SECRET=mySecretKey2026InterviewPrepPlatformSecureKeyThatIsLongEnoughForHS512AndAtLeastSixtyFourCharacters
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key_here
```

4. Click **Save**

Railway will automatically redeploy with the new variables.

## Step 4: Connect Frontend to Backend
1. Copy your Railway backend URL (e.g., `https://your-backend.railway.app`)
2. Go to https://adiitya9.github.io/AI-Interview-Prep/
3. Click the **Settings gear (⚙️)** on the login card
4. Enter: `https://your-backend.railway.app/api/v1`
5. Click **Save**
6. Log in!

## Troubleshooting

**Backend not starting?**
- Go to Railway dashboard → your backend service → **Logs** tab
- Look for error messages

**Database connection failing?**
- Verify all environment variables are set correctly in Railway
- Ensure `SPRING_DATASOURCE_URL` matches the profile (H2 or MySQL)

**CORS errors on frontend?**
- The frontend will automatically proxy through the settings dialog
- Make sure the backend URL is correct in the settings

---

For production with persistent MySQL database, upgrade to Railway's paid plan or use a managed database service like Aiven.
