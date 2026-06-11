package com.qadatracker.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

import org.json.JSONArray;
import org.json.JSONObject;

import android.content.SharedPreferences;

public class BootReceiver extends BroadcastReceiver {

    private static final String PREFS_NAME = "qada_alarms_prefs";
    private static final String ALARMS_KEY = "qada_alarms";

    @Override
    public void onReceive(Context context, Intent intent) {
        if (!Intent.ACTION_BOOT_COMPLETED.equals(intent.getAction())) return;


        // Read alarms from SharedPreferences (written by AlarmStorageBridge)
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        String alarmsJson = prefs.getString(ALARMS_KEY, "[]");

        try {
            JSONArray alarms = new JSONArray(alarmsJson);

            for (int i = 0; i < alarms.length(); i++) {
                JSONObject alarm = alarms.getJSONObject(i);

                boolean enabled = alarm.optBoolean("enabled", false);
                if (!enabled) continue;

                int id = alarm.getInt("id");
                String prayer = alarm.getString("prayer");
                long timeMillis = alarm.getLong("timestamp");

                // scheduleAlarm already handles past times → push to tomorrow
                AlarmScheduler.scheduleAlarm(context, timeMillis, prayer, id);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}