# 🚀 DigitalKhalane - Quick Setup Guide

## What Was Fixed

Your server was crashing on login due to 5 critical issues:

1. ❌ **No Async Error Wrapper** - Using `asyncHandler()` middleware now
2. ❌ **Missing Input Validation** - Added email format & password validation
3. ❌ **Poor Error Logging** - Now logs all errors with stack traces
4. ❌ **Missing Security** - Added rate limiting & enhanced auth checks
5. ❌ **Silent Database Failures** - Better DB connection error handling

## ✅ What's Been Added

| File | Change |
|------|--------|
| `middleware/asyncHandler.js` | NEW - Wraps async route handlers |
| `middleware/validation.js` | NEW - Input validation for login |
| `middleware/security.js` | NEW - Rate limiting & security |
| `controllers/authController.js` | Updated - Better logging & error handling |
| `routes/auth.js` | Updated - Uses new middlewares |
| `middleware/errorHandler.js` | Enhanced - Full error logging |
| `middleware/auth.js` | Enhanced - Better verification |
| `config/db.js` | Enhanced - Better connection errors |
| `index.js` | Enhanced - Environment validation & handlers |
| `package.json` | Updated - Added express-rate-limit |
| `DEPLOYMENT.md` | NEW - Complete deployment guide |

---

## 🎯 Getting Started (5 minutes)

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Setup Database
Make sure MongoDB is running:
```bash
# Local MongoDB
mongod

# OR if using MongoDB Atlas, update .env with your connection string
```

Update `server/.env`:
```
MONGO_URI=mongodb://localhost:27017/digitalkhalane
JWT_SECRET=khalane_yatra_utsav_secret_2024_harshal_patil
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### 3. Seed Default Admin
```bash
cd server
node utils/seed.js
```

Output should show:
```
✅ MongoDB Connected Successfully
✅ Admin user created → admin@digitalkhalane.in / khalane@2024
✅ 8 events created
```

### 4. Start Server
```bash
npm run dev
```

Server should start without crashes:
```
✅ MongoDB Connected Successfully
   Host: localhost
   Database: digitalkhalane

🎪  DigitalKhalane API Server Started
🌐  http://localhost:5000
```

### 5. Test Login Endpoint
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@digitalkhalane.in",
    "password": "khalane@2024"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "name": "Harshal Parmeshvar Patil",
    "email": "admin@digitalkhalane.in",
    "role": "superadmin"
  }
}
```

---

## 🧪 Testing Different Scenarios

### ✅ Valid Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@digitalkhalane.in","password":"khalane@2024"}'
```

### ❌ Invalid Email
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid-email","password":"khalane@2024"}'
```

Response: `400 Invalid email format`

### ❌ Missing Password
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@digitalkhalane.in"}'
```

Response: `400 Email and password are required`

### ❌ Wrong Password
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@digitalkhalane.in","password":"wrongpass"}'
```

Response: `401 Invalid credentials`

### ⏱️ Rate Limiting (5+ attempts in 15 min)
```bash
# Run 6 times quickly
for i in {1..6}; do
  curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@digitalkhalane.in","password":"wrong"}' \
  echo "\n"
done
```

6th attempt response: `429 Too many login attempts`

---

## 📋 Deployment Checklist

Before deploying to production, see `DEPLOYMENT.md`:

- [ ] Generated strong JWT_SECRET
- [ ] Configured MongoDB (Atlas recommended)
- [ ] Set NODE_ENV=production
- [ ] Updated CLIENT_URL to your domain
- [ ] Tested all login scenarios
- [ ] Checked console for errors
- [ ] Enabled HTTPS/SSL certificate
- [ ] Setup rate limiting
- [ ] Configured CORS properly
- [ ] Setup monitoring/logs
- [ ] Database backups scheduled

---

## 🆘 Troubleshooting

### Server crashes on login
✅ **FIXED** - Check logs for detailed error

### CORS errors from frontend
Update `CLIENT_URL` in `.env`:
```
CLIENT_URL=http://localhost:5173  # development
CLIENT_URL=https://yourdomain.com  # production
```

### MongoDB connection fails
```bash
# Check MongoDB is running
mongo --version

# Check connection string
cat server/.env | grep MONGO_URI

# Test connection
mongo "mongodb://localhost:27017/digitalkhalane"
```

### Token errors
Clear localStorage in browser and login again:
```javascript
localStorage.clear()
```

---

## 📚 Key Files

| File | Purpose |
|------|---------|
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Complete deployment guide |
| `server/middleware/asyncHandler.js` | Error handling wrapper |
| `server/middleware/validation.js` | Input validation |
| `server/middleware/errorHandler.js` | Global error handler |
| `server/routes/auth.js` | Auth endpoints |

---

## 🎓 What You Learned

**Server Crashes Typically Happen Due To:**
1. Unhandled async errors (use express wrapper)
2. Missing validation (validate early)
3. Env var not set (check with `.env`)
4. DB connection issues (log everything)
5. Silent exceptions (wrap with try-catch)

**Always Include:**
- Input validation
- Error logging
- Async error handling
- Environment checks
- Database connection verification

---

## ✨ Next Steps

1. **Run the server** - `npm run dev`
2. **Test the login** - Use curl examples above
3. **Check logs** - Look for 200 status code ✅
4. **Deploy** - Follow [DEPLOYMENT.md](./DEPLOYMENT.md)
5. **Monitor** - Setup PM2 or Docker for production

---

**Created by:** Harshal Parmeshvar Patil  
**Last Updated:** April 9, 2026  
**Status:** ✅ Ready for Deployment
