# FinFlow - Deployment Guide

## Overview
FinFlow is a Progressive Web App (PWA) for personal finance management. It runs entirely in the browser with local storage, making it perfect for deployment on static hosting platforms.

## Prerequisites
- Node.js 18+ and npm
- A GitHub account (for GitHub Pages deployment)
- Git

## Local Development

### Setup
```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production
```bash
npm run build
```

This generates an optimized build in the `dist/` directory with:
- Minified JavaScript and CSS
- Service Worker for offline support
- Web App Manifest for PWA features
- Icon assets (192x192, 512x512)

## Deployment Options

### Option 1: GitHub Pages (Recommended)

#### Step 1: Create a GitHub Repository
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/finflow.git
git push -u origin main
```

#### Step 2: Update vite.config.ts (if deploying to non-root path)
If deploying to `https://username.github.io/finflow/`, update `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/finflow/',  // Add this line
  plugins: [
    // ... rest of plugins
  ]
})
```

Then rebuild: `npm run build`

#### Step 3: Enable GitHub Pages
1. Go to your repository Settings → Pages
2. Set Source to "GitHub Actions"
3. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm install
    
    - name: Build
      run: npm run build
    
    - name: Deploy
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

4. Push the workflow file:
```bash
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Pages deployment workflow"
git push
```

GitHub Actions will automatically build and deploy on every push to `main`.

#### Verify Deployment
Your site will be live at: `https://YOUR_USERNAME.github.io/finflow/`

---

### Option 2: Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Follow the prompts to connect your GitHub account and select the repository.

---

### Option 3: Netlify

1. Connect your GitHub repository at https://app.netlify.com
2. Configure Build Settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Click "Deploy"

---

### Option 4: Traditional Web Server (Apache, Nginx, etc.)

1. Build the project:
   ```bash
   npm run build
   ```

2. Copy the contents of `dist/` to your web server's public directory.

3. Configure your server to serve `index.html` for all routes (SPA configuration).

#### Nginx Configuration Example
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/finflow;
    
    index index.html;
    
    # Serve static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Route all requests to index.html (for SPA)
    location / {
        try_files $uri /index.html;
    }
}
```

#### Apache Configuration Example
Create `.htaccess` in your web root:
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>

# Cache static assets
<FilesMatch "\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$">
    Header set Cache-Control "max-age=31536000, public"
</FilesMatch>
```

---

## PWA Installation

### Desktop (Chrome/Edge/Opera)
1. Open the app in the browser
2. Click the install button (appears in address bar)
3. Click "Install"

### Mobile (Android)
1. Open the app in Chrome
2. Tap menu (3 dots)
3. Select "Install app" or "Add to Home screen"

### Mobile (iOS/iPad)
1. Open the app in Safari
2. Tap Share
3. Select "Add to Home Screen"

---

## Features

### Local Storage
All data is stored locally in the browser (IndexedDB/LocalStorage):
- Income tracking
- Expense categorization
- Savings goals
- Financial recommendations
- Monthly reports

**Note:** Data is device-specific and not synced across devices. Backup regularly using the export feature.

### Export & Import
- **Export JSON:** Download all data in JSON format for backup
- **Export CSV:** Download expense/income history as CSV for spreadsheet analysis
- **Import JSON:** Restore data from previously exported JSON file

### Offline Support
The app works completely offline thanks to Service Workers:
- Service Worker caches app assets
- Workbox handles offline navigation
- Data persists in local storage

### Dark Mode
- Default dark theme (optimized for night viewing)
- Toggle available in the header
- Automatically saves preference

---

## Performance

### Build Output
```
dist/registerSW.js          0.13 kB
dist/index.html             0.57 kB
dist/manifest.webmanifest   0.90 kB
dist/assets/index.css       1.66 kB (gzip)
dist/assets/index.js      674.34 kB (gzip: 197.35 kB)
```

### Optimization Tips
1. **Service Worker Precaching:** Automatically caches key assets
2. **Code Splitting:** Dynamic imports can be added for route-based splitting
3. **Image Optimization:** SVG icons are minimal size
4. **CSS Minification:** Tailwind purges unused styles

---

## Environment Variables

Create a `.env.local` file for environment-specific settings (optional):
```
VITE_APP_TITLE=finflow
VITE_APP_VERSION=1.0.0
```

Access in code:
```typescript
import.meta.env.VITE_APP_TITLE
```

---

## Troubleshooting

### Service Worker Not Updating
Clear the cache:
1. DevTools → Application → Cache Storage
2. Delete entries
3. Refresh the page

### Icons Not Showing
Ensure PWA icons exist in `public/`:
- `icon-192.png` (192x192)
- `icon-512.png` (512x512)
- `icon-192-maskable.png` (maskable variant)
- `icon-512-maskable.png` (maskable variant)

### Build Size Too Large
The bundle includes React, TypeScript, Recharts, and Tailwind. To reduce:
1. Lazy load chart components
2. Enable dynamic imports for pages
3. Use production builds only

### CORS Issues
If calling external APIs, ensure proper CORS headers are set on the server.

---

## Security Considerations

1. **Data Privacy:** All data stays on the user's device (localStorage/IndexedDB)
2. **No Backend:** No user data is sent to external servers
3. **HTTPS:** Always serve PWAs over HTTPS
4. **Content Security Policy:** Add CSP headers for production

Example CSP Header:
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;
```

---

## Monitoring & Analytics (Optional)

For tracking app usage, add Google Analytics or similar:

```typescript
// Add to main.tsx
import('https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID')

declare global {
  function gtag(...args: any[]): void;
}

gtag('config', 'GA_MEASUREMENT_ID');
```

---

## Updates & Maintenance

### Service Worker Updates
The app uses `registerType: 'autoUpdate'` in `vite.config.ts`:
- New versions are downloaded in the background
- Users are notified of updates (via browser UI)
- No manual cache clearing needed

### Regular Maintenance
1. Keep dependencies updated: `npm update`
2. Run security audit: `npm audit`
3. Test on multiple devices
4. Monitor GitHub Issues/PRs

---

## Support & Resources

- **Vite Docs:** https://vitejs.dev
- **React Docs:** https://react.dev
- **PWA Docs:** https://web.dev/progressive-web-apps/
- **Tailwind CSS:** https://tailwindcss.com
- **TypeScript:** https://www.typescriptlang.org

---

## License

MIT License - Feel free to use and modify for personal or commercial projects.

---

## Changelog

### v1.0.0 (Initial Release)
- Personal finance tracking with income/expense management
- 4 mandatory savings goals (Emergency Fund, Sibling Education, Gaming PC, Future Fund)
- Financial health scoring and AI-driven recommendations
- Monthly planning with automatic budget allocation
- Charts and analytics with trend visualization
- CSV/JSON export and import
- Dark mode support
- Full PWA support with offline capability
- Mobile-first responsive design
