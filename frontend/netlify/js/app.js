// Library E-Resources - Main JavaScript Application
// Single Page Application with client-side routing

// ============================================
// APP CONFIGURATION
// ============================================
const AppConfig = {
    apiBaseUrl: 'http://localhost:5000/api',
    appName: 'Library E-Resources',
    defaultProfileImage: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ffffff"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>',
    colors: {
        primary: '#1e40af',
        secondary: '#64748b',
        accent: '#f59e0b',
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    }
};

// ============================================
// STATE MANAGEMENT
// ============================================
const AppState = {
    currentUser: null,
    isAuthenticated: false,
    darkMode: false,
    currentPage: 'dashboard',
    previousPage: null,
    data: {
        resources: [],
        books: [],
        recommendations: [],
        trending: [],
        stats: {
            downloadsThisMonth: 0,
            bookmarksCount: 0,
            totalReadingTime: 0
        },
        history: [],
        bookmarks: [],
        downloads: [],
        submissions: [],
        analytics: []
    },
    loading: {
        global: false,
        page: {}
    }
};

// ============================================
// ROUTER
// ============================================
class Router {
    constructor() {
        this.routes = {};
        this.notFound = null;
        
        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.page) {
                this.navigate(e.state.page, false);
            }
        });
    }
    
    addRoute(path, handler) {
        this.routes[path] = handler;
    }
    
    setNotFound(handler) {
        this.notFound = handler;
    }
    
    navigate(path, pushState = true) {
        if (pushState) {
            history.pushState({ page: path }, '', '#' + path);
        }
        
        AppState.previousPage = AppState.currentPage;
        AppState.currentPage = path;
        
        this.render(path);
    }
    
    render(path) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show the requested page
        const pageElement = document.getElementById(`page-${path}`);
        if (pageElement) {
            pageElement.classList.add('active');
            pageElement.classList.add('animate-fade-in');
            
            // Trigger page-specific initialization
            this.initPage(path);
        } else if (this.notFound) {
            this.notFound();
        }
        
        // Update navigation
        this.updateNavigation(path);
        
        // Scroll to top
        window.scrollTo(0, 0);
    }
    
    initPage(path) {
        switch(path) {
            case 'dashboard':
                loadDashboard();
                break;
            case 'search':
                loadSearch();
                break;
            case 'books':
                loadBooks();
                break;
            case 'analytics':
                loadAnalytics();
                break;
            case 'downloads':
                loadDownloads();
                break;
            case 'bookmarks':
                loadBookmarks();
                break;
            case 'history':
                loadHistory();
                break;
            case 'submissions':
                loadSubmissions();
                break;
            case 'login':
            case 'register':
                // Auth pages don't need data loading
                break;
            default:
                if (path.startsWith('reader-') || path.startsWith('book-')) {
                    loadReader(path);
                }
        }
    }
    
    updateNavigation(path) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.page === path) {
                item.classList.add('active');
            }
        });
    }
    
    getPath() {
        return window.location.hash.slice(1) || 'dashboard';
    }
}

const router = new Router();

// ============================================
// API CLIENT
// ============================================
const API = {
    async request(endpoint, options = {}) {
        const token = localStorage.getItem('token');
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` })
            },
            ...options
        };
        
        try {
            const response = await fetch(`${AppConfig.apiBaseUrl}${endpoint}`, config);
            
            if (!response.ok) {
                if (response.status === 401) {
                    // Token expired or invalid
                    AppState.isAuthenticated = false;
                    AppState.currentUser = null;
                    localStorage.removeItem('token');
                    router.navigate('login');
                    throw new Error('Session expired');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    
    get: (endpoint) => API.request(endpoint, { method: 'GET' }),
    post: (endpoint, data) => API.request(endpoint, { method: 'POST', body: JSON.stringify(data) }),
    put: (endpoint, data) => API.request(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (endpoint) => API.request(endpoint, { method: 'DELETE' })
};

// ============================================
// UI HELPERS
// ============================================
const UI = {
    showLoading(pageId = 'global') {
        const loader = document.getElementById('loading');
        if (loader) loader.style.display = 'flex';
        AppState.loading.global = true;
    },
    
    hideLoading(pageId = 'global') {
        const loader = document.getElementById('loading');
        if (loader) loader.style.display = 'none';
        AppState.loading.global = false;
    },
    
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <span>${message}</span>
            <button class="toast-close" onclick="this.parentElement.remove()">×</button>
        `;
        
        const container = document.getElementById('toast-container') || (() => {
            const c = document.createElement('div');
            c.id = 'toast-container';
            c.className = 'toast-container';
            document.body.appendChild(c);
            return c;
        })();
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    },
    
    toggleDarkMode() {
        // Dark mode removed
    },
    
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },
    
    formatNumber(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    },
    
    truncate(text, maxLength = 50) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + '...';
    }
};

