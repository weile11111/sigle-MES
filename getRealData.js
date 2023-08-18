var client = require('scp2');


const workorderStatus = {
    0: 'waiting',
    1: 'material_preparation_completed',
    2: 'material_preparaing',
    3: 'in_production',
    4: 'production_completed',
    5: 'qualitify',
    6: 'quality_inspection',
    7: 'unqualified',
    8: 'end'
};
const orderStatus = {
    0: 'waiting',
    00: 'start_material',
    1: 'material_preparation_completed',
    2: 'material_preparaing',
    3: 'in_production',
    4: 'production_completed',
    5: 'quality_inspection',
    6: 'unqualified',
    7: 'end'
}

var list = [];
var alert = false;

//工单状态

function workerStatus(group1, group2, group3, group4) {
    list = [group1, group2, group3, group4];
    console.log("到这里了！" + alert);
    for (var i = 0; i < list.length; i++) {
        if (!list[i]) {
            console.log("网络错误！" + list);
        } else {
            //解析订单数据
            const PV = list[i];
            console.log('收到PV了');
            console.log(PV);
            if (PV) {
                var work_order_number = parseInt(PV[0]).toString() + parseInt(PV[1]).toString() + parseInt(PV[2]).toString() + parseInt(PV[3]).toString() + parseInt(PV[4]).toString() + parseInt(PV[5]).toString() + parseInt(PV[6]).toString() + parseInt(PV[7]).toString() + parseInt(PV[8]).toString();
                var work_order_status = parseInt(PV[9]).toString();
                if (PV[10] == 1 || PV[11] == 1 || PV[12] == 1 || PV[13] == 1) {
                    console.log("第一工位我告警了");
                    alert = true;
                    // ctrlAlert(PV[1],alert);
                } else if (PV[10] == 0 && PV[11] == 0 && PV[12] == 0 && PV[13] == 0) {
                    alert = false;
                }
                console.log('此时获取的工单号是' + work_order_number);
                console.log('此时获取的工单状态是' + workorderStatus[work_order_status]);
                if (work_order_number !== '000000000') {
                    OMworker({
                        work_order_number: work_order_number,
                        work_order_status: workorderStatus[work_order_status]
                    })
                }
            }
        }
    }

}


function writeFuc(_defaults, order_status) {
    DBcontrlor.getCurrentWorkOrderOrderInfo(_defaults).then(async(resOrderRestInfo) => {
        console.log("需要重置订单信息");
        if (resOrderRestInfo) {
            resOrderRestInfo[0].order_status = order_status;
            console.dir(resOrderRestInfo);

            await DBcontrlor.setCurrentOrderStatus(resOrderRestInfo[0]).then(async() => {
                console.log("订单重置成等待");
            }).catch((err) => {
                console.log("Rest ordder Info peomise的错误");
            })

        } else {

        }
    })
}



