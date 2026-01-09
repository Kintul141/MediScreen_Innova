# 🏗️ System Architecture & Data Flow

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER BROWSERS                             │
│                   (Frontend: React 18)                          │
│                    Port: 3000                                   │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                    HTTP/HTTPS (REST)
                           │
     ┌─────────────────────┼─────────────────────┐
     │                     │                     │
┌────▼──────────┐  ┌──────▼─────────┐  ┌───────▼─────────┐
│   Patient     │  │   Doctor       │  │   AI Service    │
│   Dashboard   │  │   Dashboard    │  │   (Stub)        │
│               │  │                │  │   Port: 3001    │
└────┬──────────┘  └──────┬─────────┘  └─────────────────┘
     │                    │
     └────────────────────┼─────────────────────┐
                          │                     │
                    API Calls (REST)            │
                          │                     │
                          │                     │
    ┌─────────────────────▼────────────────────▼──────┐
    │         BACKEND: Express.js                     │
    │              Port: 3000                         │
    │                                                  │
    │  ┌────────────────────────────────────────┐    │
    │  │  API Routes & Controllers              │    │
    │  │  ├── /auth (Register, Login)          │    │
    │  │  ├── /cases (Upload, Assign, Get)    │    │
    │  │  └── /reports (Create, View)         │    │
    │  └────────────────────────────────────────┘    │
    │                      │                         │
    │  ┌────────────────────▼────────────────────┐  │
    │  │  Middleware & Auth                      │  │
    │  │  ├── JWT Verification                  │  │
    │  │  ├── Role-Based Access Control        │  │
    │  │  └── Error Handling                   │  │
    │  └────────────────────────────────────────┘  │
    │                      │                         │
    │  ┌────────────────────▼────────────────────┐  │
    │  │  File Upload Handler (Multer)          │  │
    │  │  └── /storage/ directory               │  │
    │  └────────────────────────────────────────┘  │
    │                                                │
    └────────────────────┬──────────────────────────┘
                         │
            ┌────────────┴────────────┐
            │                         │
    ┌───────▼─────────┐      ┌───────▼──────────┐
    │  MongoDB        │      │  File Storage    │
    │  Database       │      │  /storage/       │
    │                 │      │  (JPEG, PNG)     │
    │  Collections:   │      └──────────────────┘
    │  - Users        │
    │  - Cases        │
    │  - Reports      │
    └─────────────────┘
```

---

## Data Flow Diagrams

### 1. Patient Upload & Processing Flow

```
Patient
   │
   └─► Upload Image
         │
         └─► Save to /storage/
               │
               └─► Create Case in DB
                     │
                     └─► Call AI Service
                           │
                           └─► Process Image
                                 │
                                 └─► Return Predictions
                                      │
                                      └─► Update Case Status
                                            │
                                            └─► Show Results to Patient
```

### 2. Doctor Review & Report Flow

```
Doctor Dashboard
   │
   └─► View Pending Cases
         │
         └─► Click Case
               │
               └─► View Image + AI Results
                     │
                     └─► Write Notes & Diagnosis
                           │
                           └─► Create Report in DB
                                 │
                                 └─► Update Case Status to "Published"
                                      │
                                      └─► Patient Notified (Report Available)
```

### 3. Authentication Flow

```
User
  │
  └─► Register/Login
        │
        ├─► Send Credentials
        │    │
        │    └─► Verify in Database
        │         │
        │         └─► Hash Password (bcrypt)
        │              │
        │              └─► Create JWT Token
        │                   │
        │                   └─► Return Token + User Data
        │
        └─► Store Token (localStorage)
             │
             └─► Include in API Headers
                  │
                  └─► Backend Verifies Token
                       │
                       └─► Grant Access
```

---

## API Endpoint Structure

```
┌─ POST /auth/register
│  └─ Input: name, email, password, role
│     Output: token, user object
│
├─ POST /auth/login
│  └─ Input: email, password
│     Output: token, user object
│
├─ POST /cases/upload (Requires Auth)
│  └─ Input: image file, notes
│     Output: case object
│
├─ POST /cases/:caseId/process (Requires Auth)
│  └─ Input: caseId
│     Output: case with AI results
│
├─ GET /cases/patient/cases (Requires Auth: Patient)
│  └─ Output: array of patient's cases
│
├─ GET /cases/doctor/cases (Requires Auth: Doctor)
│  └─ Output: array of assigned cases
│
├─ GET /cases/:caseId (Requires Auth)
│  └─ Output: single case details
│
├─ POST /cases/:caseId/assign (Requires Auth: Patient)
│  └─ Input: doctorId
│     Output: updated case
│
├─ GET /cases/doctors/all (Requires Auth)
│  └─ Output: array of all doctors
│
├─ POST /reports (Requires Auth: Doctor)
│  └─ Input: caseId, notes, finalDiagnosis
│     Output: report object
│
├─ GET /reports/case/:caseId (Requires Auth)
│  └─ Output: report for case
│
├─ GET /reports/patient/reports (Requires Auth: Patient)
│  └─ Output: array of patient's reports
│
└─ GET /reports/doctor/reports (Requires Auth: Doctor)
   └─ Output: array of doctor's reports
