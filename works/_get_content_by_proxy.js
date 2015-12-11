var spider = require('../lib/spider');
var Q = require('q');
var db = require('./_db');

function get(proxyObject, domain, timeout) {
    var proxy = proxyObject.proxy;
    if (proxy.indexOf('http://') !== 0) {
        proxy = 'http://' + proxy;
    }
    var deferred = Q.defer();
    spider({
        uri: domain,
        proxy: proxy,
        timeout: timeout || 7e3
    }, function(error, data, req) {
        if (!error && data) {
            deferred.resolve(data);
        } else {
            //说明有问题，更新下数据库标注下
            if (proxyObject.errno > 5) {
                var sql = 'delete from proxy where id=' + proxyObject.id;
            } else {
                var sql = 'update proxy set errno=errno+1 where id=' + proxyObject.id;
            }
            db.query(sql);
            deferred.reject(error);
        }
    });
    return deferred.promise;
}

module.exports = get;
/*
test('http://42.62.61.245:80', 'http://guangdiu.com/m').then(function(speed) {
    console.log(speed);
}, function(e) {
    console.log(e);
});
*/
