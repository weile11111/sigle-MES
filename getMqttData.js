var mqtt = require("mqtt");
const util = require("util");
var log4js = require('log4js');



log4js.configure({
    appenders: {
        out: {
            type: 'console'
        },
        err: {
            type: 'stderr'
        },
        infoLogs: {
            type: 'file',
            filename: 'log/getMqttData.log',
            maxLogSize: 10485760, // 10mb,日志文件大小,超过该size则自动创建新的日志文件
            backups: 120, // 仅保留最新的20个日志文件
            compress: true //  超过maxLogSize,压缩代码
        }

    },
    categories: {
        default: {
            appenders: ['infoLogs', 'out'],
            level: 'INFO'
        },
        err: {
            appenders: ['err'],
            level: 'ERROR'
        }
    }
})







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

console.log = function() {
    logger.info(util.format.apply(null, arguments));
}

console.warn = function() {
    logger.warn(util.format.apply(null, arguments));
}

console.error = function() {
    logger.error(util.format.apply(null, arguments));
}







var connectUrl = 'mqtt://192.168.0.248:1883';
var readyok = 0;
var configsAll;
//告警状态
var heartStatusAll;
//设备状态
var deviceStatusAll;
//工单状态
var group1All;
var group2All;
var group3All;
var group4All;







var MQTT_OPTIONS = {
    // clientId: "17849359",
    // username: "admin",
    connectTimeout: 10, // (s)
    clean: true,
    // reconnectPeriod:4000   //(ms)
}




var TrayData = require('./gettrayData.js');
var WorkerStatus = require('./getRealData.js');
var DeviceStatus = require('./getDevice.js');
var PingProcess = require('./pingProcess.js');



var client = "";
setInterval(() => {
    console.log("下单了了了了了了了了" + readyok);
    TrayData.trayStatus(readyok);
}, 5000)



// 连接mqtt的方法
function connectMqtt(address) {
    connectUrl = "mqtt://" + address + ":1883"
    client = mqtt.connect(connectUrl, MQTT_OPTIONS);
    logger.info("MQTT连接！")
    console.log(connectUrl)
        // sessionStorage.setItem("mqttStatus", "1");
    mqttDataSub(address);

    var clientState = 0;
    //定时任务监听MQTT是否连接成功
    setInterval(() => {
        //判断client是否为空
        if (client == "") {
            flar++;
        } else {
            clientState = 0;
        }
        //如果client为空三次,提示用户
        if (clientState >= 3) {

            PingProcess.connectSCADA(0, address);
        } else {
            PingProcess.connectSCADA(1, address);
        }
    }, 10000)


}


