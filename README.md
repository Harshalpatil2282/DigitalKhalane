# 🪔 DigitalKhalane — Khalane Yatra Utsav Platform

> **Created by Harshal Parmeshvar Patil**  
> Official digital platform for the **Khalane Yatra Utsav** festival — built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

---

## ✨ Features

### 🌐 User Side
- 🏠 Home Page — Hero banner, countdown timer, history, highlights, gallery preview, CTAs
- 🎪 Events Page — Filterable events by category with search
- 📅 Schedule Page — Day-wise event timeline
- 📸 Gallery — Photo & video grid with lightbox
- 📢 Announcements — Pinned news & updates
- 📝 Registration — Register for events
- 💛 Donation — Donate to the festival with bank/UPI details
- 📞 Contact — Contact form + Google Maps embed
- 🌙 Dark / Light mode toggle
- 📱 Fully mobile responsive

### 🔐 Admin Panel (`/admin`)
- Secure JWT login (`admin@digitalkhalane.in` / `khalane@2024`)
- Dashboard with stats (events, registrations, donations, gallery, messages)
- Manage Events — CRUD + image upload
- Manage Announcements — CRUD + pin/unpin
- Manage Gallery — Upload photos/videos, delete
- Manage Registrations — View + CSV export
- Manage Donations — View + CSV export
- Content Manager — Edit homepage text, festival date, bank details, social links

---

## ⚙️ Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React.js + Vite, Framer Motion    |
| Backend    | Node.js + Express.js              |
| Database   | MongoDB + Mongoose                |
| Auth       | JWT + bcryptjs                    |
| Uploads    | Multer (local disk)               |
| HTTP       | Axios                             |
| Routing    | React Router v6                   |

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### 1. Clone & Setup

```bash
git clone <repo-url>
cd DigitalKhalane
```

### 2. Backend Setup

```bash
cd server
npm install
cp .env.example .env   # Edit MONGO_URI and JWT_SECRET
npm run seed           # Creates admin user + sample data
npm run dev            # Starts on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd ../client
npm install
# .env already configured for localhost
npm run dev            # Starts on http://localhost:5173
```

### 4. Login to Admin Panel
- URL: `http://localhost:5173/admin`
- Email: `admin@digitalkhalane.in`
- Password: `khalane@2024`

---

## 📁 Project Structure

```
DigitalKhalane/
├── server/
│   ├── config/db.js
│   ├── controllers/       (auth, events, registrations, gallery, donations, contact, content, stats)
│   ├── middleware/        (auth, upload, errorHandler)
│   ├── models/            (User, Event, Registration, Announcement, Gallery, Donation, Contact, SiteContent)
│   ├── routes/            (all REST API routes)
│   ├── utils/seed.js      (sample data seeder)
│   ├── uploads/           (uploaded images/videos)
│   ├── index.js
│   └── .env
│
└── client/
    └── src/
        ├── components/    (Navbar, Footer, WelcomeModal, AdminSidebar, ProtectedRoute)
        ├── context/       (AuthContext, ThemeContext)
        ├── pages/
        │   ├── user/      (Home, Events, EventDetail, Schedule, Gallery, Announcements, Registration, Donation, Contact)
        │   └── admin/     (Login, Dashboard, Events, Announcements, Gallery, Registrations, Donations, Content)
        ├── services/api.js
        └── App.jsx
```

---

## 🌐 Deployment

### Frontend → Vercel
1. Push `client/` folder to GitHub
2. Import to Vercel, set root to `client/`
3. Add env var: `VITE_API_URL=https://your-api.onrender.com/api`

### Backend → Render
1. Push `server/` folder to GitHub
2. Create Web Service on Render
3. Build: `npm install`, Start: `npm start`
4. Add env vars from `.env.example`
5. Use MongoDB Atlas URI for `MONGO_URI`

---

## 📞 Contact
**Harshal Parmeshvar Patil**  
📧 info@digitalkhalane.in  
📍 Khalane Village, Dhule District, Maharashtra

---

*Made with ❤️ for the people of Khalane Village — Jai Khalane! 🛕*
