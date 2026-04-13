/**
 * XSS Sanitization helper
 * In React JSX this is mostly unnecessary since React auto-escapes,
 * but useful for data sent to Supabase or displayed via dangerouslySetInnerHTML
 */
export function escapeHTML(str) {
  if (str === null || str === undefined) return ''
  if (typeof str !== 'string') str = String(str)
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/**
 * Validate @unipaz.edu.co email format
 */
export function validateUnipazEmail(email) {
  if (!email) return false
  const re = /^[a-zA-Z0-9._%+-]+@unipaz\.edu\.co$/
  return re.test(email.toLowerCase())
}
