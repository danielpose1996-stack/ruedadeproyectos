function renderAdminDashboard() {
    const adminName = currentProfile?.nombre || 'Administrador';
    return `
        <div class="flex flex-col md:flex-row min-h-[calc(100vh-80px)] bg-bg-base">
            
            <!-- Sidebar -->
            <aside class="w-full md:w-64 bg-surface border-r border-border-color p-8 flex flex-col gap-2 shrink-0 shadow-sm z-20">
                <div class="pb-8 mb-6 border-b border-slate-50">
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Sesión Administrativa</p>
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-black">
                            ${adminName.charAt(0)}
                        </div>
                        <p class="font-black text-slate-800 truncate">${adminName}</p>
                    </div>
                </div>

                <p class="text-[10px] font-black text-slate-300 uppercase tracking-widest px-4 mb-2">Módulos</p>
                
                <nav class="space-y-1">
                    <a href="#" class="flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 hover:text-primary transition-all group active-sidebar-link" id="sb-users" onclick="adminShowTab('users'); return false;">
                        <i class="fa-solid fa-users-gear text-lg opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all"></i> 
                        Gestión de Usuarios
                    </a>
                    <a href="#" class="flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 hover:text-primary transition-all group" id="sb-projects" onclick="adminShowTab('projects'); return false;">
                        <i class="fa-solid fa-folder-tree text-lg opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all"></i> 
                        Gestión de Proyectos
                    </a>
                    <a href="#" class="flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 hover:text-primary transition-all group" id="sb-postulaciones" onclick="adminShowTab('postulaciones'); return false;">
                        <i class="fa-solid fa-inbox text-lg opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all"></i> 
                        Proyectos Postulados
                    </a>
                </nav>
                
                <div class="mt-auto pt-8 border-t border-slate-50">
                    <a href="#" onclick="handleLogout(); return false;" class="flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-status-danger hover:bg-red-50 transition-all group">
                        <i class="fa-solid fa-arrow-right-from-bracket text-lg opacity-60 group-hover:scale-110 transition-all"></i> 
                        Cerrar Sesión
                    </a>
                </div>
            </aside>

            <!-- Main Content -->
            <main class="flex-1 p-4 md:p-8 overflow-y-auto">
                <div class="max-w-[1440px] mx-auto space-y-10">
                    
                    <!-- ===== USERS TAB ===== -->
                    <div id="admin-tab-users" class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <header class="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div class="space-y-1">
                                <h2 class="text-3xl font-black text-slate-800 tracking-tight">Gestión de Usuarios</h2>
                                <p class="text-slate-500 font-medium">Administra las credenciales y perfiles de acceso al ecosistema.</p>
                            </div>
                            <button class="bg-primary text-white font-black px-8 py-4 rounded-2xl hover:bg-primary-dark shadow-xl shadow-primary/20 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2" 
                                onclick="showCreateUserModal()">
                                <i class="fa-solid fa-user-plus text-sm"></i> Nuevo Usuario
                            </button>
                        </header>

                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="relative flex-1">
                                <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                                <input type="text" id="admin-search-users" placeholder="Buscar por nombre..." onkeyup="filterAdminUsers()" 
                                    class="w-full pl-12 pr-6 py-4 bg-surface border border-slate-100 rounded-2xl text-slate-700 font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all shadow-sm">
                            </div>
                            <div class="relative">
                                <select id="admin-filter-role" onchange="filterAdminUsers()" 
                                    class="pl-6 pr-12 py-4 bg-surface border border-slate-100 rounded-2xl text-slate-700 font-bold appearance-none focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all shadow-sm min-w-[200px] cursor-pointer">
                                    <option value="">Todos los roles</option>
                                    <option value="docente">Docentes</option>
                                    <option value="estudiante">Estudiantes</option>
                                </select>
                                <i class="fa-solid fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs"></i>
                            </div>
                        </div>

                        <div class="bg-surface rounded-[32px] shadow-premium border border-slate-100 overflow-hidden">
                            <div class="overflow-x-auto">
                                <table class="w-full text-left border-collapse">
                                    <thead>
                                        <tr class="bg-slate-50/50">
                                            <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nombre Completo</th>
                                            <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Rol de Acceso</th>
                                            <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Registro</th>
                                            <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody id="admin-users-tbody" class="divide-y divide-slate-50">
                                        <tr><td colspan="4" class="px-8 py-20 text-center"><i class="fa-solid fa-circle-notch fa-spin text-2xl text-primary/30"></i></td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <!-- ===== PROJECTS TAB ===== -->
                    <div id="admin-tab-projects" class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 hidden">
                        <header class="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div class="space-y-1">
                                <h2 class="text-3xl font-black text-slate-800 tracking-tight">Gestión de Proyectos</h2>
                                <p class="text-slate-500 font-medium">Control centralizado de proyectos y asignación de evaluadores.</p>
                            </div>
                            <button class="bg-primary text-white font-black px-8 py-4 rounded-2xl hover:bg-primary-dark shadow-xl shadow-primary/20 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2" 
                                onclick="showCreateProjectModal()">
                                <i class="fa-solid fa-folder-plus text-sm"></i> Registrar Proyecto
                            </button>
                        </header>

                        <div class="flex flex-wrap gap-4">
                            <div class="relative flex-grow min-w-[300px]">
                                <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                                <input type="text" id="admin-search-projects" placeholder="Buscar proyecto..." onkeyup="filterAdminProjects()" 
                                    class="w-full pl-12 pr-6 py-4 bg-surface border border-slate-100 rounded-2xl text-slate-700 font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all shadow-sm">
                            </div>
                            <div class="relative min-w-[200px]">
                                <select id="admin-filter-cat" onchange="filterAdminProjects()" 
                                    class="w-full pl-6 pr-12 py-4 bg-surface border border-slate-100 rounded-2xl text-slate-700 font-bold appearance-none focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all shadow-sm cursor-pointer">
                                    <option value="">Todas las categorías</option>
                                    <option value="Desarrollo">Desarrollo</option>
                                    <option value="Propuesta">Propuesta</option>
                                    <option value="Aplicación">Aplicación</option>
                                </select>
                                <i class="fa-solid fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs"></i>
                            </div>
                        </div>

                        <div class="bg-surface rounded-[32px] shadow-premium border border-slate-100 overflow-hidden">
                            <div class="overflow-x-auto">
                                <table class="w-full text-left border-collapse min-w-full lg:table-fixed">
                                    <thead>
                                        <tr class="bg-slate-50/50">
                                            <th class="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest w-[25%]">Proyecto</th>
                                            <th class="px-3 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center w-[12%]">Categoría</th>
                                            <th colspan="2" class="px-2 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center border-x border-slate-100/50 w-[18%]">Periodo (Sem/Año)</th>
                                            <th class="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest w-[20%]">Evaluadores</th>
                                            <th class="px-3 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center w-[12%]">Estado</th>
                                            <th class="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center w-[13%] min-w-[110px]">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody id="admin-projects-tbody" class="divide-y divide-slate-50">
                                        <tr><td colspan="7" class="px-4 py-20 text-center text-slate-400 font-medium">Cargando proyectos...</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <!-- ===== POSTULACIONES TAB ===== -->
                    <div id="admin-tab-postulaciones" class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 hidden">
                        <header class="space-y-1">
                            <h2 class="text-3xl font-black text-slate-800 tracking-tight">Proyectos Postulados</h2>
                            <p class="text-slate-500 font-medium">Revisión y validación de nuevas propuestas enviadas por estudiantes.</p>
                        </header>
                        
                        <div class="flex flex-wrap gap-3">
                            ${renderFilterButton("pfbtn-todos", "Todos", "")}
                            ${renderFilterButton("pfbtn-pendiente", "⌛ Pendientes", "Pendiente de revisión")}
                            ${renderFilterButton("pfbtn-revision", "🔍 En revisión", "En revisión")}
                            ${renderFilterButton("pfbtn-aprobado", "✅ Aprobados", "Aprobado")}
                            ${renderFilterButton("pfbtn-noaprobado", "❌ No aprobados", "No aprobado")}
                        </div>

                        <div class="bg-surface rounded-[32px] shadow-premium border border-slate-100 overflow-hidden">
                            <div class="overflow-x-auto">
                                <table class="w-full text-left border-collapse min-w-[800px]">
                                    <thead>
                                        <tr class="bg-slate-50/50">
                                            <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Proyecto</th>
                                            <th class="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Postulante</th>
                                            <th class="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Categoría</th>
                                            <th class="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fecha</th>
                                            <th class="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Estado</th>
                                            <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody id="admin-postulaciones-tbody" class="divide-y divide-slate-50">
                                        <tr><td colspan="6" class="px-8 py-20 text-center text-slate-400 font-medium">Cargando...</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    </div>
                </div>
            </main>
        </div>
        ${renderAdminModals()}
    `;
}

