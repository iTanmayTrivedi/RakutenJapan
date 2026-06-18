import { useState, useEffect } from "react";

/**
 * Only shows the fallback page when the user is truly OFFLINE.
 * Slow connections (2g/3g, high latency) will NOT trigger it —
 * the site should remain accessible at any speed.
 */
export const useSlowConnection = () => {
  const [isSlow, setIsSlow] = useState(false);

  const dismiss = () => {
    sessionStorage.setItem("slow-connection-dismissed", "true");
    setIsSlow(false);
  };

  useEffect(() => {
    if (sessionStorage.getItem("slow-connection-dismissed") === "true") return;

    const updateOffline = () => setIsSlow(!navigator.onLine);

    // Initial check
    updateOffline();

    window.addEventListener("online", () => setIsSlow(false));
    window.addEventListener("offline", () => setIsSlow(true));

    return () => {
      window.removeEventListener("online", () => setIsSlow(false));
      window.removeEventListener("offline", () => setIsSlow(true));
    };
  }, []);

  return { isSlow, dismiss };
};
