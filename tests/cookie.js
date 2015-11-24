var spider = require('../lib/spider');

var cookie = 'BDUSS=121212;';

spider.get({
    url: '',
    cookie: cookie
}, function(err, data) {
    console.log(data);
});
