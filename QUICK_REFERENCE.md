# FinFlow - Quick Reference Guide

## 📱 Features at a Glance

| Feature | Details |
|---------|---------|
| **Income Tracking** | Salary, Bonus, Freelance, Gift, Other |
| **Expense Categories** | 11 categories (Food, Transport, Entertainment, etc.) |
| **Savings Goals** | Emergency Fund, Sibling Education, Gaming PC, Future Fund |
| **Financial Health** | Score from 0-100 with AI recommendations |
| **Forecasting** | Goal completion dates, cash flow predictions |
| **Charts** | Line, Bar, Pie charts with Recharts |
| **Export** | JSON (backup) and CSV (spreadsheet) |
| **Import** | Restore from JSON backup |
| **Offline** | Works completely offline with PWA |
| **Dark Mode** | Default dark theme with toggle |
| **Mobile** | Fully responsive with bottom navigation |

## 🎯 Getting Started (5 minutes)

1. **Visit the App**
   - Online: https://YOUR_USERNAME.github.io/finflow
   - Local: `npm run dev` then open http://localhost:5173

2. **Add Your Income** (Dashboard → Income page)
   - Date: Today
   - Amount: Your monthly salary
   - Source: Salary
   - Click "Add Income"

3. **Set Up Goals** (Goals page)
   - Emergency Fund: Target ₹2-3 lakhs
   - Sibling Education: Enter expected fees
   - Gaming PC: Enter target cost
   - Future Fund: Your own goals

4. **Check Your Health** (Financial Coach page)
   - See your financial health score
   - Review recommendations
   - Check goal progress

5. **Track Expenses** (Expenses page)
   - Add daily/weekly expenses
   - View breakdown by category
   - Monitor monthly total

## 📊 Dashboard Overview

```
┌─────────────────────────────────────┐
│  FinFlow    [Settings] [🌙 Dark]   │
├─────────────────────────────────────┤
│                                     │
│  Financial Health: 72/100 [Good]   │
│  ⭕ [Status Badge]                  │
│                                     │
│  Monthly Summary:                   │
│  Income: ₹50,000                   │
│  Expenses: ₹15,000                 │
│  Balance: ₹35,000                  │
│                                     │
│  Savings Goals Progress:            │
│  🚨 Emergency Fund    ████░░░ 40%  │
│  📚 Sibling Edu       ██░░░░░░ 20% │
│  🎮 Gaming PC         ███░░░░░ 30% │
│  🎯 Future Fund       █░░░░░░░ 10% │
│                                     │
│  Net Worth: ₹5,32,000              │
│                                     │
├─────────────────────────────────────┤
│[📊 Dashboard] [💰 Income] [💸 Expenses]│
│  [🎯 Goals] [📈 Reports] [🤖 Coach] │
└─────────────────────────────────────┘
```

## 💡 Financial Health Score

### Score Ranges
- **80-100** ✅ **Excellent** - Well-structured finances, great job!
- **60-79** 👍 **Good** - On track, minor improvements needed
- **40-59** ⚠️ **Average** - Room for improvement
- **20-39** 🔴 **Poor** - Attention needed to savings
- **0-19** 🚨 **Critical** - Urgent action required

### What Affects Your Score
- Savings rate (target: 30-40% of income)
- Expense ratio (target: 50-60% of income)
- Emergency fund coverage (target: 3-6 months)
- Goal progress rate

## 📈 Pages Explained

### 1️⃣ Dashboard
**Purpose:** Overview of your financial health
- Health score visualization
- Monthly summary
- Fund progress rings
- Quick alerts
- Net worth total

### 2️⃣ Income
**Purpose:** Track all income sources
- Add income transactions
- 5 income sources (Salary, Bonus, Freelance, Gift, Other)
- Monthly total
- Source breakdown
- Delete transactions

### 3️⃣ Expenses
**Purpose:** Categorize and monitor spending
- 11 expense categories
- Add expense with date/amount/category/notes
- Top 5 categories breakdown
- Monthly total
- Delete transactions

### 4️⃣ Goals
**Purpose:** Plan and track savings goals
- 4 goal tabs (Emergency, Sibling, PC, Future)
- Current/target amounts
- Monthly contributions
- Completion date forecast
- Scenario planning for PC fund

### 5️⃣ Reports
**Purpose:** Analyze financial trends
- 6-month income vs expenses chart
- Expense breakdown pie chart
- Top 5 expenses list
- Income breakdown bar chart
- Cash flow forecast
- Export data as JSON/CSV

