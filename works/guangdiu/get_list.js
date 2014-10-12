var db = require('../_db');
var getProxyList = require('../_get_proxy_from_db');
var spiderList = require('./spider_list.js');
var Queue = require('queue');

var listArray = [
    'baby',
    'stockup',
    'daily',
    'digital',
    'electrical',
    'food',
    'clothes',
    'makeup',
    'sport',
    'automobile',
    'sale'
];
var queue = new Queue({
    concurrency: 1
});

//获取 proxy list
getProxyList(10).then(function(proxyList) {
    var index = 0;
    listArray.forEach(function(url) {
        if (index >= 10) {
            index = 0;
        }
        queue.push(getHandler(proxyList[index++], url));
        queue.start();
    });
}, function(err) {
    console.log(err);
});


function getHandler(pObj, cate) {
    return function(cb) {
        var url = 'http://guangdiu.com/cate.php?k=' + cate;
        spiderList(url, pObj.proxy).then(function(data) {
            insert(data, cate);
            cb();
        }, function(err) {
            console.log(cate + ' spider error:' + err);
            //说明有问题，更新下数据库标注下
            if (pObj.errno > 5) {
                var sql = 'UPDATE proxy set `status` =0 where id =' + pObj.id;
            } else {
                var sql = 'update proxy set errno=errno+1 where id=' + pObj.id;
            }
            // console.log(sql);
            db.query(sql).then(function(rs) {
                // console.log(rs);
            }, function(err) {
                console.log(sql, cate, err);
            });
            cb();
        });
    }
}

function insert(data, cate) {
    var arr = [
        'id',
        'title',
        'prices',
        'image',
        'source',
        'mall'
    ];
    var sql = 'insert into gd_content (' + arr.join(',') + ',time, cate) values ';
    sql += ('(' + new Array(arr.length + 3).join('?').split('').join(',') + ')');
    data.forEach(function(item) {
        var sqlFields = [];
        arr.forEach(function(v) {
            sqlFields.push(item[v]);
        });

        sqlFields.push(Math.ceil(Date.now() / 1000));
        sqlFields.push(cate);

        db.query(sql, sqlFields).then(function() {
            console.log(cate + ':' + item.id + ' → success');
            db.query('insert into gd_link (id, cate) values (?,?)', [item.id, cate]).then(function() {}, function(err) {
                if (err.code == 'ER_DUP_ENTRY') {

                } else{
                    console.log(item.id + ' insert link error ' + err);
                }
            });
        }, function(err) {
            if (err.code == 'ER_DUP_ENTRY') {
                //在多个分类需要处理
                db.query('insert into gd_link (id, cate) values (?,?)', [item.id, cate]).then(function() {}, function(err) {
                if (err.code == 'ER_DUP_ENTRY') {
                } else{
                    console.log(item.id + ' insert link error2 ' + err);
                }
            });
            } else {
                console.log(err);
            }
        });
    });

}