```

---

## Case Status Lifecycle

```
User Uploads Image
        │
        ▼
    ┌─────────────────────┐
    │  STATUS: UPLOADED   │ ◄──── Image stored in /storage/
    │  - File saved       │       Case created in DB
    │  - Ready to process │
    └─────────┬───────────┘
              │
              ▼
    ┌─────────────────────┐
    │  STATUS: PROCESSED  │ ◄──── AI service called
    │  - AI ran           │       Predictions stored
    │  - Results ready    │       Doctor can review
    └─────────┬───────────┘
              │
              ▼
    ┌─────────────────────┐
    │  STATUS: DOCTOR_    │ ◄──── Doctor assigned
    │  REVIEW             │       Doctor reviewing
    │  - Assigned to Dr.  │       Writing report
    └─────────┬───────────┘
              │
              ▼
    ┌─────────────────────┐
    │  STATUS: PUBLISHED  │ ◄──── Report created
    │  - Report ready     │       Patient notified
    │  - Diagnosis given  │       Case complete
    └─────────────────────┘
```

---

## Component Hierarchy

```
App.jsx
├── Router & Routes
│
├── Navbar
│   ├── Logo & Navigation
│   ├── Auth State Display
│   └── Logout Button
│
├── RoleBasedRoute
│   └── Protected Routes
│
├── Auth Pages
│   ├── Register
│   │   └── Form + Validation
│   └── Login
│       └── Form + Demo Credentials
│
├── Patient Pages
│   ├── Dashboard
│   │   ├── ImageUploader (Component)
│   │   └── CaseCard List (Component)
│   ├── CaseDetail
│   │   ├── Medical Image
│   │   ├── AI Results
│   │   └── Doctor Assignment
│   └── Reports
│       ├── Report List
│       └── ReportViewer (Component)
│
└── Doctor Pages
    ├── Dashboard
    │   ├── Statistics Cards
    │   └── CaseCard List (Component)
    ├── CaseDetail
    │   ├── Medical Image
    │   ├── AI Results
    │   ├── Report Form
    │   └── ReportViewer (Component)
    └── Reports
        └── Report List
```

---

## Database Schema Relationships

```
┌──────────────────┐
│      User        │
├──────────────────┤
│ _id              │◄─────┐
│ name             │      │
│ email            │      │
│ password         │      │
│ role             │      │
│ createdAt        │      │
└──────────────────┘      │
                          │
          ┌───────────────┼───────────────┐
          │               │               │
    ┌─────▼──────┐  ┌─────▼──────┐  ┌────▼─────────┐
    │   Case     │  │   Case     │  │   Report     │
    │ (Patient)  │  │ (Doctor)   │  │              │
    ├────────────┤  ├────────────┤  ├──────────────┤
    │ patientId  │  │ doctorId   │  │ _id          │
    │            │  │            │  │ caseId       │◄──┐
    │ References │  │ References │  │ doctorId     │   │
    │ User._id   │  │ User._id   │  │ notes        │   │
    └────────────┘  └────────────┘  │ diagnosis    │   │
                                     │ findings     │   │
                                     └──────────────┘   │
                                           │            │
                                           └────────────┘
                                           References
                                           Case._id
```

---

## File Organization

```
Frontend/
├── pages/          (8 files - 8 routes)
│   ├── Auth pages  (login, register)
│   ├── Patient     (dashboard, case, reports)
│   └── Doctor      (dashboard, case, reports)
│
├── components/     (6 files - reusable)
│   ├── UI elements (Navbar)
│   ├── Forms       (ImageUploader)
│   ├── Display     (CaseCard, ReportViewer)
│   └── Routing     (RoleBasedRoute)
│
├── context/        (1 file - auth state)
└── api/           (1 file - axios config)

Backend/
├── controllers/    (3 files - logic)
│   ├── auth
│   ├── cases
│   └── reports
│
├── models/        (3 files - schemas)
│   ├── User
│   ├── Case
│   └── Report
│
├── routes/        (3 files - endpoints)
│   ├── auth
│   ├── cases
│   └── reports
│
├── middleware/    (1 file - auth)
└── storage/       (uploaded files)

AI Service/
└── server.js      (stub responses)
```

---

## Security Architecture

```
Client Request
    │
    ├─► CORS Check ──► Allowed Domains Only
    │
    ├─► JWT in Header
    │   └─► Verify Token Signature
    │       ├─► If Invalid ──► 401 Unauthorized
    │       └─► If Valid ──► Extract User ID
    │
    ├─► Check User Role
    │   ├─► Patient Only? ──► Doctor Request ──► 403 Forbidden
    │   ├─► Doctor Only? ──► Patient Request ──► 403 Forbidden
    │   └─► OK ──► Proceed
    │
    ├─► Validate Input
    │   ├─► File Type Check (JPEG/PNG only)
    │   ├─► File Size Check (max 10MB)
    │   ├─► Email Format Validation
    │   └─► Required Fields Check
    │
    ├─► Execute Request
    │
    └─► Return Response
        ├─► Success: 200/201
        └─► Error: 400/401/403/500
```

---

**This architecture provides a complete, scalable medical screening platform with clear separation of concerns, role-based access control, and professional data management.**
