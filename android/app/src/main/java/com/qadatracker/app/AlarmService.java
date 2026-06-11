package com.qadatracker.app;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Intent;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.os.VibrationEffect;
import android.os.Vibrator;


import androidx.annotation.Nullable;

public class AlarmService extends Service {

    public static final String ACTION_SILENCE  = "com.qadatracker.app.ACTION_SILENCE";
    public static final String ACTION_SNOOZE   = "com.qadatracker.app.ACTION_SNOOZE";
    public static final String ACTION_PRAYED   = "com.qadatracker.app.ACTION_PRAYED";

    // Auto-snooze after 10 minutes if user does nothing
    private static final long AUTO_SNOOZE_MS   = 10 * 60 * 1000L;
    // After volume-silence, auto-dismiss after 10 minutes
    private static final long SILENCE_KILL_MS  = 10 * 60 * 1000L;

    private MediaPlayer  mediaPlayer;
    private Vibrator     vibrator;
    private Handler      handler;
    private Runnable     autoSnoozeRunnable;
    private String       prayer;
    private int          alarmId;
    private boolean      silenced = false;

    @Override
    public void onCreate() {
        super.onCreate();
        handler = new Handler(Looper.getMainLooper());
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent == null) return START_NOT_STICKY;

        String action = intent.getAction();

        // ── Handle control actions from AlarmScreenActivity ──────────────────
        if (ACTION_SILENCE.equals(action)) {
            silenceSound();
            scheduleAutoKill();
            return START_NOT_STICKY;
        }
        if (ACTION_SNOOZE.equals(action)) {
            int id = intent.getIntExtra("alarmId", 0);
            String p = intent.getStringExtra("prayer");
            snoozeAlarm(id, p);
            return START_NOT_STICKY;
        }
        if (ACTION_PRAYED.equals(action)) {
            stopSelf();
            return START_NOT_STICKY;
        }

        // ── New alarm starting ────────────────────────────────────────────────
        prayer  = intent.getStringExtra("prayer");
        alarmId = intent.getIntExtra("alarmId", 0);

        startForegroundWithNotification();
        playAlarmSound();
        startVibration();
        scheduleAutoSnooze();

        return START_NOT_STICKY;
    }

    // ── Sound ─────────────────────────────────────────────────────────────────
    private void playAlarmSound() {
        try {
            Uri alarmUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM);
            if (alarmUri == null) {
                alarmUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_RINGTONE);
            }

            mediaPlayer = new MediaPlayer();
            mediaPlayer.setAudioStreamType(AudioManager.STREAM_ALARM);
            mediaPlayer.setDataSource(this, alarmUri);
            mediaPlayer.setLooping(true);
            mediaPlayer.prepare();
            mediaPlayer.start();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * Called when the user presses the volume button.
     * Stops sound but keeps the service + screen alive — exactly like silencing
     * a phone call with the volume key.
     */
    public void silenceSound() {
        silenced = true;
        if (mediaPlayer != null && mediaPlayer.isPlaying()) {
            mediaPlayer.pause();
        }
        if (vibrator != null) {
            vibrator.cancel();
        }
        // Cancel auto-snooze; a new timer (SILENCE_KILL_MS) is set by scheduleAutoKill()
        if (autoSnoozeRunnable != null) {
            handler.removeCallbacks(autoSnoozeRunnable);
        }

        // Broadcast so AlarmScreenActivity can update its UI ("Silenced")
        Intent broadcast = new Intent("com.qadatracker.app.ALARM_SILENCED");
        sendBroadcast(broadcast);
    }

    // ── Vibration ─────────────────────────────────────────────────────────────
    private void startVibration() {
        vibrator = (Vibrator) getSystemService(VIBRATOR_SERVICE);
        if (vibrator == null) return;

        long[] pattern = {0, 800, 400, 800, 800};
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            vibrator.vibrate(VibrationEffect.createWaveform(pattern, 0));
        } else {
            vibrator.vibrate(pattern, 0);
        }
    }

    // ── Auto-snooze after 10 min of ringing ──────────────────────────────────
    private void scheduleAutoSnooze() {
        autoSnoozeRunnable = () -> snoozeAlarm(alarmId, prayer);
        handler.postDelayed(autoSnoozeRunnable, AUTO_SNOOZE_MS);
    }

    // ── After volume-silence, auto-kill after 10 min ──────────────────────────
    private void scheduleAutoKill() {
        handler.postDelayed(this::stopSelf, SILENCE_KILL_MS);
    }

    // ── Snooze: reschedule 10 min from now ────────────────────────────────────
    private void snoozeAlarm(int id, String prayerName) {
        long snoozeTime = System.currentTimeMillis() + (10 * 60 * 1000L);
        AlarmScheduler.scheduleAlarm(this, snoozeTime, prayerName, id);
        stopSelf();
    }

    // ── Foreground notification (required for Android 8+) ────────────────────
    private void startForegroundWithNotification() {
        NotificationManager nm =
                (NotificationManager) getSystemService(NOTIFICATION_SERVICE);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    "alarm_service_channel",
                    "Active Alarm",
                    NotificationManager.IMPORTANCE_LOW   // silent — real sound is via MediaPlayer
            );
            nm.createNotificationChannel(channel);
        }

        Notification notification = new Notification.Builder(this, "alarm_service_channel")
                .setContentTitle("Qada Alarm Active")
                .setContentText((prayer != null ? prayer : "Prayer") + " – Tap to open")
                .setSmallIcon(android.R.drawable.ic_lock_idle_alarm)
                .setOngoing(true)
                .build();

        startForeground(9999, notification);
    }

    // ── Cleanup ───────────────────────────────────────────────────────────────
    @Override
    public void onDestroy() {
        super.onDestroy();
        if (mediaPlayer != null) {
            mediaPlayer.stop();
            mediaPlayer.release();
            mediaPlayer = null;
        }
        if (vibrator != null) {
            vibrator.cancel();
        }
        if (autoSnoozeRunnable != null) {
            handler.removeCallbacks(autoSnoozeRunnable);
        }

        // Cancel the ongoing notification
        NotificationManager nm =
                (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        if (nm != null) nm.cancel(9999);
        if (nm != null && alarmId != 0) nm.cancel(alarmId);
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
