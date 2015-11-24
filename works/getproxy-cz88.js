var spider = require('../lib/spider');
var Queue = require('queue');
var db = require('./_db');

var testProxy = require('./test_proxy_speed');
var uniqueObj = {};
spider.get('http://www.cz88.net/proxy/index.aspx', function(err, data) {
    var content = data.content;

    var arr = [];
    for (var i = 5, len = content.length; i < len; i++) {
        var v = content[i];
        if (/\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}/.test(v)) {
            arr.push(v + ':' + content[i + 1]);
            i += 5;
        }
    }

    //获取代理list
    // console.log(arr);
    //并发一次的队列
    var queue = new Queue({
        concurrency: 1
    });
    arr.forEach(function(v) {
        if (uniqueObj[v]) {
            //检查重复的代理，减少系统消耗
            return;
        }
        uniqueObj[v] = 1;
        testProxy(v, 'http://guangdiu.com/m').then(function(data) {
            //使用闭包来完成queue的封装
            queue.push(function(cb) {
                db.query('insert into proxy (proxy, speed) values (?,?)', [data.proxy, data.speed]).then(function() {
                    console.log(data.proxy + ' → success');
                    cb();
                }, function(err) {
                    console.log(err);
                    cb();
                });
            });
            queue.start();
        }, function(err) {
            // console.log(err);
        });
    });
}, {
    content: {
        selector: '.Main table tr td',
        handler: 'text'
    }
});
