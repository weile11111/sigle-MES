var OrderInfoSqliteDao = require('../sqlite/OrderInfoSqliteDao.js');
var CurrentOrderSqliteDao = require('../sqlite/CurrentOrderSqliteDao.js');
var MaterialInventorySqliteDao = require('../sqlite/MaterialInventorySqliteDao.js');
var CurrentWorkOrderSqliteDao = require('../sqlite/CurrentWorkOrderSqliteDao.js');
var DeviceStatusSqliteDao = require('../sqlite/DeviceStatusSqliteDao.js');
var DeviceAlertSqliteDao = require('../sqlite/DeviceAlertSqliteDao.js');
var IPStatusSqliteDao = require('../sqlite/IPStatusSqliteDao.js')




function setCurrentOrderStatus(arg) {
    var _defaults = {
        customer_name: '',
        product_name: '',
        shengxiao: '',
        order_number: '',
        production_time: '',
        order_status: ''
    }
    for (var item in arg) {
        _defaults[item] = arg[item] || _defaults[item]
    }
    CurrentOrderSqliteDao.sequelize.sync();

    return CurrentOrderSqliteDao.current_order.update(

        {
            order_status: _defaults.order_status
        }, {
            where: {
                order_number: _defaults.order_number,
            },
            raw: true
        }

    )
}



function getCurrentWorkOrderOrderInfo(arg) {
    var work_order_number = arg.work_order_number || "";
    CurrentWorkOrderSqliteDao.sequelize.sync();
    return CurrentWorkOrderSqliteDao.current_work_order.findAll({
        attributes: ['order_number'],
        where: {
            work_order_number: work_order_number
        },
        raw: true
    })
}


function getCurrentWorkOrderOrderStatus(arg) {
    var work_order_number = arg.work_order_number || "";
    CurrentWorkOrderSqliteDao.sequelize.sync();
    return CurrentWorkOrderSqliteDao.current_work_order.findAll({
        attributes: ['work_order_status'],
        where: {
            work_order_number: work_order_number
        },
        raw: true
    })
}


function getCurrentWorkOrderTime(arg) {
    var work_order_number = arg.work_order_number || "";
    CurrentWorkOrderSqliteDao.sequelize.sync();
    return CurrentWorkOrderSqliteDao.current_work_order.findAll({
        where: {
            work_order_number: work_order_number
        },
        raw: true
    })
}





function getCurrentOrderProduct_NameAndShengxiao(arg) {
    var order_number = arg.order_number || "";
    CurrentOrderSqliteDao.sequelize.sync();
    return CurrentOrderSqliteDao.current_order.findAll({
        attributes: ['product_name', 'shengxiao'],
        where: {
            order_number: order_number

        },
        raw: true

    })
}




function setCurrentWorkOrderStatus(arg) {
    var _defaults = {
        work_order_number: '',
        work_order_status: '',
    }
    for (var item in arg) {
        _defaults[item] = arg[item] || _defaults[item]
    }
    CurrentWorkOrderSqliteDao.sequelize.sync();
    console.log("工单状态" + _defaults.work_order_status + _defaults.work_order_number);
    return CurrentWorkOrderSqliteDao.current_work_order.update(_defaults, {
            where: {
                work_order_number: _defaults.work_order_number
            },
            raw: true
        }

    )
}


function deleteCurrentWorkOrderInfo(arg) {
    var _defaults = {
        work_order_number: '',
    }
    for (var item in arg) {
        _defaults[item] = arg[item] || _defaults[item]
    }
    CurrentWorkOrderSqliteDao.sequelize.sync();
    console.log("到这里了工单状态" + _defaults.work_order_status + _defaults.work_order_number);
    return CurrentWorkOrderSqliteDao.current_work_order.destroy({
            where: {
                work_order_number: _defaults.work_order_number
            },
        }

    )
}








