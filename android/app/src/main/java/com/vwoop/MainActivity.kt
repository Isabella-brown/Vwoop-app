package com.vwoop

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.util.Log
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {
    private val TAG = "MainActivity"
    private var isAppActive = false

    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    override fun getMainComponentName(): String = "Vwoop"

    /**
     * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
     * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
     */
    override fun createReactActivityDelegate(): ReactActivityDelegate =
        DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        isAppActive = true
        Log.d(TAG, "App became active")
    }

    override fun onResume() {
        super.onResume()
        isAppActive = true
        Log.d(TAG, "App resumed")
        // Notify React Native about app becoming active
        sendEvent("onAppStateChanged", true)
    }

    override fun onPause() {
        super.onPause()
        isAppActive = false
        Log.d(TAG, "App paused")
        // Notify React Native about app becoming inactive
        sendEvent("onAppStateChanged", false)
        // Stop HCE service when app goes to background
        stopHceService()
    }

    override fun onDestroy() {
        super.onDestroy()
        isAppActive = false
        Log.d(TAG, "App destroyed")
        stopHceService()
    }

    private fun stopHceService() {
        try {
            val intent = Intent(this, HostCardEmulationService::class.java)
            stopService(intent)
        } catch (e: Exception) {
            Log.e(TAG, "Error stopping HCE service", e)
        }
    }

    private fun sendEvent(eventName: String, data: Any) {
        try {
            reactInstanceManager?.currentReactContext
                ?.getJSModule(com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                ?.emit(eventName, data)
        } catch (e: Exception) {
            Log.e(TAG, "Error sending event to React Native", e)
        }
    }

    companion object {
        fun isAppActive(): Boolean {
            return (currentActivity as? MainActivity)?.isAppActive ?: false
        }
    }
}
