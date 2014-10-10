var spider = require('../lib/spider');

var now = Date.now();
spider({
    proxy: 'http://42.62.61.245:80',
    uri: 'http://guangdiu.com',
    timeout: 5e3
}, function(data, error, req) {
    if(!error && data){
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
