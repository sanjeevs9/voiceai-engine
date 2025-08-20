// Download the helper library from https://www.twilio.com/docs/node/install
import twilio from "twilio"; // Or, for ESM: import twilio from "twilio";
import { Request, Response } from "express";
import { Token } from "aws-sdk";

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
   myHeaders.append("x-twilio-csrf", twilioCsrfToken || "");
   myHeaders.append("Cookie", "current-account=ACb11c02b5c89f6ab7a7d4b7f9d3bfd40d; affinity=\"d1ebc01806714a89\"; mutiny.user.token=b757cffc-90ce-4c67-bfc4-8325dee3d4c3; mutiny.user.token=b757cffc-90ce-4c67-bfc4-8325dee3d4c3; notice_behavior=none; at_check=true; AMCVS_32523BB96217F7B60A495CB6%40AdobeOrg=1; _ALGOLIA=anonymous-66d02324-0d46-449e-b20a-b501f9fa58f1; _mkto_trk=id:294-TKB-300&token:_mch-twilio.com-7fed181bd9ea523d3a427cd562c7944; sa-r-source=www.google.com; sa-user-id=s%253A0-631cea92-88b8-4af3-47c9-6040d09d6887.kEerz2IJ1Vh7sMfS8iVObiU3tl8coFIlCKv%252BjYEI6hA; sa-user-id-v2=s%253AYxzqkoi4SvNHyWBA0J1ohzHPwpc.gZ9vXsRXBH3hxTPpu2rX18J%252B23pPVqUej%252BTYJ67ErMo; sa-user-id-v3=s%253AAQAKIKa62J6BuC6j_dI4RGthzzJXBqOAiKQXRDjhNpTVTHEBEJIFGAIg9fSSxAY6BDPk3LlCBDL8wOk.0ek%252BXoPw3wHDvKxHB5xcaRCRkneoT%252BczOkoYobK8GyE; ext_name=ojplmecpdpgccookcobabopnaifgidhf; slireg=https://scout.us3.salesloft.com; _gcl_au=1.1.1058243031.1755414580; ga_gtm=%5B%7B%22clientId%22%3A%221164827079.1755414580%22%2C%22measurementId%22%3A%22G-RRP8K4M4F3%22%7D%5D; ga_dl=%5B%7B%22clientId%22%3A%221164827079.1755414580%22%2C%22measurementId%22%3A%22G-B1EHG633YE%22%7D%5D; sliguid=9ee6fcba-65bc-478a-827d-f873fec7abf6; slirequested=true; _gd_visitor=8dcb90a7-75a3-4521-8e0a-45544acd9c60; _cq_duid=1.1755414608.XhabJQZv63b8lxhL; _cq_suid=1.1755414608.m7Nm974rtktC1iS0; _an_uid=1306083486092521315; _zitok=369715edf22245ef8c401755414612; identity=; _hjSessionUser_1359002=eyJpZCI6IjNkY2VhZGMzLTc4NDktNWZmOC04Y2E4LWUzZTVjYmRhYzVhMCIsImNyZWF0ZWQiOjE3NTU0MTQ2NDM5NjgsImV4aXN0aW5nIjp0cnVlfQ==; __Host-authjs.csrf-token=5b1cadc052463625f2ef60372e5f724c62d28a6f8e5caa038f17cc16e10afe3e%7Cac93e2f1fb7d42f13c91831830decca8e26cae049afe1220f86febdf481dc7c3; __Secure-authjs.callback-url=https%3A%2F%2Fwww.twilio.com; tw-session-id=17554288891010.9959768873631104; __ssid=6fb5a49953a94a13199a48b407c01d2; sa-r-date=2025-08-19T10:41:53.946Z; _gid=GA1.2.2145389165.1755600166; AMCV_32523BB96217F7B60A495CB6%40AdobeOrg=179643557%7CMCIDTS%7C20320%7CMCMID%7C82661704007077640512701082754807659840%7CMCAAMLH-1756225018%7C12%7CMCAAMB-1756225018%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1755627418s%7CNONE%7CvVersion%7C5.5.0; _gd_session=2196e1fe-0f14-4298-8dc6-bfb76562d94a; _hjSession_1359002=eyJpZCI6ImQ5ZjM2ZmJiLTQzZjUtNDIzZC1iZTU3LTQ5Yjk2MDRjYjY1YiIsImMiOjE3NTU2NzY1MzcwNjksInMiOjAsInIiOjAsInNiIjowLCJzciI6MCwic2UiOjAsImZzIjowLCJzcCI6MX0=; mbox=PC#f0e0a610d2684200a93d3a21842f1931.41_0#1818921732|session#edfb8b235bc54ecfbf83fffcfaa17c16#1755678792; _rdt_uuid=1755414578696.f9ae9218-e9df-47ba-93a8-8eee46fc3765; _uetsid=1ec25d407ce911f0b82f25e5a7c91622; _uetvid=356bc6607b3911f098d11368795303b6; _clck=1hyoiwm%5E2%5Efym%5E0%5E2055; _clsk=l0udv0%5E1755676933495%5E1%5E1%5Ev.clarity.ms%2Fcollect; __q_state_zCnvhQFqeieM7u15=eyJ1dWlkIjoiZTczOGFlNTktM2E5Zi00ZGFmLWFlYzYtMGI5ZmQzOTU1YzgzIiwiY29va2llRG9tYWluIjoidHdpbGlvLmNvbSIsIm1lc3NlbmdlckV4cGFuZGVkIjpmYWxzZSwicHJvbXB0RGlzbWlzc2VkIjpmYWxzZSwiY29udmVyc2F0aW9uSWQiOiIxNzIzNzAyNzY1Mjc1MzI1OTYyIn0=; _ga_B1EHG633YE=GS2.1.s1755676949$o5$g0$t1755676949$j60$l0$h0; ajs_group_id=ACd93eabe0b4aab570c4ed278cb4fae490; _hp2_ses_props.1541905715=%7B%22r%22%3A%22https%3A%2F%2Fconsole.twilio.com%2Faccount%2Fverification%2Fgate%22%2C%22ts%22%3A1755681200298%2C%22d%22%3A%22console.twilio.com%22%2C%22h%22%3A%22%2Fus1%2Fdevelop%2Fphone-numbers%2Fmanage%2Fverified%22%7D; builderSessionId=5c51f3b671794952bf00b3b4d80a1d05; ajs_anonymous_id=b5ac0100-74ab-4c92-b3af-b2edf6317360; ajs_user_id=US46d07a943ac1420c83351a7609a4a9cf; _ga=GA1.2.1164827079.1755414580; _ga_RRP8K4M4F3=GS2.1.s1755681201$o8$g1$t1755681750$j60$l0$h0; _hp2_id.1541905715=%7B%22userId%22%3A%227606933370783429%22%2C%22pageviewId%22%3A%22494502307224000%22%2C%22sessionId%22%3A%22137099375229510%22%2C%22identity%22%3A%22US46d07a943ac1420c83351a7609a4a9cf%22%2C%22trackerVersion%22%3A%224.0%22%2C%22identityField%22%3Anull%2C%22isIdentified%22%3A1%2C%22oldIdentity%22%3Anull%7D; server-identity=ZTE=LA==MQ==LA==3X2b3POTtWXxuE1sLA==FvlukfJ0kOAUsNRxv1MgrI0LXsZps8-NuQCMNytbwPF6RATzQVLw6UZdoXXj8g1hpLdBGzRTmtBpDzj3VXs=; tw-visitor=eyJrZXlJZCI6InZpc2l0b3JFbmNyeXB0aW9uS2V5Iiwibm9uY2UiOiJ2VlZHazVwcThEcWgzSDQ2IiwicGF5bG9hZCI6Ikc1OXl2eUdWQ21FODExYWdHcnJpSjhJNklPZ1EyUkt4bHo3Rmg5a21lVW9XSTJTMUovOC91dFh2TlJMbURwQ3NYYTQ9IiwiY3J5cHRvSWQiOjQsImFkZGl0aW9uYWxEYXRhIjoiZEc5aFdWazNkMkpMVG5kQmNFOXJWalp0WjNCUWFrNHpSMVZYVlZSUFRXMD0ifQ==; identity=; server-identity=; tw-visitor=eyJrZXlJZCI6InZpc2l0b3JFbmNyeXB0aW9uS2V5Iiwibm9uY2UiOiJ1aHlobXZMWWhkT29qZ2QrIiwicGF5bG9hZCI6Im1IK0ZTaFhVaHJFcWdnZ1RvMGFPNUFTVVFtaTlhUVpGUk9pMldDaFRPZC9zQzQrNDVyRVVqdzc0VURoaE5tdm1qZkk9IiwiY3J5cHRvSWQiOjQsImFkZGl0aW9uYWxEYXRhIjoiZEc5aFdWazNkMkpMVG5kQmNFOXJWalp0WjNCUWFrNHpSMVZYVlZSUFRXMD0ifQ==");
   
   const raw = JSON.stringify({
     "CountryCode": "+91",
     "PhoneNumber": "6200089336"
   });
   
   const requestOptions = {
     method: "POST",
     headers: myHeaders,
     body: raw,
     redirect: "follow" as RequestRedirect
   };
   
   const response=await fetch("https://www.twilio.com/console/phone-numbers/verify/message", requestOptions)


 console.log({response});
