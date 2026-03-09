// Theming
const root = document.documentElement;
const themeToggleBtn = document.getElementById('theme-toggle-btn');
let isDarkMode = localStorage.getItem('theme') === 'dark';

// --- THEME TOGGLE LOGIC ---
function initThemeToggle() {
    const themeBtn = document.getElementById('theme-toggle');
    const icon = themeBtn.querySelector('i');
    
    // Check saved preference or OS preference
    const savedTheme = localStorage.getItem('ruedapro-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.setAttribute('data-theme', 'dark');
        icon.classList.replace('fa-moon', 'fa-sun');
    }

    themeBtn.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        if (currentTheme === 'light') {
            document.body.setAttribute('data-theme', 'dark');
            icon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('ruedapro-theme', 'dark');
        } else {
            document.body.setAttribute('data-theme', 'light');
            icon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('ruedapro-theme', 'light');
        }
    });
}

// --- BASIC JS ROUTER ---
function initRouter() {
    const navLinks = document.querySelectorAll('[data-route]');
    const desktopNav = document.querySelector('.desktop-nav');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');

    if(mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            desktopNav.classList.toggle('show');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const route = link.getAttribute('data-route');
            navigateTo(route);
            
            // Close mobile menu
            if(desktopNav.classList.contains('show')) {
                desktopNav.classList.remove('show');
            }
            
            // Update active state in top nav
            document.querySelectorAll('.nav-links a').forEach(el => el.classList.remove('active'));
            if(link.closest('.nav-links')) {
                link.classList.add('active');
            }
        });
    });
}

function navigateTo(route, data = null) {
    const appContent = document.getElementById('app-content');
    
    // Simple state machine for views
    switch(route) {
        case 'home':
            appContent.innerHTML = renderHomeView();
            break;
        case 'galeria':
            appContent.innerHTML = renderGaleriaView();
            break;
        case 'results':
            appContent.innerHTML = renderResultsView();
            break;
        case 'login-docente':
            appContent.innerHTML = renderLoginView('docente');
            break;
        case 'login-estudiante':
            appContent.innerHTML = renderLoginView('estudiante');
            break;
        case 'login-admin':
            appContent.innerHTML = renderLoginView('admin');
            break;
        case 'dashboard-docente':
            if (currentProfile?.rol === 'docente') {
                appContent.innerHTML = renderDocenteDashboard();
            } else {
                navigateTo('home');
            }
            break;
        case 'dashboard-admin':
            if (currentProfile?.rol === 'admin') {
                appContent.innerHTML = renderAdminDashboard();
                loadAdminUsers();
            } else {
                navigateTo('home');
            }
            break;
        case 'dashboard-estudiante':
            if (currentProfile?.rol === 'estudiante') {
                appContent.innerHTML = renderEstudianteDashboard();
            } else {
                navigateTo('home');
            }
            break;
        case 'evaluacion':
            if (currentProfile?.rol === 'docente') {
                appContent.innerHTML = renderEvaluacionView();
                if (data && data.projectId) {
                    initEvaluacionLogic(data.projectId);
                } else {
                    initEvaluacionLogic(); // Fallback mode
                }
            } else {
                navigateTo('home');
            }
            break;
        default:
            appContent.innerHTML = renderHomeView();
    }
    
    // Scroll to top on navigation
    window.scrollTo(0, 0);
}

function updateGlobalHeader() {
    const authBtns = document.getElementById('auth-buttons');
    const userMenu = document.getElementById('user-menu');
    
    if (currentUser && currentProfile) {
        if (authBtns) authBtns.style.display = 'none';
        if (userMenu) {
            userMenu.style.display = 'flex';
            
            // Setup User Information
            const avatarInitial = document.getElementById('header-avatar-initial');
            if (avatarInitial) {
                avatarInitial.textContent = currentProfile.nombre.charAt(0);
            }
            
            const nameEl = document.getElementById('header-user-name');
            const roleEl = document.getElementById('header-user-role');
            if (nameEl) nameEl.textContent = currentProfile.nombre;
            if (roleEl) {
                roleEl.textContent = currentProfile.rol.toUpperCase();
                roleEl.className = 'badge';
                if(currentProfile.rol === 'admin') roleEl.classList.add('badge-danger');
                else if(currentProfile.rol === 'docente') roleEl.classList.add('badge-info');
                else roleEl.classList.add('badge-success'); // estudiante
            }
            
            // Setup Panel Link route dynamically
            const panelBtn = document.getElementById('header-btn-panel');
            if (panelBtn) {
                panelBtn.onclick = (e) => {
                    e.preventDefault();
                    if(currentProfile.rol === 'docente') navigateTo('dashboard-docente');
                    else if(currentProfile.rol === 'estudiante') navigateTo('dashboard-estudiante');
                    else if(currentProfile.rol === 'admin') navigateTo('dashboard-admin');
                    document.getElementById('user-dropdown').style.display = 'none';
                };
            }
            
            // Handle clicking avatar to toggle dropdown
            const userAvatarBtn = document.getElementById('user-avatar-btn');
            const userDropdown = document.getElementById('user-dropdown');
            if (userAvatarBtn && userDropdown) {
                // Ensure no duplicate listener
                userAvatarBtn.onclick = (e) => {
                    e.stopPropagation();
                    const isVisible = userDropdown.style.display === 'flex';
                    userDropdown.style.display = isVisible ? 'none' : 'flex';
                };
                
                // Close when clicking outside
                document.addEventListener('click', (e) => {
                    if (!userMenu.contains(e.target)) {
                        userDropdown.style.display = 'none';
                    }
                });
            }
        }
    } else {
        if (authBtns) authBtns.style.display = 'flex';
        if (userMenu) userMenu.style.display = 'none';
    }
}
