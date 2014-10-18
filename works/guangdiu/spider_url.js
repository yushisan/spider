var spider = require('../../lib/spider');
var Q = require('q');
var URL = require('url');
var $ = require('./helper');

function spiderMan(id, proxyObj, timeout) {
    var opt = {
        uri: 'http://guangdiu.com/go.php?id=' + id,
        timeout: timeout || 5e3
    };
    var proxy = proxyObj.proxy || '';
    if (proxy) {
        if (proxy.indexOf('http://') !== 0) {
            proxy = 'http://' + proxy;
        }
        opt.proxy = proxy;
    }
    var defer = Q.defer();
    spider(opt, function(data, error) {
        if (error || !data) {
            defer.reject(error);
        } else {
            defer.resolve(parserURL(data.html(), data));
        }
    });
    return defer.promise;
}

module.exports = spiderMan;

// spiderMan('825964').done(function(data) {
//     console.log(data);
// });

function parserURL(content, $$) {
    if (/javascript">eval\(function/.test(content)) {
        content = $$('script').html().trim();
        content = content.slice(5, -1);
        (1, eval)('data = ' + content);

        if (data) {
            var v = data.match(/location.href\s*=\s*([\w\d]+)/);
            if (v[1]) {
                v = data.match(new RegExp('var\\s+' + v[1] + '\\s*=\\s*[\'\"]+(.*?)[\'\"]+'));
                if (v[1]) {
                    return $.getUnionUrl(v[1]);
                }

            }
        }
        return data;
    }
    return '';
}
