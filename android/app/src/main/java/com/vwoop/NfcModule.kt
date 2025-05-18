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
        try {
            val nfcManager = reactContext.getSystemService(Activity.NFC_SERVICE) as NfcManager
            nfcAdapter = nfcManager.defaultAdapter
            if (nfcAdapter != null) {
                cardEmulation = CardEmulation.getInstance(nfcAdapter)
            } else {
                Log.w(TAG, "NFC adapter is null - device may not have NFC hardware")
            }
            reactContext.addActivityEventListener(this)
        } catch (e: Exception) {
            Log.e(TAG, "Error initializing NFC: ${e.message}")
        }
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
        try {
            promise.resolve(nfcAdapter != null)
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to check NFC support: ${e.message}")
        }
    }

    @ReactMethod
    fun isNfcEnabled(promise: Promise) {
        try {
            if (nfcAdapter == null) {
                promise.resolve(false)
                return
            }
            promise.resolve(nfcAdapter?.isEnabled ?: false)
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to check NFC status: ${e.message}")
        }
    }

    @ReactMethod
    fun toggleHce(promise: Promise) {
        try {
            if (nfcAdapter == null) {
                promise.reject("ERROR", "NFC is not supported on this device")
                return
            }

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
            promise.reject("ERROR", "Failed to toggle HCE: ${e.message}")
        }
    }

    @ReactMethod
    fun isHceEnabled(promise: Promise) {
        try {
            promise.resolve(isHceEnabled)
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to check HCE status: ${e.message}")
        }
    }

    private fun sendEvent(eventName: String, data: Any) {
        try {
            reactApplicationContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit(eventName, data)
        } catch (e: Exception) {
            Log.e(TAG, "Error sending event: ${e.message}")
        }
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