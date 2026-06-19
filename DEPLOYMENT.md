# Deploying the AI Interview Prep Platform

This guide explains how to deploy the backend (Spring Boot), frontend (React), and database (MySQL) online so that it is accessible 24/7.

---

## Option 1: Railway.app (Recommended - Fastest & Simplest)

Railway is highly recommended because it can parse your `docker-compose.yml` and deploy the entire multi-container stack automatically.

### Steps:
1. Go to [Railway.app](https://railway.app/) and sign in with your GitHub account.
2. Click **New Project** -> **Deploy from GitHub repo**.
3. Select your repository: `AI-Interview-Prep`.
4. Railway will automatically detect the services in your repository:
   * **MySQL Database**: Set up a new MySQL service on Railway.
   * **Backend service**: Railway will build it using the `./backend/Dockerfile`.
     * Add these environment variables under the **Variables** tab:
       * `SPRING_DATASOURCE_URL` = `jdbc:mysql://mysql:3306/interview_prep_db` (using your Railway MySQL connection string)
       * `DB_USERNAME` = `${{MYSQLUSER}}`
       * `DB_PASSWORD` = `${{MYSQLPASSWORD}}`
       * `JWT_SECRET` = `YourCustomSecureJWTSecretString`
       * `AI_PROVIDER` = `gemini`
       * `GEMINI_API_KEY` = `your-actual-api-key`
   * **Frontend service**: Railway will build the static React frontend from the `./frontend/Dockerfile`.
     * Set the `VITE_API_URL` variable to point to the URL of your deployed backend service (e.g., `https://your-backend-service.up.railway.app/api/v1`).
5. Click deploy. Both services will be online, linked, and run automatically.

---

## Option 2: Render.com (100% Free Tier)

Render provides a completely free tier for static sites, web services, and databases.

### Step 1: Deploy MySQL Database
1. Sign in to [Render.com](https://render.com/).
2. Click **New** -> **PostgreSQL** or set up a free MySQL instance via an external provider like **Aiven.io** or **Tidbcloud.com** (Render does not offer a free MySQL tier directly anymore, but external free MySQL hosts work perfectly).
3. Save the connection details (URL, username, password).

### Step 2: Deploy Spring Boot Backend
1. On Render, click **New** -> **Web Service**.
2. Connect your GitHub repository.
3. Configure the following:
   * **Name**: `interview-prep-backend`
   * **Language/Runtime**: `Docker`
   * **Docker Command**: Leave default (uses `./backend/Dockerfile`)
4. Add the following **Environment Variables**:
   * `SPRING_DATASOURCE_URL` = `jdbc:mysql://your-external-mysql-host:3306/db_name`
   * `DB_USERNAME` = `your_db_username`
   * `DB_PASSWORD` = `your_db_password`
   * `JWT_SECRET` = `SomeVeryLongAndSecureJWTSecretString`
   * `GEMINI_API_KEY` = `your_gemini_api_key`
5. Click **Deploy Web Service**. Once built, copy your service's URL (e.g., `https://interview-prep-backend.onrender.com`).

### Step 3: Deploy React Frontend
1. On Render, click **New** -> **Static Site**.
2. Connect your GitHub repository.
3. Configure:
   * **Name**: `interview-prep-frontend`
   * **Build Command**: `cd frontend && npm install && npm run build`
   * **Publish Directory**: `frontend/dist`
4. Add the following **Environment Variable**:
   * `VITE_API_URL` = `https://interview-prep-backend.onrender.com/api/v1` (paste your copied backend URL here)
5. Click **Create Static Site**.
6. Access the live platform at the URL provided by Render!
