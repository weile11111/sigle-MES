const exec = require('child_process').exec


function pingcontrolDev(ipaddress) {
    var option = {
        ip: ipaddress,
        status: ""
    }
    exec(`ping  ${option.ip} -t -n 1`, { windowsHide: true }, (error, stdout, stderr) => {
        console.log('res')
        if (error) {
            console.log('ip is inactive.');
            option.status = 'inactive';
            setOrderInfo(option).then(() => {
                console.log('更新成功！');
            }).catch((err) => {
                console.log('更新错误！', err);
            })
        } else {
            console.log('ip is active.')
            option.status = 'active'
            setOrderInfo(option).then(() => {
                console.log('更新成功！');
            }).catch((err) => {
                console.log('更新错误！', err);
            })
        }
    })
}

function connectSCADA(MQTTconnect, ipaddress) {
    var option = {
        ip: ipaddress,
        status: MQTTconnect
    }
    if (MQTTconnect === 1) {
        console.log("连接到scada数据库" + MQTTconnect);
        console.log("连接到scada数据库" + ipaddress);
        option.status = 'activeSCADA';
        setOrderInfo(option).then(() => {
            console.log('更新成功！');
        }).catch((err) => {
            console.log('更新错误！', err);
        })
    } else if (MQTTconnect === 0) {
        console.log("未连接到scada数据库");
        option.status = 'inactiveSCADA';
        setOrderInfo(option).then(() => {
            console.log('更新成功！')
        }).catch((err) => {
            console.log('更新错误！', err)
        })
        pingcontrolDev(ipaddress);
    }
}

module.exports = {
    connectSCADA,
}