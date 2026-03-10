let currentUser = null;
let currentProfile = null;

async function restoreSession() {
    if(!supabaseClient) return;
    try {
        const { data: { session }, error } = await supabaseClient.auth.getSession();
        if (error) throw error;
        
        if (session && session.user) {
            currentUser = session.user;
            const userMeta = currentUser.user_metadata || {};
            currentProfile = {
                id: currentUser.id,
                nombre: userMeta.nombre || currentUser.email,
                rol: userMeta.rol || 'estudiante'
            };
            
            // Override with actual DB values to sync any manual RLS/Studio changes
            const { data: pData } = await supabaseClient.from('perfiles').select('nombre, rol, avatar_url').eq('id', currentProfile.id).single();
            if (pData) {
                if (pData.nombre) currentProfile.nombre = pData.nombre;
                if (pData.rol) currentProfile.rol = pData.rol;
                if (pData.avatar_url) currentProfile.avatar_url = pData.avatar_url;
            }
        }
    } catch (e) {
        console.error("Session restore err:", e);
    }
    updateGlobalHeader();
}

async function handleLogin(event, role) {
    event.preventDefault();
    
    if(!supabaseClient) {
        alert("El cliente Supabase no está inicializado. Posible fallo de red.");
        return;
    }

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorDiv = document.getElementById('login-error');
    const submitBtn = event.target.querySelector('button[type="submit"]');
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Ingresando...';
    errorDiv.style.display = 'none';
    
    // Authenticate with Supabase
    const { data: authData, error: authError } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (authError) {
        console.error("Auth Error:", authError);
        errorDiv.textContent = 'Autenticación fallida: Credenciales incorrectas o cuentas inexistentes.';
        errorDiv.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Ingresar';
        return;
    }

    currentUser = authData.user;
    
    // Read role directly from JWT user_metadata (set at user creation time).
    // This avoids a DB round-trip and any RLS policy issues during login.
    const userMeta = currentUser.user_metadata || {};
    currentProfile = {
        id: currentUser.id,
        nombre: userMeta.nombre || currentUser.email,
        rol: userMeta.rol || 'estudiante'
    };

    // Override with DB data to ensure role changes from Supabase Studio take effect immediately
    const { data: pData } = await supabaseClient.from('perfiles').select('nombre, rol, avatar_url').eq('id', currentProfile.id).single();
    if (pData) {
        if (pData.nombre) currentProfile.nombre = pData.nombre;
        if (pData.rol) currentProfile.rol = pData.rol;
        if (pData.avatar_url) currentProfile.avatar_url = pData.avatar_url;
    }

    // Route based on role, verifying the user's actual assigned role
    if (role === 'docente' && currentProfile.rol === 'docente') {
        updateGlobalHeader();
        navigateTo('dashboard-docente');
    } else if (role === 'estudiante' && currentProfile.rol === 'estudiante') {
        updateGlobalHeader();
        navigateTo('dashboard-estudiante');
    } else if (role === 'admin' && currentProfile.rol === 'admin') {
        updateGlobalHeader();
        navigateTo('dashboard-admin');
    } else {
        errorDiv.textContent = `No tienes permiso de "${role}". Tu rol asignado es: "${currentProfile.rol}".`;
        errorDiv.style.display = 'block';
        await supabaseClient.auth.signOut();
        currentUser = null;
        currentProfile = null;
        submitBtn.disabled = false;
        submitBtn.textContent = 'Ingresar';
        updateGlobalHeader();
    }
}

async function handleLogout() {
    if(supabaseClient) {
        await supabaseClient.auth.signOut();
    }
    currentUser = null;
    currentProfile = null;
    updateGlobalHeader();
    navigateTo('home');
}
