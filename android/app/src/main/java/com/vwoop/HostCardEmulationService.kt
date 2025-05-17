package com.vwoop

import android.nfc.cardemulation.HostApduService
import android.os.Bundle
import android.util.Log
import com.facebook.react.bridge.ReactContext
import com.facebook.react.modules.core.DeviceEventManagerModule

class HostCardEmulationService : HostApduService() {
    companion object {
        private const val TAG = "HostCardEmulationService"
        private const val AID = "F0010203040506"
        private const val SELECT_APDU_HEADER = "00A40400"
        private const val SUCCESS_SW = "9000"
        private const val UNKNOWN_CMD_SW = "6D00"
        private const val APP_INACTIVE_SW = "6A82" // File not found - used to indicate app is inactive
    }

    override fun processCommandApdu(commandApdu: ByteArray, extras: Bundle?): ByteArray {
        // Check if app is active before processing any commands
        if (!MainActivity.isAppActive()) {
            Log.d(TAG, "Ignoring APDU command - app is not active")
            return hexStringToByteArray(APP_INACTIVE_SW)
        }

        val command = bytesToHex(commandApdu)
        Log.d(TAG, "Processing APDU command: $command")

        if (command.startsWith(SELECT_APDU_HEADER)) {
            val aid = command.substring(SELECT_APDU_HEADER.length)
            if (aid == AID) {
                // Only process if app is active
                if (MainActivity.isAppActive()) {
                    sendEvent("onHceCommandReceived", "SELECT")
                    return hexStringToByteArray(SUCCESS_SW)
                } else {
                    return hexStringToByteArray(APP_INACTIVE_SW)
                }
            }
        }

        // Send "unknown command" response
        return hexStringToByteArray(UNKNOWN_CMD_SW)
    }

    override fun onDeactivated(reason: Int) {
        Log.d(TAG, "HCE Service deactivated: $reason")
        sendEvent("onHceDeactivated", reason)
    }

    private fun bytesToHex(bytes: ByteArray): String {
        return bytes.joinToString("") { "%02X".format(it) }
    }

    private fun hexStringToByteArray(hex: String): ByteArray {
        return hex.chunked(2)
            .map { it.toInt(16).toByte() }
            .toByteArray()
    }

    private fun sendEvent(eventName: String, data: Any) {
        try {
            val reactContext = application as? MainApplication
            reactContext?.reactNativeHost?.reactInstanceManager?.currentReactContext?.let { context ->
                context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit(eventName, data)
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error sending event to React Native", e)
        }
    }
} 