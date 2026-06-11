package com.qadatracker.app;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(android.os.Bundle savedInstanceState) {
        registerPlugin(AlarmPlugin.class);
        registerPlugin(AlarmStorageBridge.class);
        super.onCreate(savedInstanceState);
    }
}