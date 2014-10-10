var spider = require('../lib/spider');

var db = require('../lib/mysql')();

var testProxy = require('./test_proxy_speed');
var dbConfig = ({
    connectionLimit: 10,
    host: 'localhost',
    port: 3306,
    user: 'root',
    passord: '',
    database: 'spider'
});
db.config(dbConfig);

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
            arr.forEach(function(v) {
                testProxy(v, 'http://guangdiu.com/m').then(function(data) {
                    // console.log(data.speed, data.proxy);
                    db.query('insert into proxy (proxy, speed) values (?,?)', [data.proxy, data.speed]).then(function() {
                        console.log('success');
                    }, function(err) {
                        console.log(err);
                    });
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