function renderAdminModals() {
    return `
        <!-- ===== CREATE USER MODAL ===== -->
        <div id="create-user-modal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[1000] hidden items-center justify-center p-4">
            <div class="bg-surface w-full max-w-lg rounded-[32px] shadow-premium overflow-hidden animate-in zoom-in-95 duration-300">
                <div class="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                            <i class="fa-solid fa-user-plus"></i>
                        </div>
                        <h3 class="text-xl font-black text-slate-800 tracking-tight">Nuevo Usuario</h3>
                    </div>
                    <button onclick="closeCreateUserModal()" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 transition-colors">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
                
                <form id="create-user-form" onsubmit="handleCreateUser(event)" class="p-8 space-y-6">
                    <div class="space-y-2">
                        <label class="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nombre Completo</label>
                        <input type="text" id="new-user-name" required placeholder="Ej. Carlos Martínez" 
                            class="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-slate-700 font-bold placeholder:text-slate-300 focus:ring-4 focus:ring-primary/10 outline-none transition-all">
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <label class="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Correo Electrónico</label>
                            <input type="email" id="new-user-email" required placeholder="usuario@unipaz.edu.co" 
                                oninput="validateAdminUserEmail('new')"
                                class="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-slate-700 font-bold placeholder:text-slate-300 focus:ring-4 focus:ring-primary/10 outline-none transition-all">
                            <p id="new-user-email-hint" class="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Solo @unipaz.edu.co</p>
                        </div>
                        <div class="space-y-2">
                            <label class="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Rol de Acceso</label>
                            <div class="relative">
                                <select id="new-user-role" required 
                                    class="w-full pl-6 pr-12 py-4 bg-slate-50 border-none rounded-2xl text-slate-700 font-bold appearance-none focus:ring-4 focus:ring-primary/10 outline-none transition-all cursor-pointer">
                                    <option value="docente">Docente</option>
                                    <option value="estudiante">Estudiante</option>
                                </select>
                                <i class="fa-solid fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs"></i>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <label class="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Contraseña Provisional</label>
                        <input type="password" id="new-user-password" required minlength="8" placeholder="Mínimo 8 caracteres" 
                            class="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-slate-700 font-bold placeholder:text-slate-300 focus:ring-4 focus:ring-primary/10 outline-none transition-all">
                    </div>

                    <div id="create-user-error" class="hidden p-4 bg-red-50 text-status-danger rounded-2xl font-bold text-sm border border-red-100 items-center gap-3 animate-in fade-in duration-300">
                        <i class="fa-solid fa-circle-exclamation"></i>
                        <span id="create-user-error-text"></span>
                    </div>

                    <div class="flex gap-4 pt-4">
                        <button type="button" onclick="closeCreateUserModal()" 
                            class="flex-1 px-8 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all border border-slate-100">
                            Cancelar
                        </button>
                        <button type="submit" id="btn-create-user" 
                            class="flex-[1.5] bg-primary text-white font-black px-8 py-4 rounded-2xl hover:bg-primary-dark shadow-xl shadow-primary/20 transition-all transform hover:-translate-y-1 active:scale-95">
                            Crear Usuario
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- ===== EDIT USER MODAL ===== -->
        <div id="edit-user-modal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[1000] hidden items-center justify-center p-4">
            <div class="bg-surface w-full max-w-lg rounded-[32px] shadow-premium overflow-hidden animate-in zoom-in-95 duration-300">
                <div class="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                            <i class="fa-solid fa-user-pen"></i>
                        </div>
                        <h3 class="text-xl font-black text-slate-800 tracking-tight">Editar Usuario</h3>
                    </div>
                    <button onclick="closeEditUserModal()" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 transition-colors">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
                
                <form id="edit-user-form" onsubmit="handleEditUser(event)" class="p-8 space-y-6">
                    <input type="hidden" id="edit-user-id">
                    
                    <div class="space-y-2">
                        <label class="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nombre Completo</label>
                        <input type="text" id="edit-user-name" required 
                            class="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-slate-700 font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all">
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <label class="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Correo (Opcional)</label>
                            <input type="email" id="edit-user-email" placeholder="usuario@unipaz.edu.co" 
                                oninput="validateAdminUserEmail('edit')"
                                class="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-slate-700 font-bold placeholder:text-slate-300 focus:ring-4 focus:ring-primary/10 outline-none transition-all">
                            <p id="edit-user-email-hint" class="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Solo @unipaz.edu.co</p>
                        </div>
                        <div class="space-y-2">
                            <label class="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Rol</label>
                            <div class="relative">
                                <select id="edit-user-role" required 
                                    class="w-full pl-6 pr-12 py-4 bg-slate-50 border-none rounded-2xl text-slate-700 font-bold appearance-none focus:ring-4 focus:ring-primary/10 outline-none transition-all cursor-pointer">
                                    <option value="docente">Docente</option>
                                    <option value="estudiante">Estudiante</option>
                                </select>
                                <i class="fa-solid fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs"></i>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <label class="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nueva Contraseña (Opcional)</label>
                        <input type="password" id="edit-user-password" minlength="8" placeholder="Espacio para no cambiar" 
                            class="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-slate-700 font-bold placeholder:text-slate-300 focus:ring-4 focus:ring-primary/10 outline-none transition-all">
                    </div>

                    <div id="edit-user-error" class="hidden p-4 bg-red-50 text-status-danger rounded-2xl font-bold text-sm border border-red-100 items-center gap-3 animate-in fade-in duration-300">
                        <i class="fa-solid fa-circle-exclamation"></i>
                        <span id="edit-user-error-text"></span>
                    </div>

                    <div class="flex gap-4 pt-4">
                        <button type="button" onclick="closeEditUserModal()" 
                            class="flex-1 px-8 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all border border-slate-100">
                            Cancelar
                        </button>
                        <button type="submit" id="btn-edit-user" 
                            class="flex-[1.5] bg-primary text-white font-black px-8 py-4 rounded-2xl hover:bg-primary-dark shadow-xl shadow-primary/20 transition-all transform hover:-translate-y-1 active:scale-95">
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- ===== DELETE USER CONFIRM MODAL ===== -->
        <div id="delete-user-confirm-modal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[1000] hidden items-center justify-center p-4">
            <div class="bg-surface w-full max-w-sm rounded-[32px] shadow-premium overflow-hidden animate-in zoom-in-95 duration-300 p-8 text-center space-y-6">
                <div class="w-20 h-20 bg-red-50 text-status-danger rounded-3xl flex items-center justify-center mx-auto mb-2">
                    <i class="fa-solid fa-triangle-exclamation text-3xl"></i>
                </div>
                <div class="space-y-2">
                    <h3 class="text-2xl font-black text-slate-800">¿Estás seguro?</h3>
                    <p class="text-slate-500 font-medium leading-relaxed px-2">Esta acción eliminará permanentemente al usuario y sus datos asociados. No se puede deshacer.</p>
                </div>
                <input type="hidden" id="delete-user-id-target">
                <div class="flex flex-col gap-3 pt-2">
                    <button type="button" onclick="confirmDeleteUser()" 
                        class="w-full bg-status-danger text-white font-black px-8 py-4 rounded-2xl hover:bg-red-700 shadow-xl shadow-red-200 transition-all transform hover:-translate-y-1 active:scale-95">
                        Sí, Eliminar Usuario
                    </button>
                    <button type="button" onclick="closeDeleteUserConfirm()" 
                        class="w-full px-8 py-4 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-all">
                        No, Cancelar
                    </button>
                </div>
            </div>
        </div>

        <!-- ===== CREATE PROJECT MODAL ===== -->
        <div id="create-project-modal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[1000] hidden items-center justify-center p-4">
            <div class="bg-surface w-full max-w-2xl rounded-[32px] shadow-premium overflow-hidden animate-in zoom-in-95 duration-300">
                <div class="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                            <i class="fa-solid fa-folder-plus"></i>
                        </div>
                        <h3 class="text-xl font-black text-slate-800 tracking-tight">Registrar Proyecto</h3>
                    </div>
                    <button onclick="closeCreateProjectModal()" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 transition-colors">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
                
                <form id="create-project-form" onsubmit="handleCreateProject(event)" class="p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
                    <div class="space-y-2">
                        <label class="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nombre del Proyecto</label>
                        <input type="text" id="new-project-name" required placeholder="Ej. Sistema IoT..." 
                            class="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-slate-700 font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all">
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div class="space-y-2">
                            <label class="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Categoría</label>
                            <div class="relative">
                                <select id="new-project-cat" required 
                                    class="w-full pl-6 pr-12 py-4 bg-slate-50 border-none rounded-2xl text-slate-700 font-bold appearance-none focus:ring-4 focus:ring-primary/10 outline-none transition-all cursor-pointer">
                                    <option value="Desarrollo">Desarrollo</option>
                                    <option value="Propuesta">Propuesta</option>
                                    <option value="Aplicación">Aplicación</option>
                                </select>
                                <i class="fa-solid fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs"></i>
                            </div>
                        </div>
                        <div class="space-y-2">
                            <label class="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Semestre</label>
                            <div class="relative">
                                <select id="new-project-sem" required 
                                    class="w-full pl-6 pr-12 py-4 bg-slate-50 border-none rounded-2xl text-slate-700 font-bold appearance-none focus:ring-4 focus:ring-primary/10 outline-none transition-all cursor-pointer">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                </select>
                                <i class="fa-solid fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs"></i>
                            </div>
                        </div>
                        <div class="space-y-2">
                            <label class="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Año Lectivo</label>
                            <input type="number" id="new-project-year" required min="2020" max="2035" value="${new Date().getFullYear()}" 
                                class="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-slate-700 font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all">
                        </div>
                    </div>

                    <div class="p-6 bg-slate-50 rounded-[32px] space-y-4">
                        <label class="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Asignar Evaluadores</label>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div class="relative">
                                <select id="new-project-evaluator-1" onchange="updateEvaluatorDropdowns()" 
                                    class="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm appearance-none focus:ring-4 focus:ring-primary/10 outline-none transition-all">
                                    <option value="">-- Sin asignar --</option>
                                </select>
                                <i class="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none text-[10px]"></i>
                            </div>
                            <div class="relative">
                                <select id="new-project-evaluator-2" onchange="updateEvaluatorDropdowns()" 
                                    class="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm appearance-none focus:ring-4 focus:ring-primary/10 outline-none transition-all">
                                    <option value="">-- Sin asignar --</option>
                                </select>
                                <i class="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none text-[10px]"></i>
                            </div>
                            <div class="relative">
                                <select id="new-project-evaluator-3" onchange="updateEvaluatorDropdowns()" 
                                    class="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm appearance-none focus:ring-4 focus:ring-primary/10 outline-none transition-all">
                                    <option value="">-- Sin asignar --</option>
                                </select>
                                <i class="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none text-[10px]"></i>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <label class="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Estudiante Responsable (Autor)</label>
                        <div class="relative">
                            <select id="new-project-student" 
                                class="w-full pl-6 pr-12 py-4 bg-slate-50 border-none rounded-2xl text-slate-700 font-bold appearance-none focus:ring-4 focus:ring-primary/10 outline-none transition-all cursor-pointer">
                                <option value="">-- Sin asignar --</option>
                            </select>
                            <i class="fa-solid fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs"></i>
                        </div>
                    </div>

                    <div id="create-project-error" class="hidden p-4 bg-red-50 text-status-danger rounded-2xl font-bold text-sm border border-red-100 items-center gap-3 animate-in fade-in duration-300">
                        <i class="fa-solid fa-circle-exclamation"></i>
                        <span id="create-project-error-text"></span>
                    </div>

                    <div class="flex gap-4 pt-2">
                        <button type="button" onclick="closeCreateProjectModal()" 
                            class="flex-1 px-8 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all border border-slate-100">
                            Cancelar
                        </button>
                        <button type="submit" id="btn-create-project" 
                            class="flex-[1.5] bg-primary text-white font-black px-8 py-4 rounded-2xl hover:bg-primary-dark shadow-xl shadow-primary/20 transition-all transform hover:-translate-y-1 active:scale-95">
                            Crear Proyecto
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- ===== EDIT PROJECT MODAL ===== -->
        <div id="edit-project-modal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[1000] hidden items-center justify-center p-4">
            <div class="bg-surface w-full max-w-2xl rounded-[32px] shadow-premium overflow-hidden animate-in zoom-in-95 duration-300">
                <div class="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                            <i class="fa-solid fa-pen"></i>
                        </div>
                        <h3 class="text-xl font-black text-slate-800 tracking-tight">Editar Proyecto</h3>
                    </div>
                    <button onclick="closeEditProjectModal()" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 transition-colors">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
                
                <form id="edit-project-form" onsubmit="handleEditProject(event)" class="p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
                    <input type="hidden" id="edit-proj-id">
                    <div class="space-y-2">
                        <label class="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nombre del Proyecto</label>
                        <input type="text" id="edit-proj-nombre" required 
                            class="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-slate-700 font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all">
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div class="space-y-2">
                            <label class="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Categoría</label>
                            <div class="relative">
                                <select id="edit-proj-cat" required 
                                    class="w-full pl-6 pr-12 py-4 bg-slate-50 border-none rounded-2xl text-slate-700 font-bold appearance-none focus:ring-4 focus:ring-primary/10 outline-none transition-all cursor-pointer">
                                    <option value="Desarrollo">Desarrollo</option>
                                    <option value="Propuesta">Propuesta</option>
                                    <option value="Aplicación">Aplicación</option>
                                </select>
                                <i class="fa-solid fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs"></i>
                            </div>
                        </div>
                        <div class="space-y-2">
                            <label class="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Semestre</label>
                            <div class="relative">
                                <select id="edit-proj-sem" required 
                                    class="w-full pl-6 pr-12 py-4 bg-slate-50 border-none rounded-2xl text-slate-700 font-bold appearance-none focus:ring-4 focus:ring-primary/10 outline-none transition-all cursor-pointer">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                </select>
                                <i class="fa-solid fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs"></i>
                            </div>
                        </div>
                        <div class="space-y-2">
                            <label class="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Año Lectivo</label>
                            <input type="number" id="edit-proj-year" required min="2020" max="2035" 
                                class="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-slate-700 font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all">
                        </div>
                    </div>

                    <div class="p-6 bg-slate-50 rounded-[32px] space-y-4">
                        <label class="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Actualizar Evaluadores</label>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div class="relative">
                                <select id="edit-proj-ev1" 
                                    class="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm appearance-none focus:ring-4 focus:ring-primary/10 outline-none transition-all">
                                    <option value="">-- Ninguno --</option>
                                </select>
                                <i class="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none text-[10px]"></i>
                            </div>
                            <div class="relative">
                                <select id="edit-proj-ev2" 
                                    class="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm appearance-none focus:ring-4 focus:ring-primary/10 outline-none transition-all">
                                    <option value="">-- Ninguno --</option>
                                </select>
                                <i class="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none text-[10px]"></i>
                            </div>
                            <div class="relative">
                                <select id="edit-proj-ev3" 
                                    class="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm appearance-none focus:ring-4 focus:ring-primary/10 outline-none transition-all">
                                    <option value="">-- Ninguno --</option>
                                </select>
                                <i class="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none text-[10px]"></i>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <label class="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Estudiante Asignado</label>
                        <div class="relative">
                            <select id="edit-proj-student" 
                                class="w-full pl-6 pr-12 py-4 bg-slate-50 border-none rounded-2xl text-slate-700 font-bold appearance-none focus:ring-4 focus:ring-primary/10 outline-none transition-all cursor-pointer">
                                <option value="">-- Sin asignar --</option>
                            </select>
                            <i class="fa-solid fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs"></i>
                        </div>
                    </div>

                    <div id="edit-proj-error" class="hidden p-4 bg-red-50 text-status-danger rounded-2xl font-bold text-sm border border-red-100 items-center gap-3 animate-in fade-in duration-300">
                        <i class="fa-solid fa-circle-exclamation"></i>
                        <span id="edit-proj-error-text"></span>
                    </div>

                    <div class="flex gap-4 pt-2">
                        <button type="button" onclick="closeEditProjectModal()" 
                            class="flex-1 px-8 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all border border-slate-100">
                            Cancelar
                        </button>
                        <button type="submit" id="btn-edit-project" 
                            class="flex-[1.5] bg-primary text-white font-black px-8 py-4 rounded-2xl hover:bg-primary-dark shadow-xl shadow-primary/20 transition-all transform hover:-translate-y-1 active:scale-95">
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- ===== GESTIONAR POSTULACION MODAL ===== -->
        <div id="gestionar-post-modal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[1000] hidden items-center justify-center p-4">
            <div class="bg-surface w-full max-w-xl rounded-[32px] shadow-premium overflow-hidden animate-in zoom-in-95 duration-300">
                <div class="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                            <i class="fa-solid fa-inbox"></i>
                        </div>
                        <h3 class="text-xl font-black text-slate-800 tracking-tight">Gestionar Postulación</h3>
                    </div>
                    <button onclick="cerrarGestionarPost()" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 transition-colors">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
                
                <div class="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <div id="gpost-details" class="space-y-6">
                        <!-- Populated dynamically -->
                    </div>

                    <div class="pt-8 border-t border-slate-100 space-y-6">
                        <div class="flex items-center gap-3">
                             <div class="w-8 h-8 bg-slate-100 text-slate-500 rounded-lg flex items-center justify-center text-xs">
                                <i class="fa-solid fa-user-tie"></i>
                            </div>
                            <h4 class="font-black text-slate-800 tracking-tight">Asignar Docente Revisor</h4>
                        </div>
                        
                        <div class="flex gap-3">
                            <div class="relative flex-1">
                                <select id="gpost-select-docente" 
                                    class="w-full pl-6 pr-12 py-4 bg-slate-50 border-none rounded-2xl text-slate-700 font-bold appearance-none focus:ring-4 focus:ring-primary/10 outline-none transition-all cursor-pointer">
                                    <option value="">-- Selecciona un docente --</option>
                                </select>
                                <i class="fa-solid fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs"></i>
                            </div>
                            <button onclick="handleAsignarRevisor()" 
                                class="px-8 py-4 bg-primary text-white font-black rounded-2xl hover:bg-primary-dark shadow-lg shadow-primary/20 transition-all transform active:scale-95 whitespace-nowrap">
                                Asignar
                            </button>
                        </div>

                        <div id="gpost-error" class="hidden p-4 bg-red-50 text-status-danger rounded-2xl font-bold text-sm border border-red-100 items-center gap-3 animate-in fade-in duration-300">
                            <i class="fa-solid fa-circle-exclamation"></i>
                            <span id="gpost-error-text"></span>
                        </div>
                        <div id="gpost-ok" class="hidden p-4 bg-emerald-50 text-status-success rounded-2xl font-bold text-sm border border-emerald-100 items-center gap-3 animate-in fade-in duration-300">
                            <i class="fa-solid fa-circle-check"></i>
                            <span>Asignado correctamente</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderFilterButton(id, label, filter) {
    return `
        <button id="${id}" onclick="loadAdminPostulaciones('${filter}')" 
            class="px-5 py-2.5 rounded-xl border border-slate-100 bg-surface text-slate-500 font-bold text-sm hover:border-primary hover:text-primary transition-all shadow-sm active:scale-95">
            ${label}
        </button>
    `;
}
// --- ADMIN DASHBOARD LOGIC ---

let adminUsersCache = [];

async function loadAdminUsers() {
    if(!supabaseClient) return;
    
    const tbody = document.getElementById('admin-users-tbody');
    try {
        const { data, error } = await supabaseClient
            .from('perfiles')
            .select('*')
            .order('created_at', { ascending: false });
            
        if(error) throw error;
        adminUsersCache = data || [];
        renderAdminUsersTable(adminUsersCache);
    } catch (e) {
        console.error("loadAdminUsers Error:", e);
        if(tbody) tbody.innerHTML = `<tr><td colspan="4" class="px-8 py-20 text-center text-status-danger font-bold text-sm bg-red-50/50 rounded-2xl">Ocurrió un error al cargar los usuarios públicos.</td></tr>`;
    }
}

function renderAdminUsersTable(users) {
    const tbody = document.getElementById('admin-users-tbody');
    if(!tbody) return;
    
    if(!users || users.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="px-8 py-20 text-center text-slate-400 font-medium">No se encontraron usuarios</td></tr>`;
        return;
    }
    
    tbody.innerHTML = users.map(user => {
        const date = new Date(user.created_at).toLocaleDateString();
        const badgeClass = user.rol === 'admin' ? 'bg-red-50 text-status-danger border-red-100' : 
                          (user.rol === 'docente' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-emerald-50 text-status-success border-emerald-100');
                          
        return `
            <tr class="hover:bg-slate-50/50 transition-colors group">
                <td class="px-8 py-5">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 font-black text-xs group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            ${user.nombre.charAt(0)}
                        </div>
                        <span class="font-bold text-slate-700">${escapeHTML(user.nombre)}</span>
                    </div>
                </td>
                <td class="px-8 py-5 text-center">
                    <span class="inline-flex items-center px-4 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${badgeClass}">
                        ${escapeHTML(user.rol)}
                    </span>
                </td>
                <td class="px-8 py-5 text-slate-500 font-medium text-sm">${date}</td>
                <td class="px-8 py-5 text-right">
                    ${user.rol !== 'admin' ? `
                    <div class="flex items-center justify-center gap-2 transition-opacity">
                        <button onclick="openEditUserModal('${user.id}')" class="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-primary-dark hover:text-white transition-all shadow-sm" title="Editar">
                            <i class="fa-solid fa-pen text-xs"></i>
                        </button>
                        <button onclick="showDeleteUserConfirm('${user.id}')" class="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 text-status-danger hover:bg-status-danger hover:text-white transition-all shadow-sm" title="Eliminar">
                            <i class="fa-solid fa-trash text-xs"></i>
                        </button>
                    </div>
                    ` : ''}
                </td>
            </tr>
        `;
    }).join('');
}

