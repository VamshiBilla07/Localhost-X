# 📍 Community Issue Reporter

A full-stack MERN application that helps communities report and track local issues like potholes, broken streetlights, safety hazards, illegal dumping, and more. Built for civic hackathons and smart city initiatives.

## 🎯 Problem Statement

Communities struggle to efficiently report and track infrastructure, safety, health, and environmental issues. This app provides a centralized platform where:
- **Citizens** can quickly report issues with location tracking
- **Officials** can view all reports, filter by category/status, and update progress
- **Everyone** sees real-time updates on issue resolution

## ✨ Features

### Core Functionality
- 📝 **Issue Submission** - Report problems with title, description, category, location, and contact info
- 📊 **Live Dashboard** - Real-time stats showing total, open, in-progress, and resolved issues
- 🔍 **Search & Filter** - Search by keywords, filter by category (Safety, Infrastructure, Health, Environment) and status
- 🎯 **Status Tracking** - Update issue status from open → in-progress → resolved
- 📍 **Geolocation** - One-click GPS location capture for precise issue reporting
- 🗺️ **Map Placeholder** - Ready for mapping integration (Mapbox/Leaflet/Google Maps)

### Technical Features
- ⚡ **Fast Refresh** - Vite-powered development with instant updates
- 🎨 **Modern UI** - Clean, responsive design with hover effects and smooth transitions
- 🔄 **Real-time Sync** - Automatic feed updates when new issues are submitted
- 📱 **Mobile Responsive** - Works seamlessly on desktop, tablet, and mobile devices

## 🏗️ Tech Stack

### Backend
- **Express.js** - Lightweight Node.js web framework
- **TypeScript** - Type-safe JavaScript
- **CORS** - Cross-origin resource sharing
- **In-memory storage** - Fast prototyping (easily swappable for MongoDB)

### Frontend
- **React 18** - Modern UI library with hooks
- **TypeScript** - Full type safety
- **Vite** - Lightning-fast build tool
- **CSS3** - Custom responsive styling with gradients and animations

## 📁 Project Structure

```
Localhost-X/
├── backend/
│   ├── src/
│   │   └── index.ts          # Express API with all routes
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── App.tsx           # Main React component with all features
│   │   ├── api.ts            # API client functions
│   │   ├── types.ts          # TypeScript interfaces
│   │   ├── main.tsx          # React entry point
│   │   └── styles.css        # Custom styling
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** (comes with Node.js)

### Installation

1. **Clone or download the project**
   ```bash
   cd Localhost-X
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

#### Start Backend Server
```bash
cd backend
npm run dev
```
- Backend runs on **http://localhost:4000**
- Visit http://localhost:4000 to see "API is Running" page

#### Start Frontend Server (in a new terminal)
```bash
cd frontend
npm run dev
```
- Frontend runs on **http://localhost:5173** (or 5174 if 5173 is busy)
- Open the URL shown in terminal to use the app

### Building for Production

**Build Frontend**
```bash
cd frontend
npm run build
```
- Creates optimized production build in `frontend/dist/`

**Type Check Backend**
```bash
cd backend
npm run build
```
- Runs TypeScript compiler to check for errors

## 📡 API Endpoints

### Health Check
```
GET /
```
Returns HTML page showing API status and available endpoints

```
GET /health
```
Returns `{ "status": "ok" }`

### Issues
```
GET /api/issues
```
Returns all issues: `{ "issues": Issue[] }`

```
GET /api/issues/:id
```
Returns single issue or 404

```
POST /api/issues
```
**Body:** 
```json
{
  "title": "Broken streetlight",
  "description": "Street light on Main St is flickering",
  "category": "Infrastructure",
  "location": "Main Street & 5th Ave",
  "contact": "john@example.com"  // optional
}
```
**Returns:** Created issue with status "open"

```
PATCH /api/issues/:id/status
```
**Body:**
```json
{
  "status": "in-progress"  // or "open" or "resolved"
}
```
**Returns:** Updated issue

## 🎨 Usage Guide

### For Citizens (Reporting Issues)

1. **Fill out the form**
   - Enter a clear title (e.g., "Pothole on Elm Street")
   - Provide detailed description
   - Select appropriate category
   - Enter location (or click "📍 Use My Location")
   - Optionally add contact info

2. **Submit**
   - Issue appears instantly in the live feed
   - Assigned unique ID and "open" status
   - Timestamp recorded

### For Officials (Managing Issues)

1. **View Dashboard**
   - See total issues and breakdown by status
   - Quickly identify problem areas

2. **Search & Filter**
   - Search by keywords in title/description
   - Filter by category (Safety, Infrastructure, etc.)
   - Filter by status (Open, In Progress, Resolved)

3. **Update Status**
   - Click status buttons on any issue card
   - Change from Open → In Progress → Resolved
   - Updates appear immediately for all users

4. **Refresh Feed**
   - Click "Refresh" button to manually sync
   - Or wait for auto-updates when issues submitted

## 🔧 Customization

### Change Default Location
Edit `frontend/src/App.tsx` - look for geolocation button

### Add More Categories
Edit both:
- `backend/src/index.ts` - validation logic
- `frontend/src/App.tsx` - form dropdown and filters

### Connect Real Database
Replace in-memory array in `backend/src/index.ts`:
```typescript
// Replace:
const issues: Issue[] = [];

// With MongoDB/Mongoose:
import Issue from './models/Issue';
// Then use Issue.find(), Issue.create(), etc.
```

### Add Map Integration
1. Install mapping library:
   ```bash
   cd frontend
   npm install leaflet react-leaflet
   ```
2. Replace map placeholder in `App.tsx` with real map component
3. Use `issue.coordinates` to place markers

## 🐛 Troubleshooting

**Port already in use?**
- Backend: Change `PORT` in `backend/.env` or `backend/src/index.ts`
- Frontend: Vite will auto-try next port (5174, 5175, etc.)

**CORS errors?**
- Ensure backend is running on port 4000
- Check `vite.config.ts` proxy settings

**Module not found?**
- Run `npm install` in both backend/ and frontend/
- Delete `node_modules/` and reinstall if issues persist

## 📝 Future Enhancements

- [ ] Add MongoDB persistence
- [ ] User authentication (citizen vs official roles)
- [ ] Image upload for issues
- [ ] Email notifications on status changes
- [ ] Interactive map with pins
- [ ] Issue comments/discussion
- [ ] Mobile app (React Native)
- [ ] Analytics dashboard for officials
- [ ] Export reports to CSV/PDF

## 🤝 Contributing

This is a hackathon starter project. Feel free to:
- Fork and customize for your community
- Add features and submit pull requests
- Use as learning material for MERN stack

## 📄 License

Open source - use freely for hackathons, learning, or civic projects.

## 🎉 Built For

Perfect for:
- Civic tech hackathons
- Smart city initiatives  
- Community engagement projects
- MERN stack learning
- Government innovation challenges

---

**Made with ❤️ for better communities**
