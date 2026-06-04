export interface PrayerStats {
  fajr: number;
  zuhr: number;
  asr: number;
  maghrib: number;
  isha: number;
}

export interface QadaData {
  remaining: PrayerStats;
  completed: PrayerStats;

  dailyGoal: number;

  alarms: string[];

  history: {
    prayer: string;
    date: string;
  }[];
}