// ============================================
// AUTH
// ============================================
const Auth = {
    async login(email, password) {
        UI.showLoading();
        try {
            const response = await API.post('/auth/login', { email, password });
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            AppState.isAuthenticated = true;
            AppState.currentUser = response.user;
            UI.showToast('Login successful!', 'success');
            router.navigate('dashboard');
        } catch (error) {
            UI.showToast(error.message || 'Login failed', 'error');
            throw error;
        } finally {
            UI.hideLoading();
        }
    },
    
    async register(name, email, password) {
        UI.showLoading();
        try {
            const response = await API.post('/auth/register', { name, email, password });
            UI.showToast('Registration successful! Please login.', 'success');
            router.navigate('login');
        } catch (error) {
            UI.showToast(error.message || 'Registration failed', 'error');
            throw error;
        } finally {
            UI.hideLoading();
        }
    },
    
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        AppState.isAuthenticated = false;
        AppState.currentUser = null;
        UI.showToast('Logged out successfully', 'info');
        router.navigate('login');
    },
    
    checkAuth() {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        
        if (token && user) {
            AppState.isAuthenticated = true;
            AppState.currentUser = JSON.parse(user);
            return true;
        }
        return false;
    },
    
    requireAuth() {
        if (!Auth.checkAuth()) {
            router.navigate('login');
            return false;
        }
        return true;
    }
};

