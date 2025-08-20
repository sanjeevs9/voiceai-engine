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
    myHeaders.append("accept-language", "en-US,en;q=0.9");
    myHeaders.append("content-type", "application/json");
    myHeaders.append("origin", "https://console.twilio.com");
    myHeaders.append("priority", "u=1, i");
    myHeaders.append("referer", "https://console.twilio.com/");
    myHeaders.append("sec-ch-ua", "\"Not;A=Brand\";v=\"99\", \"Google Chrome\";v=\"139\", \"Chromium\";v=\"139\"");
    myHeaders.append("sec-ch-ua-mobile", "?0");
    myHeaders.append("sec-ch-ua-platform", "\"macOS\"");
    myHeaders.append("sec-fetch-dest", "empty");
    myHeaders.append("sec-fetch-mode", "cors");
    myHeaders.append("sec-fetch-site", "same-site");
    myHeaders.append("user-agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36");
    myHeaders.append("x-twilio-csrf", "e2cfa67d8b1c08f418dc4f09c90a338af3ec74884a1bc43e3950c29e3c4466c4");
    myHeaders.append("Cookie", "current-account=ACc77c9f5783ce573c7332792c0e9dcce2; AMCV_32523BB96217F7B60A495CB6%40AdobeOrg=179643557%7CMCIDTS%7C20108%7CMCMID%7C23158895978694338111312434748078766292%7CMCAAMLH-1737924024%7C12%7CMCAAMB-1737924024%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1737326424s%7CNONE%7CvVersion%7C5.5.0; notice_behavior=none; _gd_visitor=c4867b86-2c59-4370-8045-ad5507146ece; _mkto_trk=id:294-TKB-300&token:_mch-twilio.com-b5459f8556a54af6847e487011f32a24; _clck=izm9x5%7C2%7Cfsp%7C0%7C1845; _cs_c=0; _hjSessionUser_1359002=eyJpZCI6IjkyMmZlMGZlLTg3YjEtNTA3NS1hMDU0LWVjZDUxZTZjZDgyOCIsImNyZWF0ZWQiOjE3MzczMTkyMjYwMDAsImV4aXN0aW5nIjp0cnVlfQ==; sa-user-id=s%253A0-8f608f2c-b91f-4bd4-51b1-db6b7c903cc1.cATuu5YkkH%252FsGCzsEceDxf%252B5bmjSSp16ATTpytn70YA; sa-user-id-v2=s%253Aj2CPLLkfS9RRsdtrfJA8wQ.jq%252B%252FH%252BRyZ7HtaRfEw3JQAgPwLNaZ6WL%252FxhwleL3OpbU; sa-user-id-v3=s%253AAQAKIMYwUbDg_uj1TMvlGVQmbsMv1bUx_h-7SC1PWKNSehrYEJIFGAIgxZuauwY6BCjhlxhCBJ2cpvM.NsBPI7ngxwKzc6Tbovnb9Uj2tKHoyMbSzDWKd8%252BZQFY; __q_state_zCnvhQFqeieM7u15=eyJ1dWlkIjoiOTIwMDRiMmQtMTU1YS00NWExLWIwOTctODViNjk3YjA3MGQ3IiwiY29va2llRG9tYWluIjoidHdpbGlvLmNvbSIsImFjdGl2ZVNlc3Npb25JZCI6bnVsbCwic2NyaXB0SWQiOm51bGwsInN0YXRlQnlTY3JpcHRJZCI6bnVsbCwibWVzc2VuZ2VyRXhwYW5kZWQiOm51bGwsInByb21wdERpc21pc3NlZCI6dHJ1ZSwiY29udmVyc2F0aW9uSWQiOm51bGx9; _zitok=c003184eba4ca3bd36e81737319239; mbox=session#c67756006ae5476c99e8a48ca2065b3b#1737321137|PC#c67756006ae5476c99e8a48ca2065b3b.41_0#1800564077; tw-csrftoken=9be5SMlAFZ1nnSvjyhZgM5S2Os15kliQ7xXSZOfkUgrGqXC142JZmUnR6uXmp0Gc; _cs_id=68d9be22-fc47-ac22-84f2-d0f780de7a49.1737319225.1.1737319296.1737319225.1728518226.1771483225957.1; _uetvid=9c782450d6a511efb781b7efc713bc50; __Host-authjs.csrf-token=6fcd64b8e24e7fc8bb111f882d07f6fa98546793a8dfb3bc31294f9090718488%7Ca8c179a8b7f6fa3661ae633137cc4b801821d6e931c02ed1c9eec022a2462d66; __Secure-authjs.callback-url=https%3A%2F%2Fwww.twilio.com; identity=; tw-auth0-code-verifier=za4UiKumt2IBKVoNStGBQjTIN2C7rJ3VW4w1WItQ8-4; tw-auth0-nonce=8Oq3pE0ImJHrEoEMijaTlg; tw-auth0-state=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJvbmVfY29uc29sZSI6ZmFsc2UsImlzcyI6IlVBUyIsImRlZXBsaW5rX2ciOiIiLCJleHAiOjE3NTU2ODM4NjgsImRlZXBsaW5rX3QiOiIiLCJpYXQiOjE3NTU2ODIwNjh9.UDQ_4X-bx8X-6LMfURTgSURpRcBoLzmZBsBbjO0R3dE; _cq_duid=1.1755682073.cc2bOGDCNKSbq4xN; _cq_suid=1.1755682073.aUAdJkQN0knwFVC0; builderSessionId=bfc153c108724e0eb0d8a454ad5926b4; _gid=GA1.2.1560416952.1755682087; _hjSession_1359002=eyJpZCI6ImIwOGVlNzFiLWQ5ZmYtNDE0NC1iNDdmLWFhMTZkOTYwYTNjMyIsImMiOjE3NTU2ODIwOTA2NzIsInMiOjAsInIiOjAsInNiIjowLCJzciI6MCwic2UiOjAsImZzIjowLCJzcCI6MH0=; ajs_user_id=US4890ffaffa1d5852495b0c2deab87f8c; _hp2_ses_props.1541905715=%7B%22r%22%3A%22https%3A%2F%2Fconsole.twilio.com%2F%22%2C%22ts%22%3A1755682095390%2C%22d%22%3A%22console.twilio.com%22%2C%22h%22%3A%22%2F%22%7D; _ga=GA1.2.1621861064.1737319225; ajs_group_id=ACc77c9f5783ce573c7332792c0e9dcce2; ajs_anonymous_id=6dc3edf6-cfa1-45e1-bdc5-5fd95533feee; _dd_s=rum=2&id=58f3a8a7-fd8c-4201-8232-f5a29d725c25&created=1755682051509&expire=1755682966931; _ga_RRP8K4M4F3=GS2.1.s1755682095$o2$g1$t1755682194$j24$l0$h0; _hp2_id.1541905715=%7B%22userId%22%3A%223437070332912578%22%2C%22pageviewId%22%3A%226624084406158168%22%2C%22sessionId%22%3A%225970387595842651%22%2C%22identity%22%3A%22US4890ffaffa1d5852495b0c2deab87f8c%22%2C%22trackerVersion%22%3A%224.0%22%2C%22identityField%22%3Anull%2C%22isIdentified%22%3A1%2C%22oldIdentity%22%3Anull%7D; server-identity=ZTE=LA==MQ==LA==zBWBRhpbxr80oT2gLA==WLS8tEG_dwWzORYgFLHmPg5mktqp3LWPbR9-bZZ71Y4ilpIZZqj-uwqy1VlOLZKBu63Y_TIcsr58Rcslv7Q=; tw-visitor=eyJrZXlJZCI6InZpc2l0b3JFbmNyeXB0aW9uS2V5Iiwibm9uY2UiOiJwb2pCSThobjc4UFE1QUYxIiwicGF5bG9hZCI6IkFxYndidWIzTXhZY1lYWTlHTlpxc2VsaWJVcW1jeXk1d2s5VENrM3h5VSsyM05VMnR1d2lPbTcvY0d5NSs2bGI2SGc9IiwiY3J5cHRvSWQiOjQsImFkZGl0aW9uYWxEYXRhIjoiZEc5aFdWazNkMkpMVG5kQmNFOXJWalp0WjNCUWFrNHpSMVZYVlZSUFRXMD0ifQ==; identity=; server-identity=ZTE=LA==MQ==LA==uuxA9bjAz1_labcFLA==Ia_FMrN9o2R0I9hegBqrVqtju_PgSEkNDbpGZIHn7Raq3wo53-n0TnCR_yWfLC0-pp-qHruW-tvviNfnpKQ=; tw-visitor=eyJrZXlJZCI6InZpc2l0b3JFbmNyeXB0aW9uS2V5Iiwibm9uY2UiOiJpaTVMc1Vtb3ZaY3hiRjBWIiwicGF5bG9hZCI6Ik5yTEpsd2R5bkdSdVIrRUx6MVpTVkVaeDl6TnNZaFYzcVlhQ2pLT0l6RlkyeEJzVWN3ajZBMmFaRGw2aVoxNlRLMDQ9IiwiY3J5cHRvSWQiOjQsImFkZGl0aW9uYWxEYXRhIjoiZEc5aFdWazNkMkpMVG5kQmNFOXJWalp0WjNCUWFrNHpSMVZYVlZSUFRXMD0ifQ==; identity=; server-identity=; tw-visitor=eyJrZXlJZCI6InZpc2l0b3JFbmNyeXB0aW9uS2V5Iiwibm9uY2UiOiJ1aHlobXZMWWhkT29qZ2QrIiwicGF5bG9hZCI6Im1IK0ZTaFhVaHJFcWdnZ1RvMGFPNUFTVVFtaTlhUVpGUk9pMldDaFRPZC9zQzQrNDVyRVVqdzc0VURoaE5tdm1qZkk9IiwiY3J5cHRvSWQiOjQsImFkZGl0aW9uYWxEYXRhIjoiZEc5aFdWazNkMkpMVG5kQmNFOXJWalp0WjNCUWFrNHpSMVZYVlZSUFRXMD0ifQ==");
    
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
    myHeaders.append("accept-language", "en-US,en;q=0.9");
    myHeaders.append("content-type", "application/json");
    myHeaders.append("origin", "https://console.twilio.com");
    myHeaders.append("priority", "u=1, i");
    myHeaders.append("referer", "https://console.twilio.com/");
    myHeaders.append("sec-ch-ua", "\"Not;A=Brand\";v=\"99\", \"Google Chrome\";v=\"139\", \"Chromium\";v=\"139\"");
    myHeaders.append("sec-ch-ua-mobile", "?0");
    myHeaders.append("sec-ch-ua-platform", "\"macOS\"");
    myHeaders.append("sec-fetch-dest", "empty");
    myHeaders.append("sec-fetch-mode", "cors");
    myHeaders.append("sec-fetch-site", "same-site");
    myHeaders.append("user-agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36");
    myHeaders.append("x-twilio-csrf", "e2cfa67d8b1c08f418dc4f09c90a338af3ec74884a1bc43e3950c29e3c4466c4");
    myHeaders.append("Cookie", "current-account=ACc77c9f5783ce573c7332792c0e9dcce2; AMCV_32523BB96217F7B60A495CB6%40AdobeOrg=179643557%7CMCIDTS%7C20108%7CMCMID%7C23158895978694338111312434748078766292%7CMCAAMLH-1737924024%7C12%7CMCAAMB-1737924024%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1737326424s%7CNONE%7CvVersion%7C5.5.0; notice_behavior=none; _gd_visitor=c4867b86-2c59-4370-8045-ad5507146ece; _mkto_trk=id:294-TKB-300&token:_mch-twilio.com-b5459f8556a54af6847e487011f32a24; _clck=izm9x5%7C2%7Cfsp%7C0%7C1845; _cs_c=0; _hjSessionUser_1359002=eyJpZCI6IjkyMmZlMGZlLTg3YjEtNTA3NS1hMDU0LWVjZDUxZTZjZDgyOCIsImNyZWF0ZWQiOjE3MzczMTkyMjYwMDAsImV4aXN0aW5nIjp0cnVlfQ==; sa-user-id=s%253A0-8f608f2c-b91f-4bd4-51b1-db6b7c903cc1.cATuu5YkkH%252FsGCzsEceDxf%252B5bmjSSp16ATTpytn70YA; sa-user-id-v2=s%253Aj2CPLLkfS9RRsdtrfJA8wQ.jq%252B%252FH%252BRyZ7HtaRfEw3JQAgPwLNaZ6WL%252FxhwleL3OpbU; sa-user-id-v3=s%253AAQAKIMYwUbDg_uj1TMvlGVQmbsMv1bUx_h-7SC1PWKNSehrYEJIFGAIgxZuauwY6BCjhlxhCBJ2cpvM.NsBPI7ngxwKzc6Tbovnb9Uj2tKHoyMbSzDWKd8%252BZQFY; __q_state_zCnvhQFqeieM7u15=eyJ1dWlkIjoiOTIwMDRiMmQtMTU1YS00NWExLWIwOTctODViNjk3YjA3MGQ3IiwiY29va2llRG9tYWluIjoidHdpbGlvLmNvbSIsImFjdGl2ZVNlc3Npb25JZCI6bnVsbCwic2NyaXB0SWQiOm51bGwsInN0YXRlQnlTY3JpcHRJZCI6bnVsbCwibWVzc2VuZ2VyRXhwYW5kZWQiOm51bGwsInByb21wdERpc21pc3NlZCI6dHJ1ZSwiY29udmVyc2F0aW9uSWQiOm51bGx9; _zitok=c003184eba4ca3bd36e81737319239; mbox=session#c67756006ae5476c99e8a48ca2065b3b#1737321137|PC#c67756006ae5476c99e8a48ca2065b3b.41_0#1800564077; tw-csrftoken=9be5SMlAFZ1nnSvjyhZgM5S2Os15kliQ7xXSZOfkUgrGqXC142JZmUnR6uXmp0Gc; _cs_id=68d9be22-fc47-ac22-84f2-d0f780de7a49.1737319225.1.1737319296.1737319225.1728518226.1771483225957.1; _uetvid=9c782450d6a511efb781b7efc713bc50; __Host-authjs.csrf-token=6fcd64b8e24e7fc8bb111f882d07f6fa98546793a8dfb3bc31294f9090718488%7Ca8c179a8b7f6fa3661ae633137cc4b801821d6e931c02ed1c9eec022a2462d66; __Secure-authjs.callback-url=https%3A%2F%2Fwww.twilio.com; identity=; tw-auth0-code-verifier=za4UiKumt2IBKVoNStGBQjTIN2C7rJ3VW4w1WItQ8-4; tw-auth0-nonce=8Oq3pE0ImJHrEoEMijaTlg; tw-auth0-state=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJvbmVfY29uc29sZSI6ZmFsc2UsImlzcyI6IlVBUyIsImRlZXBsaW5rX2ciOiIiLCJleHAiOjE3NTU2ODM4NjgsImRlZXBsaW5rX3QiOiIiLCJpYXQiOjE3NTU2ODIwNjh9.UDQ_4X-bx8X-6LMfURTgSURpRcBoLzmZBsBbjO0R3dE; _cq_duid=1.1755682073.cc2bOGDCNKSbq4xN; _cq_suid=1.1755682073.aUAdJkQN0knwFVC0; builderSessionId=bfc153c108724e0eb0d8a454ad5926b4; _gid=GA1.2.1560416952.1755682087; _hjSession_1359002=eyJpZCI6ImIwOGVlNzFiLWQ5ZmYtNDE0NC1iNDdmLWFhMTZkOTYwYTNjMyIsImMiOjE3NTU2ODIwOTA2NzIsInMiOjAsInIiOjAsInNiIjowLCJzciI6MCwic2UiOjAsImZzIjowLCJzcCI6MH0=; ajs_user_id=US4890ffaffa1d5852495b0c2deab87f8c; _hp2_ses_props.1541905715=%7B%22r%22%3A%22https%3A%2F%2Fconsole.twilio.com%2F%22%2C%22ts%22%3A1755682095390%2C%22d%22%3A%22console.twilio.com%22%2C%22h%22%3A%22%2F%22%7D; _ga=GA1.2.1621861064.1737319225; ajs_group_id=ACc77c9f5783ce573c7332792c0e9dcce2; ajs_anonymous_id=6dc3edf6-cfa1-45e1-bdc5-5fd95533feee; _ga_RRP8K4M4F3=GS2.1.s1755682095$o2$g1$t1755682194$j24$l0$h0; _hp2_id.1541905715=%7B%22userId%22%3A%223437070332912578%22%2C%22pageviewId%22%3A%226624084406158168%22%2C%22sessionId%22%3A%225970387595842651%22%2C%22identity%22%3A%22US4890ffaffa1d5852495b0c2deab87f8c%22%2C%22trackerVersion%22%3A%224.0%22%2C%22identityField%22%3Anull%2C%22isIdentified%22%3A1%2C%22oldIdentity%22%3Anull%7D; server-identity=ZTE=LA==MQ==LA==SCMJpjc5Xa24eUtlLA==ViSJV1g8dUxAlCOV1BRVeEY0c4C3YwnKV5fFIqGlcd25YbAGy5IsKIrQytA1V5QVN4EFsQsbo0eF5S3cq3Y=; tw-visitor=eyJrZXlJZCI6InZpc2l0b3JFbmNyeXB0aW9uS2V5Iiwibm9uY2UiOiJxL2dIQnRGcXBRVys3M0N3IiwicGF5bG9hZCI6Ikl2a28yblUwTUZadXZ0Uk4xMFZrUGtKNUQ3YzdyS3B3ZisyWUw3WCs3MFU3WVAzTTFTWFhucHJGdGZLYnNEN2pteEk9IiwiY3J5cHRvSWQiOjQsImFkZGl0aW9uYWxEYXRhIjoiZEc5aFdWazNkMkpMVG5kQmNFOXJWalp0WjNCUWFrNHpSMVZYVlZSUFRXMD0ifQ==; _dd_s=rum=2&id=58f3a8a7-fd8c-4201-8232-f5a29d725c25&created=1755682051509&expire=1755682966931; identity=; server-identity=; tw-visitor=eyJrZXlJZCI6InZpc2l0b3JFbmNyeXB0aW9uS2V5Iiwibm9uY2UiOiJ1aHlobXZMWWhkT29qZ2QrIiwicGF5bG9hZCI6Im1IK0ZTaFhVaHJFcWdnZ1RvMGFPNUFTVVFtaTlhUVpGUk9pMldDaFRPZC9zQzQrNDVyRVVqdzc0VURoaE5tdm1qZkk9IiwiY3J5cHRvSWQiOjQsImFkZGl0aW9uYWxEYXRhIjoiZEc5aFdWazNkMkpMVG5kQmNFOXJWalp0WjNCUWFrNHpSMVZYVlZSUFRXMD0ifQ==");
    
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




