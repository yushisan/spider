var spider = require('../lib/spider');

spider.save('https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/logo_white_fe6da1ec.png', function(err, data) {
    console.log(err, data);
});