// ============================================
// PAGE LOADERS
// ============================================
async function loadDashboard() {
    if (!Auth.requireAuth()) return;
    
    const container = document.getElementById('dashboard-content');
    if (!container) return;
    
    container.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div class="stat-card" onclick="router.navigate('downloads')">
                <div class="stat-value">${AppState.data.stats.downloadsThisMonth}</div>
                <div class="stat-label">Downloads This Month</div>
            </div>
            <div class="stat-card" onclick="router.navigate('bookmarks')">
                <div class="stat-value">${AppState.data.stats.bookmarksCount}</div>
                <div class="stat-label">Bookmarks</div>
            </div>
            <div class="stat-card" onclick="router.navigate('reading-history')">
                <div class="stat-value">${AppState.data.stats.totalReadingTime}</div>
                <div class="stat-label">Reading Time (min)</div>
            </div>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Recently Accessed</h3>
                </div>
                <div class="resource-list" id="recent-resources">
                    <div class="loading-spinner"></div>
                </div>
            </div>
            
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Recommended for You</h3>
                </div>
                <div class="resource-list" id="recommendations">
                    <div class="loading-spinner"></div>
                </div>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Trending in Your Department</h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4" id="trending">
                <div class="loading-spinner"></div>
            </div>
        </div>
    `;
    
    // Fetch dashboard data
    try {
        const [statsRes, booksRes] = await Promise.all([
            API.get('/resources/dashboard/stats'),
            API.get('/books?sortBy=rating&sortOrder=desc&limit=6')
        ]);
        
        AppState.data.stats = statsRes;
        
        const recentResources = booksRes.slice(0, 3);
        const recommendations = booksRes.slice(0, 4).map(book => ({
            _id: book._id,
            resourceId: book,
            reason: 'Popular in Epic Literature'
        }));
        const trending = booksRes.slice(0, 3);
        
        // Render recent resources
        const recentContainer = document.getElementById('recent-resources');
        if (recentContainer) {
            if (recentResources.length === 0) {
                recentContainer.innerHTML = '<p class="text-gray-500 text-center p-4">No recent resources</p>';
            } else {
                recentContainer.innerHTML = recentResources.map(resource => `
                    <div class="resource-item" onclick="router.navigate('reader-${resource._id}')">
                        <div>
                            <div class="resource-title">${UI.truncate(resource.title, 40)}</div>
                            <div class="resource-meta">${resource.author || 'Unknown'}</div>
                        </div>
                    </div>
                `).join('');
            }
        }
        
        // Render recommendations
        const recContainer = document.getElementById('recommendations');
        if (recContainer) {
            if (recommendations.length === 0) {
                recContainer.innerHTML = '<p class="text-gray-500 text-center p-4">No recommendations</p>';
            } else {
                recContainer.innerHTML = recommendations.map(rec => `
                    <div class="resource-item" onclick="router.navigate('reader-${rec.resourceId?._id}')">
                        <div>
                            <div class="resource-title">${UI.truncate(rec.resourceId?.title, 40)}</div>
                            <div class="resource-meta text-accent">${rec.reason}</div>
                        </div>
                    </div>
                `).join('');
            }
        }
        
        // Render trending
        const trendingContainer = document.getElementById('trending');
        if (trendingContainer) {
            if (trending.length === 0) {
                trendingContainer.innerHTML = '<p class="text-gray-500 text-center p-4">No trending books</p>';
            } else {
                trendingContainer.innerHTML = trending.map(trend => `
                    <div class="book-card" onclick="router.navigate('reader-${trend._id}')">
                        <div class="book-cover">📚</div>
                        <div class="book-info">
                            <div class="book-title">${UI.truncate(trend.title, 25)}</div>
                            <div class="book-author">${trend.author || 'Unknown'}</div>
                            <div class="book-meta">
                                <span>⭐ ${trend.rating || 'N/A'}</span>
                                <span class="tag tag-accent">Trending</span>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        }
        
        // Update stats
        document.querySelectorAll('.stat-card').forEach((card, index) => {
            const values = [statsRes.downloadsThisMonth, statsRes.bookmarksCount, statsRes.totalReadingTime];
            if (card.querySelector('.stat-value')) {
                card.querySelector('.stat-value').textContent = values[index];
            }
        });
        
    } catch (error) {
        console.error('Error loading dashboard:', error);
        UI.showToast('Failed to load dashboard data', 'error');
    }
}

async function loadSearch() {
    const container = document.getElementById('search-content');
    if (!container) return;
    
    container.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">Search Resources</h1>
            <p class="page-subtitle">Find books, articles, and more</p>
        </div>
        
        <div class="card mb-6">
            <div class="flex gap-4">
                <input type="text" id="search-input" class="form-input" placeholder="Search for books, authors, topics..." />
                <button class="btn btn-primary" onclick="performSearch()">Search</button>
            </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="card cursor-pointer" onclick="performCategorySearch('Epic Literature')">
                <h4>Epic Literature</h4>
                <p class="text-sm text-gray-500">Classic epics and mythology</p>
            </div>
            <div class="card cursor-pointer" onclick="performCategorySearch('Science')">
                <h4>Science</h4>
                <p class="text-sm text-gray-500">Scientific publications</p>
            </div>
            <div class="card cursor-pointer" onclick="performCategorySearch('History')">
                <h4>History</h4>
                <p class="text-sm text-gray-500">Historical documents</p>
            </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" id="search-results">
            <p class="text-gray-500 col-span-full text-center p-6">Enter a search term or browse categories</p>
        </div>
    `;
    
    // Add enter key listener
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });
    }
}

async function performSearch() {
    const query = document.getElementById('search-input')?.value || '';
    if (!query.trim()) return;
    
    await searchBooks(query);
}

async function performCategorySearch(category) {
    document.getElementById('search-input').value = category;
    await searchBooks(category);
}

async function searchBooks(query) {
    const container = document.getElementById('search-results');
    if (!container) return;
    
    container.innerHTML = '<div class="col-span-full text-center"><div class="loading-spinner"></div></div>';
    
    try {
        const results = await API.get(`/books?search=${encodeURIComponent(query)}&limit=8`);
        
        if (results.length === 0) {
            container.innerHTML = '<p class="text-gray-500 col-span-full text-center p-6">No results found</p>';
            return;
        }
        
        container.innerHTML = results.map(book => `
            <div class="book-card" onclick="router.navigate('book-${book._id}')">
                <div class="book-cover">📖</div>
                <div class="book-info">
                    <div class="book-title">${UI.truncate(book.title, 25)}</div>
                    <div class="book-author">${book.author || 'Unknown'}</div>
                    <div class="book-meta">
                        <span>⭐ ${book.rating || 'N/A'}</span>
                    </div>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Search error:', error);
        container.innerHTML = '<p class="text-error col-span-full text-center p-6">Search failed</p>';
    }
}

