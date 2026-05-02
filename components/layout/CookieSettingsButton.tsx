"use client";

export function CookieSettingsButton() {
  return (
    <button
      onClick={() => window.dispatchEvent(new CustomEvent("cookie-settings-open"))}
      className="text-xs text-white/25 hover:text-white/55 transition-colors font-mono bg-transparent border-none cursor-pointer p-0"
    >
      Cookie Settings
    </button>
  );
}
