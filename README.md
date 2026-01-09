# 🏥 MediScreen - Early Medical Disease Screening Platform

A full-stack web application for early disease detection with AI inference capabilities (stubbed). The platform enables patients to upload medical images and doctors to review and diagnose cases.

## 📋 Features

### Patient Features
- **User Registration & Authentication** - Secure JWT-based auth with bcrypt hashing
- **Medical Image Upload** - Upload X-ray, CT, and other medical images
- **AI Analysis Results** - View automatic AI predictions with confidence scores
- **Doctor Assignment** - Assign cases to doctors for review
- **Case History** - Track all uploaded cases and their status
- **View Reports** - Read finalized doctor reports

### Doctor Features
- **Case Dashboard** - View all assigned cases requiring review
- **AI Analysis Review** - Examine AI results and medical images
- **Report Creation** - Add clinical notes and final diagnosis
- **Report Management** - View history of all published reports

### System Features
- **Role-Based Access Control** - Separate workflows for patients and doctors
- **Case Status Tracking** - Uploaded → AI Processed → Doctor Review → Published
- **Responsive Design** - Works on desktop and mobile devices
- **Medical UI Theme** - Clean, clinical design with teal/green/blue accents

## 🏗️ Architecture

```
medical-screening/
├── backend/                 # Express.js + MongoDB backend
│   ├── controllers/        # Business logic
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API endpoints
│   ├── middleware/        # Auth & validation
│   ├── storage/           # Uploaded files
│   ├── app.js             # Main server
│   ├── package.json
│   └── .env
├── frontend/              # React.js frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Route pages
│   │   ├── context/      # Auth context
│   │   ├── api/          # API client
│   │   └── App.jsx       # Main app component
│   ├── public/
│   ├── package.json
│   └── .env
└── ai-service/           # AI stub service
    ├── server.js
    ├── package.json
    └── .env
```

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Multer** - File uploads
- **Axios** - HTTP client

### Frontend
- **React 18** - UI library
- **React Router v6** - Routing
- **Axios** - API calls
- **Context API** - State management
- **CSS3** - Styling

### AI Service
- **Express.js** - Stub service (stubbed AI responses)

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone & Extract
```bash
cd New_DA_Hack
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment
# Edit .env file:
# PORT=3000
# MONGO_URI=mongodb://localhost:27017/medical-screening
# JWT_SECRET=your_secret_key

# Start backend (development)
npm run dev

# Or production
npm start
```

Backend will run on `http://localhost:3000`

### 3. AI Service Setup

```bash
cd ai-service

# Install dependencies
npm install

# Start AI service
npm run dev
# Or: npm start
```

AI service will run on `http://localhost:3001`

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment (if needed)
# .env already has: REACT_APP_API_URL=http://localhost:3000/api

# Start frontend (development)
npm start
```

Frontend will open on `http://localhost:3000` in your browser

## ✅ Running All Services

**Terminal 1 - MongoDB** (if local)
```bash
mongod
```

**Terminal 2 - Backend**
```bash
cd backend
npm run dev
```

**Terminal 3 - AI Service**
```bash
cd ai-service
npm run dev
```

**Terminal 4 - Frontend**
```bash
cd frontend
npm start
```

## 🔐 Demo Credentials

### Patient Account
- **Email:** patient@demo.com
- **Password:** password
- **Role:** Patient

### Doctor Account
- **Email:** doctor@demo.com
- **Password:** password
- **Role:** Doctor

> Create your own accounts via the registration page

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Cases (Patient)
- `POST /api/cases/upload` - Upload medical image
- `GET /api/cases/patient/cases` - Get patient's cases
- `GET /api/cases/:caseId` - Get case details
- `POST /api/cases/:caseId/assign` - Assign case to doctor
- `GET /api/cases/doctors/all` - Get all doctors

### Cases (Doctor)
- `GET /api/cases/doctor/cases` - Get assigned cases
- `POST /api/cases/:caseId/process` - Process case with AI (stub)

### Reports
- `POST /api/reports` - Create report (doctor only)
- `GET /api/reports/case/:caseId` - Get case report
- `GET /api/reports/patient/reports` - Get patient reports
- `GET /api/reports/doctor/reports` - Get doctor reports