### 6️⃣ Financial Coach
**Purpose:** Get AI-driven recommendations
- Health score with insights
- 4 metric cards (savings rate, expense ratio, emergency coverage, goal progress)
- Prioritized recommendations (High/Medium/Low priority)
- "Can I afford this?" scenario simulator
- Goal completion forecasts
- Readiness scores (Emergency, PC funds)
- Personalized strategy

## 🔢 Key Formulas

### Financial Health Score
```
Score = (30% × Savings Rate)
      + (20% × Emergency Coverage)
      + (25% × Goal Progress)
      + (25% × Expense Ratio)
```

### Savings Rate
```
Savings Rate = (Income - Expenses) / Income × 100
Target: 30-40%
```

### Emergency Fund Coverage
```
Coverage = Emergency Fund / Monthly Expenses × 100
Target: 3-6 months (300-600%)
```

### Goal Completion Date
```
Months = (Target - Current) / Monthly Contribution
Date = Today + Months
```

## 💾 Backup & Restore

### Export (Backup)
1. Go to **Reports** page
2. Click **"Export JSON"** button
3. File downloads as `finflow-backup-YYYY-MM-DD.json`
4. Save in a safe location (Google Drive, Dropbox, etc.)

### Import (Restore)
1. Go to **Reports** page
2. Click **"Import JSON"** button
3. Select previously exported JSON file
4. Data is restored

### CSV Export
1. Go to **Reports** page
2. Click **"Export CSV"** button
3. Opens in Excel/Google Sheets for analysis

## ⚙️ Settings

Click the **Settings** button in the header to configure:
- Monthly salary range (for recommendations)
- Emergency fund target
- Expense budget
- Notification preferences (coming soon)

## 🆘 Troubleshooting

### App Not Working Offline?
- Clear cache: Settings → Application → Cache Storage → Delete
- Uninstall and reinstall as PWA
- Check browser console for errors

### Data Not Saving?
- Check localStorage is enabled in browser
- Try exporting data to backup
- Refresh the page

### Charts Not Showing?
- Make sure you have income/expense data for current month
- Check that dates are correct
- Try clearing browser cache

### PWA Not Installing?
- Use Chrome, Edge, or Opera (iOS uses Safari, needs different steps)
- Must be served over HTTPS (localhost works for development)
- Click address bar to find install button

## 🚀 Advanced Usage

### Custom Goals
In the **Goals** page, add custom future goals:
- Goal name (e.g., "Vacation to Goa")
- Target amount (e.g., ₹1,00,000)
- Target date (e.g., Dec 2024)
- Monthly contribution (optional)

### Scenario Planning
Use the **Financial Coach** page's "Can I afford this?" feature:
- Enter expense amount
- Get instant recommendation (Yes/No/Maybe)
- See impact on goals

### Monthly Planning
Each month:
1. Review the Financial Coach recommendations
2. Update your goals if needed
3. Check your health score
4. Adjust monthly contributions if needed

## 📱 Mobile Installation

### Android
1. Open app in Chrome
2. Tap menu (⋮)
3. Select "Install app"
4. Tap "Install"
5. App appears on home screen

### iOS/iPad
1. Open app in Safari
2. Tap Share button
3. Select "Add to Home Screen"
4. Enter app name
5. Tap "Add"

## 🔐 Data Privacy

- ✅ All data stored locally on your device
- ✅ No data sent to servers
- ✅ No tracking or analytics
- ✅ No login required
- ✅ Data is yours to control

## 📞 Support

- **Issues?** Check [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Questions?** Open GitHub Issue
- **Suggestions?** Contribute to the project

## 🎓 Learning Path

1. **Day 1:** Add income and expenses
2. **Day 2:** Set up all 4 savings goals
3. **Day 3:** Check Financial Coach for recommendations
4. **Day 4:** Review Reports for trends
5. **Week 1:** Adjust spending based on insights
6. **Week 2:** Add data regularly
7. **Month 1:** Review Financial Health score improvement

## 📈 Sample Monthly Budget (₹45,000 Salary)

```
Income: ₹45,000

Allocation:
├── Emergency Fund      ₹3,000  (6.7%)
├── Sibling Education   ₹4,000  (8.9%)
├── Gaming PC Fund      ₹3,000  (6.7%)
├── Living Expenses     ₹25,000 (55.6%)
│   ├── Rent/Home       ₹10,000
│   ├── Food            ₹8,000
│   ├── Transport       ₹3,000
│   ├── Utilities       ₹2,000
│   └── Misc            ₹2,000
├── Personal/Shopping   ₹2,000  (4.4%)
└── Entertainment       ₹1,500  (3.3%)
    └── Emergency Buffer ₹1,500

Total Savings: ₹10,000 (22.2%)
Target: Save 25-30%
```

---

**Happy budgeting with FinFlow! 💰📊**
