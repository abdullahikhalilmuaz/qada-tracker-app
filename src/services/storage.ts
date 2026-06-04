import { Preferences } from '@capacitor/preferences';

export async function saveData(key: string, value: any) {
  await Preferences.set({
    key,
    value: JSON.stringify(value),
  });
}

export async function loadData(key: string) {
  const { value } = await Preferences.get({ key });

  return value ? JSON.parse(value) : null;
}