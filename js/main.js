document.addEventListener('DOMContentLoaded', () => {
    initRouter();
    
    // Default initial route
    navigateTo('home');
    
    // Start session check asynchronously without blocking render
    restoreSession();
});
