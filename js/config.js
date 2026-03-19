const SUPABASE_URL = 'https://gbjmulgwdjxqehhlrqjy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdiam11bGd3ZGp4cWVoaGxycWp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwMjY4NDcsImV4cCI6MjA4ODYwMjg0N30.y_goVlRIjd9DAmUbAcjz7JW23WYs5ztUWtOKlIFQkjw';

let supabaseClient = null;

if (window.supabase) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// XSS Sanitization helper - Improved
function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    if (typeof str !== 'string') str = String(str);
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// EMAIL VALIDATION UTILITIES
function validateUnipazEmail(email) {
    if (!email) return false;
    const re = /^[a-zA-Z0-9._%+-]+@unipaz\.edu\.co$/;
    return re.test(email.toLowerCase());
}

function updateSubmitButtonState(buttonId, isValid) {
    const btn = document.getElementById(buttonId);
    if (!btn) return;
    
    if (isValid) {
        btn.disabled = false;
        btn.classList.remove('opacity-50', 'cursor-not-allowed');
    } else {
        btn.disabled = true;
        btn.classList.add('opacity-50', 'cursor-not-allowed');
    }
}
