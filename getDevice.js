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



function deviceStatus(deviceStatusList) {
    console.log("我收到心跳值了-------------------------------------" + deviceStatusList);
    if (!deviceStatusList) {
        console.log("网络错误！" + deviceStatusList);
    } else {
        //解析设备数据

        DBcontrlor.getDeviceStatus().then(async(resData) => {
            console.log('有意思的值value');
            console.dir(resData);
            console.log('有意思的值value2' + Object.values(resData[0]));
            var lists = Object.values(resData[0]);
            lists = [lists[1], lists[2], lists[3], lists[4]];
            var list = lists.map((item, index) => {
                if (item >= 4) {
                    return item
                } else {
                    return deviceStatusList[index] ? deviceStatusList[index] : '1'
                }
            })
            console.log('有意思的值list' + list);
            let res = {};
            res.material_warehouse = list[0];
            res.processing_station = list[1];
            res.quality_inspection_station = list[2];
            res.finished_product_warehouse = list[3];
            if (objTest.material_warehouse != '4') {
                objTest.material_warehouse = list[0];
            }
            if (objTest.processing_station != '4') {
                objTest.processing_station = list[1];
            }
            if (objTest.quality_inspection_station != '4') {
                objTest.quality_inspection_station = list[2];
            }
            if (objTest.finished_product_warehouse != '4') {
                objTest.finished_product_warehouse = list[3];
            }
            // AlertStatus.alertStatus2(list);
            console.log('有意思的值res');
            console.dir(res);
            await DBcontrlor.setDeviceStatus(res).then(async(deviceInfo) => {
                console.log('更新成功!')
                    // 获取工单的库料数目

            }).catch((err) => {
                console.log("更新设备状态+peomise的错误" + err);
            })
        })
    }
}

var [MWnum, PSnum, QInum, FWnum] = [0, 0, 0, 0];
var objTest = {
    material_warehouse: '4',
    processing_station: '4',
    quality_inspection_station: '4',
    finished_product_warehouse: '4',
};


var deviceSList = [];

function deviceHeart(heartStatusList) {
    if (!heartStatusList) {
        console.log("网络错误！" + heartStatusList);
    } else {
        heartStatusList[0] = typeof(heartStatusList[0]) == 'number' ? heartStatusList[0] : deviceSList[0];
        heartStatusList[1] = typeof(heartStatusList[1]) == 'number' ? heartStatusList[1] : deviceSList[1];
        heartStatusList[2] = typeof(heartStatusList[2]) == 'number' ? heartStatusList[2] : deviceSList[2];
        heartStatusList[3] = typeof(heartStatusList[3]) == 'number' ? heartStatusList[3] : deviceSList[3];

        if (heartStatusList[0] != deviceSList[0]) {
            MWnum++;
        } else {
            MWnum = 0;
            if (objTest.material_warehouse == '4') {
                objTest.material_warehouse = '1';
            }
        }
        if (heartStatusList[1] != deviceSList[1]) {
            PSnum++;
        } else {
            PSnum = 0;
            if (objTest.processing_station == '4') {
                objTest.processing_station = '1';
            }

        }
        if (heartStatusList[2] != deviceSList[2]) {
            QInum++;
        } else {
            QInum = 0;
            if (objTest.quality_inspection_station == '4') {
                objTest.quality_inspection_station = '1';
            }

        }
        if (heartStatusList[3] != deviceSList[3]) {
            FWnum++;
        } else {
            FWnum = 0;
            if (objTest.finished_product_warehouse == '4') {
                objTest.finished_product_warehouse = '1';
            }
        }
        console.log("得到心跳值处理后的" + heartStatusList);


        deviceSList = heartStatusList;
        //解析设备数据

        console.log("查询成功" + heartStatusList);
        console.dir(heartStatusList);

        if (MWnum > 19) {
            objTest.material_warehouse = '4';
        }
        if (PSnum > 19) {
            objTest.processing_station = '4';
        }
        if (QInum > 19) {
            objTest.quality_inspection_station = '4';
        }
        if (FWnum > 19) {
            objTest.finished_product_warehouse = '4';
        }
        console.log('这个值，是我要得值');
        console.dir(objTest);
        DBcontrlor.setDeviceStatus(objTest).then(async(deviceInfo) => {
            console.log('更新成功脱机值流程1!');
        }).catch((err) => {
            console.log("更新设备状态+peomise的错误" + err);
        })
    }
}


module.exports = {
    deviceHeart,
    deviceStatus
}