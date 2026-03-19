function renderGaleriaView() {
    return `
        <div class="max-w-7xl mx-auto py-16 px-4 md:px-6">
            
            <div class="text-center mb-20 space-y-4">
                <p class="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Memoria Visual</p>
                <h1 class="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">Galería de Proyectos</h1>
                <p class="text-lg text-slate-500 font-medium max-w-2xl mx-auto italic">Recuerdos visuales de la innovación y creatividad en las ediciones pasadas de la Rueda de Proyectos.</p>
                <div class="w-16 h-1 bg-primary mx-auto rounded-full opacity-30 mt-6"></div>
            </div>

            <!-- Edición 2026-1 -->
            <section class="mb-20">
                <div class="flex items-center gap-4 mb-8">
                    <span class="px-5 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">Edición 2026-1</span>
                    <div class="h-px flex-grow bg-slate-100"></div>
                </div>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    ${renderGalleryItem("fa-code", "Stand Innovación Software", "bg-blue-500")}
                    ${renderGalleryItem("fa-microchip", "Prototipo de Internet de las Cosas", "bg-emerald-500")}
                    ${renderGalleryItem("fa-users", "Equipos Destacados 2026", "bg-amber-500")}
                    ${renderGalleryItem("fa-chalkboard-user", "Sustentación y Feedback", "bg-purple-500")}
                </div>
            </section>

            <!-- Edición 2025-2 -->
            <section class="mb-20">
                <div class="flex items-center gap-4 mb-8">
                    <span class="px-5 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">Edición 2025-2</span>
                    <div class="h-px flex-grow bg-slate-100"></div>
                </div>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    ${renderGalleryItem("fa-robot", "Competencia de Robótica", "bg-rose-500")}
                    ${renderGalleryItem("fa-mobile-screen", "Ecosistema de Apps Móviles", "bg-sky-500")}
                    ${renderGalleryItem("fa-medal", "Gala de Premiación Final", "bg-amber-600")}
                </div>
            </section>

            <!-- Edición 2025-1 -->
            <section class="mb-12">
                <div class="flex items-center gap-4 mb-8">
                    <span class="px-5 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">Edición 2025-1</span>
                    <div class="h-px flex-grow bg-slate-100"></div>
                </div>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-10">
                    ${renderGalleryItem("fa-server", "Infraestructura Data Center", "bg-slate-700")}
                    ${renderGalleryItem("fa-magnifying-glass-chart", "Workshop de Análisis de Datos", "bg-indigo-500")}
                </div>
            </section>
            
        </div>
    `;
}

function renderGalleryItem(icon, caption, bgColor) {
    return `
        <div class="group relative overflow-hidden rounded-[32px] aspect-square bg-slate-50 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer">
            <!-- Background Accent -->
            <div class="absolute inset-x-0 top-0 h-1/2 ${bgColor} opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
            
            <!-- Graphic/Icon Placeholder -->
            <div class="absolute inset-0 flex items-center justify-center">
                <i class="fa-solid ${icon} text-6xl text-slate-200 group-hover:text-primary group-hover:scale-110 transition-all duration-700"></i>
            </div>
            
            <!-- Glassmorphism Caption -->
            <div class="absolute inset-x-4 bottom-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-10">
                <div class="backdrop-blur-md bg-white/80 border border-white/40 p-5 rounded-2xl shadow-xl">
                    <p class="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Galería Oficial</p>
                    <h4 class="text-slate-800 font-bold leading-tight">${caption}</h4>
                </div>
            </div>

            <!-- Overlay for contrast -->
            <div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
    `;
}
