var spider = require('../lib/spider');

spider.get('http://guangdiu.com', function($){
    $('.gooditem').each(function(i, e){
        console.log($(e).find('h2').text().trim());
    });
});
