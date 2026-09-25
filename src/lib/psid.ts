import crypto from "crypto";

/**
 * Strips all non-digit characters (hyphens, spaces, etc.) from CNIC string.
 */
export function sanitizeCnic(cnic: string): string {
  if (!cnic) return "";
  return cnic.replace(/\D/g, "");
}

/**
 * Validates whether the CNIC contains strictly 13 numeric digits.
 */
export function isValidCnic(cnic: string): boolean {
  const sanitized = sanitizeCnic(cnic);
  return /^\d{13}$/.test(sanitized);
}

/**
 * Formats a 13-digit CNIC into standard Pakistani format: XXXXX-XXXXXXX-X
 */
export function formatCnicDisplay(cnic: string): string {
  const sanitized = sanitizeCnic(cnic);
  if (sanitized.length !== 13) return cnic;
  return `${sanitized.slice(0, 5)}-${sanitized.slice(5, 12)}-${sanitized.slice(12)}`;
}

/**
 * Generates a 10-digit numeric banking consumer code (PSID):
 * Format: 99 + 26 + 6-digit cryptographic sequence (e.g., 9926849102)
 */
export function generatePSID(): string {
  const randomSixDigits = crypto.randomInt(100000, 1000000).toString();
  return `9926${randomSixDigits}`;
}

/**
 * Generates unique application number:
 * Format: SLO-2026-XXXXX (where XXXXX is 5 cryptographic digits)
 */
export function generateApplicationNo(): string {
  const randomFiveDigits = crypto.randomInt(10000, 100000).toString();
  return `SLO-2026-${randomFiveDigits}`;
}
