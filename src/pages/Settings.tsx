import { useState, useRef } from "react";
import { IonContent, IonPage } from "@ionic/react";
import "../styles/setting.css";

// ── Reusable Bottom Sheet ─────────────────────────────────────────────────────
function BottomSheet({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const startY = useRef(0);
  const deltaY = useRef(0);

  const onTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    deltaY.current = 0;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    deltaY.current = e.touches[0].clientY - startY.current;
  };
  const onTouchEnd = () => {
    if (deltaY.current > 80) onClose();
  };

  return (
    <>
      {open && <div className="sheet-overlay" onClick={onClose} />}
      <div className={`bottom-sheet ${open ? "bottom-sheet-open" : ""}`}>
        <div
          className="sheet-handle-bar"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="sheet-handle" />
        </div>
        {children}
      </div>
    </>
  );
}

// ── Toggle ────────────────────────────────────────────────────────────────────
const Toggle = ({ on, onChange }: { on: boolean; onChange: () => void }) => (
  <button
    className={`s-toggle ${on ? "s-toggle-on" : "s-toggle-off"}`}
    onClick={onChange}
  >
    <span className="s-toggle-knob" />
  </button>
);

// ── Section Label ─────────────────────────────────────────────────────────────
const SectionLabel = ({ title }: { title: string }) => (
  <p className="settings-section-label">{title}</p>
);

// ── Row Components ────────────────────────────────────────────────────────────
const RowChevron = ({
  icon,
  iconBg,
  title,
  sub,
  titleColor,
  onClick,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  sub: string;
  titleColor?: string;
  onClick?: () => void;
}) => (
  <div
    className="settings-row"
    onClick={onClick}
    style={{ cursor: onClick ? "pointer" : undefined }}
  >
    <div className="settings-row-icon" style={{ background: iconBg }}>
      {icon}
    </div>
    <div className="settings-row-text">
      <span
        className="settings-row-title"
        style={{ color: titleColor ?? "#ffffff" }}
      >
        {title}
      </span>
      <span className="settings-row-sub">{sub}</span>
    </div>
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#2a3a4e"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  </div>
);

const RowToggle = ({
  icon,
  iconBg,
  title,
  sub,
  on,
  onChange,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  sub: string;
  on: boolean;
  onChange: () => void;
}) => (
  <div className="settings-row">
    <div className="settings-row-icon" style={{ background: iconBg }}>
      {icon}
    </div>
    <div className="settings-row-text">
      <span className="settings-row-title">{title}</span>
      <span className="settings-row-sub">{sub}</span>
    </div>
    <Toggle on={on} onChange={onChange} />
  </div>
);

const RowValue = ({
  icon,
  iconBg,
  title,
  sub,
  value,
  onClick,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  sub: string;
  value: string;
  onClick?: () => void;
}) => (
  <div
    className="settings-row"
    onClick={onClick}
    style={{ cursor: onClick ? "pointer" : undefined }}
  >
    <div className="settings-row-icon" style={{ background: iconBg }}>
      {icon}
    </div>
    <div className="settings-row-text">
      <span className="settings-row-title">{title}</span>
      <span className="settings-row-sub">{sub}</span>
    </div>
    <span className="settings-row-value">{value}</span>
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#2a3a4e"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  </div>
);

const Divider = () => <div className="settings-row-divider" />;

