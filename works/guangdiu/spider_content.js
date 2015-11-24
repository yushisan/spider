var spider = require('../../lib/spider');
var Q = require('q');

function spiderMan(id, proxy, timeout) {
    var opt = {
        uri: 'http://guangdiu.com/m/loadsingle.php?id=' + id,
        timeout: timeout || 5e3
    };

    if (proxy) {
        if (proxy.indexOf('http://') !== 0) {
            proxy = 'http://' + proxy;
        }
        opt.proxy = proxy;
    }
    var defer = Q.defer();

    spider(opt, function(error, data) {
        if (error || !data) {
            defer.reject(error);
        } else {
            defer.resolve(data);
        }

    }, {
        content: {
            selector: '.remoteabstract',
            handler: function($node, $) {
                var content = $node.find('.hui-content-text').html();
                if (!content) {
                    content = $node.html();
                }
                if (!content) {
                    content = '';
                }
                return (content || '').replace(/<p>(\s*|[&nbsp;])<\/p>/, '').trim();
            }
        }
    });
    return defer.promise;
}

module.exports = spiderMan;
/*
spiderMan('825964').done(function(data) {
    console.log(data);
});
*/
