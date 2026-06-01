# FinFlow - Personal Finance PWA

> A production-ready Progressive Web App for personal finance management, designed for salaried employees in India.

![React](https://img.shields.io/badge/React-19.2.6-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-8.0-green?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.3-06B6D4?logo=tailwindcss)
![PWA](https://img.shields.io/badge/PWA-Enabled-purple)
![License](https://img.shields.io/badge/License-MIT-green)

## 🎯 Overview

FinFlow is a comprehensive personal finance tracking and goal-planning PWA built for individuals managing their income, expenses, and savings goals. Designed specifically for Indian salaried employees, it provides:

- **Income & Expense Tracking** - Categorized tracking with monthly summaries
- **4 Mandatory Savings Goals** - Emergency Fund, Sibling Education, Gaming PC, Future Fund
- **AI-Driven Recommendations** - Smart financial insights and optimization suggestions
- **Financial Health Scoring** - Real-time health score (0-100) with actionable recommendations
- **Advanced Forecasting** - Predict goal completion dates and cash flow scenarios
- **Charts & Analytics** - Visualize trends with interactive charts (line, pie, bar)
- **Offline-First** - Works completely offline with service workers
- **Export & Import** - Backup/restore data as JSON or export to CSV
- **Dark Mode** - Eye-friendly dark theme with toggle
- **Mobile Responsive** - Mobile-first design with bottom navigation
- **Progressive Web App** - Install as an app on any device

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

### Installation
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/finflow.git
cd finflow

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production
```bash
npm run build
```

Optimized files are generated in the `dist/` directory.

## 📁 Project Structure

```
finflow/
├── src/
│   ├── components/           # React components
│   │   ├── charts/          # Chart components (using Recharts)
│   │   ├── layout/          # Layout (Header, BottomNav)
│   │   └── ui/              # Reusable UI (Card, ProgressBar, ProgressRing, Badge)
│   ├── context/             # State management (AppContext)
│   ├── hooks/               # Custom hooks (useLocalStorage, useApp)
│   ├── pages/               # Page components (Dashboard, Income, Expenses, Goals, Reports, FinancialCoach)
│   ├── services/            # Business logic (storage service)
│   ├── types/               # TypeScript interfaces
│   ├── utils/               # Utility functions (finance calculations, formatters)
│   ├── App.tsx              # Main app component with routing
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
│   ├── icon-192.png         # PWA icon (192x192)
│   ├── icon-512.png         # PWA icon (512x512)
│   ├── icon-192-maskable.png # Maskable icon (192x192)
│   ├── icon-512-maskable.png # Maskable icon (512x512)
│   └── vite.svg
├── vite.config.ts           # Vite configuration with PWA plugin
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
├── package.json             # Dependencies
├── DEPLOYMENT.md            # Detailed deployment guide
└── README.md                # This file
```

## 🏗️ Architecture

### State Management
Global state is managed using React Context API with the following structure:

```typescript
interface AppState {
  income: IncomeEntry[]
  expenses: ExpenseEntry[]
  emergencyFund: EmergencyFund
  siblingEducationFund: SiblingEducationFund
  gamingPCFund: GamingPCFund
  futureGoals: FutureGoal[]
  financialHealth: FinancialHealth
  notifications: Notification[]
  reports: MonthlyReport[]
  settings: AppSettings
}
```

### Financial Calculations
All financial calculations are implemented in `src/utils/finance.ts`:

- `computeHealthScore()` - Calculate financial health (0-100)
- `generateRecommendations()` - AI-driven recommendations
- `simulateExpense()` - "Can I afford this?" scenario testing
- `forecastCashFlow()` - 6-month cash flow prediction
- `forecastGoalCompletion()` - When will I reach my goal?
- `calculateNetWorth()` - Total savings across all goals
- `emergencyReadinessScore()` - Emergency fund adequacy
- `pcReadinessScore()` - Gaming PC fund readiness

### Storage
Local storage is handled through `src/services/storage.ts`:

- **Persistence:** Browser LocalStorage (IndexedDB compatible)
- **Export:** JSON backup or CSV for spreadsheet analysis
- **Import:** Restore from previously exported JSON file
- **Auto-Save:** Changes sync to storage immediately

### Forms
Forms use React Hook Form with validation:

```typescript
import { useForm } from 'react-hook-form'

const { register, handleSubmit, reset } = useForm({
  defaultValues: { /* ... */ }
})
```

## 🎨 UI Components

### Layout
- **Header** - Fixed top navigation with logo and dark mode toggle
- **BottomNav** - Fixed bottom navigation (6 pages)

### UI Components
- **Card** - Reusable container with dark theme
- **ProgressBar** - Linear progress indicator
- **ProgressRing** - Circular progress indicator with SVG
- **Badge** - Status badges (Excellent, Good, Average, Poor, Critical)

### Charts (Recharts)
- **LineChart** - Income vs Expenses trend
- **BarChart** - Cash flow forecast, Income breakdown
- **PieChart** - Expense category breakdown

## 📊 Pages

### 1. Dashboard
Main overview showing:
- Financial health score (0-100) with ring chart
- Monthly summary (income, expenses, balance)
- Fund progress for all 4 savings goals
- Net worth total
- Alerts (e.g., sibling fee due)

### 2. Income
Track income sources:
- Add income with date, amount, source, notes
- Sources: Salary, Bonus, Freelance, Gift, Other
- Monthly total and source breakdown
- Delete transactions

### 3. Expenses
Categorize and track expenses:
- 11 expense categories with icons
- Add expense with date, amount, category, notes
- Top 5 categories breakdown
- Monthly total and category distribution
- Delete transactions

### 4. Goals
Manage 4 savings goals:
- **Emergency Fund** - Current/target amount, monthly contribution
- **Sibling Education** - Forecast for fees, target amount
- **Gaming PC** - Scenario planning (5k-12k monthly)
- **Future Goals** - Custom goals with target date and amount

Features:
- Editable fund amounts
- Progress visualization
- Completion date forecasting
- Scenario simulation for PC fund

### 5. Reports
Analytics and visualization:
- 6-month income vs expenses chart
- Expense breakdown by category
- Top 5 expenses list
- Income breakdown by source
- Cash flow forecast
- Upcoming expenses
- Export JSON/CSV buttons

### 6. Financial Coach
AI-driven insights:
- Financial health score with status and color coding
- 4 metric cards (savings rate, expense ratio, emergency coverage, goal progress)
- Prioritized recommendations list
- Readiness scores for Emergency and PC funds
- "Can I afford this?" scenario simulator
- Goal completion forecasts
- Personalized financial strategy

## 💾 Data Management

### Export Options

#### JSON Export
```json
{
  "income": [...],
  "expenses": [...],
  "emergencyFund": {...},
  "siblingEducationFund": {...},
  "gamingPCFund": {...},
  "futureGoals": [...],
  "settings": {...}
}
```

#### CSV Export
Exports expense and income history in spreadsheet format:
```
Date,Amount,Category,Notes
2024-06-01,50000,Salary,June salary
2024-06-05,5000,Groceries,Weekly groceries
```

### Import
Restore from previously exported JSON file.

## 🔧 Technical Details

### Technology Stack
- **Frontend Framework:** React 19.2.6
- **Language:** TypeScript 6.0.2
- **Build Tool:** Vite 8.0.12
- **Styling:** Tailwind CSS 4.3.0
- **State Management:** React Context API
- **Forms:** React Hook Form 7.77.0
- **Charts:** Recharts 3.8.1
- **Icons:** Lucide React 1.17.0
- **Dates:** date-fns 4.4.0
- **PWA:** vite-plugin-pwa 1.3.0

### Build Output
```
dist/registerSW.js          0.13 kB
dist/index.html             0.57 kB
dist/manifest.webmanifest   0.90 kB
dist/assets/index.css       1.66 kB (gzip)
dist/assets/index.js      674.34 kB (gzip: 197.35 kB)
```

## 🌐 PWA Features

### Service Worker
- Offline functionality with Workbox
- Runtime caching for Google Fonts
- 365-day cache expiration
- Auto-update enabled

### Web App Manifest
- App name: "finflow - Personal Finance App"
- Display: Standalone (fullscreen-like on mobile)
- Theme color: Blue (RGB 59, 130, 246)
- Categories: Finance, Productivity

### Installation
The app can be installed on:
- **Chrome/Edge/Opera (Desktop)** - Click install button in address bar
- **Android** - "Add to Home Screen" from menu
- **iOS/iPad (Safari)** - Share → Add to Home Screen

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

### Quick Deploy (GitHub Pages)
```bash
# Create .github/workflows/deploy.yml with GitHub Actions workflow
# Update vite.config.ts base path if needed
# Push to main branch
git push
```

Deploy to:
- **GitHub Pages** - Free, built-in GitHub Actions
- **Vercel** - Optimized for Vite/React
- **Netlify** - Drag & drop or Git integration
- **Traditional Server** - Any static hosting

## 🎯 Features Roadmap

### Currently Implemented
✅ Income and expense tracking
✅ 4 savings goals with forecasting
✅ Financial health scoring
✅ AI recommendations engine
✅ Charts and analytics
✅ Export/import functionality
✅ Dark mode
✅ PWA with offline support
✅ Mobile-first responsive design

### Future Enhancements
⏳ Budget alerts and notifications
⏳ Savings streak tracking
⏳ Monthly planning wizard
⏳ Investment portfolio tracking
⏳ Tax deduction calculator
⏳ Loan EMI calculator
⏳ Cloud sync (optional backend)
⏳ Multiple user accounts
⏳ Bill reminders
⏳ Recurring transactions

## 📝 Configuration

### Environment Variables
Create `.env.local`:
```
VITE_APP_TITLE=finflow
VITE_APP_VERSION=1.0.0
```

Access in code:
```typescript
import.meta.env.VITE_APP_TITLE
```

### Tailwind CSS Customization
Edit `tailwind.config.js` to customize:
- Colors (dark/light modes)
- Fonts
- Shadows
- Animations
- Breakpoints

### Vite Configuration
Edit `vite.config.ts` for:
- Build optimization
- PWA settings
- Base path for deployments
- Development server settings

## 🧪 Development

### Available Scripts

```bash
# Start development server with HMR
npm run dev

# Build for production
npm run build

# Type check
npm run type-check

# Lint
npm run lint

# Preview production build locally
npm run preview
```

### Code Style
- ESLint configuration in `eslint.config.js`
- TypeScript strict mode enabled
- Component-based architecture
- Functional components with hooks

## 📚 Learning Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [PWA Fundamentals](https://web.dev/progressive-web-apps/)
- [React Hook Form](https://react-hook-form.com/)
- [Recharts Documentation](https://recharts.org/)

## 🔒 Privacy & Security

- **Local Storage Only:** All data stays on your device
- **No Backend:** No user data sent to external servers
- **No Tracking:** No analytics or tracking
- **HTTPS Recommended:** Always serve PWAs over HTTPS
- **Open Source:** Audit the code anytime

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋 Support

For issues, feature requests, or questions:
- Open an [GitHub Issue](https://github.com/YOUR_USERNAME/finflow/issues)
- Check existing issues for solutions
- Provide clear description and steps to reproduce

## 🎉 Acknowledgments

- Built with [React](https://react.dev), [TypeScript](https://www.typescriptlang.org/), and [Tailwind CSS](https://tailwindcss.com)
- Charts powered by [Recharts](https://recharts.org/)
- Icons from [Lucide React](https://lucide.dev/)
- Form handling with [React Hook Form](https://react-hook-form.com/)

---

**Start tracking your finances today with FinFlow!** 💰
