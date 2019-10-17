'use strict';

module.exports = {
  appenders: {
    "rule-console": {"type": "console"},
    "rule-error": {
      type: 'dateFile',
      //文件名为= filename + pattern, 设置为alwaysIncludePattern：true
      filename: '/var/www/log4/blog/rule-error.log',
      "encoding":"utf-8",
      "maxLogSize": 104800
    },
    "rule-res": {
      type: 'dateFile',
      filename: '/var/www/log4/blog/rule-res.log',
      "encoding":"utf-8",
      "maxLogSize": 104800
    },
    "rule-error-json": {
      type: 'dateFile',
      layout: { type: 'json', separator: ',' },
      //文件名为= filename + pattern, 设置为alwaysIncludePattern：true
      filename: '/var/www/log4/blog/jsonlog/rule-error-json.log',
      "encoding":"utf-8",
      "maxLogSize": 104800
    },
    "rule-res-json": {
      type: 'dateFile',
      layout: { type: 'json', separator: ',' },
      filename: '/var/www/log4/blog/jsonlog/rule-res-json.log',
      "encoding":"utf-8",
      "maxLogSize": 104800
    }
  },
  categories: {
    "default": {"appenders": ["rule-console"], "level": "all"},
    "rule-error": {"appenders": ['rule-error'],"level": "error"},
    "rule-res": {"appenders": ['rule-res'], "level": "info"},
    "rule-error-json": {"appenders": ['rule-error-json'], "level": "error"},
    "rule-res-json": {"appenders": ['rule-res-json'], "level": "info"}
  },
  replaceConsole: false,
  pm2: true,
  pm2InstanceVar: 'INSTANCE_ID',
  disableClustering: true
}

//log级别为8级 ALL<TRACE<DEBUG<INFO<WARN<ERROR<FATAL<MARK<OFF。默认级别是 OFF
// "type": "dateFile"   // 可以设置成 console、file、dateFile三种
// "filename": "./logs/access-", // 设置log输出的文件路劲和文件名
// "pattern": ".yyyy-MM-dd.log",
// "alwaysIncludePattern": true, // 和上面同时使用 设置每天生成log名
// "encoding": "utf-8", // 设置文件编码格式
// "maxLogSize ": 31457280 // 设置文件大小
// "level": "debug", // 设置log输出的最低级别
// "maxLevel": "error" // 设置log输出的最高级别
