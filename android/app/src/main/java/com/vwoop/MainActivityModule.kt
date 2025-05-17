package com.vwoop

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class MainActivityModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName() = "MainActivity"

    @ReactMethod
    fun toggleHceMode(promise: Promise) {
        try {
            val nfcModule = reactApplicationContext.getNativeModule(NfcModule::class.java)
            nfcModule?.toggleHce(promise) ?: promise.reject("ERROR", "NfcModule not found")
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }
} 