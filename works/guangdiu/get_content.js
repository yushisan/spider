var db = require('../_db');
var getProxyList = require('../_get_proxy_from_db');
var spiderList = require('./spider_list.js');
var Queue = require('queue');

var sql = 'select id from gd_content where content="";';
db.query(sql).then(function(rs){
    console.log(rs[0]);
}, function(err){

});
