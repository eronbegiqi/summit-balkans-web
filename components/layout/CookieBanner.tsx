"use client";

import { useState, useEffect } from "react";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("sb-cookies");
    if (!accepted) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("sb-cookies", "accepted");
    setVisible(false);
  };

  const manage = () => {
    localStorage.setItem("sb-cookies", "managed");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[300] bg-dark/96 backdrop-blur-sm border-t border-white/8 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p className="text-sm text-white/55 max-w-xl">
        We use cookies to improve your experience. By continuing to browse, you
        agree to our use of cookies.
      </p>
      <div className="flex gap-3 flex-shrink-0">
        <button
          onClick={manage}
          className="text-sm text-white/45 hover:text-white transition-colors bg-transparent border border-white/15 px-4 py-2 rounded-lg cursor-pointer"
        >
          Manage
        </button>
        <button
          onClick={accept}
          className="text-sm font-semibold text-white bg-terra px-4 py-2 rounded-lg cursor-pointer hover:opacity-90 transition-opacity border-none"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
