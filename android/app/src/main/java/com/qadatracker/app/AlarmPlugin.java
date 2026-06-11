package com.qadatracker.app;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "AlarmPlugin")
public class AlarmPlugin extends Plugin {

    /**
     * Called from TypeScript via AlarmPlugin.schedule({ id, timeMillis, prayer })
     * Schedules a native Android alarm that fires even when app is closed.
     */
    @PluginMethod
    public void schedule(PluginCall call) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
        AlarmManager am = (AlarmManager) getContext()
            .getSystemService(Context.ALARM_SERVICE);
        if (!am.canScheduleExactAlarms()) {
            call.reject("EXACT_ALARM_PERMISSION_DENIED");
            return;
        }
    }

        Integer id = call.getInt("id");
        String prayer = call.getString("prayer");
        Long timeMillis = call.getLong("timeMillis");

        if (id == null || prayer == null || timeMillis == null) {
            call.reject("Missing required parameters: id, prayer, timeMillis");
            return;
        }

        AlarmScheduler.scheduleAlarm(getContext(), timeMillis, prayer, id);
        call.resolve();
    }

    /**
     * Called from TypeScript via AlarmPlugin.cancel({ id })
     * Cancels a previously scheduled alarm.
     */
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