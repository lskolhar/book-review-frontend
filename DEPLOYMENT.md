# Frontend Deployment Guide

## Vercel Deployment

### 1. Push to GitHub
```bash
# Create new repository on GitHub called "books-frontend"
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/lskolhar/book-review-frontend.git
git push -u origin main
```

### 2. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import `books-frontend` repository
5. Set Root Directory to `./` (default)
6. Add Environment Variables:
   - `REACT_APP_API_URL`: `https://your-backend-url.vercel.app/api`

### 3. Environment Variables
In Vercel dashboard, add:
- `REACT_APP_API_URL`: Backend API URL (get this after deploying backend)

## Local Testing
```bash
npm install
REACT_APP_API_URL=http://localhost:5000/api npm start
```
