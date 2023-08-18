function alertStatus2(list) {
    var objTest = {}
    list[1] === 3 ? objTest.material_warehouse = 1 : null;
    list[2] === 3 ? objTest.processing_station = 1 : null;
    list[3] === 3 ? objTest.quality_inspection_station = 1 : null;
    list[4] === 3 ? objTest.finished_product_warehouse = 1 : null;


    if (objTest) {
        DBcontrlor.setDeviceAlertStatus(objTest).then(async(deviceInfo) => {
            console.log('更新成功故障!');
            // 获取工单的库料数目

        }).catch((err) => {
            console.log("更新设备状态+peomise的错误" + err);
        })
    }
}




module.exports = {
    alertStatus2
}