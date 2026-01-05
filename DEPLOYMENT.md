# 🚀 Deployment Guide

## Overview
This guide covers deploying the Smart Helpdesk system to production. We'll cover cloud hosting, environment configuration, and best practices.

---

## 🌐 **Deployment Options**

### Option 1: Vercel (Frontend) + Railway (Backend + MongoDB)

#### **Backend Deployment on Railway**

##### Step 1: Create Railway Account
1. Go to [Railway.app](https://railway.app/)
2. Sign up with GitHub
3. Create new project

##### Step 2: Deploy MongoDB
```bash
# In Railway dashboard
1. Click "New" → "Database" → "MongoDB"
2. Wait for deployment
3. Copy connection URL from Variables tab
```

##### Step 3: Deploy Backend
```bash
# In your terminal
cd server
railway login
railway init
railway up

# Add environment variables in Railway dashboard:
NODE_ENV=production
MONGO_URI=<your-railway-mongodb-url>
JWT_SECRET=<generate-strong-secret>
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=<your-email>
EMAIL_PASSWORD=<your-app-password>
CLIENT_URL=https://your-frontend.vercel.app
PORT=5000
```

##### Step 4: Get Backend URL
```
Your backend will be at: https://your-app.up.railway.app
```

#### **Frontend Deployment on Vercel**

##### Step 1: Update API URL
```bash
# client/src/services/api.js
const api = axios.create({
  baseURL: 'https://your-app.up.railway.app/api', # Update this
  headers: {
    'Content-Type': 'application/json',
  },
});
```

##### Step 2: Deploy
```bash
cd client
npm install -g vercel
vercel login
vercel

# Follow prompts:
# - Project name: smart-helpdesk
# - Build command: npm run build
# - Output directory: dist
```

##### Step 3: Environment Variables
```bash
# In Vercel dashboard → Settings → Environment Variables
VITE_API_URL=https://your-app.up.railway.app
```

---

### Option 2: Render (Full Stack)

#### Step 1: Create Render Account
1. Go to [Render.com](https://render.com/)
2. Sign up with GitHub
3. Connect your repository

#### Step 2: Deploy MongoDB
```bash
# Option A: Use Render's PostgreSQL (migrate from MongoDB)
# Option B: Use MongoDB Atlas (recommended)

# MongoDB Atlas Setup:
1. Go to mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Whitelist Render IPs (0.0.0.0/0 for simplicity)
```

#### Step 3: Create Web Service (Backend)
```yaml
# render.yaml (create in project root)
services:
  - type: web
    name: smart-helpdesk-api
    env: node
    region: oregon
    plan: free
    buildCommand: cd server && npm install
    startCommand: cd server && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGO_URI
        sync: false
      - key: JWT_SECRET
        generateValue: true
      - key: JWT_EXPIRE
        value: 7d
      - key: EMAIL_HOST
        value: smtp.gmail.com
      - key: EMAIL_PORT
        value: 587
      - key: EMAIL_USER
        sync: false
      - key: EMAIL_PASSWORD
        sync: false
      - key: CLIENT_URL
        value: https://smart-helpdesk.onrender.com
```

#### Step 4: Create Static Site (Frontend)
```yaml
# Add to render.yaml
  - type: web
    name: smart-helpdesk-frontend
    env: static
    buildCommand: cd client && npm install && npm run build
    staticPublishPath: client/dist
    envVars:
      - key: VITE_API_URL
        value: https://smart-helpdesk-api.onrender.com
```

#### Step 5: Deploy
```bash
git add .
git commit -m "Add Render configuration"
git push origin main

# Render will auto-deploy on push
```

---

### Option 3: AWS (EC2 + S3 + RDS)

#### Prerequisites
- AWS Account
- AWS CLI installed
- Basic AWS knowledge

#### Step 1: Launch EC2 Instance
```bash
# In AWS Console:
1. EC2 → Launch Instance
2. Choose Ubuntu 22.04 LTS
3. Instance type: t2.micro (free tier)
4. Security group:
   - SSH (22) from your IP
   - HTTP (80) from anywhere
   - HTTPS (443) from anywhere
   - Custom TCP (5000) from anywhere
5. Create/download key pair
```

#### Step 2: Connect & Setup
```bash
# Connect via SSH
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Install PM2
sudo npm install -g pm2

# Clone repository
git clone https://github.com/yourusername/smart-helpdesk.git
cd smart-helpdesk
```

#### Step 3: Setup Backend
```bash
cd server
npm install

# Create .env
cat > .env << EOF
NODE_ENV=production
MONGO_URI=mongodb://localhost:27017/helpdesk
JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
CLIENT_URL=http://your-ec2-ip
PORT=5000
EOF

# Seed database
npm run seed

# Start with PM2
pm2 start app.js --name helpdesk-api
pm2 save
pm2 startup
```

#### Step 4: Setup Frontend
```bash
cd ../client

# Update API URL in api.js
sed -i "s|http://localhost:5000|http://your-ec2-ip:5000|g" src/services/api.js

npm install
npm run build

# Serve with PM2
pm2 serve dist 3000 --name helpdesk-frontend --spa
pm2 save
```

#### Step 5: Setup Nginx (Optional but recommended)
```bash
sudo apt-get install -y nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/helpdesk

# Add configuration:
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/helpdesk /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 6: Setup SSL with Let's Encrypt
```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
sudo systemctl restart nginx
```

---

### Option 4: Docker + Docker Compose

#### Step 1: Create Dockerfiles

**Backend Dockerfile** (`server/Dockerfile`):
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

**Frontend Dockerfile** (`client/Dockerfile`):
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**Nginx Config** (`client/nginx.conf`):
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Step 2: Create Docker Compose

**docker-compose.yml** (root):
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:6.0
    container_name: helpdesk-mongodb
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: changeme
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  backend:
    build: ./server
    container_name: helpdesk-backend
    restart: unless-stopped
    environment:
      NODE_ENV: production
      MONGO_URI: mongodb://admin:changeme@mongodb:27017/helpdesk?authSource=admin
      JWT_SECRET: your-super-secret-jwt-key-change-this
      JWT_EXPIRE: 7d
      EMAIL_HOST: smtp.gmail.com
      EMAIL_PORT: 587
      EMAIL_USER: your-email@gmail.com
      EMAIL_PASSWORD: your-app-password
      CLIENT_URL: http://localhost
      PORT: 5000
    ports:
      - "5000:5000"
    depends_on:
      - mongodb

  frontend:
    build: ./client
    container_name: helpdesk-frontend
    restart: unless-stopped
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mongodb_data:
```

#### Step 3: Deploy
```bash
# Build and start
docker-compose up -d

# Check logs
docker-compose logs -f

# Stop
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

---

## 🔐 **Security Checklist**

### Pre-Deployment
- [ ] Change all default credentials
- [ ] Generate strong JWT secret
- [ ] Use app passwords for email (not main password)
- [ ] Enable 2FA on all accounts
- [ ] Review CORS settings
- [ ] Update allowed origins

### Post-Deployment
- [ ] Enable HTTPS
- [ ] Setup firewall rules
- [ ] Configure rate limiting
- [ ] Enable MongoDB authentication
- [ ] Restrict database access
- [ ] Setup monitoring alerts
- [ ] Enable automatic backups
- [ ] Create disaster recovery plan

---

## 📊 **Monitoring & Logging**

### Application Monitoring

#### Option 1: PM2 Plus
```bash
pm2 plus
# Follow registration steps
# Monitor from dashboard.pm2.io
```

#### Option 2: Sentry (Error Tracking)
```bash
# Install
npm install @sentry/node @sentry/react

# Configure backend (server/app.js)
const Sentry = require('@sentry/node');
Sentry.init({ dsn: 'your-sentry-dsn' });

# Configure frontend (client/src/main.jsx)
import * as Sentry from '@sentry/react';
Sentry.init({ dsn: 'your-sentry-dsn' });
```

### Database Monitoring

#### MongoDB Atlas
- Use built-in metrics
- Setup alerts for:
  - High CPU usage
  - Low storage
  - Slow queries

#### Self-Hosted MongoDB
```bash
# Enable profiling
mongo
use helpdesk
db.setProfilingLevel(1, { slowms: 100 })

# View slow queries
db.system.profile.find().sort({ ts: -1 }).limit(10)
```

---

## 🔄 **CI/CD Pipeline**

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install backend dependencies
        run: cd server && npm install
      
      - name: Install frontend dependencies
        run: cd client && npm install
      
      # Add test commands when tests exist
      # - name: Run tests
      #   run: npm test

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Railway
        run: |
          npm install -g @railway/cli
          railway login --token ${{ secrets.RAILWAY_TOKEN }}
          cd server
          railway up

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        run: |
          npm install -g vercel
          cd client
          vercel --token ${{ secrets.VERCEL_TOKEN }} --prod
```

---

## 🛠 **Environment Variables Reference**

### Backend (.env)
```bash
# Application
NODE_ENV=production              # production | development
PORT=5000                        # Server port

# Database
MONGO_URI=mongodb://...          # MongoDB connection string

# Authentication
JWT_SECRET=<64-char-random>      # Generate: openssl rand -base64 48
JWT_EXPIRE=7d                    # Token expiry

# Email
EMAIL_HOST=smtp.gmail.com        # SMTP host
EMAIL_PORT=587                   # SMTP port
EMAIL_USER=your@email.com        # Email address
EMAIL_PASSWORD=<app-password>    # App-specific password

# CORS
CLIENT_URL=https://your-app.com  # Frontend URL
```

### Frontend (client/.env)
```bash
# API
VITE_API_URL=https://api.your-app.com  # Backend API URL

# Optional
VITE_APP_NAME=Smart Helpdesk
VITE_APP_VERSION=1.0.0
```

---

## 📦 **Database Backup**

### Automated Backup Script

**backup.sh**:
```bash
#!/bin/bash

# Configuration
BACKUP_DIR="/var/backups/mongodb"
DATE=$(date +%Y-%m-%d_%H-%M-%S)
MONGO_URI="mongodb://localhost:27017"
DB_NAME="helpdesk"

# Create backup directory
mkdir -p $BACKUP_DIR

# Dump database
mongodump --uri=$MONGO_URI --db=$DB_NAME --out=$BACKUP_DIR/$DATE

# Compress
tar -czf $BACKUP_DIR/$DATE.tar.gz -C $BACKUP_DIR $DATE
rm -rf $BACKUP_DIR/$DATE

# Keep only last 7 days
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $BACKUP_DIR/$DATE.tar.gz"
```

**Setup Cron Job**:
```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /path/to/backup.sh >> /var/log/mongodb-backup.log 2>&1
```

---

## 🚨 **Troubleshooting**

### Common Issues

#### 1. CORS Errors
```js
// server/app.js - Add specific origin
app.use(cors({
  origin: 'https://your-frontend.com',
  credentials: true
}));
```

#### 2. Environment Variables Not Loading
```bash
# Check if .env exists
ls -la .env

# Print variables (debug only)
console.log('MONGO_URI:', process.env.MONGO_URI);

# Restart server
pm2 restart all
```

#### 3. MongoDB Connection Failed
```bash
# Check MongoDB status
sudo systemctl status mongod

# Check connection string
mongo "mongodb://localhost:27017/helpdesk"

# Check firewall
sudo ufw status
```

#### 4. Frontend Build Fails
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Increase Node memory
export NODE_OPTIONS=--max_old_space_size=4096
npm run build
```

---

## 📞 **Support & Maintenance**

### Regular Tasks
- **Daily**: Check error logs
- **Weekly**: Review performance metrics
- **Monthly**: Update dependencies
- **Quarterly**: Security audit

### Useful Commands
```bash
# View logs
pm2 logs

# Restart services
pm2 restart all

# Check server health
curl http://localhost:5000/api/health

# Database stats
mongo helpdesk --eval "db.stats()"

# Disk usage
df -h
```

---

**Deployment complete! 🎉 Your Smart Helpdesk is now live.**
