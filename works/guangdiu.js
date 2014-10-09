var spider = require('../lib/spider');

spider.get('http://guangdiu.com', function(data) {

    console.log(data.item);
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
