package com.vwoop

import android.nfc.cardemulation.HostApduService
import android.os.Bundle
import android.util.Log

class HostCardEmulationService : HostApduService() {
    companion object {
        private const val TAG = "HostCardEmulationService"
        private const val AID = "F0010203040506"
        private const val SELECT_APDU_HEADER = "00A40400"
        private const val SUCCESS_SW = "9000"
        private const val UNKNOWN_CMD_SW = "6D00"
    }

    override fun processCommandApdu(commandApdu: ByteArray, extras: Bundle?): ByteArray {
        val command = bytesToHex(commandApdu)
        Log.d(TAG, "Received APDU command: $command")

        if (command.startsWith(SELECT_APDU_HEADER)) {
            val aid = command.substring(SELECT_APDU_HEADER.length)
            if (aid == AID) {
                // Send success response
                return hexStringToByteArray(SUCCESS_SW)
            }
        }

        // Send "unknown command" response
        return hexStringToByteArray(UNKNOWN_CMD_SW)
    }

    override fun onDeactivated(reason: Int) {
        Log.d(TAG, "Deactivated: $reason")
        // Notify React Native about deactivation
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
        // TODO: Implement event sending to React Native
        // This will be implemented when we create the native module
    }
} 