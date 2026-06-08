package com.qadatracker.app;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "AlarmPlugin")
public class AlarmPlugin extends Plugin {

    @com.getcapacitor.annotation.PluginMethod
    public void schedule(PluginCall call) {
        int id = call.getInt("id");
        String prayer = call.getString("prayer");
        long timeMillis = call.getLong("timeMillis");

        AlarmScheduler.scheduleAlarm(
            getContext(),
            timeMillis,
            prayer,
            id
        );

        call.resolve();
    }
}