async function loadBooks() {
    const container = document.getElementById('books-content');
    if (!container) return;
    
    container.innerHTML = `
        <div class="page-header flex justify-between items-center">
            <div>
                <h1 class="page-title">Browse Books</h1>
                <p class="page-subtitle">Explore our collection</p>
            </div>
            <div class="flex gap-2">
                <select id="sort-select" class="form-input" style="width: auto;" onchange="loadBooksList(this.value)">
                    <option value="rating">Highest Rated</option>
                    <option value=" newest">Newest</option>
                    <option value="title">Title A-Z</option>
                </select>
            </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" id="books-grid">
            <div class="col-span-full text-center"><div class="loading-spinner"></div></div>
        </div>
    `;
    
    await loadBooksList('rating');
}

async function loadBooksList(sortBy = 'rating') {
    const container = document.getElementById('books-grid');
    if (!container) return;
    
    container.innerHTML = '<div class="col-span-full text-center"><div class="loading-spinner"></div></div>';
    
    try {
        const books = await API.get(`/books?sortBy=${sortBy}&sortOrder=desc&limit=12`);
        
        if (books.length === 0) {
            container.innerHTML = '<p class="text-gray-500 col-span-full text-center p-6">No books available</p>';
            return;
        }
        
        container.innerHTML = books.map(book => `
            <div class="book-card" onclick="router.navigate('book-${book._id}')">
                <div class="book-cover">📚</div>
                <div class="book-info">
                    <div class="book-title">${UI.truncate(book.title, 25)}</div>
                    <div class="book-author">${book.author || 'Unknown'}</div>
                    <div class="book-meta">
                        <span>⭐ ${book.rating || 'N/A'}</span>
                        <span>📖 ${book.downloadCount || 0}</span>
                    </div>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading books:', error);
        container.innerHTML = '<p class="text-error col-span-full text-center p-6">Failed to load books</p>';
    }
}

async function loadAnalytics() {
    if (!Auth.requireAuth()) return;
    
    const container = document.getElementById('analytics-content');
    if (!container) return;
    
    container.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">Analytics</h1>
            <p class="page-subtitle">Track your reading and downloads</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="card">
                <h3 class="card-title mb-4">Reading Activity</h3>
                <div id="reading-activity">
                    <div class="loading-spinner"></div>
                </div>
            </div>
            
            <div class="card">
                <h3 class="card-title mb-4">Download Statistics</h3>
                <div id="download-stats">
                    <div class="loading-spinner"></div>
                </div>
            </div>
        </div>
        
        <div class="card mt-6">
            <h3 class="card-title mb-4">Recent Activity</h3>
            <div id="recent-activity">
                <div class="loading-spinner"></div>
            </div>
        </div>
    `;
    
    try {
        const [readingRes, downloadsRes] = await Promise.all([
            API.get('/history/reading'),
            API.get('/downloads')
        ]);
        
        // Reading Activity
        const readingContainer = document.getElementById('reading-activity');
        if (readingRes.length === 0) {
            readingContainer.innerHTML = '<p class="text-gray-500">No reading activity</p>';
        } else {
            readingContainer.innerHTML = readingRes.slice(0, 5).map(item => `
                <div class="resource-item">
                    <div>
                        <div class="resource-title">${item.bookTitle || 'Unknown'}</div>
                        <div class="resource-meta">${UI.formatDate(item.lastRead)}</div>
                    </div>
                    <span class="badge">${item.progress || 0}%</span>
                </div>
            `).join('');
        }
        
        // Download Stats
        const downloadsContainer = document.getElementById('download-stats');
        const totalDownloads = downloadsRes.length;
        const thisMonth = downloadsRes.filter(d => {
            const date = new Date(d.downloadedAt);
            const now = new Date();
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        }).length;
        
        downloadsContainer.innerHTML = `
            <div class="grid grid-cols-2 gap-4">
                <div class="text-center p-4 bg-gray-50 rounded">
                    <div class="text-2xl font-bold text-primary">${totalDownloads}</div>
                    <div class="text-sm text-gray-500">Total Downloads</div>
                </div>
                <div class="text-center p-4 bg-gray-50 rounded">
                    <div class="text-2xl font-bold text-accent">${thisMonth}</div>
                    <div class="text-sm text-gray-500">This Month</div>
                </div>
            </div>
        `;
        
    } catch (error) {
        console.error('Error loading analytics:', error);
    }
}

async function loadDownloads() {
    if (!Auth.requireAuth()) return;
    
    const container = document.getElementById('downloads-content');
    if (!container) return;
    
    container.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">Downloads</h1>
            <p class="page-subtitle">Your downloaded resources</p>
        </div>
        
        <div class="card">
            <div class="resource-list" id="downloads-list">
                <div class="loading-spinner"></div>
            </div>
        </div>
    `;
    
    try {
        const downloads = await API.get('/downloads');
        
        const listContainer = document.getElementById('downloads-list');
        if (downloads.length === 0) {
            listContainer.innerHTML = '<p class="text-gray-500 text-center p-6">No downloads yet</p>';
            return;
        }
        
        listContainer.innerHTML = downloads.map(download => `
            <div class="resource-item">
                <div>
                    <div class="resource-title">${download.title || 'Unknown'}</div>
                    <div class="resource-meta">Downloaded on ${UI.formatDate(download.downloadedAt)}</div>
                </div>
                <button class="btn btn-secondary btn-sm" onclick="downloadFile('${download._id}')">Download</button>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading downloads:', error);
    }
}

async function loadBookmarks() {
    if (!Auth.requireAuth()) return;
    
    const container = document.getElementById('bookmarks-content');
    if (!container) return;
    
    container.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">Bookmarks</h1>
            <p class="page-subtitle">Your saved resources</p>
        </div>
        
        <div class="card">
            <div class="resource-list" id="bookmarks-list">
                <div class="loading-spinner"></div>
            </div>
        </div>
    `;
    
    try {
        const bookmarks = await API.get('/bookmarks');
        
        const listContainer = document.getElementById('bookmarks-list');
        if (bookmarks.length === 0) {
            listContainer.innerHTML = '<p class="text-gray-500 text-center p-6">No bookmarks yet</p>';
            return;
        }
        
        listContainer.innerHTML = bookmarks.map(bookmark => `
            <div class="resource-item">
                <div>
                    <div class="resource-title">${bookmark.resourceId?.title || 'Unknown'}</div>
                    <div class="resource-meta">${bookmark.resourceId?.author || 'Unknown'}</div>
                </div>
                <button class="btn btn-accent btn-sm" onclick="router.navigate('book-${bookmark.resourceId?._id}')">View</button>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading bookmarks:', error);
    }
}

