# Project README

## Overview

This is a personal repo for my work at a startup. The architecture leverages AWS services, Deepgram, OpenAI, Twilio, and Plivo to handle outbound calls, speech-to-text, text-to-speech, and real-time interactions.

## Architecture

Below is the architecture diagram for the project:

![Architecture Diagram]
![WhatsApp Image 2025-08-16 at 13 04 30](https://github.com/user-attachments/assets/71459d88-d377-4dd2-9a18-aaa4abd2d661)


## Environment Variables

Create a `.env` file based on the following template:

```env
# Twilio Main Account
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# Deepgram Keys
DEEPGRAM_API_KEY1=
DEEPGRAM_API_KEY2=
DEEPGRAM_API_KEY3=
DEEPGRAM_API_KEY4=
DEEPGRAM_API_KEY5=
DEEPGRAM_API_KEY6=

# Open AI
OPENAI_API_KEY=

# AWS Credentials
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=

PORT=8080
```

### Notes

* For Deepgram API keys, you can use only one. Multiple keys are provided here to handle more calls since Deepgram has a **100 requests limit** for the free version.

## Installation & Run

1. Install dependencies:

   ```bash
   npm i
   ```

2. Build the project:

   ```bash
   npm run build
   ```

3. Start the project:

   ```bash
   npm run start
   ```
