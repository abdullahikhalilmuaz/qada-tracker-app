import { useState } from "react";
import { IonContent, IonPage } from "@ionic/react";
import "./../styles/log.css";

// ── Prayer Icons (same as Home) ──────────────────────────────────────────────
const PrayerIcon = ({ name }: { name: string }) => {
  const icons: Record<string, JSX.Element> = {
    Fajr: (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <path d="M8 14 A5 5 0 0 1 18 14" stroke="#7eb3f5" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="13" y1="5" x2="13" y2="7.5" stroke="#7eb3f5" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="6" y1="17" x2="20" y2="17" stroke="#7eb3f5" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="4.5" y1="20" x2="21.5" y2="20" stroke="#7eb3f5" strokeWidth="1.4" strokeLinecap="round" opacity="0.45" />
      </svg>
    ),
    Zuhr: (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <circle cx="13" cy="13" r="4.5" stroke="#7eb3f5" strokeWidth="1.8" />
        <line x1="13" y1="4" x2="13" y2="6.5" stroke="#7eb3f5" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="13" y1="19.5" x2="13" y2="22" stroke="#7eb3f5" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="4" y1="13" x2="6.5" y2="13" stroke="#7eb3f5" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="19.5" y1="13" x2="22" y2="13" stroke="#7eb3f5" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="6.8" y1="6.8" x2="8.5" y2="8.5" stroke="#7eb3f5" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="17.5" y1="17.5" x2="19.2" y2="19.2" stroke="#7eb3f5" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="19.2" y1="6.8" x2="17.5" y2="8.5" stroke="#7eb3f5" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="8.5" y1="17.5" x2="6.8" y2="19.2" stroke="#7eb3f5" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    Asr: (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <path d="M8 14 A5 5 0 1 1 18 14" stroke="#7eb3f5" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="13" y1="5" x2="13" y2="7.5" stroke="#7eb3f5" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="19.5" y1="7.5" x2="17.8" y2="9.2" stroke="#7eb3f5" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="6.5" y1="7.5" x2="8.2" y2="9.2" stroke="#7eb3f5" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="7" y1="17" x2="19" y2="17" stroke="#7eb3f5" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    Maghrib: (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <path d="M8 14 A5 5 0 1 1 18 14" stroke="#9b8fe8" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="7" y1="17" x2="19" y2="17" stroke="#9b8fe8" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="5" y1="20" x2="21" y2="20" stroke="#9b8fe8" strokeWidth="1.4" strokeLinecap="round" opacity="0.45" />
      </svg>
    ),
    Isha: (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <path
          d="M17 14 A6 6 0 1 1 11 8 A4.5 4.5 0 0 0 17 14 Z"
          stroke="#9b8fe8"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    ),
  };
  return icons[name] ?? null;
};

// ── Data ─────────────────────────────────────────────────────────────────────
const INITIAL_PRAYERS = [
  { name: "Fajr",    remaining: 1899 },
  { name: "Zuhr",    remaining: 1899 },
  { name: "Asr",     remaining: 1899 },
  { name: "Maghrib", remaining: 1899 },
  { name: "Isha",    remaining: 1899 },
];

const TOTAL_REMAINING = 9497;

// ── Component ─────────────────────────────────────────────────────────────────
export default function Log() {
  const [counts, setCounts] = useState<Record<string, number>>(
    Object.fromEntries(INITIAL_PRAYERS.map((p) => [p.name, 0]))
  );
  const [bannerOpen, setBannerOpen] = useState(true);

  const totalAdded = Object.values(counts).reduce((a, b) => a + b, 0);
  const afterUpdate = TOTAL_REMAINING - totalAdded;

  const increment = (name: string) =>
    setCounts((c) => ({ ...c, [name]: c[name] + 1 }));

  const decrement = (name: string) =>
    setCounts((c) => ({ ...c, [name]: Math.max(0, c[name] - 1) }));

  return (
    <IonPage>
      <IonContent fullscreen className="log-content">
        <div className="log-wrapper">

          {/* ── Header ── */}
          <div className="log-header">
            <div>
              <h1 className="log-title">Log Qada</h1>
              <p className="log-subtitle">Add the Qada prayers you have completed.</p>
            </div>
            <button className="history-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <polyline points="12 7 12 12 15 15" />
              </svg>
              History
            </button>
          </div>

          {/* ── Motivational Banner ── */}
          {bannerOpen && (
            <div className="log-banner">
              <div className="banner-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#4a90d9">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
              <div className="banner-text">
                <p className="banner-main">Every prayer you log brings you closer.</p>
                <p className="banner-sub">Keep going, you're doing great!</p>
              </div>
              <button className="banner-close" onClick={() => setBannerOpen(false)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </div>
          )}

          {/* ── Prayer List ── */}
          <div className="log-section-header">
            <span className="log-section-title">Add Completed Prayers</span>
            <button className="quick-select-btn">
              Quick Select
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="14" y2="12" /><line x1="4" y1="18" x2="17" y2="18" />
              </svg>
            </button>
          </div>

          <div className="prayer-list">
            {INITIAL_PRAYERS.map((p) => (
              <div className="prayer-row" key={p.name}>
                <div className="prayer-row-icon">
                  <PrayerIcon name={p.name} />
                </div>
                <div className="prayer-row-info">
                  <span className="prayer-row-name">{p.name}</span>
                  <span className="prayer-row-remaining">{p.remaining.toLocaleString()} remaining</span>
                </div>
                <div className="prayer-row-controls">
                  <button className="ctrl-btn minus" onClick={() => decrement(p.name)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                  <span className="ctrl-count">{counts[p.name]}</span>
                  <button className="ctrl-btn plus" onClick={() => increment(p.name)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                </div>
                <div className="prayer-row-chevron">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3a4a5e" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          {/* ── Summary Card ── */}
          <div className="log-summary-card">
            <div className="summary-col">
              <div className="summary-col-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4a90d9" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="9" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
              </div>
              <div>
                <p className="summary-col-label">Total Added</p>
                <p className="summary-col-value">{totalAdded}</p>
                <p className="summary-col-sub">prayers</p>
              </div>
            </div>
            <div className="summary-divider" />
            <div className="summary-col">
              <div className="summary-col-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4a90d9" strokeWidth="2" strokeLinecap="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                  <line x1="8" y1="14" x2="10" y2="14" /><line x1="14" y1="14" x2="16" y2="14" />
                </svg>
              </div>
              <div>
                <p className="summary-col-label">After Update</p>
                <p className="summary-col-value large">{afterUpdate.toLocaleString()}</p>
                <p className="summary-col-sub">remaining</p>
              </div>
            </div>
          </div>

          {/* ── Save Button ── */}
          <button className="save-btn" disabled={totalAdded === 0}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
              <circle cx="12" cy="12" r="9" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
            Save Changes
          </button>

        </div>
      </IonContent>
    </IonPage>
  );
}