var mqtt = require("mqtt");
const util = require("util")
var log4js = require('log4js');
const { promises } = require("dns");

const logger = log4js.getLogger("cheese");
logger.trace("Entering cheese testing");
logger.debug("by zhengkai.blog.csdn.net");
logger.info("Cheese is Comté.");
logger.warn("Cheese is quite smelly.");
logger.error("Cheese is too ripe!");
logger.fatal("Cheese:", {
    name: "Cheese",
    type: "food"
});


var connectUrl = 'mqtt://192.168.0.248:1883';
var MQTT_OPTIONS = {
    // clientId:"17849359",
    // username:"admin",
    // password:"password",
    connectTimeout: 10, // (s)
    clean: true,
    will: {
        topic: 'ioserver/out/datawrite', // 发布消息的主题
        payload: 'Connection Closed abnormally!', // 要发布的消息
        qos: 2, // 消息等级
        retain: false // 保留消息标识
    }
    // reconnectPeriod:4000   //(ms)
}

var client = "";
// 连接mqtt的方法
function connectMqtt(address) {
    connectUrl = "mqtt://" + address + ":1883"
    client = mqtt.connect(connectUrl, MQTT_OPTIONS);
    logger.info("MQTT，publish连接成功！")
}

//matt写的方法，需要得到数据的name和value
function sendMQTTMessage(mms, res) {

    console.log("llllllllllllllllllllwlwlwlwe" + mms)

    //将数据封装成json
    var objData = {
        "did": "",
        "mms": [{
            "id": "",
            "name": "",
            "mm": [{
                "name": "",
                "value": ""
            }]
        }]
    }

    objData.did = "1234567890";
    objData.mms = mms;
    //连接时判断是否需要重新连接
    //sessionStorage.setItem("mqttStatue","1");
    console.log("909090909090909090990909090" + JSON.stringify(objData))
    console.log('client' + client)
    if (!client) {
        connectMqtt("192.168.0.90")
    }
    client.publish("ioserver/out/datawrite", JSON.stringify(objData));
    client.on("disconnect", () => {
        logger.warn("MQTT中断！")
    }).on("error", function(error) {
        logger.error("MQTT发生错误：", error)
    }).on("close", () => {
        logger.warn("MQTT关闭！")
    })
}


var sendMQTTMessageP = (mms) => {
    return new Promise((resolve, reject) => {
        console.log("收到要发送的数据" + mms);

        //将数据封装成json
        var objData = {
            "did": "",
            "mms": [{
                "id": "",
                "name": "",
                "mm": [{
                    "name": "",
                    "value": ""
                }]
            }]
        }

        objData.did = "1234567890";
        objData.mms = mms;
        //连接时判断是否需要重新连接
        //sessionStorage.setItem("mqttStatue","1");
        console.log("909090909090909090990909090" + JSON.stringify(objData))
        console.log('client' + client)
        if (!client) {
            connectMqtt("192.168.0.90")
        }
        client.publish("ioserver/out/datawrite", JSON.stringify(objData));
        resolve(1)
        client.on("disconnect", () => {
            logger.warn("MQTT中断！")
        }).on("error", function(error) {
            logger.error("MQTT发生错误：", error)
        }).on("close", () => {
            logger.warn("MQTT关闭！")
        })

    })
}
module.exports = {
    sendMQTTMessage,
    sendMQTTMessageP,
    connectMqtt
}