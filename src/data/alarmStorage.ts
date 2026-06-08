export interface Alarm {
  id: number;
  prayer: string;
  time: string;
  repeat: string;
  enabled: boolean;
  timestamp?: number;
}

const KEY = "qada_alarms";

export const loadAlarms = (): Alarm[] => {
  const raw = localStorage.getItem(KEY);

  if (!raw) return [];

  return JSON.parse(raw);
};

export const saveAlarms = (alarms: Alarm[]) => {
  localStorage.setItem(KEY, JSON.stringify(alarms));
};
