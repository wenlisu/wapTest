var fs = require('fs');
var path = require('path');
let proxy;
let operatorInfo = {
  name: '小明',
  username: 'ming',
};
let defaultProxy = {
  '/jqm/system/login': (req, res) => {
    setTimeout(function () {
      res.json({status: 0, des: '', operatorId: 1, token: '233', operatorInfo: operatorInfo});
    }, 500);
  },
  '/jqm/system/logout': (req, res) => {
    setTimeout(function () {
      res.json({status: 0, des: ''});
    }, 500);
  },
};

proxy = Object.assign({}, defaultProxy, proxy);

var mock = true;

if (!mock) {
  proxy = {
    'POST /jqm/*': 'http://192.168.40.221:1024/admin/'
  };
}

module.exports = proxy;