function getOrderInfo() {
    OrderInfoSqliteDao.sequelize.sync();
    return OrderInfoSqliteDao.order_info.findAll({
        raw: true
    })
}


function getCurrentWaitingOrder(arg) {
    var order_status = arg.order_status || ''
    CurrentOrderSqliteDao.sequelize.sync()
    return CurrentOrderSqliteDao.current_order.findAll({
        where: {
            order_status: order_status
        },
        raw: true
    })
}




function getCurrentWorkOrder() {
    CurrentWorkOrderSqliteDao.sequelize.sync()
    return CurrentWorkOrderSqliteDao.current_work_order.findAll({
        raw: true
    })
}


function setDeviceAlertStatus(arg) {
    var _defaults = {
        material_warehouse: '0',
        processing_station: '0',
        quality_inspection_station: '0',
        finished_product_warehouse: '0',
    }
    for (var item in arg) {
        _defaults[item] = arg[item] || _defaults[item]
    }
    DeviceAlertSqliteDao.sequelize.sync()
    return DeviceAlertSqliteDao.device_alert.create(arg)
}




function setCurrentWorkOrder(arg) {
    var _defaults = {
        order_number: '',
        work_order_number: '',
        work_order_status: '',
        tray_number: ''
    }
    for (var item in arg) {
        _defaults[item] = arg[item] || _defaults[item]
    }
    CurrentWorkOrderSqliteDao.sequelize.sync()

    return CurrentWorkOrderSqliteDao.current_work_order.create(

        {
            work_order_number: _defaults.work_order_number,
            order_number: _defaults.order_number,
            work_order_status: _defaults.work_order_status,
            tray_number: _defaults.tray_number
        })
}



function setDeviceStatus(arg) {
    var _defaults = {
        material_warehouse: '',
        processing_station: '',
        quality_inspection_station: '',
        finished_product_warehouse: '',
        cyc_number: 0,
        squ_number: 0,
        shape: ''
    }
    for (var item in arg) {
        _defaults[item] = arg[item] || ''
    }
    DeviceStatusSqliteDao.sequelize.sync()
    return DeviceStatusSqliteDao.device_status.update(arg, {
        where: {
            id: '1'
        },
        raw: true
    })
}







function getDeviceStatus() {
    DeviceStatusSqliteDao.sequelize.sync()
    return DeviceStatusSqliteDao.device_status.findAll({
        raw: true
    })
}



function setOrderInfo(arg) {
    var _defaults = {
        customer_name: '',
        production_duration: '',
        production_time: '',
        warehousing_time: '',
        order_number: '',
        shape: '',
        shengxiao: ''
    }
    for (var item in arg) {
        _defaults[item] = arg[item] || _defaults[item]
    }
    OrderInfoSqliteDao.sequelize.sync();
    return OrderInfoSqliteDao.order_info.create(_defaults)
}

function setIPStatus(arg) {
    var _defaults = {
        ip: "",
        status: ""
    }
    for (var item in arg) {
        _defaults[item] = arg[item] || _defaults[item]
    }
    console.log("ipipipipip" + arg.ip)
    IPStatusSqliteDao.sequelize.sync();
    return IPStatusSqliteDao.ip_status.update({
        status: _defaults.status,
    }, {
        where: {
            ip: arg.ip
        },
        raw: true
    })
}





module.exports = {
    setCurrentOrderStatus,
    setCurrentWorkOrderStatus,
    setIPStatus,
    deleteCurrentWorkOrderInfo,
    setOrderInfo,
    setDeviceAlertStatus,
    setCurrentWorkOrder,
    setDeviceStatus,
    getCurrentWorkOrderOrderInfo,
    getCurrentWorkOrderOrderStatus,
    getCurrentWorkOrderTime,
    getCurrentOrderProduct_NameAndShengxiao,
    getOrderInfo,
    getCurrentWaitingOrder,
    getCurrentWorkOrder,
    getDeviceStatus,
}