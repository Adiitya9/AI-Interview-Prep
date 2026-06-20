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

---

## Option 3: Deploying Without Docker (Native Builders & VPS)

If you prefer not to write or use Dockerfiles, you can deploy using native build platforms or directly on a virtual machine.

### Native Cloud Platforms (Railway, Koyeb, Zeabur)
Modern PaaS providers support **Nixpacks** or **Cloud Native Buildpacks**, which automatically detect your Maven project, compile it, and run it without requiring a `Dockerfile`.

#### 1. Railway.app (No-Docker Git Deploy)
1. Delete (or ignore) the root `Dockerfile` and `backend/Dockerfile` if you want Railway to fall back on Nixpacks.
2. In Railway, click **New Project** -> **Deploy from GitHub**.
3. Choose the `AI-Interview-Prep` repository.
4. Railway will automatically detect Java/Maven, download dependencies, run `mvn clean package`, and launch the backend executable JAR.
5. Under **Variables**, add the same environment variables (including database credentials and API keys). Make sure to set `PORT` as needed (Spring Boot will bind to it automatically via the updated `server.port=${PORT:8080}` config).

#### 2. Koyeb
1. Sign up on [Koyeb.com](https://www.koyeb.com/).
2. Create a **New Service** and connect your GitHub repository.
3. Select the **Buildpack** builder instead of Docker.
4. Set the **Work Directory** to `backend`.
5. Koyeb will run the Maven buildpack, compile the code, and host the Spring Boot application natively.

---

### Deploying to a Virtual Private Server (VPS / Linux)
You can run the application directly on any cloud VM (AWS EC2, DigitalOcean Droplet, Hetzner, etc.) using systemd.

#### Prerequisites on the Server:
1. Install Java 21 JDK:
   ```bash
   sudo apt update
   sudo apt install openjdk-21-jdk -y
   ```
2. Install MySQL Database (if hosting it yourself):
   ```bash
   sudo apt install mysql-server -y
   ```

#### Steps to Run the Backend:
1. Build the executable JAR on your local machine or server:
   ```bash
   cd backend
   mvn clean package -DskipTests
   ```
2. Copy the resulting JAR (`backend/target/interview-prep-backend-1.0.0.jar`) to your server.
3. Create a background service to keep it running using `systemd`. Create `/etc/systemd/system/interview-prep.service`:
   ```ini
   [Unit]
   Description=Interview Prep Backend
   After=syslog.target network.target

   [Service]
   User=ubuntu
   WorkingDirectory=/home/ubuntu/app
   Environment=SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/interview_prep_db
   Environment=DB_USERNAME=your_db_user
   Environment=DB_PASSWORD=your_db_password
   Environment=JWT_SECRET=your_jwt_secret
   Environment=GEMINI_API_KEY=your_gemini_key
   Environment=PORT=8080
   ExecStart=/usr/bin/java -jar interview-prep-backend-1.0.0.jar
   SuccessExitStatus=143
   Restart=always
   RestartSec=10

   [Install]
   WantedBy=multi-user.target
   ```
4. Enable and start the service:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable interview-prep
   sudo systemctl start interview-prep
   ```

#### Steps to Serve the Frontend:
The frontend can be built to static HTML/CSS/JS and served using **Nginx** (without Nginx Docker):
1. Build the React project:
   ```bash
   cd frontend
   npm install
   npm run build
   ```
2. Copy the static files inside `frontend/dist/` to your server's Nginx web root directory (e.g. `/var/www/html/`).
3. Configure Nginx to route all traffic to `index.html` to support React Router.

