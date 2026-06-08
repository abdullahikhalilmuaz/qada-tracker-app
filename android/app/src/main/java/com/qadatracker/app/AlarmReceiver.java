package com.qadatracker.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.app.PendingIntent;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Vibrator;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.os.Build;

public class AlarmReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {

        String prayer = intent.getStringExtra("prayer");

        // vibration
        Vibrator v = (Vibrator) context.getSystemService(Context.VIBRATOR_SERVICE);
        if (v != null) {
            v.vibrate(3000);
        }

        // sound
        Uri sound = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM);

        NotificationManager nm =
            (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                "alarm_channel",
                "Alarms",
                NotificationManager.IMPORTANCE_HIGH
            );
            nm.createNotificationChannel(channel);
        }

        Notification notification = new Notification.Builder(context, "alarm_channel")
            .setContentTitle("Prayer Alarm")
            .setContentText(prayer + " time")
            .setSmallIcon(android.R.drawable.ic_lock_idle_alarm)
            .setSound(sound)
            .setAutoCancel(true)
            .build();

        nm.notify((int) System.currentTimeMillis(), notification);
    }
}