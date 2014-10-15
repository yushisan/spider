var spider = require('../../lib/spider');
var Q = require('q');

function spiderMan(id, proxy, timeout) {
    var opt = {
        uri: 'http://guangdiu.com/go.php?id='+id,
        timeout: timeout || 5e3
    };

    if (proxy) {
        if (proxy.indexOf('http://') !== 0) {
            proxy = 'http://' + proxy;
        }
        opt.proxy = proxy;
    }
    var defer = Q.defer();

    spider(opt, function(data, error) {
        if (error || !data) {
            defer.reject(error);
        } else {
            defer.resolve(parserURL(data.html(), data));
        }
    });
    return defer.promise;
}

module.exports = spiderMan;

spiderMan('825964').done(function(data) {
    console.log(data);
});
function parserURL(content, $){
    if(/javascript">eval\(function/.test(content)){
        content = $('script').html().trim();
        content = content.slice(5, -1);
        (1, eval)('foo = ' + content);
        console.log(foo);
    }
}


function getDuomai($url){
    if(preg_match('/c.duomai.com/',$url)){
        //site_id=121938
        return preg_replace('/site_id=(\d+)/', 'site_id=121938', $url);
    }elseif(preg_match('/yhd.com/',$url)){
        //http://c.duomai.com/track.php?site_id=121938&aid=58&euid=&t=http%3A%2F%2Fwww.yhd.com%2F
        return 'http://c.duomai.com/track.php?site_id=121938&aid=58&euid=&t='.urlencode($url);
    }elseif(preg_match('/dangdang.com/',$url)){
        //http://c.duomai.com/track.php?site_id=121938&aid=64&euid=&t=http%3A%2F%2Fwww.dangdang.com%2F
        return 'http://c.duomai.com/track.php?site_id=121938&aid=64&euid=&t='.urlencode($url);
    }elseif(preg_match('/suning.com/',$url)){
        //http://c.duomai.com/track.php?site_id=121938&aid=84&euid=&t=http%3A%2F%2Fwww.suning.com%2F
        return 'http://c.duomai.com/track.php?site_id=121938&aid=84&euid=&t='.urlencode($url);
    }elseif(preg_match('/yixun.com/',$url)){
        //http://c.duomai.com/track.php?site_id=121938&aid=337&euid=&t=http%3A%2F%2Fwww.yixun.com%2F
        return 'http://c.duomai.com/track.php?site_id=121938&aid=337&euid=&t='.urlencode($url);
    }else{
        return $url;
    }

}
