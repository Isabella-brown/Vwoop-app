package com.vwoop

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class MainActivityModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName() = "MainActivity"

    @ReactMethod
    fun toggleHceMode() {
        val activity = currentActivity as? MainActivity
        activity?.toggleHceMode()
    }
} 