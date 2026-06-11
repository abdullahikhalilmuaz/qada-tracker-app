package com.qadatracker.app;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.graphics.Color;
import android.graphics.Typeface;
import android.os.Build;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;

public class AlarmScreenActivity extends Activity {

    private String prayer;
    private int    alarmId;
    private boolean silenced = false;

    private TextView statusLabel;

    // Receives broadcast from AlarmService when volume key silences sound
    private final BroadcastReceiver silenceReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            silenced = true;
            if (statusLabel != null) {
                statusLabel.setText("🔇 Silenced – finish your Salah");
                statusLabel.setTextColor(Color.parseColor("#4CAF50"));
            }
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // ── Show over lock screen & turn screen on ────────────────────────────
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true);
            setTurnScreenOn(true);
        } else {
            getWindow().addFlags(
                    WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED |
                    WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON  |
                    WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON
            );
        }
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        // ── Get extras ────────────────────────────────────────────────────────
        prayer  = getIntent().getStringExtra("prayer");
        alarmId = getIntent().getIntExtra("alarmId", 0);
        if (prayer == null) prayer = "Prayer";

        // ── Register silence broadcast ────────────────────────────────────────
        IntentFilter filter = new IntentFilter("com.qadatracker.app.ALARM_SILENCED");
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            registerReceiver(silenceReceiver, filter, Context.RECEIVER_NOT_EXPORTED);
        } else {
            registerReceiver(silenceReceiver, filter);
        }

        buildUI();
    }

    // ── Build the full-screen UI programmatically ─────────────────────────────
    private void buildUI() {
        // Root
        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setBackgroundColor(Color.parseColor("#0D1B2A"));
        root.setGravity(android.view.Gravity.CENTER);
        root.setPadding(dp(32), dp(60), dp(32), dp(60));

        // Prayer icon placeholder (crescent moon emoji as text)
        TextView icon = new TextView(this);
        icon.setText(prayerEmoji(prayer));
        icon.setTextSize(72);
        icon.setGravity(android.view.Gravity.CENTER);
        root.addView(icon, matchWrap());

        spacer(root, dp(16));

        // "Qada Prayer" label
        TextView labelQada = new TextView(this);
        labelQada.setText("Qada Prayer");
        labelQada.setTextColor(Color.parseColor("#7eb3f5"));
        labelQada.setTextSize(16);
        labelQada.setGravity(android.view.Gravity.CENTER);
        root.addView(labelQada, matchWrap());

        spacer(root, dp(8));

        // Prayer name
        TextView prayerName = new TextView(this);
        prayerName.setText(prayer);
        prayerName.setTextColor(Color.WHITE);
        prayerName.setTextSize(42);
        prayerName.setTypeface(null, Typeface.BOLD);
        prayerName.setGravity(android.view.Gravity.CENTER);
        root.addView(prayerName, matchWrap());

        spacer(root, dp(8));

        // Status label (updated when volume key is pressed)
        statusLabel = new TextView(this);
        statusLabel.setText("🔔 Press volume key to silence");
        statusLabel.setTextColor(Color.parseColor("#8899AA"));
        statusLabel.setTextSize(14);
        statusLabel.setGravity(android.view.Gravity.CENTER);
        root.addView(statusLabel, matchWrap());

        spacer(root, dp(56));

        // ── Prayed button ─────────────────────────────────────────────────────
        Button prayedBtn = new Button(this);
        prayedBtn.setText("✓  I Prayed");
        prayedBtn.setTextColor(Color.WHITE);
        prayedBtn.setTextSize(18);
        prayedBtn.setTypeface(null, Typeface.BOLD);
        prayedBtn.setBackgroundColor(Color.parseColor("#2E7D32")); // green
        prayedBtn.setPadding(dp(24), dp(18), dp(24), dp(18));
        prayedBtn.setOnClickListener(v -> onPrayed());

        LinearLayout.LayoutParams btnParams = matchWrap();
        btnParams.height = dp(60);
        root.addView(prayedBtn, btnParams);

        spacer(root, dp(16));

        // ── Snooze button ─────────────────────────────────────────────────────
        Button snoozeBtn = new Button(this);
        snoozeBtn.setText("⏰  Snooze 10 min");
        snoozeBtn.setTextColor(Color.parseColor("#7eb3f5"));
        snoozeBtn.setTextSize(16);
        snoozeBtn.setBackgroundColor(Color.parseColor("#1A2D3F")); // dark blue
        snoozeBtn.setPadding(dp(24), dp(16), dp(24), dp(16));
        snoozeBtn.setOnClickListener(v -> onSnooze());

        LinearLayout.LayoutParams snoozeParams = matchWrap();
        snoozeParams.height = dp(56);
        root.addView(snoozeBtn, snoozeParams);

        spacer(root, dp(32));

        // Volume hint footer
        TextView hint = new TextView(this);
        hint.setText("Volume ↓ = silence sound only\nAlarm stays until you act");
        hint.setTextColor(Color.parseColor("#445566"));
        hint.setTextSize(12);
        hint.setGravity(android.view.Gravity.CENTER);
        root.addView(hint, matchWrap());

        setContentView(root);
    }

    // ── Volume key → silence sound, keep screen alive ────────────────────────
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_VOLUME_DOWN ||
            keyCode == KeyEvent.KEYCODE_VOLUME_UP) {

            if (!silenced) {
                // Tell AlarmService to silence the sound
                Intent silenceIntent = new Intent(this, AlarmService.class);
                silenceIntent.setAction(AlarmService.ACTION_SILENCE);
                silenceIntent.putExtra("alarmId", alarmId);
                startService(silenceIntent);
                // UI update will come back via the broadcast receiver
            }
            return true; // consume — don't let system change volume
        }
        return super.onKeyDown(keyCode, event);
    }

    // ── Prayed: stop service, finish activity ─────────────────────────────────
    private void onPrayed() {
        Intent stopIntent = new Intent(this, AlarmService.class);
        stopIntent.setAction(AlarmService.ACTION_PRAYED);
        startService(stopIntent);
        finish();
    }

    // ── Snooze: reschedule + finish ────────────────────────────────────────────
    private void onSnooze() {
        Intent snoozeIntent = new Intent(this, AlarmService.class);
        snoozeIntent.setAction(AlarmService.ACTION_SNOOZE);
        snoozeIntent.putExtra("alarmId", alarmId);
        snoozeIntent.putExtra("prayer", prayer);
        startService(snoozeIntent);
        finish();
    }

    // ── Helpers ───────────────────────────────────────────────────────────────
    private String prayerEmoji(String name) {
        switch (name) {
            case "Fajr":    return "🌙";
            case "Zuhr":    return "☀️";
            case "Asr":     return "🌤️";
            case "Maghrib": return "🌅";
            case "Isha":    return "🌑";
            default:        return "🕌";
        }
    }

    private int dp(int value) {
        float density = getResources().getDisplayMetrics().density;
        return (int) (value * density + 0.5f);
    }

    private LinearLayout.LayoutParams matchWrap() {
        return new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
    }

    private void spacer(LinearLayout parent, int heightPx) {
        View space = new View(this);
        parent.addView(space, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, heightPx
        ));
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        try {
            unregisterReceiver(silenceReceiver);
        } catch (Exception ignored) {}
    }

    // Prevent back button from dismissing alarm
    @Override
    public void onBackPressed() {
        // Do nothing — user must press Prayed or Snooze
    }
}