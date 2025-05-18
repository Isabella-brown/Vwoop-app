package com.vwoop

import android.nfc.cardemulation.HostApduService
import android.os.Bundle
import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.modules.core.DeviceEventManagerModule

class HostCardEmulationService : HostApduService() {
    private val TAG = "HostCardEmulationService"
    private val AID = "F0010203040506"
    private val SELECT_APDU_HEADER = "00A40400"
    private val FOUND_STATUS = "9000"
    private val NOT_FOUND_STATUS = "6F00"

    override fun processCommandApdu(commandApdu: ByteArray, extras: Bundle?): ByteArray {
        val command = bytesToHex(commandApdu)
        Log.d(TAG, "Received APDU command: $command")

        if (command.startsWith(SELECT_APDU_HEADER)) {
            val aid = command.substring(SELECT_APDU_HEADER.length)
            if (aid == AID) {
                sendEvent("NFCEvent", mapOf(
                    "type" to "SELECT",
                    "aid" to aid
                ))
                return hexStringToByteArray(FOUND_STATUS)
            }
        }

        sendEvent("NFCEvent", mapOf(
            "type" to "UNKNOWN",
            "command" to command
        ))
        return hexStringToByteArray(NOT_FOUND_STATUS)
    }

    override fun onDeactivated(reason: Int) {
        Log.d(TAG, "Deactivated: $reason")
        sendEvent("NFCEvent", mapOf(
            "type" to "DEACTIVATED",
            "reason" to reason
        ))
    }

    private fun sendEvent(eventName: String, params: Map<String, Any>) {
        try {
            val reactContext = applicationContext as? ReactApplicationContext
            reactContext?.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                ?.emit(eventName, com.facebook.react.bridge.Arguments.makeNativeMap(params))
        } catch (e: Exception) {
            Log.e(TAG, "Error sending event: ${e.message}")
        }
    }

    private fun bytesToHex(bytes: ByteArray): String {
        return bytes.joinToString("") { "%02X".format(it) }
    }

    private fun hexStringToByteArray(hex: String): ByteArray {
        return hex.chunked(2)
            .map { it.toInt(16).toByte() }
            .toByteArray()
    }
} 