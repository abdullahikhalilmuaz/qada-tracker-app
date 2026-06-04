import { PrayerCounts } from "./storage";

export const getTotalRemaining = (
  prayers: PrayerCounts
) => {

  return (
    prayers.fajr +
    prayers.zuhr +
    prayers.asr +
    prayers.maghrib +
    prayers.isha
  );
};

export const getTotalPrayers = (
  prayers: PrayerCounts,
  completed: number
) => {

  return getTotalRemaining(prayers) + completed;
};

export const getCompletionPercent = (
  prayers: PrayerCounts,
  completed: number
) => {

  const total =
    getTotalPrayers(prayers, completed);

  return Math.round(
    (completed / total) * 100
  );
};