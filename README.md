# Finsight — Finance Dashboard UI

A clean, interactive finance dashboard built as part of the Zorvyn Frontend Developer Intern screening assessment.

---

## 🚀 Live Demo

https://finance-dashboard-one-zeta-19.vercel.app/

---

## 📸 Preview

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/ed1ac970-5084-44e9-8c3c-44bc2955f17c" />

---

## ✨ Features

### 📊 Dashboard Overview
- Summary cards showing Total Balance, Total Income, Total Expenses, and Savings Rate
- Monthly income vs expenses comparison with visual bar breakdown
- Spending breakdown donut chart by category
- Recent transactions preview

### 💳 Transactions
- Full transaction list with date, description, category, type, and amount
- Search by description or category
- Filter by type (Income / Expense) and category
- Sort by date, amount, or name (ascending / descending)
- Add, edit, and delete transactions (Admin only)

### 👥 Role-Based UI
- **Admin** — can view, add, edit, and delete transactions
- **Viewer** — read-only access, no edit controls shown
- Switch roles using the dropdown in the header — no backend needed, fully simulated on the frontend

### 💡 Insights
- Top spending category
- Savings rate with goal indicator (20% target)
- Month-over-month expense comparison
- Net income per month
- Category-wise spending breakdown with progress bars
- 3-month comparison grid (Jan, Feb, Mar)

### 🌙 Additional Features
- Dark mode toggle
- Data persistence using localStorage (data survives page refresh)
- Fully responsive — works on mobile, tablet, and desktop
- Graceful empty state handling

---

## 🛠️ Tech Stack

- **React** (via Vite)
- **Plain CSS-in-JS** (inline styles, no external UI library)
- **Google Fonts** — DM Sans + DM Mono
- **localStorage** for data persistence
- **React Hooks** — useState, useMemo, useEffect

---

## 📦 Getting Started

### Prerequisites
- Node.js (v18 or above)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/jayaydv12-stack/finance-dashboard.git

# Navigate into the project folder
cd finance-dashboard

# Install dependencies
npm install

# Start the development server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🗂️ Project Structure

```
finance-dashboard/
├── public/
├── src/
│   ├── App.jsx        # Main dashboard component (all features)
│   └── main.jsx       # React entry point
├── index.html         # Google Fonts link added here
├── package.json
└── vite.config.js
```

---

## 🧠 Approach

I kept the entire dashboard in a single `App.jsx` component using React's built-in `useState` and `useMemo` hooks for state management — no external libraries like Redux or Zustand were needed given the scope of the project.

Mock transaction data covers 3 months (Jan–Mar 2026) across multiple categories like Food, Transport, Shopping, Health, Entertainment, Utilities, Salary, Freelance, and Investment.

Role-based UI is handled purely on the frontend — the selected role is stored in state and controls which UI elements (add/edit/delete buttons) are rendered. No authentication or backend is involved.

---

## 📝 Assumptions

- All data is mock/static — no real backend or API calls
- Currency is in Indian Rupees (₹)
- Roles are toggled via a dropdown for demonstration purposes
- Data persists across page refreshes using localStorage

---

Built with ❤️ by Jaya Yadav
