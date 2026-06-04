export interface PrayerCounts {
  fajr: number;
  zuhr: number;
  asr: number;
  maghrib: number;
  isha: number;
}

export interface AppData {
  prayers: PrayerCounts;

  todayGoal: number;

  completedToday: number;

  completedTotal: number;
}

const KEY = "qada_app_data";

export const defaultData: AppData = {
  prayers: {
    fajr: 1899,
    zuhr: 1899,
    asr: 1899,
    maghrib: 1899,
    isha: 1899,
  },

  todayGoal: 10,

  completedToday: 0,

  completedTotal: 0,
};

export const loadData = (): AppData => {
  const raw = localStorage.getItem(KEY);

  if (!raw) return defaultData;

  return JSON.parse(raw);
};

export const saveData = (data: AppData) => {
  localStorage.setItem(KEY, JSON.stringify(data));
};