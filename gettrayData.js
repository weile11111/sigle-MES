var sendMQTTMessage = require('./setMqttData.js').sendMQTTMessage;
var sendMQTTMessageP = require('./setMqttData.js').sendMQTTMessageP;


const fs = require("fs");
var client = require('scp2');


path = '/api/realdata';

var data3 = [{
    "name": "VPLC_1",
    "mm": [{
        "name": "VPLC_1.a_xia_gongdan_m",
        "value": 0,
    }]
}]

var platform;
try {
    console.log('processENV' + fs.readFileSync('workerinfo.txt'))
    platform = fs.readFileSync('workerinfo.txt')
} catch (error) {
    platform = 0;
}
const schedule = require('node-schedule');


const job = schedule.scheduleJob('0 0 0 * * *', function() {
    platform = 0;
    fs.writeFileSync('workerinfo.txt', String(platform))
    console.log('设为0了');
});


flag = 1;
//生成工单号

function trayStatus(readyok_xinhao) {

    //解析返回数据
    console.log(readyok_xinhao);
    if (!readyok_xinhao) {
        console.warn("网络错误！(正在收集准备下发信号！)" + readyok_xinhao);
    } else {

        var isNull = readyok_xinhao;

        if (isNull) {
            var option = {
                work_order_number: "",
                order_status: 'waiting'
            }
            DBcontrlor.getCurrentWaitingOrder(option).then(async(resOrderInfo) => {
                console.log('获取正在等待的订单', resOrderInfo)
                if (resOrderInfo) {;
                    console.dir(resOrderInfo[0]);
                    if (resOrderInfo.length > 0) {
                        var orderInfo = resOrderInfo[0];

                        var shape = (orderInfo.product_name == 'square') ? 2 : 1;
                        console.log("订单信息有形状")
                        var SX = orderInfo.shengxiao;
                        platform++;


                        try {
                            fs.writeFileSync('workerinfo.txt', String(platform));
                        } catch (error) {
                            console.log(error);
                        }


                        var sysDate = new Date().Format('yyyyMMddhhmmss');



                        //形状加生肖加年加日期加序号

                        var work_order_number = shape + SX + parseInt(sysDate.substring(0, 4)).toString() + parseInt(sysDate.substring(4, 6)).toString() + parseInt(sysDate.substring(6, 8)).toString() + parseInt(sysDate.substring(8, 10)).toString() + parseInt(sysDate.substring(10, 12)).toString() + parseInt(sysDate.substring(12, 14)).toString() + platform;


                        console.log(work_order_number);
                        let workOrderInfo = {
                            order_number: orderInfo.order_number,
                            work_order_number: work_order_number,
                            work_order_status: 'material_preparation_completed',
                            order_status: 'material_preparation_completed',
                            start_time: Date.now(),
                            shuliang: platform,
                        };


                        await sendWorkerInfo(workOrderInfo, SX, shape, sysDate);
                    }
                }
            }).catch((err) => {
                console.log(err);
            })
        } else {
            console.log('scada设备未允许下单');
        }
    }

}

function sendWorkerInfo(workOrderInfo, SX, shape, sysDate) {
    var data = [{
        "id": "121212",
        "name": "VPLC_1",
        "mm": [{
                "name": "VPLC_1.BXT_zhonglei",
                "value": shape,
            },
            {
                "name": "VPLC_1.shengxiao",
                "value": SX,
            },
            {
                "name": "VPLC_1.nian",
                "value": sysDate.substring(0, 4),
            },
            {
                "name": "VPLC_1.yue",
                "value": sysDate.substring(4, 6),
            },
            {
                "name": "VPLC_1.ri",
                "value": sysDate.substring(6, 8),
            },
            {
                "name": "VPLC_1.shi",
                "value": sysDate.substring(8, 10),
            },
            {
                "name": "VPLC_1.fen",
                "value": sysDate.substring(10, 12),
            },
            {
                "name": "VPLC_1.miao",
                "value": sysDate.substring(12, 14),
            },
            {
                "name": "VPLC_1.DQDD_shuliang",
                "value": platform,
            }
        ]
    }]
    if (flag > 0) {
        console.log('workOrderInfo' + workOrderInfo);
        console.dir(workOrderInfo)
        console.log('POST字符串1 ');
        console.dir(data);
        flag = 0;
        console.log('flag' + flag);
        try {
            sendMQTTMessage(data);
        } catch (error) {
            console.warn('trayData' + error);
        } finally {
            DBcontrlor.setCurrentWorkOrder(workOrderInfo).then(async(resWorkOrderInfo) => {
                console.log('生成等待的工单', resWorkOrderInfo);
                console.log('等待的订单');
                console.dir(workOrderInfo)
                await DBcontrlor.setCurrentOrderStatus(workOrderInfo).then(async(resOrderInfo) => {
                    var data = [{
                        "name": "VPLC_1",
                        "mm": [{
                            "name": "VPLC_1.xia_gongdan",
                            "value": 1,
                        }]
                    }]
                    console.log("下发完成!!!");
                    try {

                        sendMQTTMessageP(data).then(() => {
                            flag = 1;
                            console.log("重置为1了呀！");
                        })

                    } catch (error) {
                        console.warn('trayData下发完成!!!' + error);
                    } finally {


                        //写签名文件
                        DBcontrlor.getCurrentWorkOrderOrderInfo(workOrderInfo).then(async(resOrderRestInfo) => {
                            console.log("需要订单信息");
                            if (resOrderRestInfo) {
                                console.dir(resOrderRestInfo);
                                if (resOrderRestInfo[0].order_number.slice(-2) == '13') {
                                    console.log('这里了啊哈哈哈哈哈哈' + resOrderRestInfo[0].order_number);
                                    client.scp('./pointTable/' + resOrderRestInfo[0].order_number + '.txt', 'root@192.168.0.31:22:/nfs_root/vm2/qianming.txt', function(err) {
                                        console.log('上传文件失败' + err);
                                        console.log("\nFile readme.md is deleted");
                                    })
                                }
                                //传输文件
                                console.log('订单号' + resOrderRestInfo[0].order_number);
                            } else {

                            }
                        })


                        setTimeout(() => {
                            sendMQTTMessage(data3)
                        }, 4000)
                    }
                })
            })
        }
    }
}











module.exports = {
    trayStatus
}