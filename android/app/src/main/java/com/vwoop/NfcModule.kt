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

    init {
        val nfcManager = reactContext.getSystemService(Activity.NFC_SERVICE) as NfcManager
        nfcAdapter = nfcManager.defaultAdapter
        cardEmulation = CardEmulation.getInstance(nfcAdapter)
        
        // Start HCE service by default
        val intent = Intent(reactApplicationContext, HostCardEmulationService::class.java)
        reactApplicationContext.startService(intent)
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