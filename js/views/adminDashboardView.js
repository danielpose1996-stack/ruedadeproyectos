function renderAdminDashboard() {
    const adminName = currentProfile?.nombre || 'Administrador';
    return `
        <div style="display: flex; min-height: calc(100vh - 70px - 100px);">
            
            <!-- Sidebar -->
            <aside style="width: 260px; background-color: var(--bg-surface); border-right: 1px solid var(--border-color); padding: 2rem 1rem; display: flex; flex-direction: column; gap: 0.5rem; flex-shrink: 0;">
                <div style="padding: 0 1rem 1.5rem; border-bottom: 1px solid var(--border-color); margin-bottom: 1rem;">
                    <p style="font-size: 0.8rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 1px;">Sesión activa</p>
                    <p style="font-weight: 600; color: var(--text-primary);">${adminName}</p>
                </div>
                <h3 style="color: var(--text-secondary); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.5rem; padding-left: 1rem;">Panel</h3>
                
                <a href="#" class="sidebar-link active" id="sb-users" onclick="adminShowTab('users'); return false;"><i class="fa-solid fa-users-gear"></i> Gestión de Usuarios</a>
                <a href="#" class="sidebar-link" id="sb-projects" onclick="adminShowTab('projects'); return false;"><i class="fa-solid fa-folder-tree"></i> Gestión de Proyectos</a>
                <a href="#" class="sidebar-link" id="sb-postulaciones" onclick="adminShowTab('postulaciones'); return false;"><i class="fa-solid fa-inbox"></i> Proyectos Postulados</a>
                
                <div style="margin-top: auto;">
                    <a href="#" onclick="handleLogout(); return false;" class="sidebar-link" style="color: var(--status-danger);"><i class="fa-solid fa-arrow-right-from-bracket"></i> Cerrar sesión</a>
                </div>
            </aside>

            <!-- Main Content -->
            <main style="flex: 1; padding: 2rem; background-color: var(--bg-base); overflow-y: auto;">
                <div style="max-width: 1000px; margin: 0 auto;">
                    
                    <!-- ===== USERS TAB ===== -->
                    <div id="admin-tab-users">
                        <header style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                            <div>
                                <h2 style="color: var(--text-primary); margin-bottom: 0.3rem;">Gestión de Usuarios</h2>
                                <p style="color: var(--text-secondary); font-size: 0.9rem;">Crea y administra cuentas de docentes y estudiantes.</p>
                            </div>
                            <button class="btn btn-primary" onclick="showCreateUserModal()"><i class="fa-solid fa-user-plus"></i> Nuevo Usuario</button>
                        </header>

                        <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem;">
                            <input type="text" id="admin-search-users" placeholder="Buscar por nombre..." onkeyup="filterAdminUsers()" style="flex: 1; padding: 0.75rem 1rem; border: 1px solid var(--border-color); border-radius: 8px; background: var(--bg-surface); color: var(--text-primary);">
                            <select id="admin-filter-role" onchange="filterAdminUsers()" style="padding: 0.75rem 1rem; border: 1px solid var(--border-color); border-radius: 8px; background: var(--bg-surface); color: var(--text-primary);">
                                <option value="">Todos los roles</option>
                                <option value="docente">Docentes</option>
                                <option value="estudiante">Estudiantes</option>
                            </select>
                        </div>

                        <div class="card" style="padding: 0; overflow: hidden;">
                            <div class="table-container">
                                <table class="data-table">
                                    <thead>
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Rol</th>
                                            <th>Fecha Registro</th>
                                            <th style="text-align: right;">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody id="admin-users-tbody">
                                        <tr><td colspan="4" style="text-align:center; padding: 2rem; color: var(--text-secondary);">Cargando usuarios...</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <!-- ===== PROJECTS TAB ===== -->
                    <div id="admin-tab-projects" style="display: none;">
                        <header style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                            <div>
                                <h2 style="color: var(--text-primary); margin-bottom: 0.3rem;">Gestión de Proyectos</h2>
                                <p style="color: var(--text-secondary); font-size: 0.9rem;">Registra y administra los proyectos de cada semestre.</p>
                            </div>
                            <button class="btn btn-primary" onclick="showCreateProjectModal()"><i class="fa-solid fa-folder-plus"></i> Nuevo Proyecto</button>
                        </header>

                        <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
                            <input type="text" id="admin-search-projects" placeholder="Buscar proyecto..." onkeyup="filterAdminProjects()" style="flex: 1; min-width: 200px; padding: 0.75rem 1rem; border: 1px solid var(--border-color); border-radius: 8px; background: var(--bg-surface); color: var(--text-primary);">
                            <select id="admin-filter-cat" onchange="filterAdminProjects()" style="padding: 0.75rem 1rem; border: 1px solid var(--border-color); border-radius: 8px; background: var(--bg-surface); color: var(--text-primary);">
                                <option value="">Todas las categorías</option>
                                <option value="Desarrollo">Desarrollo</option>
                                <option value="Propuesta">Propuesta</option>
                                <option value="Aplicación">Aplicación</option>
                            </select>
                        </div>

                        <div class="card" style="padding: 0; overflow: hidden;">
                            <div class="table-container">
                                <table class="data-table">
                                    <thead>
                                        <tr>
                                            <th>Nombre del Proyecto</th>
                                            <th>Categoría</th>
                                            <th>Semestre</th>
                                            <th>Año</th>
                                            <th>Docente Asignado</th>
                                            <th>Estado</th>
                                            <th style="text-align: right;">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody id="admin-projects-tbody">
                                        <tr><td colspan="7" style="text-align:center; padding: 2rem; color: var(--text-secondary);">Cargando proyectos...</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <!-- ===== POSTULACIONES TAB ===== -->
                    <div id="admin-tab-postulaciones" style="display: none;">
                        <header style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                            <div>
                                <h2 style="color: var(--text-primary); margin-bottom: 0.3rem;">Proyectos Postulados</h2>
                                <p style="color: var(--text-secondary); font-size: 0.9rem;">Gestiona las postulaciones de estudiantes antes de la Rueda.</p>
                            </div>
                        </header>
                        <div style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
                            <button class="btn btn-primary" id="pfbtn-todos" onclick="loadAdminPostulaciones('')" style="font-size:0.83rem;">Todos</button>
                            <button class="btn btn-outline" id="pfbtn-pendiente" onclick="loadAdminPostulaciones('Pendiente de revisi\u00f3n')" style="font-size:0.83rem;">&#9203; Pendientes</button>
                            <button class="btn btn-outline" id="pfbtn-revision" onclick="loadAdminPostulaciones('En revisi\u00f3n')" style="font-size:0.83rem;">&#128269; En revisi\u00f3n</button>
                            <button class="btn btn-outline" id="pfbtn-aprobado" onclick="loadAdminPostulaciones('Aprobado')" style="font-size:0.83rem;">&#9989; Aprobados</button>
                            <button class="btn btn-outline" id="pfbtn-noaprobado" onclick="loadAdminPostulaciones('No aprobado')" style="font-size:0.83rem;">&#10060; No aprobados</button>
                        </div>
                        <div class="card" style="padding: 0; overflow: hidden;">
                            <div class="table-container">
                                <table class="data-table">
                                    <thead>
                                        <tr>
                                            <th>Proyecto</th>
                                            <th>Estudiante</th>
                                            <th>Categoría</th>
                                            <th>Fecha</th>
                                            <th>Estado</th>
                                            <th style="text-align:right;">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody id="admin-postulaciones-tbody">
                                        <tr><td colspan="6" style="text-align:center; padding: 2rem; color: var(--text-secondary);">Cargando...</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
        
        <!-- ===== CREATE USER MODAL ===== -->
        <div id="create-user-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.55); z-index: 1000; justify-content: center; align-items: center;">
            <div style="background: var(--bg-surface); padding: 2rem; border-radius: 16px; width: 100%; max-width: 480px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); max-height: 90vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <h3 style="color: var(--text-primary); margin: 0;"><i class="fa-solid fa-user-plus" style="color: var(--primary-color);"></i> Crear Nuevo Usuario</h3>
                    <button onclick="closeCreateUserModal()" style="background: none; border: none; cursor: pointer; color: var(--text-secondary); font-size: 1.2rem;"><i class="fa-solid fa-xmark"></i></button>
                </div>
                <form id="create-user-form" onsubmit="handleCreateUser(event)" style="display: flex; flex-direction: column; gap: 1rem;">
                    <div>
                        <label style="display:block; margin-bottom:0.4rem; color:var(--text-primary); font-weight: 500; font-size: 0.9rem;">Nombre Completo</label>
                        <input type="text" id="new-user-name" required placeholder="Ej. Carlos Martínez" style="width: 100%; padding: 0.8rem; border: 1px solid var(--border-color); border-radius: 8px; background: var(--bg-base); color: var(--text-primary);">
                    </div>
                    <div>
                        <label style="display:block; margin-bottom:0.4rem; color:var(--text-primary); font-weight: 500; font-size: 0.9rem;">Correo Electrónico</label>
                        <input type="email" id="new-user-email" required placeholder="correo@ejemplo.com" style="width: 100%; padding: 0.8rem; border: 1px solid var(--border-color); border-radius: 8px; background: var(--bg-base); color: var(--text-primary);">
                    </div>
                    <div>
                        <label style="display:block; margin-bottom:0.4rem; color:var(--text-primary); font-weight: 500; font-size: 0.9rem;">Contraseña Provisional</label>
                        <input type="password" id="new-user-password" required minlength="8" placeholder="Mínimo 8 caracteres" style="width: 100%; padding: 0.8rem; border: 1px solid var(--border-color); border-radius: 8px; background: var(--bg-base); color: var(--text-primary);">
                    </div>
                    <div>
                        <label style="display:block; margin-bottom:0.4rem; color:var(--text-primary); font-weight: 500; font-size: 0.9rem;">Rol</label>
                        <select id="new-user-role" required style="width: 100%; padding: 0.8rem; border: 1px solid var(--border-color); border-radius: 8px; background: var(--bg-base); color: var(--text-primary);">
                            <option value="docente">Docente Evaluador</option>
                            <option value="estudiante">Estudiante</option>
                        </select>
                    </div>
                    <div id="create-user-error" style="color: var(--status-danger); display:none; font-size: 0.9rem; background: #FEE2E2; padding: 0.75rem; border-radius: 6px; margin-top: 0.25rem;"></div>
                    <div style="display: flex; gap: 1rem; margin-top: 0.5rem;">
                        <button type="button" class="btn btn-outline" onclick="closeCreateUserModal()" style="flex: 1;">Cancelar</button>
                        <button type="submit" class="btn btn-primary" id="btn-create-user" style="flex: 1;">Crear Usuario</button>
                    </div>
                </form>
            </div>
        </div>
        <!-- ===== EDIT USER MODAL ===== -->
        <div id="edit-user-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.55); z-index: 1000; justify-content: center; align-items: center;">
            <div style="background: var(--bg-surface); padding: 2rem; border-radius: 16px; width: 100%; max-width: 480px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); max-height: 90vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <h3 style="color: var(--text-primary); margin: 0;"><i class="fa-solid fa-user-pen" style="color: var(--primary-color);"></i> Editar Usuario</h3>
                    <button onclick="closeEditUserModal()" style="background: none; border: none; cursor: pointer; color: var(--text-secondary); font-size: 1.2rem;"><i class="fa-solid fa-xmark"></i></button>
                </div>
                <form id="edit-user-form" onsubmit="handleEditUser(event)" style="display: flex; flex-direction: column; gap: 1rem;">
                    <input type="hidden" id="edit-user-id">
                    <div>
                        <label style="display:block; margin-bottom:0.4rem; color:var(--text-primary); font-weight: 500; font-size: 0.9rem;">Nombre Completo</label>
                        <input type="text" id="edit-user-name" required style="width: 100%; padding: 0.8rem; border: 1px solid var(--border-color); border-radius: 8px; background: var(--bg-base); color: var(--text-primary);">
                    </div>
                    <div>
                        <label style="display:block; margin-bottom:0.4rem; color:var(--text-primary); font-weight: 500; font-size: 0.9rem;">Nuevo Correo Electrónico (Opcional)</label>
                        <input type="email" id="edit-user-email" placeholder="Dejar en blanco para no cambiar" style="width: 100%; padding: 0.8rem; border: 1px solid var(--border-color); border-radius: 8px; background: var(--bg-base); color: var(--text-primary);">
                    </div>
                    <div>
                        <label style="display:block; margin-bottom:0.4rem; color:var(--text-primary); font-weight: 500; font-size: 0.9rem;">Nueva Contraseña (Opcional)</label>
                        <input type="password" id="edit-user-password" minlength="8" placeholder="Dejar en blanco para no cambiar" style="width: 100%; padding: 0.8rem; border: 1px solid var(--border-color); border-radius: 8px; background: var(--bg-base); color: var(--text-primary);">
                    </div>
                    <div>
                        <label style="display:block; margin-bottom:0.4rem; color:var(--text-primary); font-weight: 500; font-size: 0.9rem;">Rol</label>
                        <select id="edit-user-role" required style="width: 100%; padding: 0.8rem; border: 1px solid var(--border-color); border-radius: 8px; background: var(--bg-base); color: var(--text-primary);">
                            <option value="docente">Docente Evaluador</option>
                            <option value="estudiante">Estudiante</option>
                        </select>
                    </div>
                    <div id="edit-user-error" style="color: var(--status-danger); display:none; font-size: 0.9rem; background: #FEE2E2; padding: 0.75rem; border-radius: 6px; margin-top: 0.25rem;"></div>
                    <div style="display: flex; gap: 1rem; margin-top: 0.5rem;">
                        <button type="button" class="btn btn-outline" onclick="closeEditUserModal()" style="flex: 1;">Cancelar</button>
                        <button type="submit" class="btn btn-primary" id="btn-edit-user" style="flex: 1;">Guardar Cambios</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- ===== DELETE USER CONFIRM MODAL ===== -->
        <div id="delete-user-confirm-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.55); z-index: 1000; justify-content: center; align-items: center;">
            <div style="background: var(--bg-surface); padding: 2.5rem 2rem; border-radius: 16px; width: 100%; max-width: 400px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); text-align: center;">
                <i class="fa-solid fa-triangle-exclamation" style="font-size: 3.5rem; color: var(--status-danger); margin-bottom: 1.5rem;"></i>
                <h3 style="color: var(--text-primary); margin-bottom: 1rem; font-size: 1.5rem;">Confirmar Eliminación</h3>
                <p style="color: var(--text-secondary); margin-bottom: 2rem; line-height: 1.6;">¿Estás seguro de que deseas eliminar a este usuario de forma permanente? Por motivos de seguridad, toma en cuenta que esta acción <strong>no se puede deshacer</strong> y eliminará todos sus datos asociados.</p>
                <input type="hidden" id="delete-user-id-target">
                <div style="display: flex; gap: 1rem;">
                    <button type="button" class="btn btn-outline" onclick="closeDeleteUserConfirm()" style="flex: 1;">Cancelar</button>
                    <button type="button" class="btn btn-primary" onclick="confirmDeleteUser()" style="flex: 1; background-color: var(--status-danger); border-color: var(--status-danger);">Sí, Eliminar</button>
                </div>
            </div>
        </div>

        <!-- ===== CREATE PROJECT MODAL ===== -->
        <div id="create-project-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.55); z-index: 1000; justify-content: center; align-items: center;">
            <div style="background: var(--bg-surface); padding: 2rem; border-radius: 16px; width: 100%; max-width: 480px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); max-height: 90vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <h3 style="color: var(--text-primary); margin: 0;"><i class="fa-solid fa-folder-plus" style="color: var(--primary-color);"></i> Registrar Proyecto</h3>
                    <button onclick="closeCreateProjectModal()" style="background: none; border: none; cursor: pointer; color: var(--text-secondary); font-size: 1.2rem;"><i class="fa-solid fa-xmark"></i></button>
                </div>
                <form id="create-project-form" onsubmit="handleCreateProject(event)" style="display: flex; flex-direction: column; gap: 1rem;">
                    <div>
                        <label style="display:block; margin-bottom:0.4rem; color:var(--text-primary); font-weight: 500; font-size: 0.9rem;">Nombre del Proyecto</label>
                        <input type="text" id="new-project-name" required placeholder="Ej. Sistema IoT para Invernaderos" style="width: 100%; padding: 0.8rem; border: 1px solid var(--border-color); border-radius: 8px; background: var(--bg-base); color: var(--text-primary);">
                    </div>
                    <div>
                        <label style="display:block; margin-bottom:0.4rem; color:var(--text-primary); font-weight: 500; font-size: 0.9rem;">Categoría</label>
                        <select id="new-project-cat" required style="width: 100%; padding: 0.8rem; border: 1px solid var(--border-color); border-radius: 8px; background: var(--bg-base); color: var(--text-primary);">
                            <option value="Desarrollo">Desarrollo</option>
                            <option value="Propuesta">Propuesta</option>
                            <option value="Aplicación">Aplicación</option>
                        </select>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div>
                            <label style="display:block; margin-bottom:0.4rem; color:var(--text-primary); font-weight: 500; font-size: 0.9rem;">Semestre</label>
                            <select id="new-project-sem" required style="width: 100%; padding: 0.8rem; border: 1px solid var(--border-color); border-radius: 8px; background: var(--bg-base); color: var(--text-primary);">
                                <option value="1">1 (Primer Semestre)</option>
                                <option value="2">2 (Segundo Semestre)</option>
                            </select>
                        </div>
                        <div>
                            <label style="display:block; margin-bottom:0.4rem; color:var(--text-primary); font-weight: 500; font-size: 0.9rem;">Año</label>
                            <input type="number" id="new-project-year" required value="2026" min="2020" max="2035" style="width: 100%; padding: 0.8rem; border: 1px solid var(--border-color); border-radius: 8px; background: var(--bg-base); color: var(--text-primary);">
                        </div>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin-top: 0.5rem; padding-top: 1rem; border-top: 1px solid var(--border-color);">
                        <div>
                            <label style="display:block; margin-bottom:0.4rem; color:var(--text-primary); font-weight: 500; font-size: 0.9rem;">Evaluador 1</label>
                            <select id="new-project-evaluator-1" onchange="updateEvaluatorDropdowns()" style="width: 100%; padding: 0.8rem; border: 1px solid var(--border-color); border-radius: 8px; background: var(--bg-surface); color: var(--text-primary);">
                                <option value="">-- Sin asignar --</option>
                            </select>
                        </div>
                        <div>
                            <label style="display:block; margin-bottom:0.4rem; color:var(--text-primary); font-weight: 500; font-size: 0.9rem;">Evaluador 2</label>
                            <select id="new-project-evaluator-2" onchange="updateEvaluatorDropdowns()" style="width: 100%; padding: 0.8rem; border: 1px solid var(--border-color); border-radius: 8px; background: var(--bg-surface); color: var(--text-primary);">
                                <option value="">-- Sin asignar --</option>
                            </select>
                        </div>
                        <div>
                            <label style="display:block; margin-bottom:0.4rem; color:var(--text-primary); font-weight: 500; font-size: 0.9rem;">Evaluador 3</label>
                            <select id="new-project-evaluator-3" onchange="updateEvaluatorDropdowns()" style="width: 100%; padding: 0.8rem; border: 1px solid var(--border-color); border-radius: 8px; background: var(--bg-surface); color: var(--text-primary);">
                                <option value="">-- Sin asignar --</option>
                            </select>
                        </div>
                    </div>
                    
                    <div style="margin-top: 0.5rem;">
                        <label style="display:block; margin-bottom:0.4rem; color:var(--text-primary); font-weight: 500; font-size: 0.9rem;">Asignar Estudiante (opcional)</label>
                        <select id="new-project-student" style="width: 100%; padding: 0.8rem; border: 1px solid var(--border-color); border-radius: 8px; background: var(--bg-surface); color: var(--text-primary);">
                            <option value="">-- Sin asignar --</option>
                        </select>
                        <small style="color: var(--text-secondary); display: block; margin-top: 0.3rem;">Autor del proyecto</small>
                    </div>
                    <div id="create-project-error" style="color: var(--status-danger); display:none; font-size: 0.9rem; background: #FEE2E2; padding: 0.75rem; border-radius: 6px; margin-top: 0.25rem;"></div>
                    <div style="display: flex; gap: 1rem; margin-top: 0.5rem;">
                        <button type="button" class="btn btn-outline" onclick="closeCreateProjectModal()" style="flex: 1;">Cancelar</button>
                        <button type="submit" class="btn btn-primary" id="btn-create-project" style="flex: 1;">Registrar Proyecto</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- ===== GESTIONAR POSTULACION MODAL ===== -->
        <div id="gestionar-post-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.55); z-index:1000; justify-content:center; align-items:center;">
            <div style="background:var(--bg-surface); padding:2rem; border-radius:16px; width:100%; max-width:560px; box-shadow:0 20px 60px rgba(0,0,0,0.3); max-height:90vh; overflow-y:auto;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
                    <h3 style="color:var(--text-primary); margin:0;"><i class="fa-solid fa-inbox" style="color:var(--primary-color);"></i> Gestionar Postulación</h3>
                    <button onclick="cerrarGestionarPost()" style="background:none; border:none; cursor:pointer; color:var(--text-secondary); font-size:1.2rem;"><i class="fa-solid fa-xmark"></i></button>
                </div>
                <div id="gpost-details" style="margin-bottom:1.5rem;"></div>
                <div style="border-top:1px solid var(--border-color); padding-top:1.5rem;">
                    <h4 style="color:var(--text-primary); margin-bottom:1rem;"><i class="fa-solid fa-user-tie"></i> Asignar Docente Revisor</h4>
                    <div style="display:flex; gap:0.75rem;">
                        <select id="gpost-select-docente" style="flex:1; padding:0.8rem; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-base); color:var(--text-primary);">
                            <option value="">-- Selecciona un docente --</option>
                        </select>
                        <button class="btn btn-primary" onclick="handleAsignarRevisor()" style="white-space:nowrap;"><i class="fa-solid fa-user-plus"></i> Asignar</button>
                    </div>
                    <div id="gpost-error" style="display:none; color:var(--status-danger); background:#FEE2E2; padding:0.75rem; border-radius:6px; margin-top:0.75rem; font-size:0.9rem;"></div>
                    <div id="gpost-ok" style="display:none; color:#065f46; background:#D1FAE5; padding:0.75rem; border-radius:6px; margin-top:0.75rem; font-size:0.9rem;"></div>
                </div>
            </div>
        </div>
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
        adminUsersCache = data;
        renderAdminUsersTable(data);
    } catch (e) {
        console.error("loadAdminUsers Error:", e);
        if(tbody) tbody.innerHTML = `<tr><td colspan="4" style="color:red; text-align:center;">Ocurrió un error al cargar los usuarios.</td></tr>`;
    }
}

function renderAdminUsersTable(users) {
    const tbody = document.getElementById('admin-users-tbody');
    if(!tbody) return;
    
    if(users.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;">No hay usuarios registrados.</td></tr>`;
        return;
    }
    
    tbody.innerHTML = users.map(user => {
        const date = new Date(user.created_at).toLocaleDateString();
        const badgeClass = user.rol === 'admin' ? 'badge-danger' : 
                          (user.rol === 'docente' ? 'badge-info' : 'badge-success');
                          
        return `
            <tr>
                <td><strong>${escapeHTML(user.nombre)}</strong></td>
                <td><span class="badge ${badgeClass}">${user.rol}</span></td>
                <td>${date}</td>
                <td style="text-align: right;">
                    ${user.rol !== 'admin' ? `
                    <button class="btn btn-outline" onclick="openEditUserModal('${user.id}')" style="padding: 0.3rem 0.6rem; color: var(--text-primary); border-color: var(--border-color); margin-right: 0.5rem;" title="Editar Usuario"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn btn-outline" onclick="showDeleteUserConfirm('${user.id}')" style="padding: 0.3rem 0.6rem; color: var(--status-danger); border-color: var(--status-danger);" title="Eliminar Usuario"><i class="fa-solid fa-trash"></i></button>
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
    document.getElementById('create-user-modal').style.display = 'flex';
}

function closeCreateUserModal() {
    document.getElementById('create-user-modal').style.display = 'none';
    document.getElementById('create-user-form').reset();
    document.getElementById('create-user-error').style.display = 'none';
}

async function handleCreateUser(e) {
    e.preventDefault();
    if(!supabaseClient) return;
    
    const btn = document.getElementById('btn-create-user');
    const errObj = document.getElementById('create-user-error');
    btn.disabled = true;
    btn.textContent = 'Creando...';
    errObj.style.display = 'none';
    
    const payload = {
        action: 'createUser',
        nombre: document.getElementById('new-user-name').value.trim(),
        email: document.getElementById('new-user-email').value.trim(),
        password: document.getElementById('new-user-password').value,
        rol: document.getElementById('new-user-role').value
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
        errObj.textContent = "Ocurrió un error al crear el usuario. Verifique los datos.";
        errObj.style.display = 'block';
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
    
    document.getElementById('edit-user-error').style.display = 'none';
    document.getElementById('edit-user-modal').style.display = 'flex';
}

function closeEditUserModal() {
    document.getElementById('edit-user-modal').style.display = 'none';
    document.getElementById('edit-user-form').reset();
}

async function handleEditUser(e) {
    e.preventDefault();
    if(!supabaseClient) return;
    
    const btn = document.getElementById('btn-edit-user');
    const errObj = document.getElementById('edit-user-error');
    btn.disabled = true;
    btn.textContent = 'Guardando...';
    errObj.style.display = 'none';
    
    const payload = {
        action: 'editUser',
        userId: document.getElementById('edit-user-id').value,
        nombre: document.getElementById('edit-user-name').value.trim(),
        email: document.getElementById('edit-user-email').value.trim() || undefined,
        password: document.getElementById('edit-user-password').value || undefined,
        rol: document.getElementById('edit-user-role').value
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
        errObj.textContent = "Ocurrió un error al guardar los cambios.";
        errObj.style.display = 'block';
    } finally {
        btn.disabled = false;
        btn.textContent = 'Guardar Cambios';
    }
}

// DELETE USER
function showDeleteUserConfirm(userId) {
    document.getElementById('delete-user-id-target').value = userId;
    document.getElementById('delete-user-confirm-modal').style.display = 'flex';
}

function closeDeleteUserConfirm() {
    document.getElementById('delete-user-confirm-modal').style.display = 'none';
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
        if (el) el.style.display = (t === tab) ? '' : 'none';
        if (sb) {
            if (t === tab) sb.classList.add('active');
            else sb.classList.remove('active');
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
        if(tbody) tbody.innerHTML = `<tr><td colspan="7" style="color:red; text-align:center; padding: 2rem;">Error al cargar los proyectos.</td></tr>`;
    }
}

function renderAdminProjectsTable(projects) {
    const tbody = document.getElementById('admin-projects-tbody');
    if(!tbody) return;

    if(!projects || projects.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 2rem; color: var(--text-secondary);">No hay proyectos registrados. Crea uno con "+ Nuevo Proyecto".</td></tr>`;
        return;
    }

    const catClass = { 'Desarrollo': 'badge-info', 'Propuesta': 'badge-warning', 'Aplicación': 'badge-success' };
    const estadoClass = { 'Pendiente': 'badge-warning', 'Evaluado': 'badge-success', 'Vencida': 'badge-danger' };

    tbody.innerHTML = projects.map(p => {
        // Extract assigned evaluators if any
        let asignado = 'Ninguno';
        if (p.proyecto_evaluadores && p.proyecto_evaluadores.length > 0) {
            const evaluatoresNames = p.proyecto_evaluadores
                .filter(pe => pe.perfiles)
                .map(pe => pe.perfiles.nombre);
            if (evaluatoresNames.length > 0) {
                asignado = evaluatoresNames.join(', ');
            }
        }

        return `
            <tr>
                <td><strong>${escapeHTML(p.nombre)}</strong></td>
                <td><span class="badge ${catClass[p.categoria] || ''}">${p.categoria}</span></td>
                <td style="text-align:center;">${p.semestre}°</td>
                <td style="text-align:center;">${p.anio}</td>
                <td>${escapeHTML(asignado)}</td>
                <td><span class="badge ${estadoClass[p.estado] || ''}">${p.estado}</span></td>
                <td>
                    <div style="display: flex; justify-content: flex-end; align-items: center; gap: 0.75rem;">
                        <button class="btn btn-outline" onclick="openEditProjectModal('${p.id}')" style="padding: 0.3rem 0.7rem;" title="Editar Proyecto"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn btn-outline" onclick="deleteProject('${p.id}')" style="padding: 0.3rem 0.7rem; color: var(--status-danger); border-color: var(--status-danger);" title="Eliminar Proyecto"><i class="fa-solid fa-trash"></i></button>
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
        nombre: document.getElementById('new-project-name').value.trim(),
        categoria: document.getElementById('new-project-cat').value,
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

    // Inject modal if not present
    if (!document.getElementById('edit-project-modal')) {
        document.body.insertAdjacentHTML('beforeend', `
        <div id="edit-project-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.55); z-index:1000; justify-content:center; align-items:center;">
            <div style="background:var(--bg-surface); padding:2rem; border-radius:16px; width:100%; max-width:520px; box-shadow:0 20px 60px rgba(0,0,0,0.3); max-height:90vh; overflow-y:auto;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
                    <h3 style="color:var(--text-primary); margin:0;"><i class="fa-solid fa-pen" style="color:var(--primary-color);"></i> Editar Proyecto</h3>
                    <button onclick="closeEditProjectModal()" style="background:none; border:none; cursor:pointer; color:var(--text-secondary); font-size:1.2rem;"><i class="fa-solid fa-xmark"></i></button>
                </div>
                <form id="edit-project-form" onsubmit="handleEditProject(event)" style="display:flex; flex-direction:column; gap:1rem;">
                    <input type="hidden" id="edit-proj-id">
                    <div>
                        <label style="display:block; margin-bottom:0.4rem; color:var(--text-primary); font-weight:500; font-size:0.9rem;">Nombre del Proyecto</label>
                        <input type="text" id="edit-proj-nombre" required style="width:100%; padding:0.8rem; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-base); color:var(--text-primary); box-sizing:border-box;">
                    </div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
                        <div>
                            <label style="display:block; margin-bottom:0.4rem; color:var(--text-primary); font-weight:500; font-size:0.9rem;">Categoría</label>
                            <select id="edit-proj-cat" required style="width:100%; padding:0.8rem; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-base); color:var(--text-primary);">
                                <option value="Desarrollo">Desarrollo</option>
                                <option value="Propuesta">Propuesta</option>
                                <option value="Aplicación">Aplicación</option>
                            </select>
                        </div>
                        <div>
                            <label style="display:block; margin-bottom:0.4rem; color:var(--text-primary); font-weight:500; font-size:0.9rem;">Semestre</label>
                            <select id="edit-proj-sem" required style="width:100%; padding:0.8rem; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-base); color:var(--text-primary);">
                                <option value="1">1 (Primer Semestre)</option>
                                <option value="2">2 (Segundo Semestre)</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label style="display:block; margin-bottom:0.4rem; color:var(--text-primary); font-weight:500; font-size:0.9rem;">Año</label>
                        <input type="number" id="edit-proj-year" required min="2020" max="2035" style="width:100%; padding:0.8rem; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-base); color:var(--text-primary); box-sizing:border-box;">
                    </div>
                    <div style="padding-top:0.75rem; border-top:1px solid var(--border-color);">
                        <label style="display:block; margin-bottom:0.75rem; color:var(--text-primary); font-weight:500; font-size:0.9rem;">Docentes Evaluadores</label>
                        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:0.75rem;">
                            <div><label style="font-size:0.8rem; color:var(--text-secondary);">Evaluador 1</label><select id="edit-proj-ev1" style="width:100%; padding:0.7rem; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-base); color:var(--text-primary);"><option value="">-- Ninguno --</option></select></div>
                            <div><label style="font-size:0.8rem; color:var(--text-secondary);">Evaluador 2</label><select id="edit-proj-ev2" style="width:100%; padding:0.7rem; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-base); color:var(--text-primary);"><option value="">-- Ninguno --</option></select></div>
                            <div><label style="font-size:0.8rem; color:var(--text-secondary);">Evaluador 3</label><select id="edit-proj-ev3" style="width:100%; padding:0.7rem; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-base); color:var(--text-primary);"><option value="">-- Ninguno --</option></select></div>
                        </div>
                    </div>
                    <div>
                        <label style="display:block; margin-bottom:0.4rem; color:var(--text-primary); font-weight:500; font-size:0.9rem;">Estudiante Asignado</label>
                        <select id="edit-proj-student" style="width:100%; padding:0.8rem; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-base); color:var(--text-primary);"><option value="">-- Sin asignar --</option></select>
                    </div>
                    <div id="edit-proj-error" style="display:none; color:var(--status-danger); background:#FEE2E2; padding:0.75rem; border-radius:6px; font-size:0.9rem;"></div>
                    <div style="display:flex; gap:1rem; margin-top:0.5rem;">
                        <button type="button" class="btn btn-outline" onclick="closeEditProjectModal()" style="flex:1;">Cancelar</button>
                        <button type="submit" class="btn btn-primary" id="btn-edit-project" style="flex:1;">Guardar Cambios</button>
                    </div>
                </form>
            </div>
        </div>`);
    }

    // Populate basic fields
    document.getElementById('edit-proj-id').value    = p.id;
    document.getElementById('edit-proj-nombre').value = p.nombre;
    document.getElementById('edit-proj-cat').value   = p.categoria;
    document.getElementById('edit-proj-sem').value   = p.semestre;
    document.getElementById('edit-proj-year').value  = p.anio;
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
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:2rem; color:var(--text-secondary);"><i class="fa-solid fa-circle-notch fa-spin"></i> Cargando...</td></tr>`;
    try {
        let query = supabaseClient
            .from('postulaciones')
            .select(`*, estudiante:perfiles!postulaciones_estudiante_id_fkey (nombre), revisor:perfiles!postulaciones_docente_revisor_id_fkey (nombre)`)
            .order('created_at', { ascending: false });
        if (estadoFilter) query = query.eq('estado', estadoFilter);
        const { data, error } = await query;
        if (error) throw error;

        if (!data || data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:2rem; color:var(--text-secondary);">No hay postulaciones${estadoFilter ? ' con este estado' : ''}.</td></tr>`;
            return;
        }
        const estConfig = { 'Pendiente de revisión':'badge-warning', 'En revisión':'badge-info', 'Aprobado':'badge-success', 'No aprobado':'badge-danger' };
        const catClass  = { 'Desarrollo':'badge-info', 'Propuesta':'badge-warning', 'Aplicado':'badge-success' };
        tbody.innerHTML = data.map(p => {
            const fecha = new Date(p.created_at).toLocaleDateString('es-CO');
            return `
                <tr>
                    <td><strong>${escapeHTML(p.nombre)}</strong></td>
                    <td>${escapeHTML(p.estudiante?.nombre || '—')}</td>
                    <td><span class="badge ${catClass[p.categoria] || ''}">${p.categoria}</span></td>
                    <td>${fecha}</td>
                    <td><span class="badge ${estConfig[p.estado] || ''}">${p.estado}</span></td>
                    <td style="text-align:right;">
                        <button class="btn btn-outline" onclick="openGestionarPost('${p.id}')" style="padding:0.3rem 0.8rem;"><i class="fa-solid fa-gear"></i> Gestionar</button>
                    </td>
                </tr>`;
        }).join('');
    } catch (err) {
        console.error('loadAdminPostulaciones Error:', err);
        tbody.innerHTML = `<tr><td colspan="6" style="color:red; text-align:center; padding:2rem;">Error al cargar postulaciones.</td></tr>`;
    }
}

async function openGestionarPost(id) {
    currentGPostId = id;
    const modal   = document.getElementById('gestionar-post-modal');
    const details = document.getElementById('gpost-details');
    const errBox  = document.getElementById('gpost-error');
    const okBox   = document.getElementById('gpost-ok');
    errBox.style.display = 'none';
    okBox.style.display  = 'none';
    modal.style.display  = 'flex';
    details.innerHTML    = '<div style="text-align:center; padding:1rem;"><i class="fa-solid fa-circle-notch fa-spin" style="color:var(--primary-color);"></i></div>';

    try {
        const { data: p, error } = await supabaseClient
            .from('postulaciones')
            .select(`*, estudiante:perfiles!postulaciones_estudiante_id_fkey (nombre), revisor:perfiles!postulaciones_docente_revisor_id_fkey (nombre)`)
            .eq('id', id).single();
        if (error) throw error;

        const estConfig = { 'Pendiente de revisión':'badge-warning', 'En revisión':'badge-info', 'Aprobado':'badge-success', 'No aprobado':'badge-danger' };
        const fecha = new Date(p.created_at).toLocaleDateString('es-CO', { year:'numeric', month:'long', day:'numeric' });

        let downloadBtn = '';
        if (p.archivo_path) {
            const { data: sd } = await supabaseClient.storage.from('postulaciones-docs').createSignedUrl(p.archivo_path, 3600);
            if (sd?.signedUrl) {
                downloadBtn = `<a href="${sd.signedUrl}" target="_blank" class="btn btn-outline" style="margin-top:0.75rem; display:inline-flex; align-items:center; gap:0.4rem;"><i class="fa-solid fa-file-word" style="color:#2563EB;"></i> Descargar Word</a>`;
            }
        }
        const obs = p.observacion_docente
            ? `<div style="margin-top:0.75rem; padding:0.75rem; background:var(--bg-base); border-radius:8px; border-left:3px solid var(--primary-color);"><p style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:0.2rem;">Observación del docente:</p><p style="color:var(--text-primary); font-size:0.9rem;">${escapeHTML(p.observacion_docente)}</p></div>` : '';

        details.innerHTML = `
            <div style="display:grid; gap:0.75rem;">
                <div><span style="color:var(--text-secondary); font-size:0.78rem; text-transform:uppercase;">Nombre</span><p style="color:var(--text-primary); font-weight:600;">${escapeHTML(p.nombre)}</p></div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
                    <div><span style="color:var(--text-secondary); font-size:0.78rem; text-transform:uppercase;">Estudiante</span><p style="color:var(--text-primary);">${escapeHTML(p.estudiante?.nombre || '—')}</p></div>
                    <div><span style="color:var(--text-secondary); font-size:0.78rem; text-transform:uppercase;">Categoría</span><p style="color:var(--text-primary);">${p.categoria}</p></div>
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
                    <div><span style="color:var(--text-secondary); font-size:0.78rem; text-transform:uppercase;">Fecha</span><p style="color:var(--text-primary);">${fecha}</p></div>
                    <div><span style="color:var(--text-secondary); font-size:0.78rem; text-transform:uppercase;">Estado</span><p><span class="badge ${estConfig[p.estado] || ''}">${p.estado}</span></p></div>
                </div>
                <div><span style="color:var(--text-secondary); font-size:0.78rem; text-transform:uppercase;">Revisor asignado</span><p style="color:var(--text-primary);">${escapeHTML(p.revisor?.nombre || 'Sin asignar')}</p></div>
                ${obs}
                ${downloadBtn}
            </div>`;

        // Load docentes into select
        const sel = document.getElementById('gpost-select-docente');
        const { data: docs } = await supabaseClient.from('perfiles').select('id, nombre').eq('rol', 'docente').order('nombre');
        sel.innerHTML = '<option value="">-- Selecciona un docente revisor --</option>';
        (docs || []).forEach(d => { const o = document.createElement('option'); o.value = d.id; o.textContent = d.nombre; sel.appendChild(o); });

    } catch (err) {
        console.error('openGestionarPost Error:', err);
        details.innerHTML = `<p style="color:var(--status-danger);">Error al cargar los detalles.</p>`;
    }
}

function cerrarGestionarPost() {
    document.getElementById('gestionar-post-modal').style.display = 'none';
    currentGPostId = null;
}

async function handleAsignarRevisor() {
    if (!supabaseClient || !currentGPostId) return;
    const docenteId = document.getElementById('gpost-select-docente').value;
    const errBox = document.getElementById('gpost-error');
    const okBox  = document.getElementById('gpost-ok');
    errBox.style.display = 'none';
    okBox.style.display  = 'none';
    if (!docenteId) { errBox.textContent = 'Selecciona un docente.'; errBox.style.display = 'block'; return; }
    try {
        const { error } = await supabaseClient
            .from('postulaciones')
            .update({ docente_revisor_id: docenteId, estado: 'En revisión' })
            .eq('id', currentGPostId);
        if (error) throw error;
        okBox.innerHTML = '<i class="fa-solid fa-circle-check"></i> Docente asignado correctamente. Estado cambiado a "En revisión".';
        okBox.style.display = 'block';
        loadAdminPostulaciones('');
    } catch (err) {
        console.error('handleAsignarRevisor Error:', err);
        errBox.textContent = 'Error al asignar el docente: ' + (err.message || '');
        errBox.style.display = 'block';
    }
}
