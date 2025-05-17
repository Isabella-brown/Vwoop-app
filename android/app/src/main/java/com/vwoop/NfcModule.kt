package com.vwoop

import android.app.Activity
import android.content.Intent
import android.nfc.NfcAdapter
import android.nfc.NfcManager
import android.nfc.cardemulation.CardEmulation
import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.bridge.ActivityEventListener

class NfcModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext), ActivityEventListener {
    private val TAG = "NfcModule"
    private var nfcAdapter: NfcAdapter? = null
    private var cardEmulation: CardEmulation? = null
    private var isHceEnabled = false

    init {
        val nfcManager = reactContext.getSystemService(Activity.NFC_SERVICE) as NfcManager
        nfcAdapter = nfcManager.defaultAdapter
        cardEmulation = CardEmulation.getInstance(nfcAdapter)
        reactContext.addActivityEventListener(this)
    }

    override fun onActivityResult(activity: Activity, requestCode: Int, resultCode: Int, data: Intent?) {
        // Not used in this module
    }

    override fun onNewIntent(intent: Intent?) {
        // Handle new intents if needed
    }

    override fun getName() = "NfcModule"

    @ReactMethod
    fun isNfcSupported(promise: Promise) {
        promise.resolve(nfcAdapter != null)
    }

    @ReactMethod
    fun isNfcEnabled(promise: Promise) {
        promise.resolve(nfcAdapter?.isEnabled ?: false)
    }

    @ReactMethod
    fun toggleHce(promise: Promise) {
        try {
            if (!isHceEnabled) {
                // Enable HCE
                val intent = Intent(reactApplicationContext, HostCardEmulationService::class.java)
                reactApplicationContext.startService(intent)
                isHceEnabled = true
                sendEvent("onHceStateChanged", true)
                promise.resolve(true)
            } else {
                // Disable HCE
                val intent = Intent(reactApplicationContext, HostCardEmulationService::class.java)
                reactApplicationContext.stopService(intent)
                isHceEnabled = false
                sendEvent("onHceStateChanged", false)
                promise.resolve(false)
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error toggling HCE", e)
            promise.reject("ERROR", e.message)
        }
    }

    @ReactMethod
    fun isHceEnabled(promise: Promise) {
        promise.resolve(isHceEnabled)
    }

    private fun sendEvent(eventName: String, data: Any) {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, data)
    }

    @ReactMethod
    fun addListener(eventName: String) {
        // Required for RN built in Event Emitter
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        // Required for RN built in Event Emitter
    }
} 