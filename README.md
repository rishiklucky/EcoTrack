# EcoTrack – Carbon Footprint Awareness Platform

EcoTrack is a production-ready, full-stack MERN application designed to help individuals calculate, monitor, and reduce their daily carbon footprint. Through precise calculators, personalized green tips, goal tracking, unlocked achievements, and educational articles, EcoTrack guides users on a path toward sustainable living.

---

## Technical Stack
- **Frontend**: React.js (Vite, Javascript), Bootstrap 5, Bootstrap Icons, Chart.js & React-Chartjs-2
- **Backend**: Node.js, Express.js REST API
- **Database**: MongoDB (Atlas) & Mongoose ODM
- **Authentication**: JWT & Password Hashing via bcryptjs
- **Security**: Helmet.js, CORS, Express Rate Limit, Express Validator Input validation

---

## Project Directory Structure
```
EcoTrack/
├── backend/
│   ├── config/            # Database configurations
│   ├── controllers/       # Route request controllers
│   ├── middleware/        # JWT auth, rate limit, and error filters
│   ├── models/            # Mongoose MongoDB schemas
│   ├── routes/            # Express route maps
│   ├── tests/             # Local test runner scripts
│   ├── utils/             # Calculator logic and DB seeders
│   ├── .env.example       # Environmental template file
│   └── server.js          # Backend bootsrap entry point
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable components (Navbar, StatCards, etc.)
│   │   ├── context/       # Auth Session Context Provider
│   │   ├── pages/         # Interactive UI pages (Calculator, Goals, etc.)
│   │   ├── index.css      # Styling tokens and design system variables
│   │   └── main.jsx       # Client bootstrapping entry point
│   ├── index.html         # SEO compliance and viewport headers
│   └── vite.config.js     # Bundler configuration
├── package.json           # Root task runner scripts
└── README.md
```

---

## Getting Started & Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v16.0.0 or higher)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or local MongoDB running on `27017`)

### Installation & Initialization

1. **Clone the repository** (already completed):
   ```bash
   git clone https://github.com/rishiklucky/EcoTrack.git
   cd EcoTrack
   ```

2. **Install all dependencies** (automates installation for root, backend, and frontend modules):
   ```bash
   npm run install-all
   ```

3. **Configure Environment Variables**:
   In the `/backend` directory, duplicate `.env.example` to create `.env` and set your credentials:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/ecotrack?retryWrites=true&w=majority
   JWT_SECRET=supersecretkeyforecotrackjwttoken123
   NODE_ENV=development
   ```
   *Note: If `MONGO_URI` is left blank, the app will fall back to local MongoDB at `mongodb://127.0.0.1:27017/ecotrack`.*

4. **Seed the Database**:
   Populate initial educational articles, standard badging milestones, and default accounts:
   ```bash
   npm run seed
   ```
   *Seeder installs:*
   - Regular User: `user@ecotrack.com` / `User@123`
   - Admin User: `admin@ecotrack.com` / `Admin@123`

5. **Run the Application**:
   Start both backend and frontend servers:
   - Run Backend API (from root):
     ```bash
     npm run dev-backend
     ```
   - Run Frontend Client (from root):
     ```bash
     npm run dev-frontend
     ```
   Open `http://localhost:5173` in your browser.

---

## API Documentation

### 1. Authentication
*   `POST /api/auth/register` - Create user. Request: `{ name, email, password }`
*   `POST /api/auth/login` - Login user. Request: `{ email, password }`
*   `GET /api/auth/profile` - Get user details. *[Protected]*

### 2. Activities & Calculator
*   `POST /api/activities` - Create or overwrite daily assessment log. Request: `{ transportation: { carKm, bikeKm, transitKm, flightHrs }, energy: { electricityKwh, lpgKg, waterLitres }, food: { dietType }, waste: { recyclingRate, plasticUsage }, date }` *[Protected]*
*   `GET /api/activities` - Fetch user's historical logs. *[Protected]*
*   `PUT /api/activities/:id` - Edit a log. *[Protected]*
*   `DELETE /api/activities/:id` - Delete a log. *[Protected]*

### 3. Sustainability Goals
*   `POST /api/goals` - Set carbon reduction targets. Request: `{ title, targetReduction, targetDate }` *[Protected]*
*   `GET /api/goals` - List user goals. *[Protected]*
*   `PUT /api/goals/:id` - Update goal progress. Request: `{ currentProgress }` *[Protected]*
*   `DELETE /api/goals/:id` - Delete goal. *[Protected]*

### 4. Educational Hub
*   `GET /api/articles` - View articles. Query params: `?search=xyz` & `?category=xyz` *[Protected]*
*   `POST /api/articles` - Add article. *[Protected/AdminOnly]*
*   `PUT /api/articles/:id` - Modify article. *[Protected/AdminOnly]*
*   `DELETE /api/articles/:id` - Delete article. *[Protected/AdminOnly]*

### 5. Admin Utilities
*   `GET /api/admin/users` - View platform users list. *[Protected/AdminOnly]*
*   `PUT /api/admin/users/:id/status` - Suspend or reactivate user. Request: `{ status: 'suspended'|'active' }` *[Protected/AdminOnly]*
*   `DELETE /api/admin/users/:id` - Delete user account. *[Protected/AdminOnly]*
*   `GET /api/admin/analytics` - View total users, averages, and contributors. *[Protected/AdminOnly]*

---

## Security Configurations
- **Helmet.js**: Configures HTTP headers to safeguard against common vulnerabilities.
- **CORS**: Handles cross-origin resource permissions.
- **Express Rate Limit**: Stricter limits applied on auth endpoints (20 per 15 min) versus general endpoints (100 per 15 min) to prevent DDoS.
- **Password Hashing**: Bcryptjs salt rounds (10) for irreversible password storage.
- **MongoDB Injection Prevention**: Strict Mongoose modeling prevents raw query syntax injections.

---

## Testing Guide
Unit tests are included to verify calculation accuracy for transportation, diet profiles, waste recycling, and home utilities:
```bash
npm test
```
The test runner executes preconfigured ecological profiles:
1.  **Vegan profile** - checks low carbon scores (< 5.0 kg CO2e).
2.  **Average Mixed Diet** - checks standard mid-tier household variables.
3.  **Meat-heavy / Flight profile** - checks high-intensity carbon outcomes.

---

## Future Enhancements
- **Wearable Integration**: Synchronize Fitbit or Google Fit steps to calculate transportation emissions automatically.
- **Community Challenges**: Competitive carbon-saving brackets where neighborhoods compete for sustainability awards.
- **API integrations for Utilities**: Upload energy bills directly via OCR to extract kWh consumption metrics.