// 订阅mqtt中的数据
function mqttDataSub() {
    client.subscribe("ioserver/in/databatch");
    client.on('message', function(topic, message) {
        logger.warn("MQTt消息", message)
        MQTTconnect = 1
        var topic = topic.toString();
        var msg = message.toString();

        var deviceNum = JSON.parse(msg).mms;

        //快速查询mqtt数据消息

        for (var j = 0; j < deviceNum.length; j++) {
            var deviceName = deviceNum[j].name
            var deviceData = deviceNum[j].mm;

            //快速查询mqtt数据消息

            for (var i = 0; i < deviceData.length; i++) {
                if (deviceData[i].name == deviceName + ".readyok_xinhao") { //下单信号
                    var readyok_xinhao = deviceData[i].value;
                } else if (deviceData[i].name == deviceName + ".GW1_ZT") { //设备状态
                    var GW1_ZT = deviceData[i].value;
                } else if (deviceData[i].name == deviceName + ".GW2_ZT") { //设备状态
                    var GW2_ZT = deviceData[i].value;
                } else if (deviceData[i].name == deviceName + ".GW3_ZT") { //设备状态
                    var GW3_ZT = deviceData[i].value;
                } else if (deviceData[i].name == deviceName + ".WORK_STATE") { //设备状态
                    var GW4_ZT = deviceData[i].value;
                } else if (deviceData[i].name == deviceName + ".GW1_XINTIAO") { //设备的心跳
                    var GW1_XINTIAO = deviceData[i].value;
                } else if (deviceData[i].name == deviceName + ".GW2_XINTIAO") { //设备的心跳
                    var GW2_XINTIAO = deviceData[i].value;
                } else if (deviceData[i].name == deviceName + ".GW3_XINTIAO") { //设备的心跳
                    var GW3_XINTIAO = deviceData[i].value;
                } else if (deviceData[i].name == deviceName + ".HEART") { //设备的心跳
                    var GW4_XINTIAO = deviceData[i].value;
                } else if (deviceData[i].name == deviceName + ".FANGXINGDANGQIANZHI") { //方形数量
                    var BXT_square = deviceData[i].value;
                } else if (deviceData[i].name == deviceName + ".YUANXINGDANGQIANZHI") { //圆形数量
                    var BXT_circular = deviceData[i].value;
                } else if (deviceData[i].name == deviceName + ".autosudu1") { //工位速度
                    var sudu1 = deviceData[i].value;
                } else if (deviceData[i].name == deviceName + ".autosudu2") { //工位速度
                    var sudu2 = deviceData[i].value;
                } else if (deviceData[i].name == deviceName + ".autosudu3") { //工位速度
                    var sudu3 = deviceData[i].value;
                } else if (deviceData[i].name == deviceName + ".autosudu4") { //工位速度
                    var sudu4 = deviceData[i].value;
                } else if (deviceData[i].name == deviceName + ".autostate1") { //自动状态
                    var autostate1 = deviceData[i].value;
                } else if (deviceData[i].name == deviceName + ".autostate2") { //自动状态

                    var autostate2 = deviceData[i].value;
                } else if (deviceData[i].name == deviceName + ".autostate3") { //自动状态
                    var autostate3 = deviceData[i].value;
                } else if (deviceData[i].name == deviceName + ".autostate4") { //自动状态
                    var autostate4 = deviceData[i].value;
                } else if (deviceData[i].name == deviceName + ".BXT_zhonglei1") {
                    var BXT_zhonglei1 = deviceData[i].value;
                } else if (deviceData[i].name == deviceName + ".shengxiao1") {
                    var shengxiao1 = deviceData[i].value;
                } else if (deviceData[i].name == deviceName + ".nian1") {
                    var nian1 = deviceData[i].value;
                } else if (deviceData[i].name == deviceName + ".yue1") {
                    var yue1 = deviceData[i].value;
                } else if (deviceData[i].name == deviceName + ".ri1") {
                    var ri1 = deviceData[i].value;
                } else if (deviceData[i].name == deviceName + ".shi1") {
                    var shi1 = deviceData[i].value;
                } else if (deviceData[i].name == deviceName + ".fen1") {
                    var fen1 = deviceData[i].value;
                } else if (deviceData[i].name == deviceName + ".miao1") {
                    var miao1 = deviceData[i].value;
                } else if (deviceData[i].name == deviceName + ".DQDD_shuliang1") {
                    var DQDD_shuliang1 = deviceData[i].value;
                } else if (deviceData[i].name == deviceName + ".BXTGD_ZT") {
                    var DBTGD_ZT1 = deviceData[i].value;
                } else if (deviceData[i].name == deviceName + ".BJ1") {
                    var BJ1 = deviceData[i].value;
                } else if (deviceData[i].name == deviceName + ".BJ2") {
                    var BJ2 = deviceData[i].value;
                } else if (deviceData[i].name == "VPLC_2.IOCard7_var1_m") {
                    var BXT_zhonglei2 = deviceData[i].value;
                } else if (deviceData[i].name == "VPLC_2.IOCard7_var2_m") {
                    var shengxiao2 = deviceData[i].value;
                } else if (deviceData[i].name == "VPLC_2.IOCard7_var3_m") {
                    var nian2 = deviceData[i].value;
                } else if (deviceData[i].name == "VPLC_2.IOCard7_var4_m") {
                    var yue2 = deviceData[i].value;
                } else if (deviceData[i].name == "VPLC_2.IOCard7_var5_m") {
                    var ri2 = deviceData[i].value;
                } else if (deviceData[i].name == "VPLC_2.IOCard7_var6_m") {
                    var shi2 = deviceData[i].value;
                } else if (deviceData[i].name == "VPLC_2.IOCard7_var7_m") {
                    var fen2 = deviceData[i].value;
                } else if (deviceData[i].name == "VPLC_2.IOCard7_var8_m") {
                    var miao2 = deviceData[i].value;
                } else if (deviceData[i].name == "VPLC_2.IOCard7_var9_m") {
                    var DQDD_shuliang2 = deviceData[i].value;
                } else if (deviceData[i].name == "VPLC_2.IOCard7_var10_m") {
                    var DBTGD_ZT2 = deviceData[i].value;
                } else if (deviceData[i].name == "VPLC_3.IOCard7_var1_m") {
                    var BXT_zhonglei3 = deviceData[i].value;
                } else if (deviceData[i].name == "VPLC_3.IOCard7_var2_m") {
                    var shengxiao3 = deviceData[i].value;
                } else if (deviceData[i].name == "VPLC_3.IOCard7_var3_m") {
                    var nian3 = deviceData[i].value;
                } else if (deviceData[i].name == "VPLC_3.IOCard7_var4_m") {
                    var yue3 = deviceData[i].value;
                } else if (deviceData[i].name == "VPLC_3.IOCard7_var5_m") {
                    var ri3 = deviceData[i].value;
                } else if (deviceData[i].name == "VPLC_3.IOCard7_var6_m") {
                    var shi3 = deviceData[i].value;
                } else if (deviceData[i].name == "VPLC_3.IOCard7_var7_m") {
                    var fen3 = deviceData[i].value;
                } else if (deviceData[i].name == "VPLC_3.IOCard7_var8_m") {
                    var miao3 = deviceData[i].value;
                } else if (deviceData[i].name == "VPLC_3.IOCard7_var9_m") {
                    var DQDD_shuliang3 = deviceData[i].value;
                } else if (deviceData[i].name == "VPLC_3.IOCard7_var10_m") {
                    var DBTGD_ZT3 = deviceData[i].value;
                    console.log("yue4yue4yue4yue4" + DBTGD_ZT3)
                } else if (deviceData[i].name == deviceName + ".RFID_XINGZHUANG") {
                    var BXT_zhonglei4 = deviceData[i].value;
                } else if (deviceData[i].name == deviceName + ".RFID_shengxiao") {
                    var shengxiao4 = deviceData[i].value;
                } else if (deviceData[i].name == deviceName + ".RFID_YER") {
                    var nian4 = deviceData[i].value;
                } else if (deviceData[i].name == deviceName + ".RFID_MONTH") {
                    var yue4 = deviceData[i].value;
                } else if (deviceData[i].name == deviceName + ".RFID_DAY") {
                    var ri4 = deviceData[i].value;
                } else if (deviceData[i].name == deviceName + ".RFID_HOUR") {
                    var shi4 = deviceData[i].value;
                } else if (deviceData[i].name == deviceName + ".RFID_MINUTE") {
                    var fen4 = deviceData[i].value;
                } else if (deviceData[i].name == deviceName + ".RFID_SEC") {
                    var miao4 = deviceData[i].value;
                } else if (deviceData[i].name == deviceName + ".RFID_WORK_ORDER") {
                    var DQDD_shuliang4 = deviceData[i].value;
                } else if (deviceData[i].name == deviceName + ".RFID_STATE") {
                    var DBTGD_ZT4 = deviceData[i].value;
                } else if (deviceData[i].name == deviceName + ".BJ200") {
                    var BJ200 = deviceData[i].value;
                }
            }
        }
        //形状数量，工位速度值，工位自动状态
        var configs = [BXT_square, BXT_circular, sudu1, sudu2, sudu3, sudu4, autostate1, autostate2, autostate3, autostate4];
        //告警状态
        var heartStatus = [GW1_XINTIAO, GW2_XINTIAO, GW3_XINTIAO, GW4_XINTIAO];
        //设备状态
        var deviceStatus = [GW1_ZT, GW2_ZT, GW3_ZT, GW4_ZT];
        //工单状态
        var group1 = [BXT_zhonglei1, shengxiao1, nian1, yue1, ri1, shi1, fen1, miao1, DQDD_shuliang1, DBTGD_ZT1, BJ1, BJ2, BJ3, BJ200];
        var group2 = [BXT_zhonglei2, shengxiao2, nian2, yue2, ri2, shi2, fen2, miao2, DQDD_shuliang2, DBTGD_ZT2];
        var group3 = [BXT_zhonglei3, shengxiao3, nian3, yue3, ri3, shi3, fen3, miao3, DQDD_shuliang3, DBTGD_ZT3];
        var group4 = [BXT_zhonglei4, shengxiao4, nian4, yue4, ri4, shi4, fen4, miao4, DQDD_shuliang4, DBTGD_ZT4];
        console.log('readyok_xinhao' + readyok_xinhao);
        console.log("MQTT" + configs, "MQTTheartStatus" + heartStatus, "MQTTdeviceStatus" + deviceStatus, "MQTTgroup1" + group1);
        console.log('group2' + group2);
        console.log('group3' + group3);
        console.log('group4' + group4);


        heartStatusAll = heartStatus;
        deviceStatusAll = deviceStatus;
        group1All = group1;
        group2All = group2;
        group3All = group3;
        group4All = group4;
        readyok = readyok_xinhao;
        configsAll = configs;


        // getConfigs(configs);
        //Index.getConfigs(configs)



    }).on("disconnect", () => {
        logger.warn("MQTT中断！")

    }).on("error", function(error) {
        logger.error("MQTT发生错误：", error)
        MQTTconnect = 0;

    }).on("close", () => {
        logger.warn("MQTT关闭！");
        MQTTconnect = 0;
        PingProcess.connectSCADA(0, '192.168.0.90');

    }).on("end", () => {
        logger.warn("MQTT结束！")

    })


}


