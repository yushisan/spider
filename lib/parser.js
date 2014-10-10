var cheerio = require('cheerio');

var parser = function(data, map) {
    var $ = cheerio.load(data || '',{
        decodeEntities: false
    });
    if (typeof map === 'object') {
        return getData(map, $, $);
    } else {
        return $;
    }
};

function getData(map, $, $$) {
    var data = {};
    for (var i in map) {
        var curMap = map[i];
        var selector = curMap.selector;
        var handler = curMap.handler;
        if (selector) {

            //选择器，生成dom节点对象
            var $nodes = [];
            if ($.find) {
                //按照数组格式
                $nodes = $.find(selector);
            } else {
                $nodes = $(selector);
            }

            //开始处理数据和递归
            switch (typeof handler) {
                case 'string':
                case 'function':
                    //获取属性值
                    data[i] = _get(handler, $nodes, $$);
                    break;
                case 'object':
                    //继续递归
                    var tArray = [];
                    $nodes.each(function(j, e) {
                        var $node = $$(e);
                        tArray.push(getData(handler, $node, $$));
                    });

                    data[i] = tArray;
                    break;
                default:
                    console.error('illegal map');
                    break;
            }
        } else {
            console.error('illegal map');
        }
    }
    return data;
}

function _get(handler, $node, $) {
    if(typeof handler==='function'){
        return handler($node, $);
    }
    var h = handler.split(':');
    if ($node.length > 1) {
        var t = [];
        $node.each(function(k, e) {
            // console.log($$(e));
            t.push($(e)[h[0]](h[1]).trim());
        });
        return t;
    } else {
        return $node[h[0]](h[1]).trim()
    }
}

module.exports = parser;