const val=await response.json();
console.log({val});
    if(val.fatal){
        res.status(404).json({
            message:val.fatal
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
  myHeaders.append("Cookie", "current-account=ACb11c02b5c89f6ab7a7d4b7f9d3bfd40d; affinity=\"d1ebc01806714a89\"; mutiny.user.token=b757cffc-90ce-4c67-bfc4-8325dee3d4c3; mutiny.user.token=b757cffc-90ce-4c67-bfc4-8325dee3d4c3; notice_behavior=none; at_check=true; AMCVS_32523BB96217F7B60A495CB6%40AdobeOrg=1; _ALGOLIA=anonymous-66d02324-0d46-449e-b20a-b501f9fa58f1; _mkto_trk=id:294-TKB-300&token:_mch-twilio.com-7fed181bd9ea523d3a427cd562c7944; sa-r-source=www.google.com; sa-user-id=s%253A0-631cea92-88b8-4af3-47c9-6040d09d6887.kEerz2IJ1Vh7sMfS8iVObiU3tl8coFIlCKv%252BjYEI6hA; sa-user-id-v2=s%253AYxzqkoi4SvNHyWBA0J1ohzHPwpc.gZ9vXsRXBH3hxTPpu2rX18J%252B23pPVqUej%252BTYJ67ErMo; sa-user-id-v3=s%253AAQAKIKa62J6BuC6j_dI4RGthzzJXBqOAiKQXRDjhNpTVTHEBEJIFGAIg9fSSxAY6BDPk3LlCBDL8wOk.0ek%252BXoPw3wHDvKxHB5xcaRCRkneoT%252BczOkoYobK8GyE; ext_name=ojplmecpdpgccookcobabopnaifgidhf; slireg=https://scout.us3.salesloft.com; _gcl_au=1.1.1058243031.1755414580; ga_gtm=%5B%7B%22clientId%22%3A%221164827079.1755414580%22%2C%22measurementId%22%3A%22G-RRP8K4M4F3%22%7D%5D; ga_dl=%5B%7B%22clientId%22%3A%221164827079.1755414580%22%2C%22measurementId%22%3A%22G-B1EHG633YE%22%7D%5D; sliguid=9ee6fcba-65bc-478a-827d-f873fec7abf6; slirequested=true; _gd_visitor=8dcb90a7-75a3-4521-8e0a-45544acd9c60; _cq_duid=1.1755414608.XhabJQZv63b8lxhL; _cq_suid=1.1755414608.m7Nm974rtktC1iS0; _an_uid=1306083486092521315; _zitok=369715edf22245ef8c401755414612; identity=; _hjSessionUser_1359002=eyJpZCI6IjNkY2VhZGMzLTc4NDktNWZmOC04Y2E4LWUzZTVjYmRhYzVhMCIsImNyZWF0ZWQiOjE3NTU0MTQ2NDM5NjgsImV4aXN0aW5nIjp0cnVlfQ==; __Host-authjs.csrf-token=5b1cadc052463625f2ef60372e5f724c62d28a6f8e5caa038f17cc16e10afe3e%7Cac93e2f1fb7d42f13c91831830decca8e26cae049afe1220f86febdf481dc7c3; __Secure-authjs.callback-url=https%3A%2F%2Fwww.twilio.com; tw-session-id=17554288891010.9959768873631104; __ssid=6fb5a49953a94a13199a48b407c01d2; sa-r-date=2025-08-19T10:41:53.946Z; _gid=GA1.2.2145389165.1755600166; AMCV_32523BB96217F7B60A495CB6%40AdobeOrg=179643557%7CMCIDTS%7C20320%7CMCMID%7C82661704007077640512701082754807659840%7CMCAAMLH-1756225018%7C12%7CMCAAMB-1756225018%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1755627418s%7CNONE%7CvVersion%7C5.5.0; _gd_session=2196e1fe-0f14-4298-8dc6-bfb76562d94a; _hjSession_1359002=eyJpZCI6ImQ5ZjM2ZmJiLTQzZjUtNDIzZC1iZTU3LTQ5Yjk2MDRjYjY1YiIsImMiOjE3NTU2NzY1MzcwNjksInMiOjAsInIiOjAsInNiIjowLCJzciI6MCwic2UiOjAsImZzIjowLCJzcCI6MX0=; mbox=PC#f0e0a610d2684200a93d3a21842f1931.41_0#1818921732|session#edfb8b235bc54ecfbf83fffcfaa17c16#1755678792; _rdt_uuid=1755414578696.f9ae9218-e9df-47ba-93a8-8eee46fc3765; _uetsid=1ec25d407ce911f0b82f25e5a7c91622; _uetvid=356bc6607b3911f098d11368795303b6; _clck=1hyoiwm%5E2%5Efym%5E0%5E2055; _clsk=l0udv0%5E1755676933495%5E1%5E1%5Ev.clarity.ms%2Fcollect; __q_state_zCnvhQFqeieM7u15=eyJ1dWlkIjoiZTczOGFlNTktM2E5Zi00ZGFmLWFlYzYtMGI5ZmQzOTU1YzgzIiwiY29va2llRG9tYWluIjoidHdpbGlvLmNvbSIsIm1lc3NlbmdlckV4cGFuZGVkIjpmYWxzZSwicHJvbXB0RGlzbWlzc2VkIjpmYWxzZSwiY29udmVyc2F0aW9uSWQiOiIxNzIzNzAyNzY1Mjc1MzI1OTYyIn0=; _ga_B1EHG633YE=GS2.1.s1755676949$o5$g0$t1755676949$j60$l0$h0; ajs_group_id=ACd93eabe0b4aab570c4ed278cb4fae490; _hp2_ses_props.1541905715=%7B%22r%22%3A%22https%3A%2F%2Fconsole.twilio.com%2Faccount%2Fverification%2Fgate%22%2C%22ts%22%3A1755681200298%2C%22d%22%3A%22console.twilio.com%22%2C%22h%22%3A%22%2Fus1%2Fdevelop%2Fphone-numbers%2Fmanage%2Fverified%22%7D; builderSessionId=5c51f3b671794952bf00b3b4d80a1d05; ajs_anonymous_id=b5ac0100-74ab-4c92-b3af-b2edf6317360; ajs_user_id=US46d07a943ac1420c83351a7609a4a9cf; _ga=GA1.2.1164827079.1755414580; _ga_RRP8K4M4F3=GS2.1.s1755681201$o8$g1$t1755681750$j60$l0$h0; _hp2_id.1541905715=%7B%22userId%22%3A%227606933370783429%22%2C%22pageviewId%22%3A%22494502307224000%22%2C%22sessionId%22%3A%22137099375229510%22%2C%22identity%22%3A%22US46d07a943ac1420c83351a7609a4a9cf%22%2C%22trackerVersion%22%3A%224.0%22%2C%22identityField%22%3Anull%2C%22isIdentified%22%3A1%2C%22oldIdentity%22%3Anull%7D; server-identity=ZTE=LA==MQ==LA==3X2b3POTtWXxuE1sLA==FvlukfJ0kOAUsNRxv1MgrI0LXsZps8-NuQCMNytbwPF6RATzQVLw6UZdoXXj8g1hpLdBGzRTmtBpDzj3VXs=; tw-visitor=eyJrZXlJZCI6InZpc2l0b3JFbmNyeXB0aW9uS2V5Iiwibm9uY2UiOiJ2VlZHazVwcThEcWgzSDQ2IiwicGF5bG9hZCI6Ikc1OXl2eUdWQ21FODExYWdHcnJpSjhJNklPZ1EyUkt4bHo3Rmg5a21lVW9XSTJTMUovOC91dFh2TlJMbURwQ3NYYTQ9IiwiY3J5cHRvSWQiOjQsImFkZGl0aW9uYWxEYXRhIjoiZEc5aFdWazNkMkpMVG5kQmNFOXJWalp0WjNCUWFrNHpSMVZYVlZSUFRXMD0ifQ==; identity=; server-identity=; tw-visitor=eyJrZXlJZCI6InZpc2l0b3JFbmNyeXB0aW9uS2V5Iiwibm9uY2UiOiJ1aHlobXZMWWhkT29qZ2QrIiwicGF5bG9hZCI6Im1IK0ZTaFhVaHJFcWdnZ1RvMGFPNUFTVVFtaTlhUVpGUk9pMldDaFRPZC9zQzQrNDVyRVVqdzc0VURoaE5tdm1qZkk9IiwiY3J5cHRvSWQiOjQsImFkZGl0aW9uYWxEYXRhIjoiZEc5aFdWazNkMkpMVG5kQmNFOXJWalp0WjNCUWFrNHpSMVZYVlZSUFRXMD0ifQ==");
    
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

    console.log(response);
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




