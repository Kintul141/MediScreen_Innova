# 📝 Development & Customization Guide

## 🔧 Modifying the Application

### Changing API URLs
**File:** `frontend/.env`
```
REACT_APP_API_URL=http://localhost:3000/api
```

Change `localhost:3000` to your backend URL.

### Changing Database
**File:** `backend/.env`
```
MONGO_URI=mongodb://localhost:27017/medical-screening
```

Use MongoDB Atlas:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/medical-screening
```

### Changing JWT Secret
**File:** `backend/.env`
```
JWT_SECRET=change_this_to_a_strong_random_string
```

Generate a strong secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Changing Port Numbers
**File:** `backend/.env`
```
PORT=3000
```

**File:** `ai-service/.env`
```
AI_PORT=3001
```

## 🎨 Customizing Colors & Theme

### Change Brand Colors
**File:** `frontend/src/components/Navbar.css`
```css
.navbar-logo {
  color: #006b66;  /* Change primary color */
}
```

**File:** `frontend/src/pages/Auth.css`
```css
.auth-button {
  background-color: #00a39a;  /* Change button color */
}
```

Primary color used throughout:
- `#00a39a` - Teal (primary)
- `#008479` - Dark Teal (hover)
- `#f0fffe` - Light Teal background
- `#4caf50` - Green (success)

### Change Logo Text
**File:** `frontend/src/components/Navbar.jsx`
```jsx
<Link to="/" className="navbar-logo">
  <span className="logo-icon">⚕️</span> MediScreen
</Link>
```

Change "MediScreen" to your brand name.

## 🔄 Adding New Diseases

### Update AI Stub Response
**File:** `ai-service/server.js`
```javascript
const stubResponse = {
  disease: {
    tb: 'Detected: No (confidence 0.12)',
    pneumonia: 'Detected: Yes (confidence 0.87)',
    fracture: 'Detected: No (confidence 0.03)',
    covid: 'Detected: No (confidence 0.05)',
    // ADD NEW DISEASE HERE
    malaria: 'Detected: No (confidence 0.08)',
  },
  explainability: 'Updated explanation...',
  overlayImageUrl: '/placeholders/heatmap.png',
  confidenceScore: 0.87,
  processingTime: '2.34s',
};
```

## 👥 Adding Demo Accounts

### Create Demo Users via API
```bash
# Create patient
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Demo Patient",
    "email":"patient@example.com",
    "password":"password",
    "role":"patient"
  }'

# Create doctor
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Dr. Demo",
    "email":"doctor@example.com",
    "password":"password",
    "role":"doctor"
  }'
```

## 📧 Adding Email Notifications

Install nodemailer:
```bash
cd backend
npm install nodemailer
```

**File:** `backend/middleware/email.js`
```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendReportEmail = (email, reportId) => {
  transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your Medical Report is Ready',
    html: `<h1>Report #${reportId}</h1><p>Your report has been published.</p>`,
  });
};

module.exports = { sendReportEmail };
```

## 🔐 Adding Two-Factor Authentication

Install speakeasy:
```bash
npm install speakeasy qrcode
```

Generate 2FA token on login - implement in `authController.js`.

## 📊 Adding Analytics

Install mixpanel or google-analytics:
```bash
npm install mixpanel-browser
```

Track events in React pages:
```javascript
import mixpanel from 'mixpanel-browser';

mixpanel.init('YOUR_TOKEN');
mixpanel.track('Case Uploaded', { caseId: case._id });
```

## 🗄️ Replacing MongoDB with PostgreSQL

Install dependencies:
```bash
npm install sequelize pg
```

Create Sequelize models instead of Mongoose schemas.

## ☁️ Deploying to AWS

### Backend to EC2
```bash
# SSH into instance
ssh -i key.pem ec2-user@instance-ip

# Install Node
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -

# Install MongoDB
sudo yum install mongodb-org -y

