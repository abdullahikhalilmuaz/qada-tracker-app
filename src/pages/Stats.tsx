import { IonContent, IonPage } from "@ionic/react";
import { useEffect, useRef, useState } from "react";
import "../styles/stats.css";

// ── Prayer Icons ──────────────────────────────────────────────────────────────
const PrayerIcon = ({ name }: { name: string }) => {
  const icons: Record<string, JSX.Element> = {
    Fajr: (
      <svg width="20" height="20" viewBox="0 0 26 26" fill="none">
        <path
          d="M8 14 A5 5 0 0 1 18 14"
          stroke="#7eb3f5"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <line
          x1="13"
          y1="5"
          x2="13"
          y2="7.5"
          stroke="#7eb3f5"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <line
          x1="6"
          y1="17"
          x2="20"
          y2="17"
          stroke="#7eb3f5"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <line
          x1="4.5"
          y1="20"
          x2="21.5"
          y2="20"
          stroke="#7eb3f5"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.45"
        />
      </svg>
    ),
    Zuhr: (
      <svg width="20" height="20" viewBox="0 0 26 26" fill="none">
        <circle cx="13" cy="13" r="4.5" stroke="#f5c842" strokeWidth="1.8" />
        <line
          x1="13"
          y1="4"
          x2="13"
          y2="6.5"
          stroke="#f5c842"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <line
          x1="13"
          y1="19.5"
          x2="13"
          y2="22"
          stroke="#f5c842"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <line
          x1="4"
          y1="13"
          x2="6.5"
          y2="13"
          stroke="#f5c842"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <line
          x1="19.5"
          y1="13"
          x2="22"
          y2="13"
          stroke="#f5c842"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <line
          x1="6.8"
          y1="6.8"
          x2="8.5"
          y2="8.5"
          stroke="#f5c842"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <line
          x1="17.5"
          y1="17.5"
          x2="19.2"
          y2="19.2"
          stroke="#f5c842"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <line
          x1="19.2"
          y1="6.8"
          x2="17.5"
          y2="8.5"
          stroke="#f5c842"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <line
          x1="8.5"
          y1="17.5"
          x2="6.8"
          y2="19.2"
          stroke="#f5c842"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
    Asr: (
      <svg width="20" height="20" viewBox="0 0 26 26" fill="none">
        <path
          d="M8 14 A5 5 0 1 1 18 14"
          stroke="#f5a623"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <line
          x1="13"
          y1="5"
          x2="13"
          y2="7.5"
          stroke="#f5a623"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <line
          x1="19.5"
          y1="7.5"
          x2="17.8"
          y2="9.2"
          stroke="#f5a623"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <line
          x1="6.5"
          y1="7.5"
          x2="8.2"
          y2="9.2"
          stroke="#f5a623"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <line
          x1="7"
          y1="17"
          x2="19"
          y2="17"
          stroke="#f5a623"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
    Maghrib: (
      <svg width="20" height="20" viewBox="0 0 26 26" fill="none">
        <path
          d="M8 14 A5 5 0 1 1 18 14"
          stroke="#f06292"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <line
          x1="7"
          y1="17"
          x2="19"
          y2="17"
          stroke="#f06292"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <line
          x1="5"
          y1="20"
          x2="21"
          y2="20"
          stroke="#f06292"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.45"
        />
      </svg>
    ),
    Isha: (
      <svg width="20" height="20" viewBox="0 0 26 26" fill="none">
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

const PRAYER_STATS = [
  { name: "Fajr", pct: 3, done: 68, total: 1899, color: "#4a90d9" },
  { name: "Zuhr", pct: 6, done: 121, total: 1899, color: "#f5c842" },
  { name: "Asr", pct: 7, done: 133, total: 1899, color: "#f5a623" },
  { name: "Maghrib", pct: 4, done: 80, total: 1899, color: "#f06292" },
  { name: "Isha", pct: 4, done: 101, total: 1899, color: "#9b8fe8" },
];

const CHART_POINTS = [
  { label: "May 7", val: 0 },
  { label: "May 14", val: 0.3 },
  { label: "May 21", val: 0.8 },
  { label: "May 28", val: 1.5 },
  { label: "Jun 4", val: 2.8 },
  { label: "Jun 11", val: 5 },
];
const MAX_VAL = 100;

function LineChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let start: number | null = null;
    const duration = 1200;
    const animate = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setProgress(p);
      if (p < 1) animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    const padL = 38,
      padR = 16,
      padT = 16,
      padB = 30;
    const chartW = W - padL - padR;
    const chartH = H - padT - padB;
    const yLabels = [100, 75, 50, 25, 0];

    ctx.clearRect(0, 0, W, H);

    yLabels.forEach((y) => {
      const yPos = padT + chartH * (1 - y / MAX_VAL);
      ctx.beginPath();
      ctx.moveTo(padL, yPos);
      ctx.lineTo(W - padR, yPos);
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = "#4a5a6e";
      ctx.font = "10px -apple-system, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(`${y}%`, padL - 6, yPos + 3.5);
    });

    const n = CHART_POINTS.length;
    CHART_POINTS.forEach((pt, i) => {
      const x = padL + (i / (n - 1)) * chartW;
      ctx.fillStyle = "#4a5a6e";
      ctx.font = "10px -apple-system, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(pt.label, x, H - 6);
    });

    const totalSegs = n - 1;
    const drawnSegs = progress * totalSegs;
    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i <= Math.floor(drawnSegs) && i < n; i++) {
      pts.push({
        x: padL + (i / (n - 1)) * chartW,
        y: padT + chartH * (1 - CHART_POINTS[i].val / MAX_VAL),
      });
    }

    const segFrac = drawnSegs % 1;
    if (segFrac > 0 && pts.length < n) {
      const i = pts.length - 1;
      const nx = padL + ((i + 1) / (n - 1)) * chartW;
      const ny = padT + chartH * (1 - CHART_POINTS[i + 1].val / MAX_VAL);
      pts.push({
        x: pts[i].x + (nx - pts[i].x) * segFrac,
        y: pts[i].y + (ny - pts[i].y) * segFrac,
      });
    }

    if (pts.length < 2) return;

    const grad = ctx.createLinearGradient(0, padT, 0, padT + chartH);
    grad.addColorStop(0, "rgba(74,144,217,0.25)");
    grad.addColorStop(1, "rgba(74,144,217,0)");
    ctx.beginPath();
    ctx.moveTo(pts[0].x, padT + chartH);
    pts.forEach((p) => ctx.lineTo(p.x, p.y));
    ctx.lineTo(pts[pts.length - 1].x, padT + chartH);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    pts.forEach((p, i) =>
      i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y),
    );
    ctx.strokeStyle = "#4a90d9";
    ctx.lineWidth = 2.2;
    ctx.lineJoin = "round";
    ctx.stroke();

    const last = pts[pts.length - 1];
    ctx.beginPath();
    ctx.arc(last.x, last.y, 6, 0, Math.PI * 2);
    ctx.fillStyle = "#4a90d9";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(last.x, last.y, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    if (progress > 0.9) {
      const boxW = 36,
        boxH = 22,
        boxR = 6;
      const bx = last.x - boxW / 2;
      const by = last.y - boxH - 10;
      ctx.beginPath();
      ctx.roundRect(bx, by, boxW, boxH, boxR);
      ctx.fillStyle = "#1a2e4a";
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 11px -apple-system, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("5%", last.x, by + 14.5);
    }
  }, [progress]);

  return (
    <canvas
      ref={canvasRef}
      className="line-chart-canvas"
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}

export default function Stats() {
  return (
    <IonPage>
      <IonContent fullscreen className="stats-content">
        <div className="stats-wrapper">
          <div className="stats-header">
            <div>
              <h1 className="stats-title">Statistics</h1>
              <p className="stats-subtitle">
                Track your progress and stay motivated.
              </p>
            </div>
            <button className="period-btn">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4a90d9"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              This Week
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4a90d9"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </div>

          <div className="stat-grid">
            <div className="stat-tile">
              <div
                className="stat-tile-icon"
                style={{ background: "rgba(74,144,217,0.15)" }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#4a90d9"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <circle cx="12" cy="12" r="9" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
              </div>
              <p className="stat-tile-label">Completed</p>
              <p className="stat-tile-value blue">503</p>
              <p className="stat-tile-sub">prayers</p>
            </div>
            <div className="stat-tile">
              <div
                className="stat-tile-icon"
                style={{ background: "rgba(245,166,35,0.15)" }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#f5a623"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <circle cx="12" cy="12" r="9" />
                  <polyline points="12 7 12 12 15 15" />
                </svg>
              </div>
              <p className="stat-tile-label">Remaining</p>
              <p className="stat-tile-value orange">9,497</p>
              <p className="stat-tile-sub">prayers</p>
            </div>
            <div className="stat-tile">
              <div
                className="stat-tile-icon"
                style={{ background: "rgba(80,220,160,0.15)" }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#50dca0"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
              </div>
              <p className="stat-tile-label">Completion</p>
              <p className="stat-tile-value green">5%</p>
              <p className="stat-tile-sub">overall</p>
            </div>
            <div className="stat-tile">
              <div
                className="stat-tile-icon"
                style={{ background: "rgba(155,143,232,0.15)" }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#9b8fe8"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M8.5 14.5s1 1.5 3.5 1.5 3.5-1.5 3.5-1.5" />
                  <path d="M15 9h.01M9 9h.01" />
                  <circle cx="12" cy="12" r="9" />
                </svg>
              </div>
              <p className="stat-tile-label">Longest Streak</p>
              <p className="stat-tile-value purple">7</p>
              <p className="stat-tile-sub">days</p>
            </div>
          </div>

          <div className="card chart-card">
            <div className="chart-card-header">
              <span className="chart-card-title">Overall Progress</span>
              <span className="chart-card-badge">5% Completed</span>
            </div>
            <div className="chart-area">
              <LineChart />
            </div>
            <div className="chart-dots">
              <span className="chart-dot active" />
              <span className="chart-dot" />
              <span className="chart-dot" />
            </div>
          </div>

          <div className="card prayer-stats-card">
            <div className="prayer-stats-header">
              <span className="prayer-stats-title">By Prayer</span>
              <button className="view-details-btn">
                View Details
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#4a90d9"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
            <div className="prayer-bars">
              {PRAYER_STATS.map((p) => (
                <div className="prayer-bar-row" key={p.name}>
                  <div className="prayer-bar-icon">
                    <PrayerIcon name={p.name} />
                  </div>
                  <span className="prayer-bar-name">{p.name}</span>
                  <div className="prayer-bar-track">
                    <div
                      className="prayer-bar-fill"
                      style={{ width: `${p.pct * 14}%`, background: p.color }}
                    />
                  </div>
                  <span className="prayer-bar-pct" style={{ color: p.color }}>
                    {p.pct}%
                  </span>
                  <span className="prayer-bar-counts">
                    {p.done} / {p.total.toLocaleString()}
                  </span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#2a3a4e"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              ))}
            </div>
          </div>

          <div className="bottom-tiles">
            <div className="bottom-tile">
              <p className="bottom-tile-label">Daily Average</p>
              <div
                className="bottom-tile-icon-wrap"
                style={{ background: "rgba(80,220,160,0.12)" }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#50dca0"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
              </div>
              <p className="bottom-tile-value green">7.2</p>
              <p className="bottom-tile-sub">prayers / day</p>
              <p className="bottom-tile-note">↑ 1.4 from last week</p>
            </div>
            <div className="bottom-tile">
              <p className="bottom-tile-label">Most Active Day</p>
              <div
                className="bottom-tile-icon-wrap"
                style={{ background: "rgba(155,143,232,0.12)" }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#9b8fe8"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <p className="bottom-tile-value purple">Saturday</p>
              <p className="bottom-tile-sub">28 prayers</p>
              <p className="bottom-tile-note">Your best day!</p>
            </div>
            <div className="bottom-tile">
              <p className="bottom-tile-label">Total Time</p>
              <div
                className="bottom-tile-icon-wrap"
                style={{ background: "rgba(74,144,217,0.12)" }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#4a90d9"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <circle cx="12" cy="12" r="9" />
                  <polyline points="12 7 12 12 15 15" />
                </svg>
              </div>
              <p className="bottom-tile-value blue" style={{ fontSize: 17 }}>
                15 h 32 m
              </p>
              <p className="bottom-tile-sub">spent praying</p>
              <p className="bottom-tile-note">Qada prayers only</p>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