async function loadHistory() {
    if (!Auth.requireAuth()) return;
    
    const container = document.getElementById('history-content');
    if (!container) return;
    
    container.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">History</h1>
            <p class="page-subtitle">Your browsing history</p>
        </div>
        
        <div class="card">
            <div class="resource-list" id="history-list">
                <div class="loading-spinner"></div>
            </div>
        </div>
    `;
    
    try {
        const history = await API.get('/history');
        
        const listContainer = document.getElementById('history-list');
        if (history.length === 0) {
            listContainer.innerHTML = '<p class="text-gray-500 text-center p-6">No history yet</p>';
            return;
        }
        
        listContainer.innerHTML = history.map(item => `
            <div class="resource-item">
                <div>
                    <div class="resource-title">${item.resourceId?.title || 'Unknown'}</div>
                    <div class="resource-meta">Viewed on ${UI.formatDate(item.viewedAt)}</div>
                </div>
                <button class="btn btn-secondary btn-sm" onclick="router.navigate('reader-${item.resourceId?._id}')">Read</button>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading history:', error);
    }
}

async function loadSubmissions() {
    if (!Auth.requireAuth()) return;
    
    const container = document.getElementById('submissions-content');
    if (!container) return;
    
    container.innerHTML = `
        <div class="page-header flex justify-between items-center">
            <div>
                <h1 class="page-title">Submissions</h1>
                <p class="page-subtitle">Submit new resources</p>
            </div>
            <button class="btn btn-primary" onclick="showSubmissionModal()">New Submission</button>
        </div>
        
        <div class="card">
            <div class="resource-list" id="submissions-list">
                <div class="loading-spinner"></div>
            </div>
        </div>
    `;
    
    try {
        const submissions = await API.get('/submissions');
        
        const listContainer = document.getElementById('submissions-list');
        if (submissions.length === 0) {
            listContainer.innerHTML = '<p class="text-gray-500 text-center p-6">No submissions yet</p>';
            return;
        }
        
        listContainer.innerHTML = submissions.map(sub => `
            <div class="resource-item">
                <div>
                    <div class="resource-title">${sub.title || 'Unknown'}</div>
                    <div class="resource-meta">
                        <span class="badge badge-${sub.status === 'approved' ? 'success' : sub.status === 'rejected' ? 'error' : 'warning'}">${sub.status}</span>
                        <span class="ml-2">Submitted on ${UI.formatDate(sub.submittedAt)}</span>
                    </div>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading submissions:', error);
    }
}

function showSubmissionModal() {
    // Simple alert for now - in real app would show a modal
    const title = prompt('Enter resource title:');
    if (!title) return;
    
    const description = prompt('Enter description:');
    
    UI.showToast('Submission feature coming soon!', 'info');
}

async function loadReader(pageId) {
    const bookId = pageId.replace('reader-', '').replace('book-', '');
    
    const container = document.getElementById('reader-content');
    if (!container) return;
    
    container.innerHTML = `
        <div class="flex gap-6">
            <div class="w-1/3">
                <div class="book-cover" style="height: 300px; border-radius: var(--radius-lg);">
                    📖
                </div>
            </div>
            <div class="w-2/3">
                <h1 id="reader-title" class="text-2xl font-bold mb-2">Loading...</h1>
                <p id="reader-author" class="text-lg text-gray-500 mb-4">Loading...</p>
                <div class="flex gap-4 mb-6">
                    <span class="badge">📖 <span id="reader-pages">-</span> pages</span>
                    <span class="badge">⭐ <span id="reader-rating">-</span></span>
                    <span class="badge">📥 <span id="reader-downloads">-</span></span>
                </div>
                <p id="reader-description" class="mb-6">Loading description...</p>
                <div class="flex gap-4">
                    <button class="btn btn-primary" onclick="startReading()">Start Reading</button>
                    <button class="btn btn-accent" onclick="downloadBook()">Download</button>
                    <button class="btn btn-secondary" onclick="toggleBookmark()">Bookmark</button>
                </div>
            </div>
        </div>
        
        <div class="card mt-6">
            <h3 class="card-title mb-4">Table of Contents</h3>
            <div id="reader-toc" class="resource-list">
                <div class="loading-spinner"></div>
            </div>
        </div>
    `;
    
    try {
        const book = await API.get(`/books/${bookId}`);
        
        document.getElementById('reader-title').textContent = book.title || 'Unknown';
        document.getElementById('reader-author').textContent = book.author || 'Unknown';
        document.getElementById('reader-pages').textContent = book
