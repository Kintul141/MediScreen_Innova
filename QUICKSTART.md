# 🚀 Quick Start Guide

## ⚡ 30-Second Setup

### Step 1: Install MongoDB (if you don't have it)
- Download: https://www.mongodb.com/try/download/community
- Or use MongoDB Atlas (Cloud): https://www.mongodb.com/cloud/atlas

### Step 2: Open 4 Terminals

**Terminal 1: Backend**
```bash
cd backend
npm install
npm run dev
```
✅ Backend running on http://localhost:3000

**Terminal 2: AI Service**
```bash
cd ai-service
npm install
npm run dev
```
✅ AI Service running on http://localhost:3001

**Terminal 3: Frontend**
```bash
cd frontend
npm install
npm start
```
✅ Frontend running on http://localhost:3000 (browser)

**Terminal 4: MongoDB (if local)**
```bash
mongod
```

## 🔐 Demo Accounts (Auto-created)

### Patient
- Email: `patient@demo.com`
- Password: `password`

### Doctor
- Email: `doctor@demo.com`
- Password: `password`

## 🧪 Test the Platform

### 1. Patient Flow
1. Go to http://localhost:3000
2. Click "Get Started" → Register OR Sign In with patient demo account
3. Upload a medical image (any .jpg/.png file)
4. View AI analysis results
5. Assign to a doctor
6. Wait for doctor's report

### 2. Doctor Flow
1. Go to http://localhost:3000/login
2. Sign in with doctor demo account
3. View pending cases on Doctor Dashboard
4. Click case to view image + AI results
5. Write medical notes and diagnosis
6. Publish report

### 3. Patient Reviews Report
1. Go to Patient → "Reports"
2. View the finalized doctor report
3. Download as JSON

## 📁 Project Structure

```
New_DA_Hack/
├── backend/              # Express.js + MongoDB
│   ├── app.js           # Main server
│   ├── package.json
│   ├── .env
│   └── controllers/     # Business logic
├── frontend/            # React.js
│   ├── src/
│   │   ├── App.jsx
│   │   ├── pages/       # Route pages
│   │   ├── components/  # UI components
│   │   └── context/     # Auth
│   └── package.json
├── ai-service/          # AI stub
│   ├── server.js
│   └── package.json
└── README.md            # Full documentation
```

## 🆘 Troubleshooting

### "Cannot find module 'express'"
```bash
# Run in backend folder
npm install
```

### "MongoDB connection error"
1. Start MongoDB: `mongod`
2. Or use MongoDB Atlas (cloud) in `.env`

### Port 3000 already in use
```bash
# Change in backend/.env
PORT=3001
```

### Frontend shows blank page
- Check browser console (F12)
- Ensure backend is running
- Ensure `.env` has `REACT_APP_API_URL=http://localhost:3000/api`

## 📚 API Testing

Use Postman or curl:

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"123456","role":"patient"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"123456"}'
```

## 📞 Need Help?

1. Check the main `README.md` for full documentation
2. Review `.env` files for configuration
3. Check terminal logs for error messages
4. Ensure all ports are available (3000, 3001)
5. MongoDB must be running

---

**Happy Screening! 🏥**
