# Vercel Deployment Guide

## Quick Deployment Steps

### 1. Install Vercel CLI (Optional)
```bash
npm install -g vercel
```

### 2. Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard (Recommended)
1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Go to [vercel.com](https://vercel.com)
3. Click "Add New Project"
4. Import your repository
5. Vercel will auto-detect the configuration from `vercel.json`
6. Click "Deploy"

#### Option B: Deploy via CLI
```bash
# From the project root directory
vercel

# For production deployment
vercel --prod
```

## Project Configuration

### Files Created for Vercel Deployment:

1. **vercel.json** - Main configuration file
   - Defines build commands
   - Sets up API routes for backend
   - Configures static file serving for frontend

2. **package.json** (root) - Build scripts for the monorepo

3. **.vercelignore** - Files to exclude from deployment

### Key Changes Made:

1. **Backend (backend/package.json)**
   - Changed build script from `tsc --noEmit` to `tsc` to compile TypeScript
   - Backend now exports the Express app for serverless deployment

2. **Backend (backend/src/index.ts)**
   - Added export for Vercel serverless: `export default app`
   - Made server only start in development mode

## Environment Variables

If you need environment variables in production:

1. Go to your Vercel project dashboard
2. Navigate to "Settings" > "Environment Variables"
3. Add any required variables

## API Routes

After deployment, your API will be available at:
- `https://your-domain.vercel.app/api/issues`
- `https://your-domain.vercel.app/health`

Frontend will be served from:
- `https://your-domain.vercel.app/`

## Troubleshooting

### Build Errors
- Check the build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript compiles locally with `npm run build`

### API Not Working
- Check that backend routes are correctly prefixed with `/api`
- Verify rewrites in `vercel.json` are correct
- Check Vercel function logs for errors

### Frontend Not Loading
- Verify `frontend/dist` is being created during build
- Check the output directory in `vercel.json`

## Testing Locally Before Deploy

### Test Frontend Build
```bash
cd frontend
npm install
npm run build
```

### Test Backend Build
```bash
cd backend
npm install
npm run build
```

## What's Deployed

- **Frontend**: Static React application built with Vite
- **Backend**: Serverless Express API functions
- **Routes**: Automatic routing for API calls and static assets

## Notes

- The backend uses in-memory storage, so data will reset between deployments
- For persistent storage, consider adding a database (MongoDB Atlas, PostgreSQL, etc.)
- All API routes are automatically routed through Vercel's serverless functions
