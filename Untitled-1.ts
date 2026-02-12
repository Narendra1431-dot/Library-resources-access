<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.5, user-scalable=yes">
  <title>SmartLibrary • professional academic portal</title>
  <!-- Tailwind (lightweight) -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Inter font -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet">
  <!-- Font Awesome 6 -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
  <!-- Chart.js -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
  <style>
    /* ---------- PROFESSIONAL DESIGN SYSTEM ---------- */
    * { font-family: 'Inter', sans-serif; margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #0b1f2f;
      color: #ffffff;
      transition: background 0.2s ease, color 0.2s;
      font-weight: 400;
      line-height: 1.5;
    }
    body.dark {
      background: #030d17;
      color: #eef2f6;
    }
    /* premium glassmorphism */
    .glass-premium {
      background: rgba(18, 35, 50, 0.65);
      backdrop-filter: blur(16px) saturate(180%);
      -webkit-backdrop-filter: blur(16px) saturate(180%);
      border: 1px solid rgba(45, 212, 191, 0.15);
      border-radius: 28px;
      box-shadow: 0 20px 35px -8px rgba(0,0,0,0.4);
      transition: all 0.25s cubic-bezier(0.2, 0, 0, 1);
    }
    .dark .glass-premium {
      background: rgba(5, 15, 25, 0.8);
      border: 1px solid rgba(74, 222, 128, 0.15);
    }
    /* emerald + purple hover glow */
    .hover-glow-premium:hover {
      box-shadow: 0 0 0 2px rgba(45, 212, 191, 0.4), 0 0 28px 6px rgba(192, 132, 252, 0.4);
      transform: translateY(-4px);
      border-color: rgba(45,212,191,0.5);
    }
    /* ripple effect */
    .ripple-smooth {
      position: relative;
      overflow: hidden;
    }
    .ripple-smooth:after {
      content: "";
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background: radial-gradient(circle, rgba(255,255,255,0.45) 10%, transparent 10.01%);
      background-repeat: no-repeat;
      background-position: 50%;
      transform: scale(10,10);
      opacity: 0;
      transition: transform .35s, opacity .5s;
      pointer-events: none;
    }
    .ripple-smooth:active:after {
      transform: scale(0,0);
      opacity: 0.35;
      transition: 0s;
    }
    /* animated counters */
    .counter-professional {
      font-feature-settings: "tnum";
      font-weight: 700;
      background: linear-gradient(145deg, #e0f2fe, #bff0e8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .dark .counter-professional {
      background: linear-gradient(145deg, #b2f0e4, #a0e7ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    /* custom scrollbar */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: rgba(20,50,70,0.2); border-radius: 10px; }
    ::-webkit-scrollbar-thumb { background: #2dd4bf; border-radius: 10px; }
    /* loading spinner */
    .spinner {
      border: 3px solid rgba(45,212,191,0.2);
      border-top: 3px solid #2dd4bf;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    /* login float animation */
    @keyframes floatSoft {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-7px); }
      100% { transform: translateY(0px); }
    }
    .float-animation { animation: floatSoft 7s infinite ease-in-out; }
    /* online pulse */
    .online-pulse { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.6); animation: pulse-green 2s infinite; }
    @keyframes pulse-green { 0% { box-shadow: 0 0 0 0 rgba(16,185,129,0.6); } 70% { box-shadow: 0 0 0 8px rgba(16,185,129,0); } 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0); } }
    @media (max-width: 640px) { .glass-premium { border-radius: 22px; } }
  </style>
</head>
<body class="antialiased overflow-x-hidden transition-colors duration-300">

<div id="app" class="min-h-screen w-full relative flex"></div>

