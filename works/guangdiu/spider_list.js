var spider = require('../../lib/spider');
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
        if (error || !data || !(data.item && data.item.length)) {
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
                    handler: function($node) {
                        return $node.attr('href').match(/id=(\d+)/)[1];
                    }
                },
                title: {
                    selector: 'h2',
                    handler: 'text'
                },
                prices: {
                    selector: 'h2 .emphricepart',
                    handler: function($node, $) {
                        var arr = [];
                        $node.each(function(i, e) {
                            arr.push($(e).text().trim());
                        });
                        return arr.join(',');
                    }
                },
                image: {
                    selector: '.showpic img',
                    handler: 'attr:src'
                },
                source_url: {
                    selector: '.rightlinks .innergototobuybtn',
                    handler: function($node, $) {
                        if ($node.find('a').length) {
                            return $node.find('a').attr('href');
                        }
                        return $node.attr('href');
                    }
                },
                source: {
                    selector: '.infofrom',
                    handler: function($node, $) {
                        var c = $node.text().trim().replace(/&nbsp;/g, ' ');
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

module.exports = spiderMan;

// spiderMan('http://guangdiu.com/cate.php?k=baby&kf=tip').done(function(data) {
//     console.log(data);
// });
