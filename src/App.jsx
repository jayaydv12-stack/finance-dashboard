import { useState, useMemo, useEffect } from "react";

const COLORS = {
  income: "#1D9E75",
  expense: "#D85A30",
  balance: "#378ADD",
  food: "#D85A30",
  transport: "#BA7517",
  shopping: "#7F77DD",
  health: "#1D9E75",
  entertainment: "#D4537E",
  utilities: "#378ADD",
  salary: "#1D9E75",
  freelance: "#0F6E56",
  investment: "#185FA5",
  other: "#888780",
};

const CATEGORY_COLORS = [
  "#7F77DD","#1D9E75","#D85A30","#378ADD","#D4537E","#BA7517","#639922","#888780"
];

const INITIAL_TRANSACTIONS = [
  { id:1, date:"2026-03-01", description:"Monthly Salary", amount:85000, category:"Salary", type:"income" },
  { id:2, date:"2026-03-02", description:"Grocery Store", amount:3200, category:"Food", type:"expense" },
  { id:3, date:"2026-03-03", description:"Metro Card Recharge", amount:500, category:"Transport", type:"expense" },
  { id:4, date:"2026-03-05", description:"Netflix Subscription", amount:649, category:"Entertainment", type:"expense" },
  { id:5, date:"2026-03-06", description:"Freelance Project", amount:22000, category:"Freelance", type:"income" },
  { id:6, date:"2026-03-08", description:"Electricity Bill", amount:1800, category:"Utilities", type:"expense" },
  { id:7, date:"2026-03-10", description:"Amazon Shopping", amount:4500, category:"Shopping", type:"expense" },
  { id:8, date:"2026-03-12", description:"Doctor Visit", amount:900, category:"Health", type:"expense" },
  { id:9, date:"2026-03-14", description:"Restaurant Dinner", amount:2100, category:"Food", type:"expense" },
  { id:10, date:"2026-03-15", description:"Dividend Income", amount:5000, category:"Investment", type:"income" },
  { id:11, date:"2026-03-17", description:"Uber Rides", amount:780, category:"Transport", type:"expense" },
  { id:12, date:"2026-03-18", description:"Gym Membership", amount:1200, category:"Health", type:"expense" },
  { id:13, date:"2026-03-20", description:"Online Course", amount:3499, category:"Shopping", type:"expense" },
  { id:14, date:"2026-03-22", description:"Internet Bill", amount:999, category:"Utilities", type:"expense" },
  { id:15, date:"2026-03-25", description:"Movie Night", amount:600, category:"Entertainment", type:"expense" },
  { id:16, date:"2026-03-28", description:"Vegetables & Fruits", amount:850, category:"Food", type:"expense" },
  { id:17, date:"2026-02-01", description:"Monthly Salary", amount:85000, category:"Salary", type:"income" },
  { id:18, date:"2026-02-05", description:"Grocery Store", amount:2800, category:"Food", type:"expense" },
  { id:19, date:"2026-02-10", description:"Metro Card", amount:500, category:"Transport", type:"expense" },
  { id:20, date:"2026-02-12", description:"Freelance Project", amount:18000, category:"Freelance", type:"income" },
  { id:21, date:"2026-02-15", description:"Electricity Bill", amount:1650, category:"Utilities", type:"expense" },
  { id:22, date:"2026-02-20", description:"Shopping Mall", amount:6200, category:"Shopping", type:"expense" },
  { id:23, date:"2026-02-22", description:"Pharmacy", amount:450, category:"Health", type:"expense" },
  { id:24, date:"2026-02-25", description:"Dinner with Friends", amount:1800, category:"Food", type:"expense" },
  { id:25, date:"2026-01-01", description:"Monthly Salary", amount:85000, category:"Salary", type:"income" },
  { id:26, date:"2026-01-05", description:"New Year Shopping", amount:9500, category:"Shopping", type:"expense" },
  { id:27, date:"2026-01-10", description:"Metro Card", amount:500, category:"Transport", type:"expense" },
  { id:28, date:"2026-01-15", description:"Freelance Project", amount:25000, category:"Freelance", type:"income" },
  { id:29, date:"2026-01-20", description:"Electricity Bill", amount:2100, category:"Utilities", type:"expense" },
  { id:30, date:"2026-01-28", description:"Medical Checkup", amount:1500, category:"Health", type:"expense" },
];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function formatINR(n) {
  if (n >= 100000) return "₹" + (n/100000).toFixed(1) + "L";
  if (n >= 1000) return "₹" + (n/1000).toFixed(1) + "K";
  return "₹" + n.toLocaleString("en-IN");
}