### AI Service
- `POST /api/process` - Process image (stub returns dummy data)

## 🎯 User Workflows

### Patient Workflow
1. Register / Login → Patient Dashboard
2. Upload medical image → Image is processed by AI stub
3. View AI results (diseases, confidence, explanation)
4. Optionally assign case to a doctor
5. View finalized doctor reports

### Doctor Workflow
1. Login → Doctor Dashboard
2. View pending cases requiring review
3. Examine patient image and AI analysis
4. Write medical notes and final diagnosis
5. Publish report to patient
6. Track all completed reports

## 📊 Database Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'patient' | 'doctor',
  createdAt: Date
}
```

### Case
```javascript
{
  patientId: ObjectId (ref: User),
  doctorId: ObjectId (ref: User, nullable),
  imageUrl: String,
  imageFilename: String,
  aiOutput: Object,
  status: 'uploaded' | 'processed' | 'doctor_review' | 'published',
  patientNotes: String,
  createdAt, processedAt, assignedAt, publishedAt: Date
}
```

### Report
```javascript
{
  caseId: ObjectId (ref: Case),
  doctorId: ObjectId (ref: User),
  notes: String,
  finalDiagnosis: String,
  diseaseFindings: Object,
  createdAt, updatedAt: Date
}
```

## 🤖 AI Stub Response Format

```javascript
{
  disease: {
    tb: "Detected: No (confidence 0.12)",
    pneumonia: "Detected: Yes (confidence 0.87)",
    fracture: "Detected: No (confidence 0.03)",
    covid: "Detected: No (confidence 0.05)"
  },
  explainability: "Opacity detected in lower left lung zone...",
  overlayImageUrl: "/placeholders/heatmap.png",
  confidenceScore: 0.87,
  processingTime: "2.34s"
}
```

## 📁 File Upload

- **Location:** `backend/storage/`
- **Allowed:** JPEG, PNG images
- **Max Size:** 10MB
- **Access:** Served at `/storage/[filename]`

## 🎨 Design System

### Colors
- **Primary:** #00a39a (Teal)
- **Secondary:** #008479 (Dark Teal)
- **Success:** #4caf50 (Green)
- **Danger:** #dc3545 (Red)
- **Text:** #333 (Dark Gray)
- **Background:** #f8f9fa (Light Gray)

### Medical Theme
- Clean, minimal interface
- Institutional color palette
- High contrast for readability
- Clear information hierarchy

## 🔒 Security Features

✅ JWT-based authentication
✅ Password hashing with bcrypt
✅ Role-based access control
✅ Request validation
✅ Error handling
✅ CORS protection
✅ File type validation

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Ensure MongoDB is running or update `MONGO_URI` in `.env` to use MongoDB Atlas

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution:** Change PORT in `.env` or kill process using port

### CORS Errors
```
Access to XMLHttpRequest has been blocked by CORS policy
```
**Solution:** Ensure backend is running on `http://localhost:3000`

### File Upload Fails
```
storage/ directory not found
```
**Solution:** The directory is created automatically, or manually create `backend/storage/`

## 📝 Notes

- **AI Service:** Currently stubbed with dummy responses. Replace with actual ML model integration
- **Storage:** Files stored locally. For production, use cloud storage (AWS S3, Azure Blob, etc.)
- **Database:** Uses local MongoDB. For production, use MongoDB Atlas or managed service
- **JWT Secret:** Change in production to a strong random string

## 🚀 Production Deployment

### Backend
1. Set `NODE_ENV=production` in `.env`
2. Use MongoDB Atlas for database
3. Deploy on Heroku, AWS, or similar
4. Set proper `JWT_SECRET`

### Frontend
1. Build: `npm run build`
2. Deploy build folder to Vercel, Netlify, or similar
3. Update `REACT_APP_API_URL` to production API

### AI Service
1. Deploy as separate service
2. Update backend `localhost:3001` reference

## 📄 License

ISC

## 👤 Author

Created with ❤️ for medical screening

---

**For questions or issues, please check the troubleshooting section or review the code comments.**
