function renderHomeView() {
    return `
        <!-- Hero Section -->
        <section class="hero">
            <div class="hero-content">
                <h1>RuedaPro <span class="text-unipaz">UNIPAZ</span></h1>
                <p>Plataforma web académica para la gestión, evaluación y publicación de resultados de la Rueda de Proyectos de Ingeniería Informática de UNIPAZ.</p>
                <div class="hero-cta">
                    <button class="btn btn-primary" onclick="navigateTo('results')"><i class="fa-solid fa-trophy"></i> Ver resultados</button>
                    <button class="btn btn-outline" onclick="navigateTo('login-docente')"><i class="fa-solid fa-chalkboard-user"></i> Ingreso docentes</button>
                    <button class="btn btn-outline" onclick="navigateTo('login-estudiante')"><i class="fa-solid fa-user-graduate"></i> Ingreso estudiantes</button>
                </div>
            </div>
            <div class="hero-image">
                <div class="hero-image-placeholder">
                    <i class="fa-solid fa-network-wired"></i>
                </div>
            </div>
        </section>

        <!-- News Section -->
        <section class="section-container">
            <h2 class="section-title">Noticias del Evento</h2>
            <div class="grid-3">
                <div class="card">
                    <div class="card-img"><i class="fa-solid fa-bullhorn"></i></div>
                    <div class="card-body">
                        <div class="card-meta">Hace 2 días</div>
                        <h3 class="card-title">Apertura de inscripciones</h3>
                        <p class="card-text">Ya están abiertas las inscripciones para la próxima Rueda de Proyectos. Registra tu propuesta antes del cierre.</p>
                    </div>
                </div>
                <div class="card">
                    <div class="card-img"><i class="fa-regular fa-calendar-check"></i></div>
                    <div class="card-body">
                        <div class="card-meta">Hace 1 semana</div>
                        <h3 class="card-title">Cronograma actualizado</h3>
                        <p class="card-text">Consulta las fechas clave para la entrega de la documentación y la presentación de los proyectos.</p>
                    </div>
                </div>
                <div class="card">
                    <div class="card-img"><i class="fa-solid fa-ranking-star"></i></div>
                    <div class="card-body">
                        <div class="card-meta">Mes pasado</div>
                        <h3 class="card-title">Ganadores Semestre Anterior</h3>
                        <p class="card-text">Felicitamos a los proyectos destacados del último periodo académico por su innovación y calidad técnica.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Results Preview Section -->
        <section class="results-preview-section section-container" style="max-width: 100%; text-align: center;">
            <div style="max-width: 1200px; margin: 0 auto;">
                <h2 class="section-title">Resultados Históricos</h2>
                <p style="color: var(--text-secondary); margin-bottom: 2rem;">Explora los proyectos ganadores y de mayor impacto que han participado en ediciones anteriores.</p>
                <button class="btn btn-primary" onclick="navigateTo('results')">Explorar el Ranking Histórico</button>
            </div>
        </section>
    `;
}
