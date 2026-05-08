"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { hasConsent, acceptAll, essentialOnly, setCookieConsent } from "@/lib/cookies";

interface ToggleRowProps {
  label: string;
  description: string;
  checked: boolean;
  onChange?: (v: boolean) => void;
  locked?: boolean;
}

function ToggleRow({ label, description, checked, onChange, locked }: ToggleRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-white/20 last:border-0">
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-white">{label}</div>
        <div className="text-xs text-white/45 mt-0.5 leading-relaxed">{description}</div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={locked}
        onClick={() => onChange?.(!checked)}
        className={`flex-shrink-0 w-10 h-6 rounded-full transition-colors duration-200 relative mt-0.5 border-none cursor-pointer overflow-hidden ${
          checked ? "bg-brand" : "bg-white/15"
        } ${locked ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <span
          className={`absolute top-1 left-0 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
            checked ? "translate-x-5" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(true);

  useEffect(() => {
    if (!hasConsent()) setVisible(true);

    const handleOpen = () => {
      setShowCustomize(false);
      setVisible(true);
    };
    window.addEventListener("cookie-settings-open", handleOpen);
    return () => window.removeEventListener("cookie-settings-open", handleOpen);
  }, []);

  if (!visible) return null;

  const handleAcceptAll = () => {
    acceptAll();
    setVisible(false);
  };

  const handleEssentialOnly = () => {
    essentialOnly();
    setVisible(false);
  };

  const handleSaveCustom = () => {
    setCookieConsent({ essential: true, analytics, marketing });
    setVisible(false);
  };

  return (
    <div className="cookie-banner fixed bottom-0 left-0 right-0 z-[300] bg-black backdrop-blur-sm border-t border-zinc-700">
      {!showCustomize ? (
        /* Default banner */
        <div className="max-w-content mx-auto px-5 md:px-10 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-sm text-white/55 max-w-xl leading-relaxed">
            We use cookies to improve your experience.{" "}
            <Link href="/legal/cookie-policy" className="text-white/70 underline underline-offset-2 hover:text-white transition-colors">
              Learn more
            </Link>
          </p>
          <div className="flex gap-2.5 flex-shrink-0 flex-wrap">
            <button
              onClick={() => setShowCustomize(true)}
              className="text-sm text-white/45 hover:text-white transition-colors bg-transparent border border-white/15 px-4 py-2 rounded-lg cursor-pointer"
            >
              Customize
            </button>
            <button
              onClick={handleEssentialOnly}
              className="text-sm text-white/55 hover:text-white transition-colors bg-transparent border border-white/15 px-4 py-2 rounded-lg cursor-pointer"
            >
              Essential Only
            </button>
            <button
              onClick={handleAcceptAll}
              className="text-sm font-semibold text-white bg-brand px-4 py-2 rounded-lg cursor-pointer hover:bg-brand-700 transition-colors border-none"
            >
              Accept All
            </button>
          </div>
        </div>
      ) : (
        /* Customize modal */
        <div className="max-w-lg mx-auto px-5 py-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-white">Cookie Preferences</h3>
            <button
              onClick={() => setShowCustomize(false)}
              className="text-white/40 hover:text-white transition-colors bg-transparent border-none cursor-pointer p-1"
              aria-label="Close"
            >
              <X className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>

          <ToggleRow
            label="Essential"
            description="Required for the website to work. Cannot be disabled."
            checked={true}
            locked
          />
          <ToggleRow
            label="Analytics"
            description="Help us understand how you use our site (Google Analytics, Hotjar)."
            checked={analytics}
            onChange={setAnalytics}
          />
          <ToggleRow
            label="Marketing"
            description="Used to measure ad effectiveness (Meta Pixel, Google Ads)."
            checked={marketing}
            onChange={setMarketing}
          />

          <div className="flex gap-2.5 justify-end mt-5 pt-4 border-t border-zinc-700">
            <button
              onClick={handleEssentialOnly}
              className="text-sm text-white/45 hover:text-white transition-colors bg-transparent border border-zinc-700 px-4 py-2 rounded-lg cursor-pointer"
            >
              Essential Only
            </button>
            <button
              onClick={handleSaveCustom}
              className="text-sm font-semibold text-white bg-brand px-4 py-2 rounded-lg cursor-pointer hover:bg-brand-700 transition-colors border-none"
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