<script>
  // ---------- REAL-TIME MOCK DATABASE (FIREBASE STYLE) ----------
  const DB = {
    books: [
      { id: 'b1', title: "Deep Learning (Adaptive Computation)", author: "Ian Goodfellow", category: "AI", type: "ebook", views: 2840, downloads: 1730, rating: 4.9, fileUrl: "#", fileSize: "18.2 MB", year: 2016, publisher: "MIT Press", cover: "https://placehold.co/600x800/0A3845/FFFFFF/png?text=DL", issn: null, availability: true },
      { id: 'b2', title: "Distributed Systems, 4th Ed", author: "Maarten van Steen", category: "Engineering", type: "book", views: 1520, downloads: 680, rating: 4.6, fileUrl: "", fileSize: null, year: 2023, publisher: "Amazon", cover: "https://placehold.co/600x800/1E4A5F/FFFFFF/png?text=DS", issn: null, availability: true },
      { id: 'b3', title: "Nature Neuroscience Review", author: "Kandel et al.", category: "Science", type: "journal", views: 3670, downloads: 2100, rating: 4.8, fileUrl: "#", fileSize: "2.4 MB", year: 2025, publisher: "Nature Research", cover: "https://placehold.co/600x800/1D5E6B/FFFFFF/png?text=NN", issn: "1546-1726", availability: true },
      { id: 'b4', title: "Reinforcement Learning: An Introduction", author: "Sutton & Barto", category: "AI", type: "ebook", views: 5120, downloads: 3740, rating: 5.0, fileUrl: "#", fileSize: "11.7 MB", year: 2018, publisher: "MIT Press", cover: "https://placehold.co/600x800/0F4C5C/FFFFFF/png?text=RL", issn: null, availability: true },
      { id: 'b5', title: "ACM Computing Surveys", author: "ACM", category: "CS", type: "journal", views: 2890, downloads: 1450, rating: 4.5, fileUrl: "#", fileSize: "3.1 MB", year: 2024, publisher: "ACM", cover: "https://placehold.co/600x800/225566/FFFFFF/png?text=CSUR", issn: "0360-0300", availability: true },
      { id: 'b6', title: "Modern Operating Systems", author: "Tanenbaum", category: "Engineering", type: "book", views: 2110, downloads: 980, rating: 4.7, fileUrl: "", fileSize: null, year: 2015, publisher: "Pearson", cover: "https://placehold.co/600x800/1E4A5F/FFFFFF/png?text=OS", issn: null, availability: false },
      { id: 'b7', title: "Artificial Intelligence: A Modern Approach", author: "Russell/Norvig", category: "AI", type: "ebook", views: 7830, downloads: 5560, rating: 4.9, fileUrl: "#", fileSize: "22.5 MB", year: 2020, publisher: "Pearson", cover: "https://placehold.co/600x800/0A3845/FFFFFF/png?text=AIMA", issn: null, availability: true },
      { id: 'b8', title: "The Lancet Digital Health", author: "Elsevier", category: "Science", type: "journal", views: 1850, downloads: 920, rating: 4.3, fileUrl: "#", fileSize: "1.9 MB", year: 2025, publisher: "Elsevier", cover: "https://placehold.co/600x800/1D5E6B/FFFFFF/png?text=TLDH", issn: "2589-7500", availability: true },
      { id: 'b9', title: "Clean Code: A Handbook", author: "Robert C. Martin", category: "Engineering", type: "ebook", views: 4420, downloads: 3180, rating: 4.8, fileUrl: "#", fileSize: "6.3 MB", year: 2008, publisher: "Prentice Hall", cover: "https://placehold.co/600x800/1E4A5F/FFFFFF/png?text=CC", issn: null, availability: true },
      { id: 'b10', title: "IEEE Transactions on Pattern Analysis", author: "IEEE", category: "CS", type: "journal", views: 2060, downloads: 1100, rating: 4.6, fileUrl: "#", fileSize: "2.8 MB", year: 2024, publisher: "IEEE", cover: "https://placehold.co/600x800/225566/FFFFFF/png?text=TPAMI", issn: "0162-8828", availability: true },
      { id: 'b11', title: "Introduction to Algorithms (CLRS)", author: "Cormen et al.", category: "CS", type: "book", views: 3150, downloads: 1870, rating: 4.9, fileUrl: "", fileSize: null, year: 2022, publisher: "MIT Press", cover: "https://placehold.co/600x800/0A3845/FFFFFF/png?text=CLRS", issn: null, availability: true },
      { id: 'b12', title: "Cell Biology", author: "Alberts", category: "Science", type: "ebook", views: 980, downloads: 430, rating: 4.4, fileUrl: "#", fileSize: "34 MB", year: 2019, publisher: "Garland", cover: "https://placehold.co/600x800/1D5E6B/FFFFFF/png?text=CB", issn: null, availability: true },
    ],
    users: [
      { id: 101, name: "Alice Chen", email: "alice@univ.edu", password: "pass", role: "student", department: "Computer Science", lastLogin: "2026-02-12 09:22", isOnline: true },
      { id: 102, name: "Dr. Rajesh Kumar", email: "faculty@univ.edu", password: "pass", role: "faculty", department: "Data Science", lastLogin: "2026-02-12 10:05", isOnline: true },
      { id: 103, name: "Bob Smith", email: "bob@univ.edu", password: "pass", role: "student", department: "Electrical Eng", lastLogin: "2026-02-11 23:12", isOnline: false },
      { id: 104, name: "Prof. Linda Park", email: "linda@univ.edu", password: "pass", role: "faculty", department: "AI Research", lastLogin: "2026-02-12 08:40", isOnline: true },
      { id: 105, name: "Maya Singh", email: "maya@univ.edu", password: "pass", role: "student", department: "Mechanical", lastLogin: "2026-02-12 11:18", isOnline: true },
    ],
    activities: [
      { userId: 101, bookId: 'b7', accessedAt: "2026-02-12 10:30", timeSpent: 12, downloaded: true },
      { userId: 101, bookId: 'b4', accessedAt: "2026-02-12 09:45", timeSpent: 5, downloaded: false },
      { userId: 102, bookId: 'b1', accessedAt: "2026-02-12 11:00", timeSpent: 20, downloaded: true },
      { userId: 105, bookId: 'b9', accessedAt: "2026-02-12 08:15", timeSpent: 7, downloaded: true },
      { userId: 101, bookId: 'b3', accessedAt: "2026-02-11 22:10", timeSpent: 15, downloaded: false },
      { userId: 104, bookId: 'b5', accessedAt: "2026-02-12 09:00", timeSpent: 9, downloaded: true },
      { userId: 103, bookId: 'b2', accessedAt: "2026-02-10 14:20", timeSpent: 18, downloaded: false },
    ]
  };

  // ---------- SESSION MANAGEMENT ----------
  let currentUser = JSON.parse(sessionStorage.getItem('smartlib_pro_user')) || null;
  let activeRoute = window.location.hash.slice(1) || 'login';

  // ---------- HELPER FUNCTIONS ----------
  const getOnlineCount = () => DB.users.filter(u => u.isOnline).length;
  const getTotalBooks = () => DB.books.length;
  const getEbooksCount = () => DB.books.filter(b => b.type === 'ebook').length;
  const getJournalsCount = () => DB.books.filter(b => b.type === 'journal').length;
  const getTrendingBooks = () => [...DB.books].sort((a,b) => b.views - a.views).slice(0,5);
  const getUserRecent = (uid) => DB.activities.filter(a => a.userId === uid).sort((a,b)=> new Date(b.accessedAt)-new Date(a.accessedAt)).slice(0,5);
  const getBookById = (id) => DB.books.find(b => b.id === id);

  // ---------- SMOOTH COUNTER (requestAnimationFrame) ----------
  function animateCounter(el, target, duration = 1000) {
    if (!el) return;
    let current = 0, inc = target / (duration / 16), timer;
    const frame = () => {
      current += inc;
      if (current >= target) { el.innerText = target; cancelAnimationFrame(timer); return; }
      el.innerText = Math.floor(current);
      timer = requestAnimationFrame(frame);
    };
    timer = requestAnimationFrame(frame);
  }

  // ---------- LOGIN PAGE ----------
  function renderLogin() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="min-h-screen w-full flex items-center justify-center p-5" style="background: radial-gradient(125% 125% at 50% 10%, #0b2b3c, #05131e);">
        <div class="glass-premium w-full max-w-md p-8 md:p-10 float-animation" style="border-top: 3px solid #2dd4bf;">
          <div class="text-center mb-8">
            <div class="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-400 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl mb-5">
              <i class="fas fa-robot text-4xl text-white"></i>
            </div>
            <h1 class="text-4xl font-bold tracking-tight bg-gradient-to-r from-emerald-200 to-blue-200 bg-clip-text text-transparent">SmartLibrary</h1>
            <p class="text-white/60 mt-2 text-sm">realtime • academic • intelligent</p>
          </div>
          <form id="loginForm" class="space-y-5">
            <div class="relative">
              <i class="fas fa-envelope absolute left-4 top-4 text-emerald-300/80"></i>
              <input type="email" id="email" placeholder="university email" value="faculty@univ.edu" class="w-full py-3.5 pl-12 pr-4 rounded-2xl bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:ring-2 focus:ring-emerald-400 outline-none backdrop-blur-sm transition">
            </div>
            <div class="relative">
              <i class="fas fa-lock absolute left-4 top-4 text-emerald-300/80"></i>
              <input type="password" id="password" placeholder="password" value="pass" class="w-full py-3.5 pl-12 pr-4 rounded-2xl bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:ring-2 focus:ring-emerald-400 outline-none backdrop-blur-sm">
            </div>
            <div class="relative">
              <i class="fas fa-id-card absolute left-4 top-4 text-emerald-300/80"></i>
              <select id="role" class="w-full py-3.5 pl-12 pr-4 rounded-2xl bg-white/5 border border-white/20 text-white appearance-none focus:ring-2 focus:ring-emerald-400 outline-none backdrop-blur-sm">
                <option value="student" class="bg-[#0b1f2f]">🎓 Student</option>
                <option value="faculty" selected class="bg-[#0b1f2f]">👨‍🏫 Faculty</option>
              </select>
            </div>
            <button type="submit" class="relative w-full py-3.5 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold rounded-2xl ripple-smooth transition shadow-lg shadow-emerald-900/50 text-lg">Access portal →</button>
            <div class="flex justify-between text-sm text-white/50">
              <a href="#" id="forgotPwd" class="hover:text-emerald-300 transition flex items-center gap-1"><i class="fas fa-key"></i> OTP recovery</a>
              <span>demo: faculty@univ.edu / pass</span>
            </div>
          </form>
        </div>
      </div>
    `;
    document.getElementById('loginForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const pwd = document.getElementById('password').value;
      const role = document.getElementById('role').value;
      const user = DB.users.find(u => u.email === email && u.password === pwd && u.role === role);
      if (user) {
        currentUser = user; sessionStorage.setItem('smartlib_pro_user', JSON.stringify(user));
        window.location.hash = 'dashboard'; renderRoute('dashboard');
      } else alert('❌ Invalid credentials — try faculty@univ.edu / pass');
    });
    document.getElementById('forgotPwd')?.addEventListener('click', (e) => { e.preventDefault(); alert('📧 OTP sent to your registered email (simulated).'); });
  }

  // ---------- SIDEBAR (role‑aware) ----------
  function renderSidebar() {
    const isFaculty = currentUser?.role === 'faculty';
    return `
      <aside class="glass-premium w-24 md:w-72 p-5 md:p-6 flex flex-col items-center md:items-start h-screen sticky top-0 z-30 mr-1" style="border-right: 1px solid rgba(45,212,191,0.2);">
        <div class="flex items-center space-x-4 mb-10 mt-2">
          <div class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg"><i class="fas fa-book-open text-white text-xl"></i></div>
          <span class="hidden md:block text-2xl font-bold bg-gradient-to-r from-emerald-200 to-blue-200 bg-clip-text text-transparent">SmartLib</span>
        </div>
        <nav class="flex flex-col space-y-5 w-full flex-1">
          <a href="#dashboard" class="flex items-center space-x-4 text-white/80 hover:text-white p-3 rounded-2xl transition-all hover:bg-white/5 ${activeRoute==='dashboard'?'bg-white/10 text-emerald-300':''}"><i class="fas fa-chart-pie w-6 text-emerald-300"></i><span class="hidden md:inline font-medium">Dashboard</span></a>
          <a href="#books" class="flex items-center space-x-4 text-white/80 hover:text-white p-3 rounded-2xl transition-all hover:bg-white/5"><i class="fas fa-book w-6 text-emerald-300"></i><span class="hidden md:inline">All Books</span></a>
          <a href="#ebooks" class="flex items-center space-x-4 text-white/80 hover:text-white p-3 rounded-2xl transition-all hover:bg-white/5"><i class="fas fa-file-pdf w-6 text-emerald-300"></i><span class="hidden md:inline">E‑Books</span></a>
          <a href="#journals" class="flex items-center space-x-4 text-white/80 hover:text-white p-3 rounded-2xl transition-all hover:bg-white/5"><i class="fas fa-scroll w-6 text-emerald-300"></i><span class="hidden md:inline">Journals</span></a>
          <a href="#active-users" class="flex items-center space-x-4 text-white/80 hover:text-white p-3 rounded-2xl transition-all hover:bg-white/5"><i class="fas fa-user-check w-6 text-emerald-300"></i><span class="hidden md:inline">Active Users</span></a>
          <a href="#trending" class="flex items-center space-x-4 text-white/80 hover:text-white p-3 rounded-2xl transition-all hover:bg-white/5"><i class="fas fa-fire w-6 text-emerald-300"></i><span class="hidden md:inline">Trending</span></a>
          <a href="#recent" class="flex items-center space-x-4 text-white/80 hover:text-white p-3 rounded-2xl transition-all hover:bg-white/5"><i class="fas fa-clock w-6 text-emerald-300"></i><span class="hidden md:inline">Recent</span></a>
          <a href="#analytics" class="flex items-center space-x-4 text-white/80 hover:text-white p-3 rounded-2xl transition-all hover:bg-white/5"><i class="fas fa-chart-line w-6 text-emerald-300"></i><span class="hidden md:inline">Analytics</span></a>
          ${isFaculty ? `<a href="#upload" class="flex items-center space-x-4 bg-emerald-900/40 p-3 rounded-2xl border border-emerald-500/50"><i class="fas fa-upload w-6 text-emerald-300"></i><span class="hidden md:inline font-medium">Upload resource</span></a>` : ''}
        </nav>
        <div class="mt-auto w-full space-y-3 pb-5">
          <button id="darkToggle" class="flex items-center space-x-4 text-white/70 hover:text-white p-3 w-full rounded-2xl hover:bg-white/5"><i class="fas fa-moon w-6"></i><span class="hidden md:inline">Dark/Light</span></button>
          <a href="#logout" id="logoutBtn" class="flex items-center space-x-4 text-rose-300/90 hover:text-rose-200 p-3 w-full rounded-2xl hover:bg-white/5"><i class="fas fa-sign-out-alt w-6"></i><span class="hidden md:inline">Logout</span></a>
        </div>
      </aside>
    `;
  }

  // ---------- DASHBOARD (7 LIVE CARDS) ----------
  function renderDashboard() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="flex w-full min-h-screen bg-[#0b1f2f] text-white">
        ${renderSidebar()}
        <main class="flex-1 p-6 md:p-9 overflow-y-auto">
          <div class="mb-9">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-emerald-800/30 rounded-2xl flex items-center justify-center"><i class="fas fa-user-graduate text-2xl text-emerald-300"></i></div>
              <div>
                <h2 class="text-3xl md:text-4xl font-light">Welcome back, <span class="font-bold bg-gradient-to-r from-emerald-300 to-blue-300 bg-clip-text text-transparent">${currentUser?.name}</span></h2>
                <p class="text-white/50 flex items-center gap-2"><span class="inline-block w-2 h-2 bg-emerald-400 rounded-full online-pulse"></span> ${currentUser?.role === 'faculty' ? 'Faculty · upload enabled' : 'Student · explorer'}</p>
              </div>
            </div>
          </div>
          <!-- 7 cards grid -->
          <div id="dashboard-counters" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7 auto-rows-fr">
            <!-- 1 total books -->
            <a href="#books" class="glass-premium p-6 hover-glow-premium ripple-smooth flex flex-col">
              <div class="flex justify-between items-start"><i class="fas fa-book-open text-emerald-400 text-3xl"></i><span class="text-5xl font-bold counter-professional" id="totalBooksCounter">0</span></div>
              <p class="text-white/80 text-lg mt-2 font-medium">Total Books</p>
              <span class="text-xs text-emerald-300/80 mt-2 flex items-center">browse collection <i class="fas fa-arrow-right ml-1 text-xs"></i></span>
            </a>
            <!-- 2 ebooks -->
            <a href="#ebooks" class="glass-premium p-6 hover-glow-premium ripple-smooth flex flex-col">
              <div class="flex justify-between items-start"><i class="fas fa-file-pdf text-emerald-400 text-3xl"></i><span class="text-5xl font-bold counter-professional" id="ebooksCounter">0</span></div>
              <p class="text-white/80 text-lg mt-2 font-medium">E‑Books</p>
              <span class="text-xs text-emerald-300/80 mt-2">PDF download →</span>
            </a>
            <!-- 3 journals -->
            <a href="#journals" class="glass-premium p-6 hover-glow-premium ripple-smooth flex flex-col">
              <div class="flex justify-between items-start"><i class="fas fa-scroll text-emerald-400 text-3xl"></i><span class="text-5xl font-bold counter-professional" id="journalsCounter">0</span></div>
              <p class="text-white/80 text-lg mt-2 font-medium">Journals</p>
              <span class="text-xs text-emerald-300/80 mt-2">peer reviewed →</span>
            </a>
            <!-- 4 active users -->
            <a href="#active-users" class="glass-premium p-6 hover-glow-premium ripple-smooth flex flex-col">
              <div class="flex justify-between items-start"><i class="fas fa-users text-emerald-400 text-3xl"></i><span class="text-5xl font-bold counter-professional" id="activeUsersCounter">0</span></div>
              <p class="text-white/80 text-lg mt-2 font-medium">Active Users</p>
              <span class="text-xs text-emerald-300/80 mt-2">live online →</span>
            </a>
            <!-- 5 trending -->
            <a href="#trending" class="glass-premium p-6 hover-glow-premium ripple-smooth flex flex-col">
              <div class="flex justify-between items-start"><i class="fas fa-fire text-orange-400 text-3xl"></i><span class="text-5xl font-bold counter-professional" id="trendingCounter">5</span></div>
              <p class="text-white/80 text-lg mt-2 font-medium">Trending</p>
              <span class="text-xs text-emerald-300/80 mt-2">most accessed →</span>
            </a>
            <!-- 6 recent -->
            <a href="#recent" class="glass-premium p-6 hover-glow-premium ripple-smooth flex flex-col">
              <div class="flex justify-between items-start"><i class="fas fa-history text-emerald-400 text-3xl"></i><span class="text-5xl font-bold counter-professional" id="recentCounter">0</span></div>
              <p class="text-white/80 text-lg mt-2 font-medium">Recent Activity</p>
              <span class="text-xs text-emerald-300/80 mt-2">your history →</span>
            </a>
            <!-- 7 analytics mini preview -->
            <a href="#analytics" class="glass-premium p-6 hover-glow-premium ripple-smooth flex flex-col row-span-1">
              <div class="flex items-center gap-2"><i class="fas fa-chart-simple text-emerald-400 text-2xl"></i><span class="text-sm bg-emerald-800/40 px-2 py-0.5 rounded-full">+5s live</span></div>
              <div class="mt-1 h-12 w-full"><canvas id="miniChartPreview" width="200" height="50"></canvas></div>
              <p class="text-white/80 text-lg font-medium">Analytics</p>
              <span class="text-xs text-emerald-300/80">realtime graphs →</span>
            </a>
          </div>
        </main>
      </div>
    `;
    // animate counters
    animateCounter(document.getElementById('totalBooksCounter'), getTotalBooks(), 900);
    animateCounter(document.getElementById('ebooksCounter'), getEbooksCount(), 900);
    animateCounter(document.getElementById('journalsCounter'), getJournalsCount(), 900);
    animateCounter(document.getElementById('activeUsersCounter'), getOnlineCount(), 900);
    animateCounter(document.getElementById('recentCounter'), currentUser ? getUserRecent(currentUser.id).length : 0, 900);
    // mini sparkline
    const ctx = document.getElementById('miniChartPreview')?.getContext('2d');
    if (ctx) new Chart(ctx, { type: 'line', data: { labels: [1,2,3,4,5], datasets: [{ data: [5,7,4,9,6], borderColor: '#2dd4bf', borderWidth: 2, pointRadius: 0, tension: 0.4 }] }, options: { responsive: true, maintainAspectRatio: true, scales: { x: { display: false }, y: { display: false } } } });
    attachDarkToggle();
  }

  // ---------- DETAIL PAGES (fully implemented) ----------
  function renderBooksPage() {
    const app = document.getElementById('app');
    app.innerHTML = `<div class="flex w-full">${renderSidebar()}<main class="flex-1 p-7 overflow-auto"><div class="spinner mx-auto mt-20"></div></main></div>`;
    setTimeout(() => {
      let html = `<div class="flex w-full">${renderSidebar()}<main class="flex-1 p-7 overflow-auto">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-7"><h2 class="text-3xl font-bold bg-gradient-to-r from-emerald-300 to-blue-300 bg-clip-text text-transparent"><i class="fas fa-book mr-3"></i>All books</h2>
        <div class="flex gap-3 mt-3 md:mt-0 w-full md:w-auto"><input type="text" id="bookSearch" placeholder="Search title/author" class="bg-white/10 border border-white/20 p-3 rounded-2xl w-full md:w-64"><select id="catFilter" class="bg-white/10 border border-white/20 p-3 rounded-2xl"><option value="">All categories</option><option>AI</option><option>Engineering</option><option>Science</option><option>CS</option></select></div></div>
        <div id="bookGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"></div>
        <div id="paginationControls" class="mt-10 flex justify-center gap-2"></div></main></div>`;
      app.innerHTML = html;
      const grid = document.getElementById('bookGrid');
      let filtered = [...DB.books];
      const renderBooks = (page = 1) => {
        const search = document.getElementById('bookSearch')?.value.toLowerCase() || '';
        const cat = document.getElementById('catFilter')?.value || '';
        filtered = DB.books.filter(b => (b.title.toLowerCase().includes(search) || b.author.toLowerCase().includes(search)) && (cat ? b.category === cat : true));
        const perPage = 6, start = (page-1)*perPage, paginated = filtered.slice(start, start+perPage);
        grid.innerHTML = paginated.map(b => `<div class="glass-premium p-5 flex gap-4 items-start hover-glow-premium transition">
          <div class="w-16 h-20 rounded-xl bg-gradient-to-br from-blue-900 to-emerald-900 flex items-center justify-center text-4xl shadow-lg">${b.cover.includes('DL')?'📘':b.cover.includes('RL')?'🤖':'📚'}</div>
          <div class="flex-1"><h3 class="font-semibold text-white">${b.title}</h3><p class="text-sm text-white/60">${b.author}</p><span class="inline-block mt-1 text-xs px-2 py-0.5 bg-emerald-900/50 rounded-full ${b.availability?'text-emerald-300':'text-amber-400'}">${b.availability?'available':'on hold'}</span>
          <button class="mt-3 text-xs bg-emerald-800/60 px-4 py-1.5 rounded-full hover:bg-emerald-700 transition">View details →</button></div></div>`).join('');
        let pages = Math.ceil(filtered.length/perPage);
        document.getElementById('paginationControls').innerHTML = Array.from({length: pages}, (_,i) => `<button class="px-4 py-2 rounded-xl ${page===i+1?'bg-emerald-700':'bg-white/10'} hover:bg-emerald-800 transition" data-page="${i+1}">${i+1}</button>`).join('');
        document.querySelectorAll('#paginationControls button').forEach(btn => btn.addEventListener('click', (e) => { e.preventDefault(); renderBooks(parseInt(e.target.dataset.page)); }));
      };
      renderBooks(1);
      document.getElementById('bookSearch')?.addEventListener('input', () => renderBooks(1));
      document.getElementById('catFilter')?.addEventListener('change', () => renderBooks(1));
    }, 100);
  }

  function renderEbooksPage() {
    const app = document.getElementById('app'); 
    app.innerHTML = `<div class="flex w-full">${renderSidebar()}<main class="flex-1 p-7"><h2 class="text-2xl font-bold mb-6"><i class="fas fa-file-pdf text-emerald-400 mr-2"></i>E-Books (PDF)</h2><div class="grid grid-cols-1 lg:grid-cols-2 gap-6">`+
      DB.books.filter(b=>b.type==='ebook').map(b=>`<div class="glass-premium p-5 flex flex-col"><div class="flex justify-between"><span class="font-semibold">${b.title}</span><span class="bg-amber-800/40 px-2 py-0.5 rounded-full text-amber-300 text-sm">⭐ ${b.rating}</span></div><p class="text-sm text-white/70">${b.author} • ${b.fileSize}</p><div class="flex gap-3 mt-3"><button class="bg-emerald-800/70 px-4 py-2 rounded-xl text-sm hover:bg-emerald-700 transition"><i class="fas fa-download mr-1"></i>Download</button><button class="bg-blue-900/50 px-4 py-2 rounded-xl text-sm hover:bg-blue-800/60"><i class="fas fa-eye mr-1"></i>Preview</button></div><p class="text-xs text-white/40 mt-3">related: similar in AI, CS</p></div>`).join('')+
    `</div></main></div>`;
  }

  function renderJournalsPage() {
    const app = document.getElementById('app'); 
    app.innerHTML = `<div class="flex w-full">${renderSidebar()}<main class="flex-1 p-7"><div class="flex justify-between"><h2 class="text-2xl font-bold"><i class="fas fa-scroll mr-2"></i>Journals</h2><select id="journalCat" class="bg-white/10 p-3 rounded-2xl"><option value="All">All</option><option>Science</option><option>Engineering</option><option>CS</option></select></div><div id="journalList" class="mt-6 space-y-4"></div></main></div>`;
    const renderJournals = (cat) => { 
      let filtered = DB.books.filter(b=>b.type==='journal' && (cat&&cat!=='All'?b.category===cat:true)); 
      document.getElementById('journalList').innerHTML = filtered.map(j=>`<div class="glass-premium p-5 flex justify-between items-center"><div><span class="font-medium">${j.title}</span><div class="text-sm text-white/60">ISSN ${j.issn} • ${j.publisher} • ${j.year}</div></div><div><button class="bg-emerald-800/60 px-5 py-2 rounded-xl text-sm">Download</button></div></div>`).join('');
    };
    renderJournals('All');
    document.getElementById('journalCat')?.addEventListener('change', e => renderJournals(e.target.value));
  }

  function renderActiveUsersPage() {
    if (currentUser.role === 'faculty') {
      let html = `<div class="flex w-full">${renderSidebar()}<main class="flex-1 p-7"><h2 class="text-2xl font-bold mb-6"><i class="fas fa-users mr-2"></i>Active users (faculty view)</h2><div class="space-y-4">`;
      DB.users.forEach(u => { html+=`<div class="glass-premium p-5 flex items-center gap-4"><span class="relative flex h-3 w-3"><span class="animate-ping absolute inline-flex h-full w-full rounded-full ${u.isOnline?'bg-emerald-400':'bg-gray-500'} opacity-75"></span><span class="relative inline-flex rounded-full h-3 w-3 ${u.isOnline?'bg-emerald-500':'bg-gray-500'}"></span></span><div><p class="font-medium">${u.name} <span class="text-xs bg-indigo-900/60 px-2 py-0.5 rounded-full ml-2">${u.role}</span></p><p class="text-sm text-white/60">${u.department} • last login: ${u.lastLogin}</p></div></div>`; });
      html+=`</div></main></div>`; document.getElementById('app').innerHTML = html;
    } else {
      document.getElementById('app').innerHTML = `<div class="flex w-full">${renderSidebar()}<main class="flex-1 p-7"><div class="glass-premium p-12 text-center max-w-lg mx-auto"><i class="fas fa-user-shield text-6xl text-emerald-300 mb-4"></i><p class="text-3xl font-bold counter-professional" id="activeCountSimple">${getOnlineCount()}</p><p class="text-white/70 text-lg">currently online</p><p class="text-sm text-white/40 mt-3">(student view – details restricted)</p></div></main></div>`;
      animateCounter(document.getElementById('activeCountSimple'), getOnlineCount(), 800);
    }
  }

  function renderTrendingPage() {
    let html = `<div class="flex w-full">${renderSidebar()}<main class="flex-1 p-7"><h2 class="text-2xl font-bold mb-6"><i class="fas fa-fire text-orange-400 mr-2"></i>Trending this week</h2><div class="grid gap-5">`;
    getTrendingBooks().forEach((b,i) => { html+=`<div class="glass-premium p-5 flex items-center justify-between"><div class="flex items-center gap-4"><span class="text-2xl font-bold text-emerald-300/50">#${i+1}</span><div><h3 class="font-semibold">${b.title}</h3><p class="text-sm text-white/60">👁️ ${b.views} views • ⭐ ${b.rating}</p></div></div><button class="bg-emerald-800/70 px-5 py-2 rounded-full text-sm hover:bg-emerald-700">Quick view</button></div>`; });
    html+=`</div></main></div>`; document.getElementById('app').innerHTML = html;
  }

  function renderRecentPage() {
    const rec = getUserRecent(currentUser.id);
    let html = `<div class="flex w-full">${renderSidebar()}<main class="flex-1 p-7"><h2 class="text-2xl font-bold mb-5"><i class="fas fa-clock mr-2"></i>My recent activity</h2><div class="space-y-4">`;
    rec.forEach(r => { const b = getBookById(r.bookId); html+=`<div class="glass-premium p-5 flex justify-between items-center"><div><span class="font-medium">${b?.title}</span><p class="text-xs text-white/50">${r.accessedAt} • ${r.timeSpent} min • ${r.downloaded?'⬇️ downloaded':'viewed'}</p></div><button class="text-rose-400/70 hover:text-rose-400 text-sm"><i class="fas fa-trash-alt mr-1"></i>remove</button></div>`; });
    html+=`</div></main></div>`; document.getElementById('app').innerHTML = html;
  }

  // ---------- ANALYTICS WITH LIVE UPDATE (5s) ----------
  function renderAnalyticsPage() {
    const app = document.getElementById('app');
    app.innerHTML = `<div class="flex w-full">${renderSidebar()}<main class="flex-1 p-7"><h2 class="text-2xl font-bold mb-7"><i class="fas fa-chart-line mr-2"></i>Analytics · live (5s refresh)</h2><div class="grid lg:grid-cols-2 gap-7"><div class="glass-premium p-5"><canvas id="lineDaily"></canvas></div><div class="glass-premium p-5"><canvas id="barMonthly"></canvas></div><div class="glass-premium p-5 lg:col-span-2"><canvas id="pieCategory"></canvas></div></div></main></div>`;
    setTimeout(() => {
      const line = document.getElementById('lineDaily')?.getContext('2d');
      const bar = document.getElementById('barMonthly')?.getContext('2d');
      const pie = document.getElementById('pieCategory')?.getContext('2d');
      if (line) window.dailyChart = new Chart(line, { type: 'line', data: { labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], datasets: [{ label: 'daily visits', data: [72,85,94,112,136,128,155], borderColor: '#2dd4bf', backgroundColor: '#2dd4bf20', tension: 0.3 }] } });
      if (bar) window.monthlyChart = new Chart(bar, { type: 'bar', data: { labels: ['Jan','Feb','Mar','Apr'], datasets: [{ label: 'downloads', data: [420,510,620,780], backgroundColor: '#818cf8' }] } });
      if (pie) window.pieChart = new Chart(pie, { type: 'pie', data: { labels: ['AI','Engineering','Science','CS'], datasets: [{ data: [42,28,18,12], backgroundColor: ['#2dd4bf','#818cf8','#f472b6','#fbbf24'] }] } });
    }, 50);
    setInterval(() => { if (activeRoute === 'analytics') { 
      window.dailyChart?.data.datasets[0].data = window.dailyChart.data.datasets[0].data.map(v=> v + Math.floor(Math.random()*6-2)); 
      window.dailyChart?.update(); 
      window.monthlyChart?.data.datasets[0].data = window.monthlyChart.data.datasets[0].data.map(v=> v + Math.floor(Math.random()*12-4)); 
      window.monthlyChart?.update(); 
    } }, 5000);
  }

  function renderUploadPage() { 
    if (currentUser?.role!=='faculty') { renderDashboard(); return; } 
    document.getElementById('app').innerHTML = `<div class="flex w-full">${renderSidebar()}<main class="flex-1 p-7"><div class="glass-premium max-w-2xl p-8"><h2 class="text-2xl mb-5"><i class="fas fa-cloud-upload-alt mr-2"></i>Upload academic resource</h2><input placeholder="Title" class="w-full bg-white/10 p-3 rounded-xl mb-3"><input placeholder="Author" class="w-full bg-white/10 p-3 rounded-xl mb-3"><select class="w-full bg-white/10 p-3 rounded-xl mb-4"><option>E-Book</option><option>Journal</option></select><button class="bg-emerald-700 px-8 py-3 rounded-xl font-semibold hover:bg-emerald-600 transition">Publish</button></div></main></div>`; 
  }

  // ---------- DARK MODE TOGGLE ----------
  function attachDarkToggle() {
    document.getElementById('darkToggle')?.addEventListener('click', (e) => { e.preventDefault(); document.body.classList.toggle('dark'); });
  }

  // ---------- ROUTER ----------
  function renderRoute(route) {
    if (!currentUser && route !== 'login') { window.location.hash = 'login'; renderLogin(); return; }
    activeRoute = route;
    if (route === 'login') renderLogin();
    else if (route === 'dashboard') renderDashboard();
    else if (route === 'books') renderBooksPage();
    else if (route === 'ebooks') renderEbooksPage();
    else if (route === 'journals') renderJournalsPage();
    else if (route === 'active-users') renderActiveUsersPage();
    else if (route === 'trending') renderTrendingPage();
    else if (route === 'recent') renderRecentPage();
    else if (route === 'analytics') renderAnalyticsPage();
    else if (route === 'upload') renderUploadPage();
    else if (route === 'logout') { sessionStorage.removeItem('smartlib_pro_user'); currentUser = null; window.location.hash = 'login'; renderLogin(); }
    else renderDashboard();
  }

  window.addEventListener('load', () => { if (!window.location.hash) window.location.hash = currentUser ? 'dashboard' : 'login'; renderRoute(window.location.hash.slice(1)); });
  window.addEventListener('hashchange', () => renderRoute(window.location.hash.slice(1)));
</script>

</body>
</html>