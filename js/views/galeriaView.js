function renderGaleriaView() {
    return `
        <div style="max-width: 1200px; margin: 3rem auto; padding: 0 1rem;">
            
            <div style="text-align: center; margin-bottom: 3rem;">
                <h1 style="color: var(--primary-color); font-size: 2.5rem; margin-bottom: 0.5rem;">Galería de Proyectos</h1>
                <p style="color: var(--text-secondary); font-size: 1.1rem;">Recuerdos visuales de las ediciones pasadas de la Rueda de Proyectos.</p>
            </div>

            <!-- Edición 2026-1 -->
            <section style="margin-bottom: 4rem;">
                <h2 style="color: var(--text-primary); margin-bottom: 1.5rem; display: inline-block; border-bottom: 3px solid var(--secondary-color); padding-bottom: 0.5rem;">
                    Año 2026 / Semestre 1
                </h2>
                <div class="gallery-grid" style="margin-top: 1rem;">
                    <div class="gallery-item" style="position: relative;">
                        <i class="fa-solid fa-code"></i>
                        <div style="position: absolute; bottom: 0; width: 100%; background: rgba(0,0,0,0.6); color: white; padding: 0.5rem; font-size: 0.8rem; text-align: center;">Stand Innovación</div>
                    </div>
                    <div class="gallery-item" style="position: relative;">
                        <i class="fa-solid fa-microchip"></i>
                        <div style="position: absolute; bottom: 0; width: 100%; background: rgba(0,0,0,0.6); color: white; padding: 0.5rem; font-size: 0.8rem; text-align: center;">Prototipo IoT</div>
                    </div>
                    <div class="gallery-item" style="position: relative;">
                        <i class="fa-solid fa-users"></i>
                        <div style="position: absolute; bottom: 0; width: 100%; background: rgba(0,0,0,0.6); color: white; padding: 0.5rem; font-size: 0.8rem; text-align: center;">Equipo Ganador</div>
                    </div>
                    <div class="gallery-item" style="position: relative;">
                        <i class="fa-solid fa-chalkboard-user"></i>
                        <div style="position: absolute; bottom: 0; width: 100%; background: rgba(0,0,0,0.6); color: white; padding: 0.5rem; font-size: 0.8rem; text-align: center;">Evaluación en Vivo</div>
                    </div>
                </div>
            </section>

            <!-- Edición 2025-2 -->
            <section style="margin-bottom: 4rem;">
                <h2 style="color: var(--text-primary); margin-bottom: 1.5rem; display: inline-block; border-bottom: 3px solid var(--secondary-color); padding-bottom: 0.5rem;">
                    Año 2025 / Semestre 2
                </h2>
                <div class="gallery-grid" style="margin-top: 1rem;">
                    <div class="gallery-item" style="position: relative;">
                        <i class="fa-solid fa-robot"></i>
                        <div style="position: absolute; bottom: 0; width: 100%; background: rgba(0,0,0,0.6); color: white; padding: 0.5rem; font-size: 0.8rem; text-align: center;">Robótica Avanzada</div>
                    </div>
                    <div class="gallery-item" style="position: relative;">
                        <i class="fa-solid fa-mobile-screen"></i>
                        <div style="position: absolute; bottom: 0; width: 100%; background: rgba(0,0,0,0.6); color: white; padding: 0.5rem; font-size: 0.8rem; text-align: center;">App Móviles</div>
                    </div>
                    <div class="gallery-item" style="position: relative;">
                        <i class="fa-solid fa-medal"></i>
                        <div style="position: absolute; bottom: 0; width: 100%; background: rgba(0,0,0,0.6); color: white; padding: 0.5rem; font-size: 0.8rem; text-align: center;">Premiación</div>
                    </div>
                </div>
            </section>

            <!-- Edición 2025-1 -->
            <section style="margin-bottom: 2rem;">
                <h2 style="color: var(--text-primary); margin-bottom: 1.5rem; display: inline-block; border-bottom: 3px solid var(--secondary-color); padding-bottom: 0.5rem;">
                    Año 2025 / Semestre 1
                </h2>
                <div class="gallery-grid" style="margin-top: 1rem;">
                    <div class="gallery-item" style="position: relative;">
                        <i class="fa-solid fa-server"></i>
                        <div style="position: absolute; bottom: 0; width: 100%; background: rgba(0,0,0,0.6); color: white; padding: 0.5rem; font-size: 0.8rem; text-align: center;">Data Center UNIPAZ</div>
                    </div>
                    <div class="gallery-item" style="position: relative;">
                        <i class="fa-solid fa-magnifying-glass-chart"></i>
                        <div style="position: absolute; bottom: 0; width: 100%; background: rgba(0,0,0,0.6); color: white; padding: 0.5rem; font-size: 0.8rem; text-align: center;">Análisis de Datos</div>
                    </div>
                </div>
            </section>
            
        </div>
    `;
}
