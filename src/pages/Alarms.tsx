import { useState, useEffect } from "react";
import { IonContent, IonPage } from "@ionic/react";
import { loadAlarms, saveAlarms } from "../data/alarmStorage";
import "../styles/alarm.css";
import { registerPlugin } from "@capacitor/core";

interface AlarmPluginInterface {
  schedule(option: {
    id: number;
    timeMillis: number;
    prayer: string;
  }): Promise<void>;
}

const AlarmPlugin = registerPlugin<AlarmPluginInterface>("AlarmPlugin");
const formatTime = (h: number, m: number) => {
  const ampm = h >= 12 ? "PM" : "AM";
  const displayH = h % 12 === 0 ? 12 : h % 12;

  return `${String(displayH).padStart(2, "0")} : ${String(m).padStart(2, "0")} 
  ${ampm}`;
};

// ── Prayer Icons ──────────────────────────────────────────────────────────────
const PrayerIcon = ({ name, size = 26 }: { name: string; size?: number }) => {
  const s = size;
  const icons: Record<string, React.ReactNode> = {
    Fajr: (
      <svg width={s} height={s} viewBox="0 0 26 26" fill="none">
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
      <svg width={s} height={s} viewBox="0 0 26 26" fill="none">
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
      <svg width={s} height={s} viewBox="0 0 26 26" fill="none">
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
      <svg width={s} height={s} viewBox="0 0 26 26" fill="none">
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
      <svg width={s} height={s} viewBox="0 0 26 26" fill="none">
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

// ── Icon background tints ─────────────────────────────────────────────────────
const iconBg: Record<string, string> = {
  Fajr: "rgba(74,144,217,0.15)",
  Zuhr: "rgba(245,200,66,0.15)",
  Asr: "rgba(245,166,35,0.15)",
  Maghrib: "rgba(240,98,146,0.15)",
  Isha: "rgba(155,143,232,0.15)",
};

// ── Data ──────────────────────────────────────────────────────────────────────
const DEFAULT_ALARMS = [
  {
    id: 1,
    prayer: "Fajr",
    time: "04:30 AM",
    repeat: "Every day",
    enabled: true,
  },
  {
    id: 2,
    prayer: "Zuhr",
    time: "01:00 PM",
    repeat: "Every day",
    enabled: true,
  },
  {
    id: 3,
    prayer: "Asr",
    time: "04:45 PM",
    repeat: "Every day",
    enabled: true,
  },
  {
    id: 4,
    prayer: "Maghrib",
    time: "07:15 PM",
    repeat: "Every day",
    enabled: false,
  },
  {
    id: 5,
    prayer: "Isha",
    time: "09:00 PM",
    repeat: "Every day",
    enabled: true,
  },
];

const PRAYERS = ["Fajr", "Zuhr", "Asr", "Maghrib", "Isha"];

// ── Toggle component ──────────────────────────────────────────────────────────
const Toggle = ({ on, onChange }: { on: boolean; onChange: () => void }) => (
  <button
    className={`toggle ${on ? "toggle-on" : "toggle-off"}`}
    onClick={onChange}
    aria-label="Toggle alarm"
  >
    <span className="toggle-knob" />
  </button>
);

// ── Alarm Alert component ─────────────────────────────────────────────────────
const AlarmAlert = ({
  prayer,
  time,
  onDismiss,
}: {
  prayer: string;
  time: string;
  onDismiss: () => void;
}) => (
  <div className="alarm-alert-overlay">
    <div className="alarm-alert-card">
      <div className="alarm-alert-icon" style={{ background: iconBg[prayer] }}>
        <PrayerIcon name={prayer} size={40} />
      </div>
      <p className="alarm-alert-label">Time for Qada</p>
      <p className="alarm-alert-prayer">{prayer} Qada</p>
      <p className="alarm-alert-time">{time}</p>
      <button className="alarm-alert-dismiss" onClick={onDismiss}>
        Dismiss
      </button>
    </div>
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────
export default function Alarms() {
  const [alarms, setAlarms] = useState(() => {
    const saved = loadAlarms();
    return saved.length ? saved : DEFAULT_ALARMS;
  });
  const [sheetOpen, setSheetOpen] = useState(false);
  const [newPrayer, setNewPrayer] = useState("Fajr");
  const [newTime, setNewTime] = useState("04:30");
  const [newRepeat, setNewRepeat] = useState("Every day");
  const [lastTriggered, setLastTriggered] = useState<number | null>(null);

  // ── NEW: fired alarm state ────────────────────────────────────────────────
  const [firedAlarm, setFiredAlarm] = useState<{
    prayer: string;
    time: string;
  } | null>(null);

  const nextAlarm = alarms.find((a) => a.enabled) ?? alarms[0];

  useEffect(() => {
    saveAlarms(alarms);
  }, [alarms]);

  const toggleAlarm = (id: number) =>
    setAlarms((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a)),
    );

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();

      const current = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      alarms.forEach((alarm) => {
        if (!alarm.enabled) return;

        if (alarm.time === current && lastTriggered !== alarm.id) {
          console.log("ALARM FIRED:", alarm.prayer, alarm.time);

          setFiredAlarm({
            prayer: alarm.prayer,
            time: alarm.time,
          });

          setLastTriggered(alarm.id);
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [alarms, lastTriggered]);

  const saveAlarm = async () => {
    const [h, m] = newTime.split(":").map(Number);

    const date = new Date();
    date.setHours(h, m, 0, 0);

    const id = Date.now();

    setAlarms((prev) => [
      ...prev,
      {
        id,
        prayer: newPrayer,
        time: formatTime(h, m),
        timestamp: date.getTime(),
        repeat: newRepeat,
        enabled: true,
      },
    ]);

    await AlarmPlugin.schedule({
      id,
      timeMillis: date.getTime(), // <-- send millis directly
      prayer: newPrayer,
    });

    setSheetOpen(false);
  };

  return (
    <IonPage>
      <IonContent fullscreen className="alarms-content">
        {/* ── Alarm Alert Overlay ── */}
        {firedAlarm && (
          <AlarmAlert
            prayer={firedAlarm.prayer}
            time={firedAlarm.time}
            onDismiss={() => setFiredAlarm(null)}
          />
        )}

        <div className="alarms-wrapper">
          {/* ── Header ── */}
          <div className="alarms-header">
            <div>
              <h1 className="alarms-title">Alarms</h1>
              <p className="alarms-subtitle">
                Stay on track. Never miss your Qada.
              </p>
            </div>
            <button
              className="add-alarm-btn"
              onClick={() => setSheetOpen(true)}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <circle cx="12" cy="12" r="9" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
              Add Alarm
            </button>
          </div>

          {/* ── Next Alarm Banner ── */}
          <div className="next-alarm-card">
            <div className="next-alarm-icon">
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4a90d9"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                <line x1="19" y1="4" x2="21" y2="2" />
                <line x1="5" y1="4" x2="3" y2="2" />
              </svg>
            </div>
            <div className="next-alarm-info">
              <p className="next-alarm-label">Next Alarm</p>
              <p className="next-alarm-name">{nextAlarm.prayer} Qada</p>
              <p className="next-alarm-time">{nextAlarm.time}</p>
            </div>
            <div className="next-alarm-right">
              <span className="next-alarm-badge">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#4a90d9"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <circle cx="12" cy="12" r="9" />
                  <polyline points="12 7 12 12 15 15" />
                </svg>
                In 7h 48m
              </span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#3a4a5e"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </div>

          {/* ── Your Alarms ── */}
          <div className="alarms-section-header">
            <span className="alarms-section-title">Your Alarms</span>
            <button className="edit-btn">Edit</button>
          </div>

          <div className="alarms-list">
            {alarms.map((alarm) => (
              <div
                className={`alarm-row ${
                  !alarm.enabled ? "alarm-row-disabled" : ""
                }`}
                key={alarm.id}
              >
                <div
                  className="alarm-row-icon"
                  style={{ background: iconBg[alarm.prayer] }}
                >
                  <PrayerIcon name={alarm.prayer} />
                </div>
                <div className="alarm-row-info">
                  <span className="alarm-row-name">{alarm.prayer} Qada</span>
                  <span
                    className={`alarm-row-time ${
                      !alarm.enabled ? "alarm-row-time-off" : ""
                    }`}
                  >
                    {alarm.time}
                  </span>
                  <span className="alarm-row-repeat">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#4a5a6e"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="17 1 21 5 17 9" />
                      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                      <polyline points="7 23 3 19 7 15" />
                      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                    </svg>
                    {alarm.repeat}
                  </span>
                </div>
                <div className="alarm-row-actions">
                  <Toggle
                    on={alarm.enabled}
                    onChange={() => toggleAlarm(alarm.id)}
                  />
                  <button className="more-btn">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#3a4a5e"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    >
                      <circle cx="12" cy="5" r="1" fill="#3a4a5e" />
                      <circle cx="12" cy="12" r="1" fill="#3a4a5e" />
                      <circle cx="12" cy="19" r="1" fill="#3a4a5e" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom Sheet Overlay ── */}
        {sheetOpen && (
          <div className="sheet-overlay" onClick={() => setSheetOpen(false)} />
        )}

        {/* ── Add Alarm Bottom Sheet ── */}
        <div
          className={`add-sheet ${sheetOpen ? "add-sheet-open" : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sheet-handle" />
          <div className="sheet-header">
            <div>
              <p className="sheet-title">Add New Alarm</p>
              <p className="sheet-subtitle">Choose prayer and time</p>
            </div>
            <button className="sheet-close" onClick={() => setSheetOpen(false)}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="sheet-fields">
            <div className="sheet-field">
              <PrayerIcon name={newPrayer} size={20} />
              <div className="sheet-field-content">
                <p className="sheet-field-label">Prayer</p>
                <div className="sheet-field-select-wrap">
                  <select
                    className="sheet-field-select"
                    value={newPrayer}
                    onChange={(e) => setNewPrayer(e.target.value)}
                  >
                    {PRAYERS.map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                  <svg
                    className="select-chevron"
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
                </div>
              </div>
            </div>

            <div className="sheet-field">
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
                <polyline points="12 7 12 12 15 15" />
              </svg>
              <div className="sheet-field-content">
                <p className="sheet-field-label">Time</p>
                <input
                  type="time"
                  className="sheet-time-input"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                />
              </div>
            </div>

            <div className="sheet-field">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4a90d9"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="17 1 21 5 17 9" />
                <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                <polyline points="7 23 3 19 7 15" />
                <path d="M21 13v2a4 4 0 0 1-4 4H3" />
              </svg>
              <div className="sheet-field-content">
                <p className="sheet-field-label">Repeat</p>
                <div className="sheet-field-select-wrap">
                  <select
                    className="sheet-field-select"
                    value={newRepeat}
                    onChange={(e) => setNewRepeat(e.target.value)}
                  >
                    <option>Every day</option>
                    <option>Weekdays</option>
                    <option>Weekends</option>
                    <option>Once</option>
                  </select>
                  <svg
                    className="select-chevron"
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
                </div>
              </div>
            </div>
          </div>

          <button className="save-alarm-btn" onClick={saveAlarm}>
            Save Alarm
          </button>
        </div>
      </IonContent>
    </IonPage>
  );
}
