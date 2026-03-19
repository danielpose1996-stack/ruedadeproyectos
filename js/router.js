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
            document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('text-primary', 'font-bold'));
            if(link.classList.contains('nav-link')) {
                link.classList.add('text-primary', 'font-bold');
            }
        });
    });

    // Dropdown Toggles and Outside Clicks (Added once here)
    const userAvatarBtn = document.getElementById('user-avatar-btn');
    const userDropdown = document.getElementById('user-dropdown');
    const userMenu = document.getElementById('user-menu');
    const panelBtn = document.getElementById('header-btn-panel');

    if (userAvatarBtn && userDropdown) {
        userAvatarBtn.onclick = (e) => {
            e.stopPropagation();
            userDropdown.classList.toggle('hidden');
        };

        document.addEventListener('click', (e) => {
            if (userMenu && !userMenu.contains(e.target)) {
                userDropdown.classList.add('hidden');
            }
        });
    }

    if (panelBtn) {
        panelBtn.onclick = (e) => {
            e.preventDefault();
            if (!currentProfile) return;
            if(currentProfile.rol === 'docente') navigateTo('dashboard-docente');
            else if(currentProfile.rol === 'estudiante') navigateTo('dashboard-estudiante');
            else if(currentProfile.rol === 'admin') navigateTo('dashboard-admin');
            userDropdown.classList.add('hidden');
        };
    }
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
        if (authBtns) authBtns.classList.add('hidden');
        if (userMenu) {
            userMenu.classList.remove('hidden');
            userMenu.classList.add('flex');
            
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
                roleEl.className = 'inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors';
                if(currentProfile.rol === 'admin') roleEl.classList.add('bg-red-100', 'text-red-600');
                else if(currentProfile.rol === 'docente') roleEl.classList.add('bg-blue-100', 'text-blue-600');
                else roleEl.classList.add('bg-green-100', 'text-green-600'); // estudiante
            }
        }
    } else {
        if (authBtns) authBtns.classList.remove('hidden');
        if (userMenu) userMenu.classList.add('hidden');
    }
}
