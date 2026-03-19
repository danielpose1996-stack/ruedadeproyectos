function renderLoginView(role) {
    let title = '';
    let nextRoute = '';
    
    if (role === 'docente') {
        title = 'Ingreso Docente Evaluador';
        nextRoute = 'dashboard-docente';
    } else if (role === 'estudiante') {
        title = 'Ingreso Portal Estudiantes';
        nextRoute = 'dashboard-estudiante';
    } else if (role === 'admin') {
        title = 'Ingreso de Administrador';
        nextRoute = 'dashboard-admin';
    }
    
    return `
        <div class="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div class="w-full max-w-md bg-surface p-10 rounded-3xl shadow-premium border border-border-color transition-all">
                <div class="w-20 h-20 bg-primary/10 text-primary rounded-2xl flex items-center justify-center text-3xl mb-8 mx-auto shadow-sm">
                    <i class="fa-solid fa-user-lock"></i>
                </div>
                
                <div class="text-center mb-10">
                    <h2 class="text-2xl font-bold text-primary tracking-tight mb-2">${title}</h2>
                    <p class="text-slate-500 text-sm">Ingrese sus credenciales para acceder a la plataforma</p>
                </div>
                
                <form onsubmit="handleLogin(event, '${role}')" class="space-y-6 text-left">
                    <div>
                        <label class="block text-sm font-semibold text-slate-700 mb-2 ml-1">Correo Electrónico</label>
                        <div class="relative">
                            <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                                <i class="fa-solid fa-envelope"></i>
                            </span>
                            <input id="login-email" type="email" placeholder="usuario@unipaz.edu.co" required 
                                oninput="validateAuthEmail()"
                                class="w-full pl-11 pr-4 py-3 bg-bg-base border border-border-color rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400">
                        </div>
                        <p id="email-hint" class="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                            Solo correos @unipaz.edu.co
                        </p>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-semibold text-slate-700 mb-2 ml-1">Contraseña</label>
                        <div class="relative">
                            <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                                <i class="fa-solid fa-key"></i>
                            </span>
                            <input id="login-password" type="password" required 
                                class="w-full pl-11 pr-4 py-3 bg-bg-base border border-border-color rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all">
                        </div>
                    </div>
                    
                    <div id="login-error" class="hidden animate-pulse bg-red-50 text-status-danger text-xs font-semibold py-3 px-4 rounded-xl text-center border border-red-100">
                        <i class="fa-solid fa-circle-exclamation mr-1"></i> Usuario o contraseña incorrectos.
                    </div>
                    
                    <button type="submit" id="btn-login" disabled class="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary-dark shadow-xl shadow-primary/20 transform hover:-translate-y-0.5 active:scale-95 transition-all opacity-50 cursor-not-allowed">
                        Ingresar <i class="fa-solid fa-arrow-right-to-bracket ml-2"></i>
                    </button>
                    
                    <div class="pt-6 text-center text-xs text-slate-400 border-t border-border-color mt-8">
                        RuedaPro UNIPAZ &bull; Sistema de Gestión de Proyectos
                    </div>
                </form>
            </div>
        </div>
    `;
}

// REAL-TIME VALIDATION FOR AUTH
function validateAuthEmail() {
    const email = document.getElementById('login-email').value.trim();
    const hint = document.getElementById('email-hint');
    const isValid = validateUnipazEmail(email);
    
    if (email.length > 0) {
        if (isValid) {
            hint.textContent = 'Correo institucional válido';
            hint.classList.replace('text-slate-400', 'text-status-success');
            hint.classList.remove('text-status-danger');
        } else {
            hint.textContent = 'Debe usar un correo @unipaz.edu.co';
            hint.classList.replace('text-slate-400', 'text-status-danger');
            hint.classList.remove('text-status-success');
        }
    } else {
        hint.textContent = 'Solo correos @unipaz.edu.co';
        hint.classList.add('text-slate-400');
        hint.classList.remove('text-status-success', 'text-status-danger');
    }
    
    updateSubmitButtonState('btn-login', isValid);
}