// ── SOUND OPTIONS ─────────────────────────────────────────────────────────────
const SOUND_OPTIONS = [
  "Default",
  "Adhan Soft",
  "Bell",
  "Reminder",
  "Digital",
  "Custom (Upload)",
];

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function Settings() {
  const [yearsMissed, setYearsMissed] = useState(8);
  const [wakeScreen, setWakeScreen] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [dnd, setDnd] = useState(false);
  const [alarmSound, setAlarmSound] = useState("Default");
  const [volume, setVolume] = useState(75);

  // Sheet visibility
  const [sheet, setSheet] = useState<string | null>(null);
  const openSheet = (s: string) => setSheet(s);
  const closeSheet = () => setSheet(null);

  // Recalc sheet local state
  const [recalcYears, setRecalcYears] = useState(8);

  return (
    <IonPage>
      <IonContent fullscreen className="settings-content">
        <div className="settings-wrapper">
          {/* ── Header ── */}
          <div className="settings-header">
            <h1 className="settings-title">Settings</h1>
            <p className="settings-subtitle">Customize your Qada journey.</p>
          </div>

          {/* ══ Qada Overview ══ */}
          <SectionLabel title="Qada Overview" />
          <div className="settings-card">
            <div className="qada-overview-row">
              <div className="qada-overview-icon">
                <svg
                  width="26"
                  height="26"
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
                  <line x1="8" y1="14" x2="10" y2="14" />
                  <line x1="14" y1="14" x2="16" y2="14" />
                  <line x1="8" y1="18" x2="10" y2="18" />
                </svg>
              </div>
              <div className="qada-overview-info">
                <p className="qada-overview-label">Total Remaining</p>
                <p className="qada-overview-number">9,497</p>
                <p className="qada-overview-sub">prayers</p>
              </div>
              <div className="qada-overview-right">
                <button
                  className="recalc-btn"
                  onClick={() => openSheet("recalc")}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#4a90d9"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="23 4 23 10 17 10" />
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                  </svg>
                  Recalculate
                </button>
                <p className="qada-last-calc">Last calculated</p>
                <p className="qada-last-calc">Jun 11, 2024</p>
              </div>
            </div>
          </div>

          {/* ══ Calculation ══ */}
          <SectionLabel title="Calculation" />
          <div className="settings-card">
            <div className="settings-row no-border">
              <div
                className="settings-row-icon"
                style={{ background: "rgba(74,144,217,0.15)" }}
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
                  <path d="M12 22V8" />
                  <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
                  <path d="M12 2v2" />
                  <path d="M5.2 5.2l1.4 1.4" />
                  <path d="M17.4 6.6l1.4-1.4" />
                </svg>
              </div>
              <div className="settings-row-text">
                <span className="settings-row-title">Years Missed</span>
                <span className="settings-row-sub">
                  {"Set how many years of prayers\nyou want to make up."}
                </span>
              </div>
              <div className="years-counter">
                <button
                  className="years-btn"
                  onClick={() => setYearsMissed((v) => Math.max(0, v - 1))}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#4a90d9"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
                <span className="years-value">{yearsMissed}</span>
                <button
                  className="years-btn"
                  onClick={() => setYearsMissed((v) => v + 1)}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#4a90d9"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
              </div>
            </div>
            <Divider />
            <RowValue
              icon={
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#50c888"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <rect x="4" y="2" width="16" height="20" rx="2" />
                  <line x1="8" y1="6" x2="16" y2="6" />
                  <line x1="8" y1="10" x2="16" y2="10" />
                  <line x1="8" y1="14" x2="12" y2="14" />
                </svg>
              }
              iconBg="rgba(80,180,120,0.15)"
              title="Calculation Method"
              sub={"Method used to calculate\nyour Qada prayers."}
              value="5 Prayers / Day"
            />
          </div>

          {/* ══ Alarms & Notifications ══ */}
          <SectionLabel title="Alarms & Notifications" />
          <div className="settings-card">
            <RowChevron
              icon={
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#9b8fe8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              }
              iconBg="rgba(155,143,232,0.15)"
              title="Alarm Sound"
              sub={alarmSound}
              onClick={() => openSheet("sound")}
            />
            <Divider />
            <RowChevron
              icon={
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#f5a623"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              }
              iconBg="rgba(245,166,35,0.15)"
              title="Alarm Volume"
              sub={`${volume}%`}
              onClick={() => openSheet("volume")}
            />
            <Divider />
            <RowToggle
              icon={
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#4a90d9"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <rect x="5" y="2" width="14" height="20" rx="2" />
                  <line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>
              }
              iconBg="rgba(74,144,217,0.15)"
              title="Wake Screen"
              sub="Turn on screen when alarm goes off"
              on={wakeScreen}
              onChange={() => setWakeScreen((v) => !v)}
            />
            <Divider />
            <RowToggle
              icon={
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#f5623a"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <rect x="2" y="6" width="20" height="12" rx="2" />
                  <path d="M12 12h.01" />
                  <path d="M17 12h.01" />
                  <path d="M7 12h.01" />
                </svg>
              }
              iconBg="rgba(245,98,58,0.15)"
              title="Vibration"
              sub="Vibrate when alarm goes off"
              on={vibration}
              onChange={() => setVibration((v) => !v)}
            />
            <Divider />
            <RowToggle
              icon={
                <svg width="22" height="22" viewBox="0 0 26 26" fill="none">
                  <path
                    d="M17 14 A6 6 0 1 1 11 8 A4.5 4.5 0 0 0 17 14 Z"
                    stroke="#9b8fe8"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              }
              iconBg="rgba(155,143,232,0.15)"
              title="Do Not Disturb"
              sub="Silence other notifications during alarm"
              on={dnd}
              onChange={() => setDnd((v) => !v)}
            />
          </div>

          {/* ══ Data & Backup ══ */}
          <SectionLabel title="Data & Backup" />
          <div className="settings-card">
            <RowChevron
              icon={
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#50c888"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="16 16 12 12 8 16" />
                  <line x1="12" y1="12" x2="12" y2="21" />
                  <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                </svg>
              }
              iconBg="rgba(80,200,136,0.15)"
              title="Backup Data"
              sub="Export your data to a file"
              onClick={() => openSheet("backup")}
            />
            <Divider />
            <RowChevron
              icon={
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#4a90d9"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="8 16 12 20 16 16" />
                  <line x1="12" y1="20" x2="12" y2="11" />
                  <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                </svg>
              }
              iconBg="rgba(74,144,217,0.15)"
              title="Restore Data"
              sub="Import data from a backup file"
              onClick={() => openSheet("restore")}
            />
            <Divider />
            <RowChevron
              icon={
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#f06060"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6" />
                  <path d="M14 11v6" />
                  <path d="M9 6V4h6v2" />
                </svg>
              }
              iconBg="rgba(240,96,96,0.15)"
              title="Reset Data"
              sub="Clear all data and start over"
              titleColor="#f06060"
              onClick={() => openSheet("reset")}
            />
          </div>

          {/* ══ About ══ */}
          <SectionLabel title="About" />
          <div className="settings-card">
            <RowChevron
              icon={
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#7a8899"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <circle cx="12" cy="12" r="9" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              }
              iconBg="rgba(255,255,255,0.07)"
              title="About Qada Tracker"
              sub="Version 1.0.0"
              onClick={() => openSheet("about")}
            />
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════
            BOTTOM SHEETS
        ════════════════════════════════════════════════════════════ */}

        {/* ── Sheet 8: Recalculate Debt ── */}
        <BottomSheet open={sheet === "recalc"} onClose={closeSheet}>
          <div className="sheet-content">
            <h2 className="sheet-title">Recalculate Debt</h2>
            <div className="sheet-section-title">Years Missed</div>
            <div className="recalc-counter">
              <button
                className="recalc-counter-btn"
                onClick={() => setRecalcYears((v) => Math.max(0, v - 1))}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
              <span className="recalc-counter-value">{recalcYears}</span>
              <button
                className="recalc-counter-btn"
                onClick={() => setRecalcYears((v) => v + 1)}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
            </div>
            <div className="recalc-note">
              This will update your remaining qada calculation.
            </div>
            <button
              className="sheet-primary-btn green-btn"
              onClick={closeSheet}
            >
              Calculate
            </button>
            <button className="sheet-cancel-btn" onClick={closeSheet}>
              Cancel
            </button>
          </div>
        </BottomSheet>

        {/* ── Sheet 9: Alarm Sound ── */}
        <BottomSheet open={sheet === "sound"} onClose={closeSheet}>
          <div className="sheet-content">
            <h2 className="sheet-title">Alarm Sound</h2>
            <div className="sound-list">
              {SOUND_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  className={`sound-option ${
                    alarmSound === opt ? "sound-option-selected" : ""
                  }`}
                  onClick={() => {
                    setAlarmSound(opt);
                  }}
                >
                  <span>{opt}</span>
                  <div
                    className={`sound-radio ${
                      alarmSound === opt ? "sound-radio-on" : ""
                    }`}
                  >
                    {alarmSound === opt && <div className="sound-radio-dot" />}
                  </div>
                </button>
              ))}
            </div>
            <button className="sheet-cancel-btn" onClick={closeSheet}>
              Cancel
            </button>
          </div>
        </BottomSheet>

        {/* ── Sheet 10: Alarm Volume ── */}
        <BottomSheet open={sheet === "volume"} onClose={closeSheet}>
          <div className="sheet-content">
            <h2 className="sheet-title">Alarm Volume</h2>
            <div className="volume-icon-row">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4a90d9"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
            </div>
            <div className="volume-slider-wrap">
              <input
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="volume-slider"
              />
            </div>
            <p className="volume-pct">{volume}%</p>
            <button className="sheet-cancel-btn" onClick={closeSheet}>
              Cancel
            </button>
          </div>
        </BottomSheet>

        {/* ── Sheet 11: Backup Data ── */}
        <BottomSheet open={sheet === "backup"} onClose={closeSheet}>
          <div className="sheet-content sheet-content-center">
            <div className="data-sheet-icon green-icon">
              <svg
                width="38"
                height="38"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#50c888"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="16 16 12 12 8 16" />
                <line x1="12" y1="12" x2="12" y2="21" />
                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
              </svg>
            </div>
            <h2 className="sheet-title">Backup Data</h2>
            <p className="sheet-desc">
              Export your data to a file{"\n"}(JSON format).
            </p>
            <button
              className="sheet-primary-btn green-btn"
              onClick={closeSheet}
            >
              Export Backup
            </button>
          </div>
        </BottomSheet>

        {/* ── Sheet 12: Restore Data ── */}
        <BottomSheet open={sheet === "restore"} onClose={closeSheet}>
          <div className="sheet-content sheet-content-center">
            <div className="data-sheet-icon blue-icon">
              <svg
                width="38"
                height="38"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4a90d9"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="8 16 12 20 16 16" />
                <line x1="12" y1="20" x2="12" y2="11" />
                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
              </svg>
            </div>
            <h2 className="sheet-title">Restore Data</h2>
            <p className="sheet-desc">
              Select a backup file to{"\n"}restore your data.
            </p>
            <button
              className="sheet-primary-btn green-btn"
              onClick={closeSheet}
            >
              Select File
            </button>
          </div>
        </BottomSheet>

        {/* ── Sheet 13: Reset Confirmation ── */}
        <BottomSheet open={sheet === "reset"} onClose={closeSheet}>
          <div className="sheet-content sheet-content-center">
            <div className="data-sheet-icon red-icon">
              <svg
                width="42"
                height="42"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#f06060"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h2 className="sheet-title red-title">Reset All Data?</h2>
            <p className="sheet-desc">
              This will permanently delete{"\n"}all your data.{"\n"}This action
              cannot be undone.
            </p>
            <div className="reset-actions">
              <button
                className="sheet-cancel-btn reset-cancel"
                onClick={closeSheet}
              >
                Cancel
              </button>
              <button
                className="sheet-primary-btn red-btn"
                onClick={closeSheet}
              >
                Delete Everything
              </button>
            </div>
          </div>
        </BottomSheet>

        {/* ── Sheet 14: About ── */}
        <BottomSheet open={sheet === "about"} onClose={closeSheet}>
          <div className="sheet-content">
            <div className="about-app-icon">
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#50c888"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <circle cx="12" cy="12" r="3" fill="#50c888" stroke="none" />
              </svg>
            </div>
            <h2 className="sheet-title">Qada Tracker</h2>
            <p className="about-version">Version 1.0.0</p>
            <div className="about-list">
              {[
                "About Qada Tracker",
                "Privacy Policy",
                "Open Source Libraries",
              ].map((item) => (
                <div key={item} className="about-list-row">
                  <span>{item}</span>
                  <svg
                    width="14"
                    height="14"
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
            <button className="sheet-cancel-btn" onClick={closeSheet}>
              Close
            </button>
          </div>
        </BottomSheet>
      </IonContent>
    </IonPage>
  );
}
