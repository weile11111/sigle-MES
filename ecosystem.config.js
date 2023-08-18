module.exports = {
  apps: [
    //{
  //     "name": 'WEB',
  //     script: "index.js", // 前端启动
  //     cwd: "\MES_src\server", // 目录
  //     max_memory_restart: "1G", // 最大内存重启
  //     autorestart: true, // 自动重启
  //     watch: ["\MES_src\server"],
  //   },
  //   {
  //     "name": '托盘状态',
  //     script: "gettrayData.js", // 前端启动
  //     cwd: "\MES_src\server", // 目录
  //     max_memory_restart: "1G", // 最大内存重启
  //     autorestart: true, // 自动重启
  //     watch: ["\MES_src\server"],
  //   },
  //   {
  //     "name": '工单状态',
  //     script: "getRealData.js", // 前端启动
  //     cwd: "\MES_src\server", // 目录
  //     max_memory_restart: "1G", // 最大内存重启
  //     autorestart: true, // 自动重启
  //     watch: ["\MES_src\server"],
  //   },
  //   {
  //     "name": '设备状态',
  //     script: "getDevice.js", // 前端启动
  //     cwd: "\MES_src\server", // 目录
  //     max_memory_restart: "1G", // 最大内存重启
  //     autorestart: true, // 自动重启
  //     watch: ["\MES_src\server"],
  //   },
    // {
    //   "name": '通讯状态',
    //   script: "pingProcess.js", // 前端启动
    //   cwd: "", // 目录
    //   max_memory_restart: "1G", // 最大内存重启
    //   autorestart: true, // 自动重启
    //   watch: [''],
    // },
    // {
    //   name : 'VUE',
    //   script : "nginx.exe", // 前端启动
    //   cwd : "\nginx-1.22.1", // 目录
    //   max_memory_restart: "1G", // 最大内存重启 
    //   autorestart: true, // 自动重启
    //   watch  : ['\nginx-1.22.1\html\static'],
    // },
    // {
    //   "name": '视觉服务',
    //   script: "rtspMain.js", // 前端启动
    //   cwd: "\MES_src\server", // 目录
    //   max_memory_restart: "1G", // 最大内存重启
    //   autorestart: true, // 自动重启
    //   watch: ["\MES_src\server"],
    // },
    {
        "name": 'MQTT服务',
        script: "getMqttData.js", // 前端启动
        cwd: "\MES_src\server", // 目录
        max_memory_restart: "1G", // 最大内存重启
        autorestart: true, // 自动重启
        //watch: [],
      },

  ],

  deploy: {
    production: {
      user: 'SSH_USERNAME',
      host: 'SSH_HOSTMACHINE',
      ref: 'origin/master',
      repo: 'GIT_REPOSITORY',
      path: 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};