let adminUsersDebounceTimer;
function filterAdminUsers() {
    clearTimeout(adminUsersDebounceTimer);
    adminUsersDebounceTimer = setTimeout(() => {
        const search = document.getElementById('admin-search-users').value.toLowerCase();
        const role = document.getElementById('admin-filter-role').value;
        
        const filtered = adminUsersCache.filter(u => {
            const matchSearch = u.nombre.toLowerCase().includes(search);
            const matchRole = role ? u.rol === role : true;
            return matchSearch && matchRole;
        });
        
        renderAdminUsersTable(filtered);
    }, 300);
}

function showCreateUserModal() {
    const modal = document.getElementById('create-user-modal');
    if(modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeCreateUserModal() {
    const modal = document.getElementById('create-user-modal');
    if(modal) modal.classList.add('hidden');
    document.getElementById('create-user-form').reset();
    const err = document.getElementById('create-user-error');
    if(err) err.classList.add('hidden');
}

async function handleCreateUser(e) {
    e.preventDefault();
    if(!supabaseClient) return;
    
    const btn = document.getElementById('btn-create-user');
    const errObj = document.getElementById('create-user-error');
    btn.disabled = true;
    btn.textContent = 'Creando...';
    if(errObj) errObj.classList.add('hidden');
    
    const email = document.getElementById('new-user-email').value.trim();
    if (!validateUnipazEmail(email)) {
        if(errObj) {
            errObj.textContent = "El correo debe ser institucional (@unipaz.edu.co).";
            errObj.classList.remove('hidden');
            errObj.classList.add('flex');
        }
        btn.disabled = false;
        btn.textContent = 'Crear Usuario';
        return;
    }

    const payload = {
        action: 'createUser',
        nombre: escapeHTML(document.getElementById('new-user-name').value.trim()),
        email: email, 
        password: document.getElementById('new-user-password').value,
        rol: escapeHTML(document.getElementById('new-user-role').value)
    };
    
    try {
        // Get a fresh access token from the current session
        const { data: sessionData } = await supabaseClient.auth.getSession();
        const token = sessionData?.session?.access_token;
        if (!token) throw new Error('No hay sesión activa. Vuelve a iniciar sesión.');

        const response = await fetch(`${SUPABASE_URL}/functions/v1/admin_manage_users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'apikey': SUPABASE_ANON_KEY
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        if (!response.ok || result.error) throw new Error(result.error || `Error ${response.status}`);
        
        closeCreateUserModal();
        loadAdminUsers();
    } catch (err) {
        console.error("handleCreateUser Error:", err);
        const errText = document.getElementById('create-user-error-text');
        if(errText) errText.textContent = "Ocurrió un error al crear el usuario. Verifique los datos.";
        if(errObj) {
            errObj.classList.remove('hidden');
            errObj.classList.add('flex');
        }
    } finally {
        btn.disabled = false;
        btn.textContent = 'Crear Usuario';
    }
}

// EDIT USER
function openEditUserModal(userId) {
    const user = adminUsersCache.find(u => u.id === userId);
    if (!user) return;
    
    document.getElementById('edit-user-id').value = user.id;
    document.getElementById('edit-user-name').value = user.nombre;
    document.getElementById('edit-user-email').value = '';
    document.getElementById('edit-user-password').value = '';
    document.getElementById('edit-user-role').value = user.rol;
    
    const err = document.getElementById('edit-user-error');
    if(err) err.classList.add('hidden');
    const modal = document.getElementById('edit-user-modal');
    if(modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeEditUserModal() {
    const modal = document.getElementById('edit-user-modal');
    if(modal) modal.classList.add('hidden');
    document.getElementById('edit-user-form').reset();
}

async function handleEditUser(e) {
    e.preventDefault();
    if(!supabaseClient) return;
    
    const btn = document.getElementById('btn-edit-user');
    const errObj = document.getElementById('edit-user-error');
    btn.disabled = true;
    btn.textContent = 'Guardando...';
    if(errObj) errObj.classList.add('hidden');
    
    const email = document.getElementById('edit-user-email').value.trim();
    if (email && !validateUnipazEmail(email)) {
        if(errObj) {
            errObj.textContent = "El correo debe ser institucional (@unipaz.edu.co).";
            errObj.classList.remove('hidden');
            errObj.classList.add('flex');
        }
        btn.disabled = false;
        btn.textContent = 'Guardar Cambios';
        return;
    }

    const payload = {
        action: 'editUser',
        userId: document.getElementById('edit-user-id').value,
        nombre: escapeHTML(document.getElementById('edit-user-name').value.trim()),
        email: email || undefined,
        password: document.getElementById('edit-user-password').value || undefined,
        rol: escapeHTML(document.getElementById('edit-user-role').value)
    };
    
    try {
        const { data: sessionData } = await supabaseClient.auth.getSession();
        const token = sessionData?.session?.access_token;
        if (!token) throw new Error('No hay sesión activa.');

        const response = await fetch(`${SUPABASE_URL}/functions/v1/admin_manage_users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'apikey': SUPABASE_ANON_KEY
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        if (!response.ok || result.error) throw new Error(result.error || `Error ${response.status}`);
        
        closeEditUserModal();
        loadAdminUsers();
    } catch (err) {
        console.error("handleEditUser Error:", err);
        const errText = document.getElementById('edit-user-error-text');
        if(errText) errText.textContent = "Ocurrió un error al guardar los cambios.";
        if(errObj) {
            errObj.classList.remove('hidden');
            errObj.classList.add('flex');
        }
    } finally {
        btn.disabled = false;
        btn.textContent = 'Guardar Cambios';
    }
}

// DELETE USER
function showDeleteUserConfirm(userId) {
    document.getElementById('delete-user-id-target').value = userId;
    const modal = document.getElementById('delete-user-confirm-modal');
    if(modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeDeleteUserConfirm() {
    const modal = document.getElementById('delete-user-confirm-modal');
    if(modal) modal.classList.add('hidden');
}

async function confirmDeleteUser() {
    const userId = document.getElementById('delete-user-id-target').value;
    if(!userId || !supabaseClient) return;
    
    closeDeleteUserConfirm();
    try {
        const { data: sessionData } = await supabaseClient.auth.getSession();
        const token = sessionData?.session?.access_token;
        if (!token) throw new Error('No hay sesión activa.');

        const response = await fetch(`${SUPABASE_URL}/functions/v1/admin_manage_users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'apikey': SUPABASE_ANON_KEY
            },
            body: JSON.stringify({ action: 'deleteUser', userId })
        });

        const result = await response.json();
        if (!response.ok || result.error) throw new Error(result.error || `Error ${response.status}`);
        
        loadAdminUsers();
    } catch (err) {
        console.error("confirmDeleteUser Error:", err);
        alert("Ocurrió un error al intentar eliminar el usuario.");
    }
}

// --- ADMIN TAB SWITCHING ---

function adminShowTab(tab) {
    const tabs = ['users', 'projects', 'postulaciones'];
    tabs.forEach(t => {
        const el = document.getElementById(`admin-tab-${t}`);
        const sb = document.getElementById(`sb-${t}`);
        if (el) el.classList.toggle('hidden', t !== tab);
        if (sb) {
            if (t === tab) sb.classList.add('active-sidebar-link');
            else sb.classList.remove('active-sidebar-link');
        }
    });
    if (tab === 'users') loadAdminUsers();
    else if (tab === 'projects') loadAdminProjects();
    else if (tab === 'postulaciones') loadAdminPostulaciones('');
}

// --- ADMIN PROJECT MANAGEMENT ---

let adminProjectsCache = [];

async function loadAdminProjects() {
    if(!supabaseClient) return;
    const tbody = document.getElementById('admin-projects-tbody');
    try {
        const { data, error } = await supabaseClient
            .from('proyectos')
            .select(`
                *,
                proyecto_evaluadores (
                    perfiles (nombre)
                )
            `)
            .order('created_at', { ascending: false });
        
        if(error) throw error;
        adminProjectsCache = data;
        renderAdminProjectsTable(data);
    } catch (e) {
        console.error("loadAdminProjects Error:", e);
        if(tbody) tbody.innerHTML = `<tr><td colspan="7" class="px-8 py-20 text-center text-status-danger font-bold text-sm bg-red-50/50 rounded-2xl">Error al cargar los proyectos.</td></tr>`;
    }
}

function renderAdminProjectsTable(projects) {
    const tbody = document.getElementById('admin-projects-tbody');
    if(!tbody) return;

    if(!projects || projects.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="px-8 py-20 text-center text-slate-400 font-medium">No se encontraron proyectos</td></tr>`;
        return;
    }

    const catStyles = { 
        'Desarrollo': 'bg-blue-50 text-blue-600 border-blue-100', 
        'Propuesta': 'bg-amber-50 text-amber-600 border-amber-100', 
        'Aplicación': 'bg-emerald-50 text-emerald-600 border-emerald-100' 
    };
    const estadoStyles = { 
        'Pendiente': 'bg-slate-100 text-slate-500 border-slate-200', 
        'Evaluado': 'bg-primary/10 text-primary border-primary/20', 
        'Vencida': 'bg-red-50 text-status-danger border-red-100' 
    };

    tbody.innerHTML = projects.map(p => {
        let asignado = 'Sin asignar';
        if (p.proyecto_evaluadores && p.proyecto_evaluadores.length > 0) {
            const names = p.proyecto_evaluadores.filter(pe => pe.perfiles).map(pe => pe.perfiles.nombre);
            if (names.length > 0) asignado = names.join(', ');
        }

        return `
            <tr class="hover:bg-slate-50/50 transition-colors group">
                <td class="px-4 py-5">
                    <div class="flex flex-col gap-1">
                        <p class="font-black text-slate-800 text-sm truncate max-w-[200px]" title="${escapeHTML(p.nombre)}">${escapeHTML(p.nombre)}</p>
                        <p class="text-[10px] text-slate-400 font-medium uppercase tracking-wider">${escapeHTML(p.tipo)}</p>
                    </div>
                </td>
                <td class="px-3 py-5 text-center">
                    <span class="inline-flex px-3 py-1 rounded-lg bg-slate-50 text-[9px] font-black text-slate-500 border border-slate-100">
                        ${escapeHTML(p.categoria)}
                    </span>
                </td>
                <td class="px-1 py-5 text-center text-slate-600 font-bold text-xs border-l border-slate-50">${p.semestre}°</td>
                <td class="px-1 py-5 text-center text-slate-400 font-medium text-xs border-r border-slate-50">${p.anio}</td>
                <td class="px-4 py-5">
                    <div class="flex flex-wrap gap-1 max-w-[180px]">
                        ${asignado === 'Sin asignar' 
                            ? `<span class="px-2 py-0.5 bg-slate-50 text-slate-400 text-[9px] font-black rounded-lg italic">Sin asignar</span>`
                            : asignado.split(', ').map(n => `<span class="px-2 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-bold rounded-lg truncate max-w-[100px]">${escapeHTML(n)}</span>`).join('')
                        }
                    </div>
                </td>
                <td class="px-3 py-5 text-center">
                    <span class="inline-flex items-center px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${estadoStyles[p.estado] || 'bg-slate-50 text-slate-400 border-slate-100'}">
                        ${escapeHTML(p.estado)}
                    </span>
                </td>
                <td class="px-4 py-5">
                    <div class="flex items-center justify-center gap-1.5">
                        <button onclick="openEditProjectModal('${p.id}')" class="w-8 h-8 flex items-center justify-center rounded-lg bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all shadow-sm" title="Editar">
                            <i class="fa-solid fa-pen text-[10px]"></i>
                        </button>
                        <button onclick="deleteProject('${p.id}')" class="w-8 h-8 flex items-center justify-center rounded-lg bg-status-danger/5 text-status-danger hover:bg-status-danger hover:text-white transition-all shadow-sm" title="Eliminar">
                            <i class="fa-solid fa-trash text-[10px]"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

let adminProjectsDebounceTimer;
function filterAdminProjects() {
    clearTimeout(adminProjectsDebounceTimer);
    adminProjectsDebounceTimer = setTimeout(() => {
        const search = (document.getElementById('admin-search-projects')?.value || '').toLowerCase();
        const cat = document.getElementById('admin-filter-cat')?.value || '';

        const filtered = adminProjectsCache.filter(p => {
            const matchSearch = p.nombre.toLowerCase().includes(search);
            const matchCat = cat ? p.categoria === cat : true;
            return matchSearch && matchCat;
        });

        renderAdminProjectsTable(filtered);
    }, 300);
}

async function showCreateProjectModal() {
    document.getElementById('create-project-modal').style.display = 'flex';
    
    // Load docentes and estudiantes for the select dropdowns
    if(!supabaseClient) return;
    try {
        // Fetch Docs
        const { data: docentes, error: errDoc } = await supabaseClient
            .from('perfiles')
            .select('id, nombre')
            .eq('rol', 'docente')
            .order('nombre');
            
        if(errDoc) throw errDoc;
        
        const sel1 = document.getElementById('new-project-evaluator-1');
        const sel2 = document.getElementById('new-project-evaluator-2');
        const sel3 = document.getElementById('new-project-evaluator-3');
        
        [sel1, sel2, sel3].forEach(sel => {
            sel.innerHTML = '<option value="">-- Sin asignar --</option>';
            docentes.forEach(d => {
                const opt = document.createElement('option');
                opt.value = d.id;
                opt.textContent = d.nombre;
                sel.appendChild(opt);
            });
        });
        
        // Store for dynamic filtering
        window.adminCurrentDocentes = docentes;
        updateEvaluatorDropdowns();

        // Fetch Students
        const { data: estudiantes, error: errEst } = await supabaseClient
            .from('perfiles')
            .select('id, nombre')
            .eq('rol', 'estudiante')
            .order('nombre');
            
        if(errEst) throw errEst;

        const selectEst = document.getElementById('new-project-student');
        selectEst.innerHTML = '<option value="">-- Sin asignar --</option>';
        estudiantes.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.id;
            opt.textContent = s.nombre;
            selectEst.appendChild(opt);
        });

    } catch (e) {
        console.error("Error loading users for modal:", e);
    }
}

// Dynamically block selected evaluators in the other dropdowns
function updateEvaluatorDropdowns() {
    const sel1 = document.getElementById('new-project-evaluator-1');
    const sel2 = document.getElementById('new-project-evaluator-2');
    const sel3 = document.getElementById('new-project-evaluator-3');
    
    if (!sel1 || !sel2 || !sel3 || !window.adminCurrentDocentes) return;

    const val1 = sel1.value;
    const val2 = sel2.value;
    const val3 = sel3.value;

    const allDropdowns = [
        { el: sel1, val: val1 },
        { el: sel2, val: val2 },
        { el: sel3, val: val3 }
    ];

    allDropdowns.forEach(current => {
        const otherVals = allDropdowns.filter(d => d.el !== current.el).map(d => d.val).filter(v => v !== "");
        
        Array.from(current.el.options).forEach(opt => {
            if (opt.value === "") return; // Never block the "-- Sin asignar --"
            opt.disabled = otherVals.includes(opt.value);
        });
    });
}

function closeCreateProjectModal() {
    document.getElementById('create-project-modal').style.display = 'none';
    document.getElementById('create-project-form').reset();
    document.getElementById('create-project-error').style.display = 'none';
    if(window.adminCurrentDocentes) {
        updateEvaluatorDropdowns();
    }
}

async function handleCreateProject(e) {
    e.preventDefault();
    if(!supabaseClient) return;

    const btn = document.getElementById('btn-create-project');
    const errObj = document.getElementById('create-project-error');
    btn.disabled = true;
    btn.textContent = 'Guardando...';
    errObj.style.display = 'none';

    const payload = {
        nombre: escapeHTML(document.getElementById('new-project-name').value.trim()),
        categoria: escapeHTML(document.getElementById('new-project-cat').value),
        semestre: parseInt(document.getElementById('new-project-sem').value),
        anio: parseInt(document.getElementById('new-project-year').value),
        estado: 'Pendiente'
    };
    
    const val1 = document.getElementById('new-project-evaluator-1').value;
    const val2 = document.getElementById('new-project-evaluator-2').value;
    const val3 = document.getElementById('new-project-evaluator-3').value;
    
    const evaluatorIds = [val1, val2, val3].filter(val => val !== "");

    if (evaluatorIds.length === 0) {
        errObj.textContent = "Debe asignar al menos un evaluador al proyecto.";
        errObj.style.display = 'block';
        btn.disabled = false;
        btn.textContent = 'Registrar Proyecto';
        return;
    }

    const studentId = document.getElementById('new-project-student').value;

    try {
        // 1. Create the project
        const { data: projData, error: projError } = await supabaseClient
            .from('proyectos')
            .insert([payload])
            .select()
            .single();

        if(projError) throw projError;
        
        // 2. Assign the evaluators if selected
        if (evaluatorIds.length > 0 && projData) {
            const evaluatorInserts = evaluatorIds.map(id => ({
                proyecto_id: projData.id,
                evaluador_id: id
            }));
            const { error: evalError } = await supabaseClient
                .from('proyecto_evaluadores')
                .insert(evaluatorInserts);
            if(evalError) console.error("Error asignando evaluador:", evalError); // Non-blocking
        }

        // 3. Assign the student if selected
        if (studentId && projData) {
            const { error: studError } = await supabaseClient
                .from('proyecto_estudiantes')
                .insert([{ proyecto_id: projData.id, estudiante_id: studentId }]);
            if(studError) console.error("Error asignando estudiante:", studError); // Non-blocking
        }

        closeCreateProjectModal();
        loadAdminProjects(); // Refresh
    } catch (e) {
        console.error("handleCreateProject Error:", e);
        errObj.textContent = "Ocurrió un error al registrar el proyecto.";
        errObj.style.display = 'block';
    } finally {
        btn.disabled = false;
        btn.textContent = 'Registrar Proyecto';
    }
}

async function deleteProject(projectId) {
    if(!confirm('¿Eliminar este proyecto? Esta acción no se puede deshacer.')) return;
    if(!supabaseClient) return;

    try {
        const { error } = await supabaseClient
            .from('proyectos')
            .delete()
            .eq('id', projectId);

        if(error) throw error;
        loadAdminProjects();
    } catch (e) {
        console.error("deleteProject Error:", e);
        alert("Ocurrió un error al intentar eliminar el proyecto.");
    }
}

// ── EDITAR PROYECTO ────────────────────────────────────────────────────────────

async function openEditProjectModal(projectId) {
    const p = adminProjectsCache.find(x => x.id === projectId);
    if (!p) return;

    const modal = document.getElementById('edit-project-modal');
    if (!modal) return;
    
    document.getElementById('edit-proj-id').value = p.id;
    document.getElementById('edit-proj-nombre').value = p.nombre;
    document.getElementById('edit-proj-cat').value = p.categoria;
    document.getElementById('edit-proj-sem').value = p.semestre;
    document.getElementById('edit-proj-year').value = p.anio;
    
    const errBox = document.getElementById('edit-proj-error');
    if(errBox) errBox.classList.add('hidden');
    
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.getElementById('edit-proj-error').style.display = 'none';
    document.getElementById('edit-project-modal').style.display = 'flex';

    try {
        // Load docentes
        const { data: docentes } = await supabaseClient.from('perfiles').select('id, nombre').eq('rol', 'docente').order('nombre');
        const evSelects = ['edit-proj-ev1','edit-proj-ev2','edit-proj-ev3'];
        evSelects.forEach(selId => {
            const sel = document.getElementById(selId);
            sel.innerHTML = '<option value="">-- Ninguno --</option>';
            (docentes || []).forEach(d => { const o = document.createElement('option'); o.value = d.id; o.textContent = d.nombre; sel.appendChild(o); });
        });

        // Pre-select current evaluators
        const currentEvals = (p.proyecto_evaluadores || [])
            .filter(pe => pe.perfiles)
            .map(pe => pe.evaluador_id || '');
        // Also fetch IDs directly
        const { data: evalData } = await supabaseClient.from('proyecto_evaluadores').select('evaluador_id').eq('proyecto_id', p.id);
        const evalIds = (evalData || []).map(e => e.evaluador_id);
        evalIds.forEach((id, i) => { if (i < 3) document.getElementById(evSelects[i]).value = id || ''; });

        // Load estudiantes
        const { data: estudiantes } = await supabaseClient.from('perfiles').select('id, nombre').eq('rol', 'estudiante').order('nombre');
        const selEst = document.getElementById('edit-proj-student');
        selEst.innerHTML = '<option value="">-- Sin asignar --</option>';
        (estudiantes || []).forEach(s => { const o = document.createElement('option'); o.value = s.id; o.textContent = s.nombre; selEst.appendChild(o); });

        // Pre-select current student
        const { data: studData } = await supabaseClient.from('proyecto_estudiantes').select('estudiante_id').eq('proyecto_id', p.id).maybeSingle();
        if (studData?.estudiante_id) selEst.value = studData.estudiante_id;

    } catch(err) { console.error('openEditProjectModal load error:', err); }
}

function closeEditProjectModal() {
    const m = document.getElementById('edit-project-modal');
    if (m) m.style.display = 'none';
}

async function handleEditProject(e) {
    e.preventDefault();
    if (!supabaseClient) return;

    const btn    = document.getElementById('btn-edit-project');
    const errObj = document.getElementById('edit-proj-error');
    btn.disabled = true;
    btn.textContent = 'Guardando...';
    errObj.style.display = 'none';

    const projectId = document.getElementById('edit-proj-id').value;
    const nombre    = document.getElementById('edit-proj-nombre').value.trim();
    const categoria = document.getElementById('edit-proj-cat').value;
    const semestre  = parseInt(document.getElementById('edit-proj-sem').value);
    const anio      = parseInt(document.getElementById('edit-proj-year').value);
    const ev1 = document.getElementById('edit-proj-ev1').value;
    const ev2 = document.getElementById('edit-proj-ev2').value;
    const ev3 = document.getElementById('edit-proj-ev3').value;
    const evalIds = [ev1, ev2, ev3].filter(v => v !== '');
    const studentId = document.getElementById('edit-proj-student').value;

    try {
        // 1. Update basic project fields
        const { error: updErr } = await supabaseClient
            .from('proyectos')
            .update({ nombre, categoria, semestre, anio })
            .eq('id', projectId);
        if (updErr) throw updErr;

        // 2. Replace evaluators: delete old, insert new
        await supabaseClient.from('proyecto_evaluadores').delete().eq('proyecto_id', projectId);
        if (evalIds.length > 0) {
            const inserts = evalIds.map(id => ({ proyecto_id: projectId, evaluador_id: id }));
            const { error: evErr } = await supabaseClient.from('proyecto_evaluadores').insert(inserts);
            if (evErr) console.error('Error actualizando evaluadores:', evErr);
        }

        // 3. Replace student: delete old, insert new
        await supabaseClient.from('proyecto_estudiantes').delete().eq('proyecto_id', projectId);
        if (studentId) {
            const { error: stErr } = await supabaseClient.from('proyecto_estudiantes').insert([{ proyecto_id: projectId, estudiante_id: studentId }]);
            if (stErr) console.error('Error actualizando estudiante:', stErr);
        }

        closeEditProjectModal();
        loadAdminProjects();
    } catch(err) {
        console.error('handleEditProject Error:', err);
        errObj.textContent = 'Error al guardar: ' + (err.message || '');
        errObj.style.display = 'block';
    } finally {
        btn.disabled = false;
        btn.textContent = 'Guardar Cambios';
    }
}

// ── PROYECTOS POSTULADOS ──────────────────────────────────────────────────────

let currentGPostId = null;

async function loadAdminPostulaciones(estadoFilter) {
    if (!supabaseClient) return;
    const tbody = document.getElementById('admin-postulaciones-tbody');
    if (!tbody) return;
    
    tbody.innerHTML = `<tr><td colspan="6" class="px-8 py-20 text-center"><div class="inline-block animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div></td></tr>`;
    
    try {
        let query = supabaseClient
            .from('postulaciones')
            .select(`*, estudiante:perfiles!postulaciones_estudiante_id_fkey (nombre), revisor:perfiles!postulaciones_docente_revisor_id_fkey (nombre)`)
            .order('created_at', { ascending: false });
        if (estadoFilter) query = query.eq('estado', estadoFilter);
        const { data, error } = await query;
        if (error) throw error;

        if (!data || data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="px-8 py-20 text-center text-slate-400 font-medium">No hay postulaciones registradas</td></tr>`;
            return;
        }

        const estConfig = { 
            'Pendiente de revisión': 'bg-amber-50 text-amber-600 border-amber-100', 
            'En revisión': 'bg-blue-50 text-blue-600 border-blue-100', 
            'Aprobado': 'bg-emerald-50 text-emerald-600 border-emerald-100', 
            'No aprobado': 'bg-red-50 text-status-danger border-red-100' 
        };
        const catClass = { 
            'Desarrollo': 'bg-blue-50 text-blue-600 border-blue-100', 
            'Propuesta': 'bg-slate-50 text-slate-500 border-slate-100', 
            'Aplicado': 'bg-emerald-50 text-emerald-600 border-emerald-100' 
        };

        // Update active filter button styles
        const filterBtns = {
            '': 'pfbtn-todos',
            'Pendiente de revisión': 'pfbtn-pendiente',
            'En revisión': 'pfbtn-revision',
            'Aprobado': 'pfbtn-aprobado',
            'No aprobado': 'pfbtn-noaprobado'
        };
        Object.values(filterBtns).forEach(id => {
            const btn = document.getElementById(id);
            if (btn) {
                if (id === filterBtns[estadoFilter]) {
                    btn.classList.replace('bg-surface', 'bg-primary');
                    btn.classList.replace('text-slate-500', 'text-white');
                    btn.classList.replace('border-slate-100', 'border-primary');
                } else {
                    btn.classList.replace('bg-primary', 'bg-surface');
                    btn.classList.replace('text-white', 'text-slate-500');
                    btn.classList.replace('border-primary', 'border-slate-100');
                }
            }
        });

        tbody.innerHTML = data.map(p => {
            const fecha = new Date(p.created_at).toLocaleDateString();
            return `
                <tr class="hover:bg-slate-50/50 transition-colors group">
                    <td class="px-8 py-5">
                       <span class="font-bold text-slate-700 block max-w-xs truncate" title="${escapeHTML(p.nombre)}">${escapeHTML(p.nombre)}</span>
                    </td>
                    <td class="px-8 py-5 text-slate-600 font-medium">${escapeHTML(p.estudiante?.nombre || '—')}</td>
                    <td class="px-8 py-5 text-center">
                        <span class="inline-flex items-center px-4 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${catClass[p.categoria] || 'bg-slate-50 text-slate-400 border-slate-100'}">
                            ${escapeHTML(p.categoria)}
                        </span>
                    </td>
                    <td class="px-8 py-5 text-slate-500 font-medium text-sm text-center">${fecha}</td>
                    <td class="px-8 py-5 text-center">
                        <span class="inline-flex items-center px-4 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${estConfig[p.estado] || 'bg-slate-50 text-slate-400 border-slate-100'}">
                            ${escapeHTML(p.estado)}
                        </span>
                    </td>
                    <td class="px-8 py-5">
                         <button onclick="openGestionarPost('${p.id}')" 
                            class="w-full px-4 py-2 rounded-xl bg-slate-100 text-slate-500 hover:bg-primary hover:text-white font-bold text-xs transition-all shadow-sm">
                            <i class="fa-solid fa-gear mr-2"></i>Gestionar
                        </button>
                    </td>
                </tr>`;
        }).join('');
    } catch (err) {
        console.error('loadAdminPostulaciones Error:', err);
    }
}

async function openGestionarPost(id) {
    currentGPostId = id;
    const modal = document.getElementById('gestionar-post-modal');
    const details = document.getElementById('gpost-details');
    const errBox = document.getElementById('gpost-error');
    const okBox = document.getElementById('gpost-ok');
    
    if(errBox) errBox.classList.add('hidden');
    if(okBox) okBox.classList.add('hidden');
    if(modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
    
    details.innerHTML = '<div class="py-20 flex justify-center"><div class="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full"></div></div>';

    try {
        const { data: p, error } = await supabaseClient
            .from('postulaciones')
            .select(`*, estudiante:perfiles!postulaciones_estudiante_id_fkey (nombre), revisor:perfiles!postulaciones_docente_revisor_id_fkey (nombre)`)
            .eq('id', id).single();
        if (error) throw error;

        const estConfig = { 
            'Pendiente de revisión': 'bg-amber-50 text-amber-600 border-amber-100', 
            'En revisión': 'bg-blue-50 text-blue-600 border-blue-100', 
            'Aprobado': 'bg-emerald-50 text-emerald-600 border-emerald-100', 
            'No aprobado': 'bg-red-50 text-status-danger border-red-100' 
        };
        const fecha = new Date(p.created_at).toLocaleDateString('es-CO', { year:'numeric', month:'long', day:'numeric' });

        let downloadBtn = '';
        if (p.archivo_path) {
            const { data: sd } = await supabaseClient.storage.from('postulaciones-docs').createSignedUrl(p.archivo_path, 3600);
            if (sd?.signedUrl) {
                downloadBtn = `
                    <a href="${sd.signedUrl}" target="_blank" 
                        class="inline-flex items-center gap-3 px-6 py-4 bg-slate-50 hover:bg-slate-100 rounded-2xl text-primary font-black text-sm transition-all border border-slate-100">
                        <i class="fa-solid fa-file-word text-xl"></i> 
                        Descargar Word de Postulación
                    </a>`;
            }
        }
        
        const obs = p.observacion_docente
            ? `<div class="p-6 bg-slate-50 rounded-2xl border-l-4 border-primary space-y-2">
                 <span class="block text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Observación del docente</span>
                 <p class="text-slate-700 font-bold leading-relaxed">${escapeHTML(p.observacion_docente)}</p>
               </div>` : '';

        details.innerHTML = `
            <div class="space-y-8">
                <div class="space-y-1">
                    <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Proyecto</span>
                    <h4 class="text-2xl font-black text-slate-800 leading-tight">${escapeHTML(p.nombre)}</h4>
                </div>
                
                <div class="grid grid-cols-2 gap-8 p-6 bg-slate-50/50 rounded-3xl border border-slate-50">
                    <div class="space-y-1">
                        <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estudiante</span>
                        <p class="text-slate-700 font-bold">${escapeHTML(p.estudiante?.nombre || '—')}</p>
                    </div>
                    <div class="space-y-1">
                        <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado</span>
                        <div>
                            <span class="inline-flex items-center px-4 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${estConfig[p.estado] || ''}">
                                ${escapeHTML(p.estado)}
                            </span>
                        </div>
                    </div>
                    <div class="space-y-1">
                        <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Categoría</span>
                        <p class="text-slate-700 font-bold">${escapeHTML(p.categoria)}</p>
                    </div>
                    <div class="space-y-1">
                        <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fecha Registro</span>
                        <p class="text-slate-700 font-bold text-sm">${fecha}</p>
                    </div>
                </div>

                <div class="space-y-1">
                    <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Revisor Actual</span>
                    <p class="flex items-center gap-2 text-slate-700 font-black">
                        <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                        ${escapeHTML(p.revisor?.nombre || 'Sin asignar todavía')}
                    </p>
                </div>
                
                ${obs}
                <div class="pt-2">${downloadBtn}</div>
            </div>`;

        const sel = document.getElementById('gpost-select-docente');
        const { data: docs } = await supabaseClient.from('perfiles').select('id, nombre').eq('rol', 'docente').order('nombre');
        sel.innerHTML = '<option value="">-- Selecciona un docente revisor --</option>';
        (docs || []).forEach(d => { const o = document.createElement('option'); o.value = d.id; o.textContent = d.nombre; sel.appendChild(o); });
    } catch (err) {
        console.error('openGestionarPost Error:', err);
    }
}

function cerrarGestionarPost() {
    const modal = document.getElementById('gestionar-post-modal');
    if(modal) modal.classList.add('hidden');
    currentGPostId = null;
}

async function handleAsignarRevisor() {
    if (!supabaseClient || !currentGPostId) return;
    const docenteId = document.getElementById('gpost-select-docente').value;
    const errBox = document.getElementById('gpost-error');
    const okBox = document.getElementById('gpost-ok');
    
    if(errBox) errBox.classList.add('hidden');
    if(okBox) okBox.classList.add('hidden');

    if (!docenteId) { 
        if(errBox) {
            errBox.querySelector('span').textContent = 'Selecciona un docente.';
            errBox.classList.remove('hidden');
            errBox.classList.add('flex');
        }
        return; 
    }
    try {
        const { error } = await supabaseClient
            .from('postulaciones')
            .update({ docente_revisor_id: docenteId, estado: 'En revisión' })
            .eq('id', currentGPostId);
        if (error) throw error;
        
        if(okBox) {
            okBox.classList.remove('hidden');
            okBox.classList.add('flex');
        }
        loadAdminPostulaciones('');
    } catch (err) {
        console.error('handleAsignarRevisor Error:', err);
        if(errBox) {
            errBox.querySelector('span').textContent = 'Error: ' + (err.message || '');
            errBox.classList.remove('hidden');
            errBox.classList.add('flex');
        }
    }
}

function validateAdminUserEmail(prefix) {
    const email = document.getElementById(`${prefix}-user-email`).value.trim();
    const hint = document.getElementById(`${prefix}-user-email-hint`);
    const btn = document.getElementById(`btn-${prefix}-user`);
    const isValid = (prefix === 'edit' && email === '') || validateUnipazEmail(email);
    
    if (email.length > 0) {
        if (isValid) {
            hint.textContent = 'Correo válido';
            hint.classList.replace('text-slate-400', 'text-status-success');
            hint.classList.remove('text-status-danger');
        } else {
            hint.textContent = 'Debe ser @unipaz.edu.co';
            hint.classList.replace('text-slate-400', 'text-status-danger');
            hint.classList.remove('text-status-success');
        }
    } else {
        hint.textContent = 'Solo @unipaz.edu.co';
        hint.classList.add('text-slate-400');
        hint.classList.remove('text-status-success', 'text-status-danger');
    }
    
    if (btn) {
        if (isValid) {
            btn.disabled = false;
            btn.classList.remove('opacity-50', 'cursor-not-allowed');
        } else {
            btn.disabled = true;
            btn.classList.add('opacity-50', 'cursor-not-allowed');
        }
    }
}