# Deploy code
git clone your-repo
cd backend
npm install
PM2_HOME=/home/ec2-user/.pm2 npx pm2 start app.js --name "api"
```

### Frontend to S3 + CloudFront
```bash
cd frontend
npm run build
aws s3 sync build/ s3://your-bucket/
# Configure CloudFront distribution
```

### Database to RDS
Update `.env`:
```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/medical-screening
```

## 🐳 Docker Deployment

**File:** `backend/Dockerfile`
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

**File:** `docker-compose.yml`
```yaml
version: '3'
services:
  mongodb:
    image: mongo:5.0
    ports:
      - "27017:27017"
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    depends_on:
      - mongodb
    environment:
      - MONGO_URI=mongodb://mongodb:27017/medical-screening
  frontend:
    build: ./frontend
    ports:
      - "3001:3000"
```

Run:
```bash
docker-compose up -d
```

## 📱 Mobile App Version

Convert frontend to React Native:
```bash
npx react-native init MediScreenMobile
# Copy src/pages and src/components
# Adjust for React Native components
```

## 🔌 Integrating Real AI Model

Replace stub in `ai-service/server.js`:
```javascript
const tf = require('@tensorflow/tfjs-node');
const model = await tf.loadLayersModel('file://./model/model.json');

app.post('/api/process', async (req, res) => {
  const predictions = await model.predict(imageData);
  res.json(predictions);
});
```

## 🔄 Adding Real-Time Updates with Socket.io

```bash
npm install socket.io socket.io-client
```

**Backend:**
```javascript
const io = require('socket.io')(app);

io.on('connection', (socket) => {
  socket.on('case-update', (caseId, status) => {
    io.emit('case-updated', { caseId, status });
  });
});
```

**Frontend:**
```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:3000');
socket.on('case-updated', (data) => {
  setCases(cases.map(c => c._id === data.caseId ? {...c, status: data.status} : c));
});
```

## 🚀 Performance Optimization

### Enable GZIP Compression
**File:** `backend/app.js`
```javascript
const compression = require('compression');
app.use(compression());
```

### Caching with Redis
```bash
npm install redis
```

```javascript
const redis = require('redis');
const client = redis.createClient();

app.get('/api/cases/:caseId', async (req, res) => {
  const cached = await client.get(`case:${caseId}`);
  if (cached) return res.json(JSON.parse(cached));
  
  const caseData = await Case.findById(caseId);
  await client.setEx(`case:${caseId}`, 3600, JSON.stringify(caseData));
  res.json(caseData);
});
```

### Image Optimization
```bash
npm install sharp
```

```javascript
const sharp = require('sharp');

sharp(req.file.path)
  .resize(1024, 1024, { fit: 'inside' })
  .toFile(optimizedPath);
```

## 📚 Environment-Specific Configs

**File:** `backend/.env.production`
```
PORT=8080
MONGO_URI=mongodb+srv://prod-user:prod-pass@prod-cluster.mongodb.net/medical-screening
JWT_SECRET=prod-secret-key
NODE_ENV=production
```

**File:** `backend/.env.development`
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/medical-screening
JWT_SECRET=dev-secret-key
NODE_ENV=development
```

Load with:
```javascript
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
```

## 🧪 Testing

### Backend Tests (Jest)
```bash
npm install --save-dev jest supertest
```

**File:** `backend/tests/auth.test.js`
```javascript
const request = require('supertest');
const app = require('../app');

describe('Auth', () => {
  it('should register a user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', email: 'test@test.com', password: '123456', role: 'patient' });
    
    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
  });
});
```

### Frontend Tests (Vitest)
```bash
npm install --save-dev vitest react-test-library
```

## 🔍 Monitoring & Logging

Install Winston:
```bash
npm install winston
```

**File:** `backend/config/logger.js`
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

module.exports = logger;
```

---

**For more advanced customization, review the source code comments and structure!**
