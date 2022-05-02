const express = require(`express`);
const line = require(`@line/bot-sdk`);
const fetch = require(`node-fetch`);
const CONFIG = {
  channelAccessToken: ``,
  channelSecret: ``,
};

const app = express();
const client = new line.Client(CONFIG);
app.get(`/`, async (req, rep) => {
  let url = `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-79D4FC47-04F4-436C-BB72-993ECDF752C8&limit=1&locationName=`;

  let json = await fetch(url).then((r) => r.json());
  //console.log(json);
  let { locationName, weatherElement } = json.records.location[0];
  let parameter = weatherElement[1].time[0].parameter;
  console.log(parameter);
  let reponse = `${parameter.parameterName} %`
  rep.end(reponse);
});
app.post(`/webhook`, line.middleware(CONFIG), (req, rep) => {
  console.log(req.body.events);
  req.body.events.map(async e=>{
    let text= e.message.text;
    if(text.search(`天氣`)>-1){
      let url = `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-79D4FC47-04F4-436C-BB72-993ECDF752C8&limit=1&locationName=`;

      let json = await fetch(url).then((r) => r.json());
      //console.log(json);
      let { locationName, weatherElement } = json.records.location[0];
      let parameter = weatherElement[1].time[0].parameter;
      console.log(parameter);
      text = `${locationName} 的降雨機率是 ${parameter.parameterName} %`
    }
    
    client.replyMessage(e.replyToken, {
      type: `text`,
      text: text,
    });
  })

  // let event = req.body.events[0];
  // let { text } = event.message;
  // if (text.search(`天氣`) > 0) {
  //   // search
  // } else {
  //   text = `我不明白`;
  // }

  // client.replyMessage(event.replyToken, {
  //   type: `text`,
  //   text: text,
  // });
});
app.listen(8080, () => {
  console.log(`running`);
});