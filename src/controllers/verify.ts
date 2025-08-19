// Download the helper library from https://www.twilio.com/docs/node/install
import twilio from "twilio"; // Or, for ESM: import twilio from "twilio";
import { Request, Response } from "express";

// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);
const cookie=process.env.COOKIE;
console.log({cookie});
const twilioCsrfToken=process.env.TOKEN;

async function createValidationRequest(req: Request, res: Response) {
  const { phoneNumber, countryCode } = req.body;
  console.log({phoneNumber, countryCode});
  try {
    const myHeaders = new Headers();
myHeaders.append("accept", "*/*");
myHeaders.append("accept-language", "en-GB,en-US;q=0.9,en;q=0.8,hi;q=0.7");
myHeaders.append("content-type", "application/json");
myHeaders.append("origin", "https://console.twilio.com");
myHeaders.append("priority", "u=1, i");
myHeaders.append("referer", "https://console.twilio.com/");
myHeaders.append("sec-ch-ua", "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"");
myHeaders.append("sec-ch-ua-mobile", "?0");
myHeaders.append("sec-ch-ua-platform", "\"macOS\"");
myHeaders.append("sec-fetch-dest", "empty");
myHeaders.append("sec-fetch-mode", "cors");
myHeaders.append("sec-fetch-site", "same-site");
myHeaders.append("user-agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36");
myHeaders.append("x-twilio-csrf", String(twilioCsrfToken) || "");
myHeaders.append("Cookie", String(cookie) || "" );

const raw = JSON.stringify({
  "CountryCode": countryCode,
  "PhoneNumber": phoneNumber
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow" as RequestRedirect
};

const response =await fetch("https://www.twilio.com/console/phone-numbers/verify/message", requestOptions)
 
const val=await response.json();
console.log(val);
    if(val.fatal){
        res.status(404).json({
            message:"Number already verified or wrong number"
        })
        return
    }

      res.status(200).json({ message: "Validation request created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating validation request" });
  }

}

async function validateNumber(req: Request, res: Response) {
    const { verificationCode, phoneNumber, countryCode } = req.body;
    console.log({verificationCode, phoneNumber, countryCode});
  try {
    const myHeaders = new Headers();
    myHeaders.append("accept", "*/*");
    myHeaders.append("accept-language", "en-GB,en-US;q=0.9,en;q=0.8,hi;q=0.7");
    myHeaders.append("content-type", "application/json");
    myHeaders.append("origin", "https://console.twilio.com");
    myHeaders.append("priority", "u=1, i");
    myHeaders.append("referer", "https://console.twilio.com/");
    myHeaders.append("sec-ch-ua", "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"");
    myHeaders.append("sec-ch-ua-mobile", "?0");
    myHeaders.append("sec-ch-ua-platform", "\"macOS\"");
    myHeaders.append("sec-fetch-dest", "empty");
    myHeaders.append("sec-fetch-mode", "cors");
    myHeaders.append("sec-fetch-site", "same-site");
    myHeaders.append("user-agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36");
    myHeaders.append("x-twilio-csrf", String(twilioCsrfToken) || "");
    myHeaders.append("Cookie", String(cookie) || "" );
    
    const raw = JSON.stringify({
      "VerificationCode": verificationCode,
      "PhoneNumber": phoneNumber,
      "CountryCode": countryCode
    });
    
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow" as RequestRedirect
    };
    
    const response =await fetch("https://www.twilio.com/console/phone-numbers/verify/message/validate", requestOptions)

    const val=await response.json();

    console.log({val});
    if(val.error){
        res.status(404).json({
            message:"We were unable to verify your Caller ID"
        });
        return;
    }
    res.status(200).json({
        message:"caller Id verified"
    });
    return;
  }catch(err){
    console.error(err);
    res.status(500).json({ message: "Error validating number" });
    return;
  }
}
export  {createValidationRequest,validateNumber};