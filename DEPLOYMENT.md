# DigitalKhalane - Deployment Guide 🚀

## Quick Start (Development)

### Prerequisites
- **Node.js** v18+ and **npm**
- **MongoDB** (local or Atlas connection string)
- **Git** (for version control)

### Step 1: Clone & Install Dependencies

```bash
# Server setup
cd server
npm install

# Client setup
cd ../client
npm install
```

### Step 2: Configure Environment Variables

**Server (.env)**
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/digitalkhalane
JWT_SECRET=khalane_yatra_utsav_secret_2024_harshal_patil
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

**Client (.env)**
```
VITE_API_URL=http://localhost:5000/api
```

### Step 3: Seed Default Admin User

```bash
cd server
node utils/seed.js
```

Default credentials:
- Email: `admin@digitalkhalane.in`
- Password: `khalane@2024`

### Step 4: Start Development Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

Access the app at: `http://localhost:5173`

---

## Production Deployment

### 1. Environment Configuration

Create `.env` file with production values:

```bash
# Server Production .env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/digitalkhalane
JWT_SECRET=<USE_STRONG_RANDOM_SECRET_MIN_32_CHARS>
JWT_EXPIRES_IN=7d
NODE_ENV=production
CLIENT_URL=https://yourdomain.com
```

**Generate Strong JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Build Frontend

```bash
cd client
npm run build
```

This creates `dist/` folder for static hosting.

### 3. Database Setup

**Option A: Local MongoDB**
```bash
# Ensure MongoDB service is running
mongod
```

**Option B: MongoDB Atlas (Recommended)**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create cluster and database
3. Get connection string: `mongodb+srv://...`
4. Add IP address to whitelist

### 4. Deploy Backend

#### Docker Deployment (Recommended)

Create `Dockerfile` in server/:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["node", "index.js"]
```

Build & run:
```bash
docker build -t digitalkhalane-api .
docker run -p 5000:5000 --env-file .env digitalkhalane-api
```

#### Traditional Deployment (VPS/EC2)

```bash
# On server
cd /var/www/digitalkhalane/server
npm install --production
npm start
```

Use PM2 for process management:
```bash
npm install -g pm2
pm2 start index.js --name "digitalkhalane-api"
pm2 save
pm2 startup
```

### 5. Deploy Frontend

#### Static Hosting (Vercel, Netlify)

```bash
cd client
npm run build
# Upload dist/ folder to your hosting
```

#### Serve from Same Server

```bash
# Copy built files to server
cp -r client/dist server/public/

# Update server to serve static files
app.use(express.static(path.join(__dirname, 'public')));
```

### 6. Setup Reverse Proxy (Nginx)

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Static files
    location / {
        root /var/www/digitalkhalane/client/dist;
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 7. SSL Certificate (HTTPS)

```bash
# Using Let's Encrypt with Certbot
sudo certbot certonly --nginx -d yourdomain.com
```

---

## Troubleshooting

### Server Crashes on Login

✅ **Fixed Issues:**
- Missing async error handler
- No input validation
- Unhandled promise rejections
- Missing environment variables

**Verify:**
```bash
# Check logs
npm run dev

# Test health endpoint
curl http://localhost:5000/api/health

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@digitalkhalane.in","password":"khalane@2024"}'
```

### Database Connection Issues

```bash
# Check MongoDB
mongo "mongodb://localhost:27017/digitalkhalane"

# If using Atlas, verify:
# 1. Connection string is correct
# 2. IP is whitelisted
# 3. Username/password are correct
```

### CORS Errors

Ensure `CLIENT_URL` in server `.env` matches your frontend URL:
```
CLIENT_URL=http://localhost:5173  # Development
CLIENT_URL=https://yourdomain.com  # Production
```

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | ❌ | Admin login |
| GET | `/api/auth/me` | ✅ | Get current user |
| GET | `/api/health` | ❌ | Server health check |

---

## Security Best Practices

✅ **Implemented:**
- JWT token authentication
- Password hashing with bcrypt
- Input validation
- Rate limiting on login endpoint
- Error handler catches all exceptions
- Environment variables for secrets

🔒 **Before Production:**
1. Change default admin password
2. Use strong JWT_SECRET
3. Enable HTTPS
4. Set CORS properly
5. Run regular security audits
6. Use environment-specific configs
7. Implement logging/monitoring
8. Regular database backups

---

## Monitoring & Logs

Check application logs:
```bash
# PM2 logs
pm2 logs digitalkhalane-api

# Docker logs
docker logs <container_id>

# System logs
journalctl -u digitalkhalane-api -f
```

---

## Support

Created by **Harshal Parmeshvar Patil**  
For issues, check console output and error messages.
