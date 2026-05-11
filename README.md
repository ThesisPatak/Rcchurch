# Church Records Admin Web App

A simple, professional church records management system for admin use. Built with React, TypeScript, and Vite.

## Features
- ✅ Admin login with username/password (stored locally in browser)
- ✅ Manage Baptismal, Wedding, and Funeral records
- ✅ Input person details, event date, and notes
- ✅ Search records by first name or last name
- ✅ Delete records as needed
- ✅ Responsive design (mobile & desktop)
- ✅ All data stored in browser localStorage

---

## Prerequisites
- **Node.js** v18+ and **npm** installed on your machine
- **Git** for version control
- A code editor (VS Code recommended)
- Internet connection for deployment

---

## Step 1: Initialize the Web Project

### 1.1 Navigate to the Church folder
```bash
cd c:\Users\Jojo\OneDrive\Desktop\Church
```

### 1.2 Create a React + Vite + TypeScript project
```bash
npm create vite@latest . -- --template react-ts
npm install
```

This generates:
- `src/` folder with React components
- `public/` folder for static assets
- `vite.config.ts` configuration file
- `tsconfig.json` TypeScript settings
- `package.json` with dependencies

### 1.3 Install additional dependencies (optional)
```bash
npm install axios react-router-dom  # If you plan to add routing or API calls later
```

---

## Step 2: Add Church Components

### 2.1 Move component files into src/
```bash
Move-Item ChurchAdminLogin.tsx src/
Move-Item ChurchAdminDashboard.tsx src/
```

### 2.2 Update `src/App.tsx`
Replace the generated `src/App.tsx` with:
```typescript
import React from "react";
import ChurchAdminDashboard from "./ChurchAdminDashboard";

function App() {
  return <ChurchAdminDashboard />;
}

export default App;
```

### 2.3 Update `src/main.tsx`
Verify it looks like this:
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

---

## Step 3: Project Structure
After setup, your folder should look like this:
```
Church/
├── node_modules/         # Installed npm packages
├── public/               # Static files (favicon, etc.)
├── src/
│   ├── ChurchAdminLogin.tsx       # Login component
│   ├── ChurchAdminDashboard.tsx   # Main dashboard
│   ├── App.tsx                    # App entry point
│   ├── main.tsx                   # React DOM render
│   └── index.css                  # Styling
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript config
├── package.json          # Dependencies & scripts
├── package-lock.json     # Locked dependency versions
├── README.md             # This file
└── Church.code-workspace # VS Code workspace file
```

---

## Step 4: Run Locally

### 4.1 Start the development server
```bash
npm run dev
```

Output will show:
```
  VITE v7.2.7  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

### 4.2 Open in browser
Visit `http://localhost:5173/` in your browser.

### 4.3 Create your first admin account
- The first time you log in, it asks you to create an admin account.
- Enter any username and password (stored locally).
- Add test records for Baptismal, Wedding, and Funeral.

---

## Step 5: Set Up Git Repository

### 5.1 Initialize Git
```bash
git init
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

### 5.2 Create `.gitignore`
Create a file named `.gitignore` in the Church folder with:
```
node_modules/
dist/
.env
.env.local
.DS_Store
*.log
```

### 5.3 Initial commit
```bash
git add .
git commit -m "Initial commit: Church records web app"
```

---

## Step 6: Create GitHub Repository

### 6.1 Create a new repository on GitHub
1. Go to [github.com](https://github.com) and log in
2. Click **New repository**
3. Name it: `church-records-admin`
4. **Do NOT** initialize with README (we already have one)
5. Click **Create repository**

### 6.2 Connect local repo to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/church-records-admin.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

### 6.3 Verify
Visit `https://github.com/YOUR_USERNAME/church-records-admin` and confirm your code is uploaded.

---

## Step 7: Build for Production

### 7.1 Create a production build
```bash
npm run build
```

This generates a `dist/` folder with optimized files ready to deploy.

### 7.2 Test the build locally
```bash
npm run preview
```

---

## Step 8: Deploy Online

Choose one of these hosting platforms:

### **Option A: Vercel (Recommended)**
1. Go to [vercel.com](https://vercel.com)
2. Log in with GitHub
3. Click **Add New Project**
4. Select your `church-records-admin` repository
5. Click **Deploy**
6. Your app is live! (URL will be shown)

**Auto-deploy:** Every time you push to GitHub, Vercel automatically rebuilds and deploys.

### **Option B: Netlify**
1. Go to [netlify.com](https://netlify.com)
2. Log in with GitHub
3. Click **Add new site** → **Import an existing project**
4. Select your GitHub repository
5. Build command: `npm run build`
6. Publish directory: `dist`
7. Click **Deploy**

### **Option C: GitHub Pages**
1. Update `vite.config.ts` to include:
   ```typescript
   export default {
     base: '/church-records-admin/',
     // ... rest of config
   }
   ```
2. Install gh-pages: `npm install --save-dev gh-pages`
3. Update `package.json` scripts:
   ```json
   "deploy": "npm run build && npx gh-pages -d dist"
   ```
4. Run: `npm run deploy`

---

## Step 9: Share Your App

Once deployed, share the live URL with church admins:
- **Vercel**: `https://church-records-admin.vercel.app`
- **Netlify**: `https://church-records-admin.netlify.app`
- **GitHub Pages**: `https://YOUR_USERNAME.github.io/church-records-admin`

---

## Data Storage

### Browser localStorage
- **Admin credentials:** Stored after first login
- **Records:** All baptismal, wedding, funeral records
- **Persistence:** Data stays in browser even after closing the tab

### Backup records
To backup your records, use browser developer tools:
1. Press `F12` to open Developer Tools
2. Go to **Application** → **Local Storage**
3. Search for `churchRecords` or `churchAdminCredentials`
4. Copy and save the values somewhere safe

---

## Useful Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build locally |
| `git add .` | Stage changes for commit |
| `git commit -m "message"` | Commit changes |
| `git push` | Push to GitHub |

---

## Common Issues

### Port 5173 already in use
```bash
npm run dev -- --port 3000
```

### Can't push to GitHub
Make sure you have Git credentials set up:
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Build fails with TypeScript errors
Run:
```bash
npm run build -- --mode development
```

---

## Future Enhancements
- Add a backend API (Node.js/Express) to store records in a database
- Export records to PDF or Excel
- Add user roles (multiple admins with different permissions)
- Email notifications for upcoming events
- Record attachments (photos, documents)

---

## Support
For questions or issues:
1. Check the browser console (`F12` → **Console**)
2. Review the React error messages
3. Refer to [Vite docs](https://vitejs.dev) or [React docs](https://react.dev)
