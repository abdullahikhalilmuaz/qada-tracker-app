package com.qadatracker.app;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;

public class AlarmScheduler {

    /**
     * Schedule a single exact alarm.
     * If timeInMillis is in the past, automatically schedules for +24h.
     */
    public static void scheduleAlarm(Context context, long timeInMillis, String prayer, int id) {

        // If the time has already passed today, push to tomorrow
        if (timeInMillis <= System.currentTimeMillis()) {
            timeInMillis += 24 * 60 * 60 * 1000L;
        }

        AlarmManager alarmManager =
                (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);

        Intent intent = new Intent(context, AlarmReceiver.class);
        intent.putExtra("prayer", prayer);
        intent.putExtra("alarmId", id);

        PendingIntent pendingIntent = PendingIntent.getBroadcast(
                context,
                id,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        alarmManager.setExactAndAllowWhileIdle(
                AlarmManager.RTC_WAKEUP,
                timeInMillis,
                pendingIntent
        );
    }

    /**
     * Cancel a scheduled alarm by id.
     */
    public static void cancelAlarm(Context context, int id) {
        AlarmManager alarmManager =
                (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);

        Intent intent = new Intent(context, AlarmReceiver.class);

        PendingIntent pendingIntent = PendingIntent.getBroadcast(
                context,
                id,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        alarmManager.cancel(pendingIntent);
    }
}