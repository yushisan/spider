var spider = require('../lib/spider');
var Q = require('q');

function test(proxy, domain, timeout) {
    var time1 = Date.now();
    if (proxy.indexOf('http://') !== 0) {
        proxy = 'http://' + proxy;
    }
    var deferred = Q.defer();
    spider({
        uri: domain,
        proxy: proxy,
        timeout: timeout || 5e3
    }, function(error, data, req) {
        if (!error && data) {
            var time2 = Date.now();
            deferred.resolve({
                speed: time2 - time1,
                proxy: proxy,
                data: data
            });
        } else {
            deferred.reject(error);
        }
    });
    return deferred.promise;
}

module.exports = test;
/*
test('http://42.62.61.245:80', 'http://guangdiu.com/m').then(function(speed) {
    console.log(speed);
}, function(e) {
    console.log(e);
});
*/
