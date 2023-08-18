let sendMQTTMessageP = require('.setMqttData.js').sendMQTTMessageP;

let data3 = [{
    "name": "VPLC_1",
    "mm": [{
        "name": "VPLC_1.MES_XINTIAO",
        "value": 1,
    }]
}]
setInterval(() => {
    // data3[0].mm.value = data3[0].mm.value == 1 ? 0 : 1;
    console.log('12', data3[0].mm[0].value)
    if (data3[0].mm[0].value == 1) {
        data3[0].mm[0].value = 0
    } else {
        data3[0].mm[0].value = 1
    }
    console.log('123', data3[0])
    sendMQTTMessageP(data3)
}, 1000)