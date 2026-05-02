export interface CookieConsent {
  essential: true;
  analytics: boolean;
  marketing: boolean;
}

const KEY = "cookie-consent";

export function getCookieConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CookieConsent;
  } catch {
    return null;
  }
}

export function setCookieConsent(consent: CookieConsent): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(consent));
}

export function hasConsent(): boolean {
  return getCookieConsent() !== null;
}

export function acceptAll(): void {
  setCookieConsent({ essential: true, analytics: true, marketing: true });
}

export function essentialOnly(): void {
  setCookieConsent({ essential: true, analytics: false, marketing: false });
}