setInterval(() => {
    if (heartStatusAll) {
        // heartStatusAll.map(item=>{return typeof(item) === 'number'? item:1})
        DeviceStatus.deviceHeart(heartStatusAll);
    }
}, 909)
setInterval(() => {
    DeviceStatus.deviceStatus(deviceStatusAll);
}, 1000)

function getAllData() {
    setInterval(() => {
        //告警状态
        WorkerStatus.workerStatus(group1All, group2All, group3All, group4All);

        const fs = require("fs");

        fs.writeFileSync('./configtTable.txt', JSON.stringify(configsAll) ? ? '');
    }, 1000)
}


const EventEmitter = require('events');
const eventEmitter = new EventEmitter();
global.configsData = {
    squareNum: "",
    circularNum: "",
    sudu1: "",
    sudu2: "",
    sudu3: "",
    sudu4: "",
    autostate1: "",
    autostate2: "",
    autostate3: "",
    autostate4: ""
};

function getConfigs(configs) {

    for (var i = 0; i < configs.length; i++) {
        configsData[Object.keys(configsData)[i]] = configs[i];
    }
    console.log("configsData" + configsData)
    console.dir(configsData)

    eventEmitter.emit('configsUpdated', configsData);
}

setTimeout(() => {
    getAllData();
}, 1000)

module.exports = {
    sendMQTTMessage,
    connectMqtt,
}