var URL = require('url');
function getUnionURL(url) {
    if (/guangdiu-23/i.test(url)) {
        return url.replace('guangdiu-23', 'wangyongqing-23');
    }
    var urlObj = URL.parse(url, true);
    urlObj.hostname = urlObj.hostname.toLowerCase();
    if (urlObj.hostname === 'union.dangdang.com') {
        return 'http://union.dangdang.com/transfer.php?from=P-245603&ad_type=10&sys_id=1&backurl=' + (urlObj.query.backurl);
    }

    if (/(jd|360buy).com/i.test(url)) {
        if (/unionId=\d+/.test(url)) {
            return url.replace(/unionId=\d+/, 'unionId=28271');
        } else {
            return 'http://click.union.jd.com/JdClick/?unionId=28271&t=1&to=' + encodeURIComponent(url);

        }
    }
    if (/suning.com/i.test(url)) {
        if (urlObj.hostname === 'union.suning.com') {
            return getDuomai(decodeURIComponent(urlObj.query.vistURL));
        }
        return getDuomai(url);
    }

    if (/dangdang.com/i.test(url)) {
        return getDuomai(url);
    }

    if (/(yixun|51buy).com/i.test(url)) {
        if (urlObj.hostname === 'cps.yixun.com') {
            return getDuomai(decodeURIComponent(urlObj.query.url));
        }
        return getDuomai(url);
    }

    if (/cps.gome.com.cn/i.test(url)) {
        return urlObj.query.to;
    }

    return getDuomai(url);
}

function getDuomai(url) {
    if (/c.duomai.com/.test(url)) {
        return url.replace(/site_id=\d+/, 'site_id=121938');
    }

    if (/yhd.com/.test(url)) {
        return 'http://c.duomai.com/track.php?site_id=121938&aid=58&euid=&t=' + encodeURIComponent(url);
    }

    if (/dangdang.com/.test(url)) {
        return 'http://c.duomai.com/track.php?site_id=121938&aid=64&euid=&t=' + encodeURIComponent(url);
    }
    if (/suning.com/.test(url)) {
        return 'http://c.duomai.com/track.php?site_id=121938&aid=84&euid=&t=' + encodeURIComponent(url);

    }
    if (/yixun.com/.test(url)) {
        return 'http://c.duomai.com/track.php?site_id=121938&aid=337&euid=&t=' + encodeURIComponent(url);

    }
    return url;

}

module.exports = {
    getUnionUrl: getUnionURL,
    getDuomai: getDuomai
};
