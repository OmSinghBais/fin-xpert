# Quick Start - URLs to Access

## 🚀 Main Application URLs

### Frontend (Main Application)
**URL:** http://localhost:3000

This is the **main application** you'll use in your browser:
- Login page
- Dashboard
- Client management
- All user-facing features

**To start:**
```bash
cd finxpert-frontend
npm run dev
```

---

### Backend API
**URL:** http://localhost:3001

This is the API server (runs automatically when frontend calls it):
- REST API endpoints
- Database operations
- Authentication

**To start:**
```bash
cd backend
npm run start:dev
```

---

### API Documentation (Swagger)
**URL:** http://localhost:3001/api/docs

Interactive API documentation where you can:
- View all available endpoints
- Test API calls directly
- See request/response schemas
- Authenticate and test protected routes

**To access:** Just open in your browser (backend must be running)

---

## 📋 Quick Access Summary

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:3000 | Main application UI |
| **Backend API** | http://localhost:3001 | API server |
| **API Docs** | http://localhost:3001/api/docs | Swagger documentation |

---

## 🎯 Getting Started Flow

1. **Start Backend:**
   ```bash
   cd backend
   npm run start:dev
   ```
   ✅ Should see: `🚀 Backend running on http://localhost:3001`

2. **Start Frontend:**
   ```bash
   cd finxpert-frontend
   npm run dev
   ```
   ✅ Should see: `Ready - started server on 0.0.0.0:3000`

3. **Open Browser:**
   - Go to: **http://localhost:3000**
   - You'll see the login page
   - Register a new advisor or login

4. **Check API Docs (Optional):**
   - Go to: **http://localhost:3001/api/docs**
   - Explore available endpoints

---

## 🔐 Default Login

If you've seeded the database, you can use:
- **Email:** (check your seed data)
- **Password:** (check your seed data)

Or register a new advisor at the login page.

---

## ⚠️ Troubleshooting

**Frontend can't connect to backend:**
- Make sure backend is running on port 3001
- Check backend console for errors
- Verify CORS settings in `backend/src/main.ts`

**Port already in use:**
- Backend (3001): Change in `backend/src/main.ts`
- Frontend (3000): Change in `finxpert-frontend/package.json` or use `npm run dev -- -p 3002`

**API Docs not loading:**
- Make sure backend is running
- Check http://localhost:3001/api/docs
- Verify Swagger is enabled in `backend/src/main.ts`