function ctrlStatus(_defaults, _def_orderInfo) {
    if (_defaults.work_order_status == "end") {
        DBcontrlor.getCurrentWorkOrderOrderInfo(_defaults).then(async(resOrderOverInfo) => {
            console.dir(resOrderOverInfo)
            if (resOrderOverInfo) {
                resOrderOverInfo[0].order_status = 'end';

                //删除文件

                await DBcontrlor.setCurrentOrderStatus(resOrderOverInfo[0]).then(async() => {
                    console.dir(resOrderOverInfo);

                    await DBcontrlor.getCurrentWorkOrderTime(_defaults).then(async(resWorkOrderTimeInfo) => {
                        if (resWorkOrderTimeInfo) {
                            console.log("工单信息");
                            console.dir(resWorkOrderTimeInfo);

                            //删除文件
                            try {

                                fs.unlinkSync('./pointTable/' + resOrderOverInfo[0].order_number + '.txt');
                            } catch {
                                console.log("点表删不掉，洗白的访问！！！");
                            } //计算时厂
                            await DBcontrlor.getCurrentOrderProduct_NameAndShengxiao(resOrderOverInfo[0]).then(async(resProduct_NameAndShengxiao) => {
                                //_defaults.production_duration = order_status.end_time  -order_status.end_time 
                                // console.log("返回用户名称")
                                // console.dir(resCustomName)

                                console.log("返形状和生肖");
                                console.dir(resProduct_NameAndShengxiao);
                                // _def_orderInfo.production_duration = ""
                                _def_orderInfo.production_duration = Math.floor((new Date(resWorkOrderTimeInfo[0].end_time).getTime() - new Date(resWorkOrderTimeInfo[0].start_time).getTime()) / 1000);
                                // _def_orderInfo.customer_name = resCustomName[0].customer_name
                                _def_orderInfo.shape = resProduct_NameAndShengxiao[0].product_name;
                                _def_orderInfo.shengxiao = resProduct_NameAndShengxiao[0].shengxiao;
                                _def_orderInfo.order_number = resOrderOverInfo[0].order_number;
                                _def_orderInfo.completion_time = new Date().Format('yyyy-MM-dd hh:mm:ss');
                                _def_orderInfo.warehousing_time = resWorkOrderTimeInfo[0].createdAt;

                                await DBcontrlor.DBcontrlor.getOrderInfo().then(async(resAllOrderTable) => {
                                    for (var i = 0; i < resAllOrderTable.length; i++) {
                                        if (resAllOrderTable[i].order_number == resOrderOverInfo[0].order_number) {
                                            console.log("订单号一重复，未保存订单");
                                            return
                                        }
                                    }
                                    await DBcontrlor.setOrderInfo(_def_orderInfo).then(async(resAll) => {
                                        console.log("生成订单历史成功!");
                                        console.dir(resAll);
                                    }).catch((err) => {
                                        console.log("生成订单历史错误+peomise的错误" + err);
                                    })

                                })
                            }).catch((err) => {
                                console.log("获取用户名称peomise的错误" + err);
                            })
                        }
                    }).catch((err) => {
                        console.log("获取工单时间peomise的错误" + err);
                    })
                }).catch((err) => {
                    console.log("更新工单状态peomise的错误" + err);
                })
            }
        }).catch((err) => {
            console.log("获取订单号peomise的错误" + err);
        })
    } else if (_defaults.work_order_status == 'unqualified') {
        DBcontrlor.getCurrentWorkOrderOrderInfo(_defaults).then(async(resOrderRestInfo) => {
            console.log("需要重置订单信息");
            if (resOrderRestInfo) {
                resOrderRestInfo[0].order_status = 'waiting';
                console.dir(resOrderRestInfo);

                await DBcontrlor.setCurrentOrderStatus(resOrderRestInfo[0]).then(async() => {
                    console.log("订单重置成等待");
                }).catch((err) => {
                    console.log("Rest ordder Info peomise的错误");
                })

            } else {

            }
        })
    } else if (_defaults.work_order_status == 'quality_inspection') {
        writeFuc(_defaults, 'quality_inspection');
    } else if (_defaults.work_order_status == 'production_completed') {
        writeFuc(_defaults, 'production_completed');
    } else if (_defaults.work_order_status == 'in_production') {
        writeFuc(_defaults, 'in_production');
    } else if (_defaults.work_order_status == 'material_preparation_completed') {

        DBcontrlor.getCurrentWorkOrderOrderInfo(_defaults).then(async(resOrderRestInfo) => {
            console.log("需要重置订单信息");
            if (resOrderRestInfo) {
                resOrderRestInfo[0].order_status = 'material_preparation_completed';
                console.dir(resOrderRestInfo);

                //传输文件

                console.log('订单号' + resOrderRestInfo[0].order_number);
                await DBcontrlor.setCurrentOrderStatus(resOrderRestInfo[0]).then(async() => {
                    console.log('订单号2' + resOrderRestInfo[0].order_number.slice(-2));

                    if (resOrderRestInfo[0].order_number.slice(-2) == '13') {
                        //fs.exist()d
                        console.log('这里了啊哈哈哈哈哈哈' + resOrderRestInfo[0].order_number);
                        client.scp('./pointTable/' + resOrderRestInfo[0].order_number + '.txt', 'root@192.168.0.31:22:/nfs_root/vm2/qianming.txt', function(err) {
                            console.log('上传文件失败' + err);

                            console.log("\nFile readme.md is deleted");
                        })


                    } else {
                        client.scp('./pointTable/0.txt', 'root@192.168.0.31:22:/nfs_root/vm2/qianming.txt', function(err) {
                            console.log('上传文件失败' + err);
                        })
                    }

                    console.log("订单重置成上料完毕");
                }).catch((err) => {
                    console.log("Rest ordder Info peomise的错误");
                })

            } else {

            }
        })

    } else if (_defaults.work_order_status == 'qualitify') {
        writeFuc(_defaults, 'qualitify');
    } else if (_defaults.work_order_status == 'material_preparaing') {

        DBcontrlor.getCurrentWorkOrderOrderInfo(_defaults).then(async(resOrderRestInfo) => {
            console.log("需要重置订单信息");
            if (resOrderRestInfo) {
                resOrderRestInfo[0].order_status = 'material_preparaing';
                console.dir(resOrderRestInfo);


                console.log('订单号' + resOrderRestInfo[0].order_number);
                await DBcontrlor.setCurrentOrderStatus(resOrderRestInfo[0]).then(async() => {
                    console.log('订单号2' + resOrderRestInfo[0].order_number.slice(-2));
                    if (resOrderRestInfo[0].order_number.slice(-2) == '13') {
                        //fs.exist()d
                        console.log('这里了啊哈哈哈哈哈哈' + resOrderRestInfo[0].order_number);
                        client.scp('./pointTable/' + resOrderRestInfo[0].order_number + '.txt', 'root@192.168.0.31:22:/nfs_root/vm2/qianming.txt', function(err) {
                            console.log('上传文件失败' + err);
                            console.log("\nFile readme.md is deleted");
                        })
                    } else {
                        client.scp('./pointTable/0.txt', 'root@192.168.0.31:22:/nfs_root/vm2/qianming.txt', function(err) {
                            console.log('上传文件失败' + err);
                        })
                    }
                    console.log("订单重置成上料完毕");
                }).catch((err) => {
                    console.log("Rest ordder Info peomise的错误", err);
                })
            } else {

            }
        })
    }
}