function formatFull(n) {
  return "₹" + n.toLocaleString("en-IN");
}

function Badge({ type }) {
  const styles = {
    income: { background:"#E1F5EE", color:"#0F6E56" },
    expense: { background:"#FAECE7", color:"#993C1D" },
  };
  return (
    <span style={{ ...styles[type], fontSize:11, fontWeight:600, padding:"2px 8px", borderRadius:20, textTransform:"uppercase", letterSpacing:"0.5px" }}>
      {type}
    </span>
  );
}

function MiniBar({ value, max, color }) {
  return (
    <div style={{ background:"#f0f0f0", borderRadius:4, height:6, width:"100%", overflow:"hidden" }}>
      <div style={{ width:`${Math.min(100,(value/max)*100)}%`, background:color, height:"100%", borderRadius:4, transition:"width 0.5s ease" }} />
    </div>
  );
}

function SimpleBarChart({ data, color="#378ADD" }) {
  const max = Math.max(...data.map(d=>d.value), 1);
  return (
    <div style={{ display:"flex", alignItems:"flex-end", gap:6, height:80, padding:"4px 0" }}>
      {data.map((d,i) => (
        <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
          <div style={{ width:"100%", background:color, borderRadius:"3px 3px 0 0", height:`${Math.max(4,(d.value/max)*68)}px`, opacity: i === data.length-1 ? 1 : 0.55, transition:"height 0.4s ease" }} />
          <span style={{ fontSize:9, color:"#888", whiteSpace:"nowrap" }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ segments, size=120 }) {
  const total = segments.reduce((s,x)=>s+x.value,0);
  let cumulative = 0;
  const r = 42, cx = 60, cy = 60, stroke = 16;
  const arcs = segments.map(seg => {
    const pct = seg.value / total;
    const start = cumulative;
    cumulative += pct;
    const startAngle = start * 2 * Math.PI - Math.PI/2;
    const endAngle = cumulative * 2 * Math.PI - Math.PI/2;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const largeArc = pct > 0.5 ? 1 : 0;
    const d = `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
    return { ...seg, d, pct };
  });
  return (
    <svg width={size} height={size} viewBox="0 0 120 120">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f0f0f0" strokeWidth={stroke} />
      {arcs.map((arc,i) => (
        <path key={i} d={arc.d} fill="none" stroke={arc.color} strokeWidth={stroke} strokeLinecap="butt" />
      ))}
      <text x={cx} y={cy-4} textAnchor="middle" fontSize={9} fill="#888">Total</text>
      <text x={cx} y={cy+10} textAnchor="middle" fontSize={11} fontWeight={600} fill="#333">
        {segments.length > 0 ? formatINR(total) : "—"}
      </text>
    </svg>
  );
}

export default function FinanceDashboard() {
  const [role, setRole] = useState("admin");
  const [transactions, setTransactions] = useState(() => {
    try { const s = localStorage.getItem("fin_txns"); return s ? JSON.parse(s) : INITIAL_TRANSACTIONS; } catch { return INITIAL_TRANSACTIONS; }
  });
  const [activeTab, setActiveTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCat, setFilterCat] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [darkMode, setDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ description:"", amount:"", category:"Food", type:"expense", date: new Date().toISOString().split("T")[0] });
  const [editId, setEditId] = useState(null);
  const [nextId, setNextId] = useState(100);

  useEffect(() => {
    try { localStorage.setItem("fin_txns", JSON.stringify(transactions)); } catch {}
  }, [transactions]);

  const totalIncome = useMemo(() => transactions.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0), [transactions]);
  const totalExpense = useMemo(() => transactions.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0), [transactions]);
  const balance = totalIncome - totalExpense;

  const monthlyData = useMemo(() => {
    const months = ["2026-01","2026-02","2026-03"];
    return months.map(m => {
      const month = transactions.filter(t => t.date.startsWith(m));
      return {
        label: MONTHS[parseInt(m.split("-")[1])-1],
        income: month.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0),
        expense: month.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0),
      };
    });
  }, [transactions]);

  const categoryBreakdown = useMemo(() => {
    const cats = {};
    transactions.filter(t=>t.type==="expense").forEach(t => { cats[t.category] = (cats[t.category]||0)+t.amount; });
    return Object.entries(cats).sort((a,b)=>b[1]-a[1]).map(([k,v],i) => ({ name:k, value:v, color:CATEGORY_COLORS[i%CATEGORY_COLORS.length] }));
  }, [transactions]);

  const filtered = useMemo(() => {
    let list = [...transactions];
    if (filterType !== "all") list = list.filter(t=>t.type===filterType);
    if (filterCat !== "all") list = list.filter(t=>t.category===filterCat);
    if (search) list = list.filter(t=>t.description.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase()));
    list.sort((a,b) => {
      let va = a[sortBy], vb = b[sortBy];
      if (sortBy==="amount") { va=a.amount; vb=b.amount; }
      if (typeof va === "string") return sortDir==="asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      return sortDir==="asc" ? va-vb : vb-va;
    });
    return list;
  }, [transactions, filterType, filterCat, search, sortBy, sortDir]);

  const allCategories = useMemo(() => [...new Set(transactions.map(t=>t.category))], [transactions]);

  const insights = useMemo(() => {
    const top = categoryBreakdown[0];
    const prevMonth = monthlyData[1];
    const curMonth = monthlyData[2];
    const savingsRate = totalIncome > 0 ? Math.round(((totalIncome-totalExpense)/totalIncome)*100) : 0;
    const expChange = prevMonth && prevMonth.expense > 0 ? Math.round(((curMonth.expense-prevMonth.expense)/prevMonth.expense)*100) : 0;
    return { top, savingsRate, expChange, curMonth, prevMonth };
  }, [categoryBreakdown, monthlyData, totalIncome, totalExpense]);

  const handleSave = () => {
    if (!form.description || !form.amount || isNaN(Number(form.amount))) return;
    const tx = { ...form, amount: Math.abs(Number(form.amount)) };
    if (editId !== null) {
      setTransactions(prev => prev.map(t => t.id===editId ? { ...tx, id:editId } : t));
      setEditId(null);
    } else {
      setTransactions(prev => [{ ...tx, id: nextId }, ...prev]);
      setNextId(n => n+1);
    }
    setForm({ description:"", amount:"", category:"Food", type:"expense", date: new Date().toISOString().split("T")[0] });
    setShowModal(false);
  };

  const handleEdit = (t) => {
    setForm({ description:t.description, amount:t.amount, category:t.category, type:t.type, date:t.date });
    setEditId(t.id);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setTransactions(prev => prev.filter(t=>t.id!==id));
  };

  const bg = darkMode ? "#111" : "#F7F7F5";
  const card = darkMode ? "#1A1A1A" : "#fff";
  const border = darkMode ? "#2a2a2a" : "#EBEBEA";
  const text = darkMode ? "#E8E8E6" : "#1A1A18";
  const muted = darkMode ? "#777" : "#888";
  const inputBg = darkMode ? "#222" : "#FAFAF9";

  const tabs = ["overview","transactions","insights"];

  return (
    <div style={{ fontFamily:"'DM Sans', system-ui, sans-serif", background:bg, minHeight:"100vh", color:text, transition:"all 0.3s ease" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background: darkMode?"#161616":card, borderBottom:`1px solid ${border}`, padding:"0 24px", position:"sticky", top:0, zIndex:50 }}>
        <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", height:56 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:28, height:28, borderRadius:8, background:"linear-gradient(135deg,#1D9E75,#378ADD)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <span style={{ fontWeight:600, fontSize:16, letterSpacing:"-0.3px" }}>Finsight</span>
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            {/* Role switcher */}
            <div style={{ display:"flex", alignItems:"center", gap:6, background: darkMode?"#222":"#F0F0EE", borderRadius:20, padding:"3px 4px 3px 10px" }}>
              <span style={{ fontSize:12, color:muted }}>Role:</span>
              <select value={role} onChange={e=>setRole(e.target.value)} style={{ border:"none", background:"transparent", fontSize:12, fontWeight:600, color:text, cursor:"pointer", outline:"none", padding:"2px 4px" }}>
                <option value="admin">Admin</option>
                <option value="viewer">Viewer</option>
              </select>
              <div style={{ width:6, height:6, borderRadius:"50%", background: role==="admin"?"#1D9E75":"#378ADD" }} />
            </div>
            {/* Dark mode */}
            <button onClick={()=>setDarkMode(d=>!d)} style={{ border:`1px solid ${border}`, background:"transparent", borderRadius:8, width:32, height:32, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:text }}>
              {darkMode ? "☀" : "☾"}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", gap:0 }}>
          {tabs.map(t => (
            <button key={t} onClick={()=>setActiveTab(t)} style={{ background:"transparent", border:"none", borderBottom: activeTab===t ? `2px solid #1D9E75` : "2px solid transparent", padding:"10px 16px", fontSize:13, fontWeight: activeTab===t ? 600 : 400, color: activeTab===t ? "#1D9E75" : muted, cursor:"pointer", transition:"all 0.2s", textTransform:"capitalize" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth:1200, margin:"0 auto", padding:"24px 24px" }}>

        {/* ===== OVERVIEW ===== */}
        {activeTab === "overview" && (
          <div>
            {/* Summary cards */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:12, marginBottom:24 }}>
              {[
                { label:"Total Balance", value:balance, color:"#378ADD", icon:"◈" },
                { label:"Total Income", value:totalIncome, color:"#1D9E75", icon:"↑" },
                { label:"Total Expenses", value:totalExpense, color:"#D85A30", icon:"↓" },
                { label:"Savings Rate", value:`${Math.max(0,Math.round(((totalIncome-totalExpense)/Math.max(totalIncome,1))*100))}%`, color:"#7F77DD", icon:"◉", raw:true },
              ].map(c => (
                <div key={c.label} style={{ background:card, border:`1px solid ${border}`, borderRadius:12, padding:"16px 18px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                    <span style={{ fontSize:12, color:muted, fontWeight:500 }}>{c.label}</span>
                    <span style={{ fontSize:18, color:c.color }}>{c.icon}</span>
                  </div>
                  <div style={{ fontSize:22, fontWeight:600, color:c.color, letterSpacing:"-0.5px" }}>
                    {c.raw ? c.value : formatINR(Math.abs(c.value))}
                  </div>
                  <div style={{ fontSize:11, color:muted, marginTop:4 }}>
                    {c.label==="Total Balance" ? (balance>=0?"Positive balance":"Deficit") : c.label==="Total Income" ? `${transactions.filter(t=>t.type==="income").length} transactions` : c.label==="Total Expenses" ? `${transactions.filter(t=>t.type==="expense").length} transactions` : "Of total income"}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:24 }}>
              {/* Monthly trend */}
              <div style={{ background:card, border:`1px solid ${border}`, borderRadius:12, padding:"18px 20px" }}>
                <div style={{ fontSize:13, fontWeight:600, marginBottom:16 }}>Monthly Overview</div>
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {monthlyData.map((m,i) => (
                    <div key={i}>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:4 }}>
                        <span style={{ fontWeight:500 }}>{m.label}</span>
                        <div style={{ display:"flex", gap:12 }}>
                          <span style={{ color:"#1D9E75", fontFamily:"'DM Mono',monospace", fontSize:11 }}>+{formatINR(m.income)}</span>
                          <span style={{ color:"#D85A30", fontFamily:"'DM Mono',monospace", fontSize:11 }}>-{formatINR(m.expense)}</span>
                        </div>
                      </div>
                      <div style={{ display:"flex", gap:4, height:6 }}>
                        <div style={{ flex: m.income, background:"#1D9E75", borderRadius:3, opacity:0.8 }} />
                        <div style={{ flex: m.expense, background:"#D85A30", borderRadius:3, opacity:0.8 }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display:"flex", gap:16, marginTop:14, fontSize:11, color:muted }}>
                  <span><span style={{ color:"#1D9E75" }}>■</span> Income</span>
                  <span><span style={{ color:"#D85A30" }}>■</span> Expenses</span>
                </div>
              </div>

              {/* Category donut */}
              <div style={{ background:card, border:`1px solid ${border}`, borderRadius:12, padding:"18px 20px" }}>
                <div style={{ fontSize:13, fontWeight:600, marginBottom:12 }}>Spending Breakdown</div>
                <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                  <DonutChart segments={categoryBreakdown.slice(0,6)} size={110} />
                  <div style={{ flex:1, display:"flex", flexDirection:"column", gap:6 }}>
                    {categoryBreakdown.slice(0,5).map((c,i) => (
                      <div key={i} style={{ display:"flex", alignItems:"center", gap:6 }}>
                        <div style={{ width:8, height:8, borderRadius:2, background:c.color, flexShrink:0 }} />
                        <span style={{ fontSize:11, flex:1, color:muted }}>{c.name}</span>
                        <span style={{ fontSize:11, fontFamily:"'DM Mono',monospace", fontWeight:500 }}>{formatINR(c.value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Transactions preview */}
            <div style={{ background:card, border:`1px solid ${border}`, borderRadius:12, padding:"18px 20px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                <span style={{ fontSize:13, fontWeight:600 }}>Recent Transactions</span>
                <button onClick={()=>setActiveTab("transactions")} style={{ fontSize:12, color:"#1D9E75", background:"transparent", border:"none", cursor:"pointer", fontWeight:500 }}>View all →</button>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
                {transactions.slice(0,5).map((t,i) => (
                  <div key={t.id} style={{ display:"flex", alignItems:"center", padding:"10px 0", borderBottom: i<4 ? `1px solid ${border}` : "none", gap:12 }}>
                    <div style={{ width:34, height:34, borderRadius:10, background: t.type==="income"?"#E1F5EE":"#FAECE7", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>
                      {t.type==="income"?"↑":"↓"}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:500 }}>{t.description}</div>
                      <div style={{ fontSize:11, color:muted }}>{t.category} · {t.date}</div>
                    </div>
                    <div style={{ fontFamily:"'DM Mono',monospace", fontWeight:600, fontSize:14, color: t.type==="income"?"#1D9E75":"#D85A30" }}>
                      {t.type==="income"?"+":"-"}{formatINR(t.amount)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== TRANSACTIONS ===== */}
        {activeTab === "transactions" && (
          <div>
            {/* Controls */}
            <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap", alignItems:"center" }}>
              <input placeholder="Search transactions..." value={search} onChange={e=>setSearch(e.target.value)} style={{ flex:1, minWidth:160, background:inputBg, border:`1px solid ${border}`, borderRadius:8, padding:"8px 12px", fontSize:13, color:text, outline:"none" }} />
              <select value={filterType} onChange={e=>setFilterType(e.target.value)} style={{ background:inputBg, border:`1px solid ${border}`, borderRadius:8, padding:"8px 10px", fontSize:13, color:text, cursor:"pointer", outline:"none" }}>
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <select value={filterCat} onChange={e=>setFilterCat(e.target.value)} style={{ background:inputBg, border:`1px solid ${border}`, borderRadius:8, padding:"8px 10px", fontSize:13, color:text, cursor:"pointer", outline:"none" }}>
                <option value="all">All Categories</option>
                {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{ background:inputBg, border:`1px solid ${border}`, borderRadius:8, padding:"8px 10px", fontSize:13, color:text, cursor:"pointer", outline:"none" }}>
                <option value="date">Sort: Date</option>
                <option value="amount">Sort: Amount</option>
                <option value="description">Sort: Name</option>
              </select>
              <button onClick={()=>setSortDir(d=>d==="asc"?"desc":"asc")} style={{ background:inputBg, border:`1px solid ${border}`, borderRadius:8, padding:"8px 10px", fontSize:13, cursor:"pointer", color:text }}>
                {sortDir==="asc"?"↑ Asc":"↓ Desc"}
              </button>
              {role === "admin" && (
                <button onClick={()=>{setEditId(null);setForm({ description:"", amount:"", category:"Food", type:"expense", date: new Date().toISOString().split("T")[0] });setShowModal(true);}} style={{ background:"#1D9E75", color:"#fff", border:"none", borderRadius:8, padding:"8px 14px", fontSize:13, fontWeight:600, cursor:"pointer", whiteSpace:"nowrap" }}>
                  + Add
                </button>
              )}
            </div>

            {/* Role note for viewer */}
            {role === "viewer" && (
              <div style={{ background: darkMode?"#1a2820":"#E1F5EE", border:"1px solid #9FE1CB", borderRadius:8, padding:"8px 14px", fontSize:12, color:"#0F6E56", marginBottom:12 }}>
                Viewer mode — read only. Switch to Admin to add or edit transactions.
              </div>
            )}

            {/* Table */}
            <div style={{ background:card, border:`1px solid ${border}`, borderRadius:12, overflow:"hidden" }}>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                  <thead>
                    <tr style={{ background: darkMode?"#1A1A1A":"#FAFAF9", borderBottom:`1px solid ${border}` }}>
                      {["Date","Description","Category","Type","Amount",""].map((h,i) => (
                        <th key={i} style={{ padding:"10px 14px", textAlign: h==="Amount" ? "right" : "left", fontWeight:600, fontSize:11, color:muted, textTransform:"uppercase", letterSpacing:"0.5px", whiteSpace:"nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr><td colSpan={6} style={{ padding:"40px", textAlign:"center", color:muted, fontSize:13 }}>No transactions found</td></tr>
                    ) : filtered.map((t,i) => (
                      <tr key={t.id} style={{ borderBottom: i<filtered.length-1 ? `1px solid ${border}` : "none", transition:"background 0.15s" }}>
                        <td style={{ padding:"11px 14px", color:muted, fontFamily:"'DM Mono',monospace", fontSize:12 }}>{t.date}</td>
                        <td style={{ padding:"11px 14px", fontWeight:500 }}>{t.description}</td>
                        <td style={{ padding:"11px 14px", color:muted }}>{t.category}</td>
                        <td style={{ padding:"11px 14px" }}><Badge type={t.type} /></td>
                        <td style={{ padding:"11px 14px", textAlign:"right", fontFamily:"'DM Mono',monospace", fontWeight:600, color: t.type==="income"?"#1D9E75":"#D85A30" }}>
                          {t.type==="income"?"+":"-"}{formatINR(t.amount)}
                        </td>
                        <td style={{ padding:"11px 14px", textAlign:"right" }}>
                          {role === "admin" && (
                            <div style={{ display:"flex", gap:6, justifyContent:"flex-end" }}>
                              <button onClick={()=>handleEdit(t)} style={{ background:"transparent", border:`1px solid ${border}`, borderRadius:6, padding:"3px 8px", fontSize:11, cursor:"pointer", color:muted }}>Edit</button>
                              <button onClick={()=>handleDelete(t.id)} style={{ background:"transparent", border:"1px solid #F0997B", borderRadius:6, padding:"3px 8px", fontSize:11, cursor:"pointer", color:"#D85A30" }}>Del</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div style={{ fontSize:12, color:muted, marginTop:8, textAlign:"right" }}>
              {filtered.length} of {transactions.length} transactions
            </div>
          </div>
        )}

        {/* ===== INSIGHTS ===== */}
        {activeTab === "insights" && (
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {/* Insight cards row */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:12 }}>
              {[
                {
                  title:"Top Spending Category",
                  value: insights.top ? insights.top.name : "—",
                  sub: insights.top ? formatFull(insights.top.value) + " spent" : "",
                  color:"#D85A30", icon:"🏆"
                },
                {
                  title:"Savings Rate",
                  value: `${Math.max(0,insights.savingsRate)}%`,
                  sub: insights.savingsRate>=20 ? "Great! Above 20% goal" : "Below 20% — try to save more",
                  color: insights.savingsRate>=20?"#1D9E75":"#D85A30", icon:"💰"
                },
                {
                  title:"Expense vs Last Month",
                  value: `${insights.expChange>0?"+":""}${insights.expChange}%`,
                  sub: insights.expChange<=0 ? "Spending down — great job!" : "Spending increased this month",
                  color: insights.expChange<=0?"#1D9E75":"#D85A30", icon:"📊"
                },
                {
                  title:"Net This Month",
                  value: formatINR(insights.curMonth.income - insights.curMonth.expense),
                  sub: `${formatINR(insights.curMonth.income)} in · ${formatINR(insights.curMonth.expense)} out`,
                  color: (insights.curMonth.income-insights.curMonth.expense)>=0?"#378ADD":"#D85A30", icon:"📈"
                },
              ].map((c,i) => (
                <div key={i} style={{ background:card, border:`1px solid ${border}`, borderRadius:12, padding:"18px 20px" }}>
                  <div style={{ fontSize:20, marginBottom:8 }}>{c.icon}</div>
                  <div style={{ fontSize:11, color:muted, fontWeight:500, marginBottom:4, textTransform:"uppercase", letterSpacing:"0.4px" }}>{c.title}</div>
                  <div style={{ fontSize:26, fontWeight:700, color:c.color, letterSpacing:"-0.5px", marginBottom:4 }}>{c.value}</div>
                  <div style={{ fontSize:11, color:muted }}>{c.sub}</div>
                </div>
              ))}
            </div>

            {/* Category breakdown detail */}
            <div style={{ background:card, border:`1px solid ${border}`, borderRadius:12, padding:"20px 22px" }}>
              <div style={{ fontSize:13, fontWeight:600, marginBottom:16 }}>Category Spending Analysis</div>
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {categoryBreakdown.map((c,i) => {
                  const pct = totalExpense > 0 ? Math.round((c.value/totalExpense)*100) : 0;
                  return (
                    <div key={i}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5, fontSize:13 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <div style={{ width:10, height:10, borderRadius:3, background:c.color }} />
                          <span style={{ fontWeight:500 }}>{c.name}</span>
                        </div>
                        <div style={{ display:"flex", gap:16, color:muted, fontSize:12 }}>
                          <span style={{ fontFamily:"'DM Mono',monospace" }}>{formatFull(c.value)}</span>
                          <span style={{ minWidth:36, textAlign:"right", fontWeight:600, color:c.color }}>{pct}%</span>
                        </div>
                      </div>
                      <MiniBar value={c.value} max={categoryBreakdown[0]?.value||1} color={c.color} />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Monthly comparison */}
            <div style={{ background:card, border:`1px solid ${border}`, borderRadius:12, padding:"20px 22px" }}>
              <div style={{ fontSize:13, fontWeight:600, marginBottom:14 }}>Month-over-Month Comparison</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
                {monthlyData.map((m,i) => (
                  <div key={i} style={{ background: darkMode?"#222":"#FAFAF9", borderRadius:10, padding:"14px 16px" }}>
                    <div style={{ fontSize:12, fontWeight:600, color:muted, marginBottom:8 }}>{m.label} 2026</div>
                    <div style={{ fontSize:13, color:"#1D9E75", marginBottom:3 }}>+{formatINR(m.income)}</div>
                    <div style={{ fontSize:13, color:"#D85A30", marginBottom:8 }}>-{formatINR(m.expense)}</div>
                    <div style={{ height:1, background:border, marginBottom:8 }} />
                    <div style={{ fontSize:12, fontWeight:600, color: (m.income-m.expense)>=0?"#378ADD":"#D85A30" }}>
                      Net: {formatINR(m.income-m.expense)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
          <div style={{ background:card, borderRadius:16, padding:"24px", width:"100%", maxWidth:420, boxShadow:"0 20px 40px rgba(0,0,0,0.2)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <span style={{ fontSize:15, fontWeight:600 }}>{editId!==null?"Edit":"Add"} Transaction</span>
              <button onClick={()=>setShowModal(false)} style={{ background:"transparent", border:"none", fontSize:18, cursor:"pointer", color:muted }}>×</button>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {[
                { label:"Description", key:"description", type:"text", placeholder:"e.g. Grocery Store" },
                { label:"Amount (₹)", key:"amount", type:"number", placeholder:"e.g. 2500" },
                { label:"Date", key:"date", type:"date" },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize:12, color:muted, marginBottom:4, display:"block", fontWeight:500 }}>{f.label}</label>
                  <input type={f.type} value={form[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} placeholder={f.placeholder} style={{ width:"100%", background:inputBg, border:`1px solid ${border}`, borderRadius:8, padding:"9px 12px", fontSize:13, color:text, outline:"none", boxSizing:"border-box" }} />
                </div>
              ))}
              <div>
                <label style={{ fontSize:12, color:muted, marginBottom:4, display:"block", fontWeight:500 }}>Category</label>
                <select value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))} style={{ width:"100%", background:inputBg, border:`1px solid ${border}`, borderRadius:8, padding:"9px 12px", fontSize:13, color:text, outline:"none" }}>
                  {["Food","Transport","Shopping","Health","Entertainment","Utilities","Salary","Freelance","Investment","Other"].map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize:12, color:muted, marginBottom:4, display:"block", fontWeight:500 }}>Type</label>
                <div style={{ display:"flex", gap:8 }}>
                  {["income","expense"].map(t => (
                    <button key={t} onClick={()=>setForm(p=>({...p,type:t}))} style={{ flex:1, padding:"9px", borderRadius:8, border:`1px solid ${form.type===t?(t==="income"?"#1D9E75":"#D85A30"):border}`, background: form.type===t?(t==="income"?"#E1F5EE":"#FAECE7"):"transparent", color: form.type===t?(t==="income"?"#0F6E56":"#993C1D"):muted, fontSize:13, fontWeight:form.type===t?600:400, cursor:"pointer", textTransform:"capitalize", transition:"all 0.15s" }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={handleSave} style={{ background:"#1D9E75", color:"#fff", border:"none", borderRadius:8, padding:"11px", fontSize:13, fontWeight:600, cursor:"pointer", marginTop:4, transition:"opacity 0.15s" }}>
                {editId!==null?"Save Changes":"Add Transaction"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
