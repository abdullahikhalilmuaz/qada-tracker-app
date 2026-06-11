package com.qadatracker.app;

import android.app.AlarmManager;
import android.content.Context;
import android.os.Build;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "AlarmPlugin")
public class AlarmPlugin extends Plugin {

    @PluginMethod
    public void schedule(PluginCall call) {
        Integer id = call.getInt("id");
        String prayer = call.getString("prayer");
        Long timeMillis = call.getLong("timeMillis");

        if (id == null || prayer == null || timeMillis == null) {
            call.reject("Missing required parameters: id, prayer, timeMillis");
            return;
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            AlarmManager am = (AlarmManager) getContext()
                    .getSystemService(Context.ALARM_SERVICE);
            if (am != null && !am.canScheduleExactAlarms()) {
                call.reject("EXACT_ALARM_PERMISSION_DENIED");
                return;
            }
        }

        AlarmScheduler.scheduleAlarm(getContext(), timeMillis, prayer, id);
        call.resolve();
    }

    @PluginMethod
    public void cancel(PluginCall call) {
        Integer id = call.getInt("id");

        if (id == null) {
            call.reject("Missing required parameter: id");
            return;
        }

        AlarmScheduler.cancelAlarm(getContext(), id);
        call.resolve();
    }
}