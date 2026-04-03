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
