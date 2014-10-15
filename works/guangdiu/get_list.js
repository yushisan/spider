var db = require('../_db');
var getProxyList = require('../_get_proxy_from_db');
var spiderList = require('./spider_list.js');
var spiderContent = require('./spider_content');
var spiderURL = require('./spider_url');
var Queue = require('queue');
var Q = require('q');
var Event = require('events').EventEmitter;

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
var emitter = new Event();

var index = 0;
//1.获取 proxy list
getProxyList(100)
//2. 获取分类列表
.then(function(proxyList) {

    listArray.forEach(function(item) {
        getList(proxyList, item)
        //3.获取content详情
        .then(getContent);
    });
    //4.获取url内容
    emitter.on('needURL', getURL)
    //5.插入数据库
    .on('inserDB', insert)
        .on('error', function(err) {
            console.log(err);
        })
});

//获取分类列表
function getList(proxyList, keywords) {
    var deferred = Q.defer();

    var count = 0;
    var handler = function(cate) {
        var url = 'http://guangdiu.com/cate.php?k=' + cate;
        var proxyObject = proxyList[index++];

        spiderList(url, proxyObject.proxy).then(function(data) {
            data.map(function(item) {
                item.cate = cate;
                item.time = Math.ceil(Date.now() / 1000);
            });
            deferred.resolve({
                items: data,
                proxyList: proxyList,
                curProxy: proxyObject
            });
        }, function(err) {
            //代理刨除
            badProxy(curProxy, proxyList);
            proxyList = proxyList[index++];
            if (count < 10) {
                handler(cate);
            } else {
                console.log(cate + ' too bad');
                deferred.resolve(err);
            }
            count++;
        });
    };
    handler(keywords);

    return deferred.promise;
}



/**
 * 获取正文内容
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function getContent(data) {
    var items = data.items;
    var proxyList = data.proxyList;
    var curProxy = data.curProxy;
    var handler = function(item) {
        var deferred = Q.defer();
        var id = item.id;
        spiderContent(id, curProxy.proxy).then(function(c) {
            item.content = c.content;
            deferred.resolve();

            emitter.emit('needURL', item, curProxy, proxyList);
        }, function(err) {
            deferred.reject(err);
        });
        return deferred.promise;
    };
    items.forEach(function(item) {
        handler(item).then(function(data) {}, function(err) {
            badProxy(curProxy, proxyList);
            curProxy = proxyList[index++];
            handler(item);
        });
    });
    return emitter;
}


function getURL(item, curProxy, proxyList) {
    var id = item.id;
    var count = 0;
    spiderURL(id, curProxy).then(function(data) {
        item.url = data.url;
        item.source_url = data.source_url;
        emitter.emit('inserDB', item);
    }, function(err) {
        badProxy(curProxy, proxyList);
        curProxy = proxyList[index++];
        if (count < 5) {
            getURL(item, curProxy, proxyList);
        } else {
            emitter.emit('error', new Error('getURL proxy timeout!'));
        }
    });
}

/**
 * 插入数据
 * @param  {[type]} item [description]
 * @return {[type]}      [description]
 */
function insert(item) {
    var arr = [
        'id',
        'title',
        'prices',
        'image',
        'source',
        'mall',
        'content',
        'url',
        'source_url'
    ];

    var sql = 'insert into gd_content (' + arr.join(',') + ') values ';
    sql += ('(' + new Array(arr.length + 1).join('?').split('').join(',') + ')');

    var sqlFields = [];
    arr.forEach(function(v) {
        sqlFields.push(item[v]);
    });


    // console.log(sql, sqlFields);
    db.query(sql, sqlFields).then(function() {
        console.log(cate + ':' + item.id + ' → success');
        db.query('insert into gd_link (id, cate) values (?,?)', [item.id, cate]).then(function() {}, function(err) {
            if (err.code == 'ER_DUP_ENTRY') {

            } else {
                console.log(item.id + ' insert link error ' + err);
            }
        });
    }, function(err) {
        if (err.code == 'ER_DUP_ENTRY') {
            //在多个分类需要处理
            db.query('insert into gd_link (id, cate) values (?,?)', [item.id, cate]).then(function() {}, function(err) {
                if (err.code == 'ER_DUP_ENTRY') {} else {
                    console.log(item.id + ' insert link error2 ' + err);
                }
            });
        } else {
            console.log(err);
        }
    });

}
/**
 * 代理刨除
 * @param  {[type]} pObj      [description]
 * @param  {[type]} proxyList [description]
 * @return {[type]}           [description]
 */
function badProxy(pObj, proxyList) {
    //说明有问题，更新下数据库标注下
    if (pObj.errno > 5) {
        var sql = 'UPDATE proxy set `status` =0 where id =' + pObj.id;
    } else {
        var sql = 'update proxy set errno=errno+1 where id=' + pObj.id;
    }
    var i = proxyList.indexOf(pObj);
    proxyList.splice(i, 1);
    // console.log(sql);
    db.query(sql).then(function(rs) {
        // console.log(rs);
    }, function(err) {
        console.log(sql, cate, err);
    });
}
