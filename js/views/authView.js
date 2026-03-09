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
        <div class="view-login" style="padding: 4rem 2rem; max-width: 450px; margin: 0 auto;">
            <div class="card" style="padding: 2.5rem; text-align: center;">
                <div style="width: 80px; height: 80px; background-color: var(--primary-light); color: var(--primary-color); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; margin: 0 auto 1.5rem;">
                    <i class="fa-solid fa-user-lock"></i>
                </div>
                <h2 style="color: var(--primary-color); margin-bottom: 0.5rem;">${title}</h2>
                <p style="color: var(--text-secondary); margin-bottom: 2rem;">Ingrese sus credenciales para acceder</p>
                
                <form onsubmit="handleLogin(event, '${role}')" style="display: flex; flex-direction: column; gap: 1rem; text-align: left;">
                    <div>
                        <label style="display: block; margin-bottom: 0.5rem; color: var(--text-primary); font-weight: 500;">Correo Electrónico</label>
                        <input id="login-email" type="email" placeholder="usuario@ruedapro.edu.co" required style="width: 100%; padding: 0.8rem; border: 1px solid var(--border-color); border-radius: 6px; background: var(--bg-base); color: var(--text-primary);">
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 0.5rem; color: var(--text-primary); font-weight: 500;">Contraseña</label>
                        <input id="login-password" type="password" required style="width: 100%; padding: 0.8rem; border: 1px solid var(--border-color); border-radius: 6px; background: var(--bg-base); color: var(--text-primary);">
                    </div>
                    
                    <div id="login-error" style="color: var(--status-danger); text-align: center; font-size: 0.9rem; display: none;">Usuario o contraseña incorrectos.</div>
                    
                    <button type="submit" class="btn btn-primary" style="margin-top: 1rem; width: 100%;">Ingresar</button>
                </form>
            </div>
        </div>
    `;
}
