function renderHomeView() {
    return `
        <!-- Hero Section -->
        <section class="relative overflow-hidden bg-white pt-20 pb-24 md:pt-28 md:pb-32">
            <div class="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 hidden lg:block"></div>
            
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div class="flex flex-col lg:flex-row items-center gap-16">
                    <div class="flex-1 space-y-8 text-center lg:text-left">
                        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-light border border-primary/10 text-primary animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                            <span class="text-[10px] font-black uppercase tracking-[0.2em]">Ingeniería Informática</span>
                        </div>
                        
                        <h1 class="text-5xl md:text-7xl font-black text-slate-800 tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                            RuedaPro <span class="text-primary italic">UNIPAZ</span>
                        </h1>
                        
                        <p class="text-xl text-slate-500 font-medium leading-relaxed max-w-xl animate-in fade-in slide-in-from-bottom-12 duration-700 delay-200">
                            Plataforma académica de vanguardia para la gestión, evaluación y proyección de la innovación tecnológica en la región.
                        </p>
                        
                        <div class="flex flex-wrap justify-center lg:justify-start gap-4 pt-4 animate-in fade-in slide-in-from-bottom-16 duration-700 delay-300">
                            <button class="px-8 py-4 bg-primary text-white font-black rounded-2xl shadow-2xl shadow-primary/30 hover:bg-primary-dark transform hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-3" 
                                onclick="navigateTo('results')">
                                <i class="fa-solid fa-trophy text-amber-400"></i> Ver Resultados
                            </button>
                            <button class="px-8 py-4 bg-white border-2 border-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 hover:border-slate-200 transform hover:-translate-y-1 transition-all active:scale-95" 
                                onclick="navigateTo('login-estudiante')">
                                Ingreso Estudiantes
                            </button>
                        </div>
                    </div>
                    
                    <div class="flex-1 w-full max-w-lg lg:max-w-none relative animate-in fade-in zoom-in duration-1000 delay-500">
                        <div class="absolute -inset-4 bg-primary/10 rounded-[60px] blur-3xl opacity-50"></div>
                        <div class="relative bg-slate-900 rounded-[60px] aspect-[4/3] flex items-center justify-center overflow-hidden shadow-2xl border border-slate-800 group">
                            <div class="absolute inset-0 bg-gradient-to-tr from-primary/40 to-transparent opacity-40 group-hover:opacity-60 transition-opacity"></div>
                            <div class="text-white text-9xl transform group-hover:scale-110 transition-transform duration-1000">
                                <i class="fa-solid fa-network-wired opacity-20"></i>
                            </div>
                            <div class="absolute bottom-10 left-10 right-10 text-center">
                                <div class="backdrop-blur-xl bg-white/10 border border-white/10 p-6 rounded-[32px] shadow-2xl">
                                    <p class="text-primary-light font-black text-[10px] uppercase tracking-widest mb-2">Campus Virtual</p>
                                    <h3 class="text-white font-bold text-lg">Impulsando el Futuro Digital</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- News Section -->
        <section class="py-24 bg-bg-base">
            <div class="max-w-7xl mx-auto px-4 md:px-6">
                <div class="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                    <div class="space-y-2">
                        <div class="h-1.5 w-12 bg-primary rounded-full"></div>
                        <h2 class="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">Noticias del Evento</h2>
                    </div>
                    <p class="text-slate-500 font-medium max-w-xs md:text-right">Mantente al día con las últimas actualizaciones de la facultad.</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
                    ${renderNewsCard("fa-bullhorn", "Apertura de inscripciones", "Ya están abiertas las inscripciones para la próxima Rueda de Proyectos. Registra tu propuesta antes del cierre.", "Hace 2 días", "bg-blue-500")}
                    ${renderNewsCard("fa-calendar-check", "Cronograma actualizado", "Consulta las fechas clave para la entrega de la documentación y la presentación de los proyectos.", "Hace 1 semana", "bg-emerald-500")}
                    ${renderNewsCard("fa-ranking-star", "Ganadores Semestre Anterior", "Felicitamos a los proyectos destacados del último periodo académico por su innovación y calidad técnica.", "Mes pasado", "bg-amber-500")}
                </div>
            </div>
        </section>

        <!-- Results CTA Section -->
        <section class="py-24">
            <div class="max-w-7xl mx-auto px-4 md:px-6">
                <div class="bg-primary rounded-[60px] p-10 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-primary/40 group">
                    <div class="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-white/10 transition-colors duration-700"></div>
                    <div class="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
                    
                    <div class="relative z-10 space-y-8">
                        <h2 class="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight max-w-3xl mx-auto">Explora el Legado de la Rueda de Proyectos</h2>
                        <p class="text-primary-light text-lg font-medium max-w-2xl mx-auto opacity-80">Descubre los proyectos de mayor impacto y califica a los innovadores del mañana.</p>
                        <button class="px-10 py-5 bg-white text-primary font-black rounded-2xl shadow-xl hover:scale-105 transition-all active:scale-95" 
                            onclick="navigateTo('results')">
                            Explorar el Ranking Histórico
                        </button>
                    </div>
                </div>
            </div>
        </section>
    `;
}

function renderNewsCard(icon, title, text, meta, color) {
    return `
        <div class="bg-surface rounded-[40px] p-10 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col h-full group">
            <div class="w-16 h-16 ${color} rounded-x overflow-hidden flex items-center justify-center text-white text-2xl mb-8 rounded-3xl shadow-lg ring-4 ring-slate-50">
                <i class="fa-solid ${icon}"></i>
            </div>
            <div class="flex-grow space-y-3">
                <span class="text-[10px] font-black text-primary uppercase tracking-widest">${meta}</span>
                <h3 class="text-2xl font-black text-slate-800 tracking-tight group-hover:text-primary transition-colors">${title}</h3>
                <p class="text-slate-500 font-medium leading-relaxed">${text}</p>
            </div>
            <div class="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
                <a href="#" class="text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-primary transition-colors">Leer más</a>
                <i class="fa-solid fa-arrow-right text-slate-200 group-hover:text-primary transform group-hover:translate-x-2 transition-all"></i>
            </div>
        </div>
    `;
}
