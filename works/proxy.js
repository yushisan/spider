var spider = require('../lib/spider');

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
    var arr = [];
    proxys.forEach(function(proxy) {
        spider.get(proxy, function(data) {
            var content = data.content;
            content = content.replace('&nbsp;','');
            content = content.replace(/\r\n/g,'\n');
            content = content.split(/\n/);
            content.forEach(function(v){
                arr.push(v.split('@')[0]);
            });

            console.log(arr);
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
