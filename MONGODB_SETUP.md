# MongoDB Setup Guide - DigitalKhalane

Your server needs MongoDB to run. Choose one of the options below:

---

## ✅ Option 1: Use MongoDB Atlas (Recommended for Cloud)

### Step 1: Create Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up (it's free!)
3. Create a project: "DigitalKhalane"

### Step 2: Create Cluster
1. Click "Create Deployment"
2. Choose "Free" tier
3. Select your preferred region
4. Click "Create"

### Step 3: Get Connection String
1. Click "Connect"
2. Choose "Drivers" → "Node.js"
3. Copy the connection string

### Step 4: Update .env
Replace in `server/.env`:
```
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/digitalkhalane
```

Replace `<username>` and `<password>` with your credentials

### Step 5: Whitelist IP (Important!)
1. Go to Security → Network Access
2. Click "Add IP Address"
3. Choose "Allow Access from Anywhere" (for development)
4. Click "Confirm"

✅ Done! Your server will connect to MongoDB Atlas

---

## ✅ Option 2: Install MongoDB Locally (Windows/Mac/Linux)

### Windows - Windows Subsystem for Linux 2 (WSL2)
```bash
# If you have WSL2 installed
wsl
sudo apt-get update
sudo apt-get install mongodb
sudo service mongodb start

# Or use MongoDB community edition
# Download from: https://www.mongodb.com/try/download/community
```

### Windows - Direct Installation
1. Download MongoDB Community: https://www.mongodb.com/try/download/community
2. Run installer
3. Accept defaults
4. MongoDB service starts automatically
5. Verify: Open Command Prompt and run `mongosh`

### Mac (with Homebrew)
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Linux (Ubuntu/Debian)
```bash
sudo apt-get update
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

### Verify Installation
```bash
# Test connection
mongosh "mongodb://localhost:27017/digitalkhalane"

# You should see: test>
# Type "exit" to quit
```

✅ Done! MongoDB is running on localhost:27017

---

## 🚀 Next Steps

### After Setting Up MongoDB:

1. **Start Server**
```bash
cd server
npm run dev
```

Should show:
```
✅ MongoDB Connected Successfully
   Host: localhost (or cluster.mongodb.net)
   Database: digitalkhalane
   
🎪  DigitalKhalane API Server Started
🌐  http://localhost:5000
```

2. **Seed Default Data**
```bash
node utils/seed.js
```

Should show:
```
✅ Admin user created → admin@digitalkhalane.in / khalane@2024
✅ 8 events created
```

3. **Test Login**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@digitalkhalane.in","password":"khalane@2024"}'
```

Should return: `200 OK` with JWT token ✅

---

## 🆘 Troubleshooting

### "Cannot connect to MongoDB"
**Solution:** Make sure MongoDB is running
```bash
# Check if MongoDB is running
mongosh

# If not running, start it:
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongodb
# Windows: Services app → search "MongoDB" → Start
```

### "connect ECONNREFUSED 127.0.0.1:27017"
**Solution:** MongoDB isn't running on localhost
- Start MongoDB service (see above)
- OR use MongoDB Atlas instead

### "Authentication failed"
**Solution:** Check MongoDB credentials in .env file
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/digitalkhalane
```
- Make sure username and password are correct
- Make sure IP is whitelisted in MongoDB Atlas

### "Database doesn't exist"
**Solution:** The database is created automatically when first data is inserted. Run the seed script:
```bash
node utils/seed.js
```

---

## 📊 Comparison: Local vs Cloud

| Feature | Local MongoDB | MongoDB Atlas |
|---------|--------------|---------------|
| Cost | Free | Free (with limits) |
| Setup Time | 5-10 min | 2-3 min |
| Performance | Fast (local) | Network latency |
| Maintenance | You manage | MongoDB manages |
| Best For | Development | Development + Production |
| Backups | Manual | Automatic |

---

## ✅ Quick Start (Choose One)

### Fast Track (MongoDB Atlas - 5 min)
```bash
# 1. Create free account at https://www.mongodb.com/cloud/atlas
# 2. Create cluster and get connection string
# 3. Update MONGO_URI in server/.env
# 4. Done!
cd server && npm run dev
```

### Local Development (MongoDB Local - 10 min)
```bash
# 1. Install MongoDB (see options above for your OS)
# 2. Start MongoDB service
# 3. Verify with: mongosh
# 4. Done!
cd server && npm run dev
```

---

## 📝 .env Configuration

### For Local MongoDB
```
MONGO_URI=mongodb://localhost:27017/digitalkhalane
```

### For MongoDB Atlas
```
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/digitalkhalane
```

Get your connection string from MongoDB Atlas:
1. Go to Cluster → Connect
2. Choose "Drivers" 
3. Copy the connection string
4. Replace `<username>`, `<password>`, and cluster details

---

## 🎯 Recommended Setup

**For Development:** Local MongoDB or MongoDB Atlas (both work)
**For Production:** MongoDB Atlas (managed, automatic backups)
**For Testing:** In-memory MongoDB (for unit tests)

---

**Status:** Choose one option above and configure your .env file accordingly.

Next: Go back to [QUICK_START.md](./QUICK_START.md) and continue from Step 2.
