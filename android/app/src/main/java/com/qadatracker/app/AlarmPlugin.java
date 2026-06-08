package com.qadatracker.app;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.PluginMethod;

import java.util.Date;

@CapacitorPlugin(name = "AlarmPlugin")
public class AlarmPlugin extends Plugin {

    @PluginMethod
    public void schedule(PluginCall call) {

        int id = call.getInt("id");
        String prayer = call.getString("prayer");
        String time = call.getString("time");

        long timeMillis = java.time.Instant.parse(time).toEpochMilli();

        AlarmScheduler.scheduleAlarm(
            getContext(),
            timeMillis,
            prayer,
            id
        );

        call.resolve();
    }
}