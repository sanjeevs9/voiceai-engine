import express from "express";
import { makeOutboundCall, twilioResponse } from "../controllers/Call";
import { callEndCallback } from "../controllers/Callback";
import { createValidationRequest, validateNumber } from "../controllers/verify";

const router = express.Router();

/**
 * Route for creating an outbound call.
 */
router.post("/outbound", makeOutboundCall);

/**
 * Route to return an XML response containing details on bidirectional stream setup.
 */
router.post("/", twilioResponse);

/**
 * Callback Route for Twilio to return call object after call end
 */
router.post("/callback", callEndCallback);

/**
 * Route to verify the number
 */
router.post("/verify", createValidationRequest);

/**
 * Route to validate the number
 */
router.post("/validate", validateNumber);


export default router;
