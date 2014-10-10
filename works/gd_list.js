var spider = require('../lib/spider');
var Q = require('q');
var spiderMan = function(url, proxy, timeout) {
    var opt = {
        uri: url,
        timeout: timeout || 5e3
    };

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
            defer.resolve(data.item);
        }

    }, {
        item: {
            selector: '.gooditem',
            handler: {
                id: {
                    selector: 'a.goodname',
                    handler: function($node){
                        return $node.attr('href').match(/id=(\d+)/)[1];
                    }
                },
                title: {
                    selector: 'h2',
                    handler: 'text'
                },
                prices: {
                    selector: 'h2 .emphricepart',
                    handler: 'text'
                },
                image: {
                    selector: '.showpic img',
                    handler: 'attr:src'
                },
                from: {
                    selector: '.infofrom',
                    handler: function($node, $){
                        var c = $node.text().trim();
                        return c.split(/\s/)[1].trim();
                    }
                },
                mall: {
                    selector: '.rightmallname',
                    handler: 'text'
                }
            }
        }
    });
    return defer.promise;
}

spiderMan('http://guangdiu.com/cate.php?k=baby&kf=tip').done(function(data) {
    console.log(data);
});
