import { useState, useEffect } from "react";
import { IonContent, IonIcon, IonPage } from "@ionic/react";
import "../styles/home.css";
import { sunnyOutline, partlySunnyOutline, moonOutline } from "ionicons/icons";

import { loadData, AppData } from "../data/storage";

import {
  getTotalRemaining,
  // getTotalPrayers,
  getCompletionPercent,
} from "../data/prayerCalculator";

// SVG ring helper
const Ring = ({
  percent,
  size = 90,
  stroke = 7,
  color = "#4a90d9",
  bg = "#1a2540",
  children,
}: {
  percent: number;
  size?: number;
  stroke?: number;
  color?: string;
  bg?: string;
  children?: React.ReactNode;
}) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <div className="ring-wrapper" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={bg}
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="ring-center">{children}</div>
    </div>
  );
};

export default function Home() {
  const [data, setData] = useState<AppData | null>(null);

  useEffect(() => {
    const stored = loadData();

    setData(stored);
  }, []);

  if (!data) {
    return (
      <IonPage>
        <IonContent>Loading...</IonContent>
      </IonPage>
    );
  }

  const totalRemaining = getTotalRemaining(data.prayers);

  // const totalPrayers = getTotalPrayers(data.prayers, data.completedTotal);

  const completedPercent = getCompletionPercent(
    data.prayers,
    data.completedTotal,
  );

  const todayGoal = data.todayGoal;

  const todayDone = data.completedToday;

  const todayPercent = Math.round((todayDone / todayGoal) * 100);

  const prayers = [
    {
      name: "Fajr",
      icon: sunnyOutline,
      tint: "#4a90d9",
      remaining: data.prayers.fajr,
    },

    {
      name: "Zuhr",
      icon: sunnyOutline,
      tint: "#f5c842",
      remaining: data.prayers.zuhr,
    },

    {
      name: "Asr",
      icon: partlySunnyOutline,
      tint: "#f5a623",
      remaining: data.prayers.asr,
    },

    {
      name: "Maghrib",
      icon: partlySunnyOutline,
      tint: "#f06292",
      remaining: data.prayers.maghrib,
    },

    {
      name: "Isha",
      icon: moonOutline,
      tint: "#9b8fe8",
      remaining: data.prayers.isha,
    },
  ];
  return (
    <IonPage>
      <IonContent fullscreen className="home-content">
        <div className="home-wrapper">
          {/* ── Header ── */}
          <div className="home-header">
            <div>
              <h1 className="greeting">Assalamu Alaikum 👋</h1>
              <p className="sub-greeting">
                Stay consistent. Every prayer counts.
              </p>
            </div>
            <div className="notif-bell">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="notif-dot" />
            </div>
          </div>

          {/* ── Total Remaining Card ── */}
          <div className="card summary-card">
            <div className="summary-left">
              <p className="card-label">Total Remaining</p>
              <h2 className="summary-number">
                {totalRemaining.toLocaleString()}
              </h2>
              <p className="card-sublabel">prayers</p>
              <p className="encouragement">
                Keep going, you're doing great! 💙
              </p>
            </div>
            <Ring percent={completedPercent} size={96} stroke={8}>
              <span className="ring-pct">{completedPercent}%</span>
              <span className="ring-sub">Completed</span>
            </Ring>
          </div>

          {/* ── Remaining by Prayer ── */}
          <div className="section-header">
            <span className="section-title">Remaining by Prayer</span>
            <span className="view-all">View all &rsaquo;</span>
          </div>
          <div className="prayers-row">
            {prayers.map((p) => (
              <div className="prayer-card" key={p.name}>
                <IonIcon
                  icon={p.icon}
                  style={{ fontSize: 24, color: p.tint }}
                />
                <span className="prayer-name">{p.name}</span>
                <span className="prayer-count">{p.remaining}</span>
                <span className="prayer-sub">remaining</span>
              </div>
            ))}
          </div>

          {/* ── Next Qada Alarm ── */}
          <div className="card alarm-card">
            <div className="alarm-icon-wrap">
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4a90d9"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="9" />
                <polyline points="12 7 12 12 15 15" />
              </svg>
            </div>
            <div className="alarm-info">
              <p className="alarm-label">Next Qada Alarm</p>
              <p className="alarm-name">Fajr Qada</p>
              <p className="alarm-time">04:30 AM</p>
            </div>
            <div className="alarm-badge">In 7h 48m</div>
          </div>

          {/* ── Today's Goal ── */}
          <div className="card goal-card">
            <div className="goal-icon-wrap">
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4a90d9"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
              </svg>
            </div>
            <div className="goal-info">
              <p className="goal-label">Today's Goal</p>
              <p className="goal-count">{todayGoal}</p>
              <p className="goal-sub">prayers</p>
            </div>
            <Ring percent={todayPercent} size={72} stroke={6}>
              <span className="ring-pct small">
                {todayDone}/{todayGoal}
              </span>
            </Ring>
          </div>

          {/* ── Quick Actions ── */}
          <p className="section-title" style={{ marginTop: 8 }}>
            Quick Actions
          </p>
          <div className="quick-actions">
            <div className="qa-btn primary">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4a90d9"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Log Qada</span>
            </div>
            <div className="qa-btn">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6b7a90"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <circle cx="12" cy="12" r="9" />
                <polyline points="12 7 12 12 15 15" />
              </svg>
              <span>Set Alarm</span>
            </div>
            <div className="qa-btn">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6b7a90"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
              <span>View Stats</span>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
