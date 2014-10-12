var spider = require('../lib/spider');
var Queue = require('queue');
var DB = require('../lib/db2');

var testProxy = require('./test_proxy_speed');
var dbConfig = {
    connectionLimit: 100,
    host: 'localhost',
    port: 3306,
    user: 'root',
    passord: '',
    database: 'spider'
};
//设置
var db = new DB(dbConfig, 10e3);

spider.get('http://www.youdaili.net/Daili/', function(data) {
    var count = 0;
    var proxys = [];
    var items = data.item;
    for (var i = 0, len = items.length; i < len; i++) {
        if (count < 2 && items[i].tag.toLowerCase().indexOf('http') !== -1) {
            proxys.push(items[i].url);
            count++;
        }
    }
    //去除两天中重复的proxy
    var uniqueObj = {};

    proxys.forEach(function(proxy) {
        spider.get(proxy, function(data) {
            var content = data.content;
            content = content.replace('&nbsp;', '');
            content = content.replace(/\r\n/g, '\n');
            content = content.split(/\n/);
            var arr = [];
            content.forEach(function(v) {
                arr.push(v.split('@')[0]);
            });
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
                        db.query('insert into proxy (proxy, speed) values (?,?)', [data.proxy, data.speed], function(err) {
                            if (err) {
                                console.log('insertdb error', err);
                            } else {
                                console.log(data.proxy + ' → success');

                            }
                            cb();
                        });
                    });
                    queue.start();
                }, function(err) {
                    // console.log('testProxy error', err);
                });
            });
        }, {
            content: {
                selector: '.newsdetail_cont .cont_font p',
                handler: 'text'
            }
        });
    });

}, {
    item: {
        selector: '.newslist_line li',
        handler: {
            url: {
                selector: 'a',
                handler: 'attr:href'
            },
            tag: {
                selector: 'a font',
                handler: 'text'
            }
        }
    }
});
