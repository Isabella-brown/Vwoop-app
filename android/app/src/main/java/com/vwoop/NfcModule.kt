package com.vwoop

import android.app.Activity
import android.content.Intent
import android.nfc.NfcAdapter
import android.nfc.NfcManager
import android.nfc.cardemulation.CardEmulation
import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule

class NfcModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private val TAG = "NfcModule"
    private var nfcAdapter: NfcAdapter? = null
    private var cardEmulation: CardEmulation? = null
    private var isHceEnabled = false
    private var isAppActive = false

    init {
        val nfcManager = reactContext.getSystemService(Activity.NFC_SERVICE) as NfcManager
        nfcAdapter = nfcManager.defaultAdapter
        cardEmulation = CardEmulation.getInstance(nfcAdapter)
        
        // Register for app state changes
        reactContext.addActivityEventListener(object : BaseActivityEventListener() {
            override fun onActivityResumed(activity: Activity) {
                isAppActive = true
                Log.d(TAG, "App became active in NfcModule")
            }

            override fun onActivityPaused(activity: Activity) {
                isAppActive = false
                Log.d(TAG, "App became inactive in NfcModule")
                // Ensure HCE is disabled when app goes to background
                if (isHceEnabled) {
                    toggleHceInternal(false)
                }
            }
        })
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
        if (!isAppActive) {
            promise.reject("ERROR", "Cannot toggle HCE when app is not active")
            return
        }

        try {
            toggleHceInternal(!isHceEnabled)
            promise.resolve(isHceEnabled)
        } catch (e: Exception) {
            Log.e(TAG, "Error toggling HCE", e)
            promise.reject("ERROR", e.message)
        }
    }

    private fun toggleHceInternal(enable: Boolean) {
        try {
            val intent = Intent(reactApplicationContext, HostCardEmulationService::class.java)
            if (enable) {
                reactApplicationContext.startService(intent)
                isHceEnabled = true
                sendEvent("onHceStateChanged", true)
            } else {
                reactApplicationContext.stopService(intent)
                isHceEnabled = false
                sendEvent("onHceStateChanged", false)
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error in toggleHceInternal", e)
            throw e
        }
    }

    @ReactMethod
    fun isHceEnabled(promise: Promise) {
        promise.resolve(isHceEnabled && isAppActive)
    }

    private fun sendEvent(eventName: String, data: Any) {
        try {
            reactApplicationContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit(eventName, data)
        } catch (e: Exception) {
            Log.e(TAG, "Error sending event", e)
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