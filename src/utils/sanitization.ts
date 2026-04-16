/**
 * Utility for masking Personally Identifiable Information (PII)
 * Optimized for Statement of Purpose (SOP) analysis safety.
 */

export const sanitizePII = (text: string): string => {
  if (!text) return text;

  let sanitized = text;

  // 1. Mask Emails
  sanitized = sanitized.replace(
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    '[EMAIL_MASKED]'
  );

  // 2. Mask Phone Numbers (International and Local)
  // Handles formats like +1-555-0199, 555-0199, (555) 0199, etc.
  sanitized = sanitized.replace(
    /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
    '[PHONE_MASKED]'
  );

  // 3. Mask Passport/ID Numbers (Pattern-based)
  // Common format: uppercase letters followed by digits
  sanitized = sanitized.replace(
    /\b[A-Z]{1,2}[0-9]{6,9}\b/g,
    '[ID_MASKED]'
  );

  return sanitized;
};

/**
 * Advanced Name-Masking heuristic
 * Note: This is non-trivial without NLP, but handles common 'My name is [Name]' patterns.
 */
export const sanitizeStudentName = (text: string, studentName?: string): string => {
  if (!text) return text;
  
  let sanitized = text;
  
  if (studentName) {
    const nameParts = studentName.split(' ').filter(part => part.length > 2);
    nameParts.forEach(part => {
      const regex = new RegExp(`\\b${part}\\b`, 'gi');
      sanitized = sanitized.replace(regex, '[NAME_MASKED]');
    });
  }

  return sanitized;
};

/**
 * Basic HTML/XSS Sanitization
 * Strips script tags and event handlers (onmouseover, onclick, etc.)
 */
export const sanitizeHTML = (html: string): string => {
  if (!html) return html;

  let sanitized = html;

  // 1. Remove script tags and their content
  sanitized = sanitized.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, '');

  // 2. Remove event handlers starts with 'on'
  sanitized = sanitized.replace(/\son[a-zA-Z]+\s*=\s*['"][^'"]*['"]/gim, '');
  sanitized = sanitized.replace(/\son[a-zA-Z]+\s*=\s*[^\s>]+/gim, '');

  // 3. Remove javascript: pseudo-protocol
  sanitized = sanitized.replace(/href\s*=\s*['"]\s*javascript:[^'"]*['"]/gim, '');

  // 4. Remove iframe, object, embed tags
  sanitized = sanitized.replace(/<(iframe|object|embed|form)\b[^>]*>([\s\S]*?)<\/(iframe|object|embed|form)>/gim, '');
  sanitized = sanitized.replace(/<(iframe|object|embed|form)\b[^>]*\/?>/gim, '');

  return sanitized;
};
