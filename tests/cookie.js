var spider = require('../lib/spider');

var cookie = 'BDUSS=EpHfll5amN2RGQ4UEl6RmxVWmtUNFI4akRzNkFVSlFyU1lNWXNMczY2T0tIWHBXQVFBQUFBJCQAAAAAAAAAAAEAAABXt4cAa3NreTUyMQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIqQUlaKkFJWN;';

spider.get({
    url: 'http://po.m.baidu.com/api/user/get.json?format=json&appkey=searchbox',
    cookie: cookie
}, function(err, data) {
    console.log(data);
});
