spider
======

spider(opts, callback[, handlerMap])

* opts： 同request
* callback： 回调函数，参数：error, data/cheerio对象，req
* handlerMap：data处理方式

```js
var spider = require('../lib/spider');

spider.get('http://guangdiu.com', function(err, $) {
    $('.gooditem').each(function(i, e) {
        console.log($(e).find('h2').text().trim());
    });
});

```


```js
var spider = require('../lib/spider');

var now = Date.now();
spider({
    proxy: 'http://42.62.61.245:80',
    uri: 'http://guangdiu.com',
    timeout: 5e3
}, function(error, data, req) {
    if (!error && data) {
        var t = Date.now();
        console.log(t - now);
    }
}, {
    item: {
        selector: '.gooditem',
        handler: {
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
            }
        }
    }
});

```
