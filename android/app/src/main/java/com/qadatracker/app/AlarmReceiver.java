package com.qadatracker.app;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;

public class AlarmReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
        String prayer = intent.getStringExtra("prayer");
        int alarmId  = intent.getIntExtra("alarmId", 0);

        // ── 1. Start AlarmService (plays sound, handles volume key) ──────────
        Intent serviceIntent = new Intent(context, AlarmService.class);
        serviceIntent.putExtra("prayer", prayer);
        serviceIntent.putExtra("alarmId", alarmId);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            context.startForegroundService(serviceIntent);
        } else {
            context.startService(serviceIntent);
        }

        // ── 2. Launch full-screen AlarmScreenActivity ─────────────────────────
        Intent fullScreenIntent = new Intent(context, AlarmScreenActivity.class);
        fullScreenIntent.putExtra("prayer", prayer);
        fullScreenIntent.putExtra("alarmId", alarmId);
        fullScreenIntent.addFlags(
                Intent.FLAG_ACTIVITY_NEW_TASK |
                Intent.FLAG_ACTIVITY_NO_USER_ACTION
        );

        PendingIntent fullScreenPendingIntent = PendingIntent.getActivity(
                context,
                alarmId,
                fullScreenIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        // ── 3. Post notification (required for full-screen intent on Android 10+)
        NotificationManager nm =
                (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    "alarm_channel",
                    "Prayer Alarms",
                    NotificationManager.IMPORTANCE_HIGH
            );
            channel.setBypassDnd(true);
            channel.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);
            nm.createNotificationChannel(channel);
        }

        Notification notification = new Notification.Builder(context, "alarm_channel")
                .setContentTitle("Qada Prayer Alarm")
                .setContentText(prayer + " – Time for your Qada prayer")
                .setSmallIcon(android.R.drawable.ic_lock_idle_alarm)
                .setFullScreenIntent(fullScreenPendingIntent, true)
                .setCategory(Notification.CATEGORY_ALARM)
                .setVisibility(Notification.VISIBILITY_PUBLIC)
                .setOngoing(true)
                .setAutoCancel(false)
                .build();

        nm.notify(alarmId, notification);
    }
}