function OMworker(res) {
    var _def_orderInfo = {
        order_number: '',
        production_duration: '',
        completion_time: '',
        warehousing_time: '',
        customer_name: ''
    }
    var _defaults = {
        order_number: '',
        work_order_number: '12321102',
        work_order_status: 'end',
        order_status: '',
        customer_name: '',
    }
    var _default = {
        work_order_number: '12321102',
        work_order_status: 'end',
    }
    for (var item in res) {
        _defaults[item] = res[item] || _defaults[item];
    }
    console.dir(_defaults);
    for (var item in res) {
        _default[item] = res[item] || _default[item];
    }
    console.dir(_default);




    function findKey(obj, value, compare = (a, b) => a === b) {
        return Object.keys(obj).find(k => compare(obj[k], value))
    }



    const workorderStatus = {
        0: 'waiting',
        1: 'material_preparation_completed',
        2: 'material_preparaing',
        3: 'in_production',
        4: 'production_completed',
        5: 'qualitify',
        6: 'quality_inspection',
        7: 'unqualified',
        8: 'end'
    };



    console.log("我获取到工单号。。！" + _defaults.work_order_number);
    if (res.work_order_status) {
        DBcontrlor.getCurrentWorkOrderOrderStatus(_defaults).then(async(resStatusData) => {
            console.dir(resStatusData)
            if (resStatusData.length >= 1) {
                console.dir(resStatusData[0].work_order_status);
                //工单状态结束

                var value = findKey(workorderStatus, resStatusData[0].work_order_status);
                var value2 = findKey(workorderStatus, _defaults.work_order_status);

                console.log("我获取到工单状态值了。。！" + value);

                //时间长度


                if (value == '1' || value == '2') {



                    DBcontrlor.getCurrentWorkOrderOrderInfo(_defaults).then(async(resOrderRestInfo) => {
                        console.log("需要重置订单信息")

                        console.dir(resOrderRestInfo);
                        if (resOrderRestInfo) {

                            if (alert) {
                                resOrderRestInfo[0].order_status = 'waiting';

                                console.dir(resOrderRestInfo);
                                console.log('订单号read' + resOrderRestInfo[0].order_number);
                                await DBcontrlor.setCurrentOrderStatus(resOrderRestInfo[0]).then(async() => {
                                    console.log('订单号write' + resOrderRestInfo[0].order_number.slice(-2));

                                    if (resOrderRestInfo[0].order_number.slice(-2) == '13') {

                                        console.log('这里了359' + resOrderRestInfo[0].order_number);

                                    }
                                    console.log("------------------------delete---------------------------");
                                    console.log("准备删除");
                                    console.log("----------_defaults.work_order_number------------------");
                                    console.log(_defaults.work_order_number);


                                    DBcontrlor.deleteCurrentWorkOrderInfo(_defaults).then(() => {
                                        console.log('已删除');
                                    })
                                    console.log("订单重置成上料完毕");
                                }).catch((err) => {
                                    console.log("Rest ordder Info peomise的错误");
                                })
                            }
                        }
                    })
                }


                if (value == '3') {
                    DBcontrlor.getCurrentWorkOrderOrderInfo(_defaults).then(async(resOrderRestInfo) => {
                        console.log("需要重置订单信息由于BJ");

                        console.dir(resOrderRestInfo);
                        if (resOrderRestInfo) {
                            if (alert) {
                                resOrderRestInfo[0].order_status = 'waiting';
                                console.dir(resOrderRestInfo);
                                console.log('订单号read' + resOrderRestInfo[0].order_number);
                                await DBcontrlor.setCurrentOrderStatus(resOrderRestInfo[0]).then(async() => {
                                    console.log('订单号write' + resOrderRestInfo[0].order_number.slice(-2));

                                    if (resOrderRestInfo[0].order_number.slice(-2) == '13') {
                                        console.log('这里了啊哈哈哈哈哈哈' + resOrderRestInfo[0].order_number);
                                    }
                                    console.log("------------------------delete---------------------------");
                                    console.log("准备删除");
                                    console.log("----------_defaults.work_order_number------------------");
                                    console.log(_defaults.work_order_number);
                                    //delete workerOrder for easy
                                    DBcontrlor.deleteCurrentWorkOrderInfo(_defaults).then(() => {
                                        console.log('已删除');
                                    })
                                    console.log("订单重置成等待派工");
                                }).catch((err) => {
                                    console.log("Rest ordder Info peomise的错误");
                                })
                            }
                        }
                    })
                }



                if (value < value2) {
                    if (value2 == '3') {
                        _default.start_time = new Date();
                    }
                    if (value2 == '4') {
                        _default.end_time = new Date();
                    }

                    DBcontrlor.setCurrentWorkOrderStatus(_default).then(async(resStatusData) => {
                        console.log("我到这里");
                        console.dir(resStatusData);
                        ctrlStatus(_defaults, _def_orderInfo);
                    })
                }
            }

        }).catch((err) => {
            console.log("工单状态更新peomise的错误" + err);
        })
    } else {
        DBcontrlor.getCurrentWorkOrderOrderStatus(_defaults).then(async(resStatusData) => {
            console.log("我获取到工单号了状态。。！");
            console.dir(resStatusData);
            console.log("我获取到工单号了状态。。！dfd");
            if (resStatusData.length >= 1) {

                console.dir(resStatusData[0].work_order_status);
                //工单状态结束

                var value = findKey(workorderStatus, resStatusData[0].work_order_status);
                var value2 = findKey(workorderStatus, _defaults.work_order_status);

                console.log("我获取到工单状态值了。。！" + value);

                //时间长度


                if (value == '1' || value == '2') {



                    DBcontrlor.getCurrentWorkOrderOrderInfo(_defaults).then(async(resOrderRestInfo) => {
                        console.log("需要重置订单信息");

                        console.dir(resOrderRestInfo);
                        if (resOrderRestInfo) {

                            if (alert) {



                                resOrderRestInfo[0].order_status = 'waiting';


                                console.dir(resOrderRestInfo);
                                console.log('订单号' + resOrderRestInfo[0].order_number);
                                await DBcontrlor.setCurrentOrderStatus(resOrderRestInfo[0]).then(async() => {
                                    console.log('订单号2' + resOrderRestInfo[0].order_number.slice(-2));

                                    if (resOrderRestInfo[0].order_number.slice(-2) == '13') {

                                        console.log('这里了啊哈哈哈哈哈哈' + resOrderRestInfo[0].order_number);


                                    }
                                    console.log("订单重置成上料完毕");
                                }).catch((err) => {
                                    console.log("Rest ordder Info peomise的错误");
                                })
                            }

                        }
                    })
                }

            }

        }).catch((err) => {
            console.log("工单状态更新peomise的错误" + err);
        })
    }
}



module.exports = {
    workerStatus,
}