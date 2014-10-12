var db = require('./_db');
var Q = require('q');
function getProxyList(num) {
    num = num | 0;
    var deferred = Q.defer();
    var sql = 'select * from proxy where `status`=1 order by speed limit ?;';
    db.query(sql, [num || 10]).then(function(result) {
        if(result[0]){
            deferred.resolve(result[0]);
        }else{
            deferred.reject('empty result');
        }
    }, function(err) {
        deferred.reject(err);
    });
    return deferred.promise;
}

module.exports = getProxyList;
