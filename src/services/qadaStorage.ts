import { Preferences } from "@capacitor/preferences";

const KEY = "qada_data";

export async function getQadaData() {
  const { value } = await Preferences.get({ key: KEY });

  if (!value) {
    return null;
  }

  return JSON.parse(value);
}

export async function saveQadaData(data: any) {
  await Preferences.set({
    key: KEY,
    value: JSON.stringify(data),
  });
}