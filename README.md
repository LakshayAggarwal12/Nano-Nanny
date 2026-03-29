<div align="center">

# 🏥 NanoNanny

### AI-Powered Post-Surgical Recovery Monitoring System

[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb)](https://mongodb.com/)
[![Gemini AI](https://img.shields.io/badge/Google-Gemini_2.0_Flash-4285F4?style=flat-square&logo=google)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)
[![Live Demo](https://img.shields.io/badge/Demo-Render-46E3B7?style=flat-square&logo=render)](https://nano-nanny.onrender.com)

*Empowering patients to monitor recovery at home with real-time AI risk assessment and automatic doctor alerts — bridging the gap between hospital discharge and full recovery.*

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
- [API Reference](#-api-reference)
- [Risk Scoring System](#-risk-scoring-system)
- [How It Works](#-how-it-works)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔍 Overview

Every year, millions of surgical patients are discharged with little to no structured follow-up, relying on paper checklists and guesswork to manage recovery at home. **NanoNanny** solves this by giving patients a smart, browser-based tool to log daily symptoms, receive AI-personalised recovery advice, and automatically alert their doctor when risk reaches a dangerous threshold.

No hardware. No app install. Just open a browser.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| **Symptom Check-in** | Select from 7 post-operative symptoms via an intuitive checkbox interface |
| **AI Risk Assessment** | Weighted rule-based engine scores each check-in as Low, Intermediate, or Severe |
| **Gemini AI Advice** | Google Gemini 2.0 Flash generates personalised 80–100 word recovery guidance per check-in |
| **Auto Doctor Alert** | Nodemailer fires an automatic email to the assigned doctor when risk is Intermediate or Severe |
| **Secure Authentication** | JWT-based sessions (7-day expiry) with bcrypt password hashing (12 rounds) |
| **Recovery Journal** | Every authenticated check-in is auto-saved to MongoDB for longitudinal tracking |
| **Progress Dashboard** | Trend analysis (improving / worsening / stable), risk distribution, top symptoms, and a visual timeline |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18.2 | UI framework — hooks & Context API |
| Vite | 7.x | Dev server & production build tool |
| React Router | v6 | Client-side routing (5 routes) |
| Context API | — | Global auth state via `AuthContext` |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | — | JavaScript runtime |
| Express | 4.18 | HTTP server & REST routing |
| Mongoose | 9.x | MongoDB ODM — Users & Journals |
| bcryptjs | 2.x | Password hashing (12 rounds) |
| jsonwebtoken | 9.x | JWT sign & verify (7-day sessions) |

### AI & Services
| Technology | Purpose |
|---|---|
| `@google/generative-ai` | Gemini 2.0 Flash — personalised recovery advice |
| Nodemailer | Gmail SMTP — automated doctor alerts |
| dotenv | Secure environment variable management |

---

## 📁 Project Structure

```
Nano-Nanny/
├── backend/
│   ├── config/
│   │   ├── aiConfig.js              # Gemini AI configuration
│   │   └── database.js              # MongoDB connection (Mongoose)
│   ├── controllers/
│   │   ├── analyzeController.js     # Core analysis — risk scoring, AI call, email, journal save
│   │   ├── authController.js        # Register, login, getMe
│   │   └── journalController.js     # CRUD + progress trend aggregation
│   ├── middleware/
│   │   └── authenticate.js          # JWT verification middleware
│   ├── models/
│   │   ├── User.js                  # Mongoose User schema
│   │   └── Journal.js               # Mongoose Journal schema
│   ├── routes/
│   │   ├── analyzeRoutes.js         # POST /api/analyze
│   │   ├── authRoutes.js            # /api/auth/*
│   │   └── journalRoutes.js         # /api/journals/*
│   ├── services/
│   │   ├── aiService.js             # Gemini API call with 20s timeout & fallback
│   │   └── emailService.js          # Nodemailer Gmail SMTP alert
│   ├── utils/
│   │   └── riskLogic.js             # Symptom weighting & risk level calculation
│   ├── package.json
│   └── server.js                    # Express entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CheckboxList.jsx     # 7-symptom controlled checkbox grid
│   │   │   ├── Loader.jsx           # Full-page overlay spinner
│   │   │   ├── Navbar.jsx           # Auth-aware persistent navigation
│   │   │   ├── ResultCard.jsx       # Risk badge, AI advice, symptom tags
│   │   │   └── SymptomForm.jsx      # Main check-in form with validation
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Global auth state, login/register/logout
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx        # Protected recovery progress dashboard
│   │   │   ├── Home.jsx             # Landing page with symptom form
│   │   │   ├── Login.jsx            # Login form
│   │   │   ├── Register.jsx         # Registration form
│   │   │   └── Result.jsx           # Analysis results display
│   │   ├── services/
│   │   │   └── api.js               # analyzeSymptoms() — POST /api/analyze
│   │   ├── styles/
│   │   │   └── global.css           # Dark theme CSS variables & global styles
│   │   ├── utils/
│   │   │   └── symptomList.js       # The 7 tracked symptoms
│   │   ├── App.jsx                  # Layout shell — AuthProvider + Navbar
│   │   ├── main.jsx                 # React entry point, RouterProvider
│   │   └── router.jsx               # createBrowserRouter — 5 routes
│   ├── .env.production              # VITE_API_URL for production builds
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── package-lock.json
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://npmjs.com/) v9 or higher
- A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (or a local MongoDB instance)
- A [Google AI Studio](https://aistudio.google.com/) API key for Gemini
- A Gmail account with an [App Password](https://support.google.com/accounts/answer/185833) for email alerts (optional)

---

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/your-username/Nano-Nanny.git
cd Nano-Nanny
```

**2. Install backend dependencies**

```bash
cd backend
npm install
```

**3. Install frontend dependencies**

```bash
cd ../frontend
npm install
```

---

### Environment Variables

#### Backend — `backend/.env`

Create a `.env` file in the `backend/` directory:

```env
# Server
PORT=5000

# MongoDB
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/nanonanny?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long

# Google Gemini AI
GEMINI_API_KEY=your_google_ai_studio_api_key

# Email Alerts (optional — alerts are silently skipped if not set)
EMAIL_USER=your.gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
DOCTOR_EMAIL=doctor@example.com
```

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | HTTP port (default: `5000`) |
| `MONGO_URI` | **Yes** | MongoDB connection string |
| `JWT_SECRET` | **Yes** | Secret key for signing JWTs — use a long random string |
| `GEMINI_API_KEY` | **Yes** | Google AI Studio API key |
| `EMAIL_USER` | No | Gmail address used to send alerts |
| `EMAIL_PASS` | No | Gmail [App Password](https://support.google.com/accounts/answer/185833) — **not** your login password |
| `DOCTOR_EMAIL` | No | Recipient address for patient risk alerts |

> **Note:** If `EMAIL_USER`, `EMAIL_PASS`, or `DOCTOR_EMAIL` are absent, the app logs a warning and skips the email step without crashing.

#### Frontend — `frontend/.env.local`

Create a `.env.local` file in the `frontend/` directory for local development:

```env
VITE_API_URL=http://localhost:5000
```

The production value (`https://nano-nanny.onrender.com`) is already set in `frontend/.env.production`.

---

### Running the App

**Start the backend** (from `backend/`)

```bash
# Development — auto-restarts on file changes
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:5000`.

**Start the frontend** (from `frontend/`)

```bash
npm run dev
```

The app will open at `http://localhost:5173`.

> The backend must be running before the frontend makes API calls.

---

## 📡 API Reference

All endpoints are prefixed with `/api`. JSON is the data format for all requests and responses.

### Authentication — `/api/auth`

| Method | Endpoint | Auth | Body | Response |
|---|---|---|---|---|
| `POST` | `/api/auth/register` | None | `{ name, email, password }` | `{ user, token }` |
| `POST` | `/api/auth/login` | None | `{ email, password }` | `{ user, token }` |
| `GET` | `/api/auth/me` | Bearer | — | `{ user }` |

**Password requirements:** Minimum 6 characters. Stored as a bcrypt hash (12 rounds). Tokens expire after **7 days**.

---

### Analysis — `/api/analyze`

| Method | Endpoint | Auth | Body | Response |
|---|---|---|---|---|
| `POST` | `/api/analyze` | Optional | `{ symptoms[], description }` | `{ symptoms, riskLevel, aiAdvice, journalId }` |

Authentication is optional. If a valid Bearer token is included, the check-in is automatically saved to the user's journal. If not authenticated, analysis still runs but nothing is persisted.

**Example request:**

```json
{
  "symptoms": ["Fever", "Swelling"],
  "description": "Noticing some redness around the incision site, feeling warm."
}
```

**Example response:**

```json
{
  "symptoms": ["Fever", "Swelling"],
  "riskLevel": "Intermediate",
  "aiAdvice": "Your symptoms suggest a possible early infection. Keep the wound dry and clean. Monitor your temperature — if it exceeds 38.5°C, contact your doctor immediately. Mild swelling is normal but increasing warmth or discharge warrants urgent review.",
  "journalId": "6617a2c3e8f9b4001a2b3c4d"
}
```

---

### Journals — `/api/journals`

All journal routes require a valid Bearer token.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/journals` | Manually save a symptom check-in |
| `GET` | `/api/journals` | Get all check-ins for the current user, newest first |
| `GET` | `/api/journals/progress` | Get aggregated progress stats and trend analysis |

**Progress response shape (`GET /api/journals/progress`):**

```json
{
  "entries": [...],
  "summary": {
    "totalEntries": 14,
    "firstEntry": "2025-03-01T10:00:00.000Z",
    "latestEntry": "2025-03-14T18:30:00.000Z",
    "currentRisk": "Low",
    "trend": "improving",
    "riskCounts": { "Low": 9, "Moderate": 0, "Intermediate": 4, "Severe": 1 },
    "topSymptoms": [
      { "name": "Pain", "count": 8 },
      { "name": "Swelling", "count": 5 }
    ],
    "improvementPercent": 22
  }
}
```

---

## ⚖️ Risk Scoring System

Each symptom carries a fixed weight. The total score determines the risk level.

| Symptom | Points | Reason |
|---|---|---|
| Breathing difficulty | **+4** | Highest priority — potential respiratory emergency |
| Fever | +2 | Strong indicator of infection |
| Swelling | +2 | Common sign of inflammation or fluid build-up |
| Redness | +2 | Localised infection marker |
| Pain | +1 | Common post-op — weighted lower |
| Nausea | +1 | Mild complication indicator |
| Weakness | +1 | Non-specific, weighted lower |

| Score | Risk Level | Action |
|---|---|---|
| 0 – 2 | 🟢 **Low** | Monitor at home, no alert sent |
| 3 – 5 | 🟡 **Intermediate** | Doctor email alert fired automatically |
| 6+ | 🔴 **Severe** | Doctor email alert fired automatically |

---

## 🔄 How It Works

```
Patient logs in
      │
      ▼
Selects symptoms + writes description
      │
      ▼
POST /api/analyze
      │
      ├─► calculateRisk(symptoms)         — weighted score → risk level
      │
      ├─► analyzeWithAI(symptoms, desc)   — Gemini 2.0 Flash generates 80–100 word advice
      │                                     (20s timeout, safe fallback on error)
      │
      ├─► sendDoctorEmail()               — fires if risk = Intermediate OR Severe
      │                                     (silently skipped if env vars absent)
      │
      └─► Journal.create(...)             — auto-saved if Bearer token present
              │
              ▼
      Response: { riskLevel, aiAdvice, journalId }
              │
              ▼
      Frontend navigates to /result
      Result displayed → Dashboard updated
```

**Trend Analysis (Dashboard):**
The progress endpoint compares the average risk score of the **first half** of all entries against the **second half**. If the recent average is lower, the trend is `improving`; higher means `worsening`; equal means `stable`.

---

## ☁️ Deployment

### Backend — [Render](https://render.com/)

1. Push your `backend/` folder (or the full repo) to GitHub.
2. Create a new **Web Service** on Render, pointing to the `backend/` root.
3. Set the **Start Command** to `node server.js`.
4. Add all backend environment variables in Render's **Environment** settings.
5. Your backend URL will be something like `https://nano-nanny.onrender.com`.

### Frontend — [Vercel](https://vercel.com/) or [Netlify](https://netlify.com/)

1. Push your `frontend/` folder to GitHub.
2. Import the project in Vercel/Netlify, setting the **Root Directory** to `frontend/`.
3. Add the environment variable:
   ```
   VITE_API_URL=https://nano-nanny.onrender.com
   ```
4. The build command is `npm run build` and the output directory is `dist/`.

> **CORS note:** The backend currently allows all origins (`app.use(cors())`). For production, restrict this to your frontend domain:
> ```js
> app.use(cors({ origin: "https://your-app.vercel.app" }));
> ```

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository.
2. **Create** a feature branch: `git checkout -b feature/your-feature-name`
3. **Commit** your changes: `git commit -m "feat: add your feature"`
4. **Push** to your branch: `git push origin feature/your-feature-name`
5. **Open** a Pull Request against `main`.

### Ideas for Contributions

- Add unit tests (Jest + Supertest for the API)
- Expand the symptom set with surgery-type-specific profiles
- Add WhatsApp / SMS alerts via Twilio as an alternative to email
- Build a doctor portal with multi-patient overview
- Internationalise the UI (i18n) for non-English patients

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with ❤️ by the **NanoNanny** team · 2026

*Smarter Recovery. Safer Outcomes. Anywhere.*

</div>
