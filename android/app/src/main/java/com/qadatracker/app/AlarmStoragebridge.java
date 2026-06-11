package com.qadatracker.app;

import android.content.SharedPreferences;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * Bridges localStorage alarms → Android SharedPreferences.
 * BootReceiver reads from SharedPreferences after reboot,
 * so we need a native copy of the alarm list.
 *
 * Call from TypeScript after every saveAlarms():
 *   AlarmStorageBridge.sync({ alarms: JSON.stringify(alarms) })
 */
@CapacitorPlugin(name = "AlarmStorageBridge")
public class AlarmStorageBridge extends Plugin {


    private static final String PREFS_NAME = "qada_alarms_prefs";
    private static final String ALARMS_KEY = "qada_alarms";

    @PluginMethod
    public void sync(PluginCall call) {
        String alarmsJson = call.getString("alarms");

        if (alarmsJson == null) {
            call.reject("Missing alarms JSON string");
            return;
        }

        SharedPreferences prefs =
                getContext().getSharedPreferences(PREFS_NAME, android.content.Context.MODE_PRIVATE);

        prefs.edit().putString(ALARMS_KEY, alarmsJson).apply();
        call.resolve();
    }
}
