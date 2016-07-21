spider
======

spider(opts, callback[, handlerMap])

* opts： 同request
* callback： 回调函数，参数：error, data/cheerio对象，req
* handlerMap：data处理方式

## handlerMap

handlerMap是抓取的数据结构，抓取后会按照handlerMap的数据结构产出json数据。定义handlerMap的抓取结构是由`selector`和`handler`两个key组成的对象，例如：

```js
{
    selector: '',
    handler: ''
}
```
### selector
`selector`是跟jQuery（cheerio）的选择器，会在 **父节点（上一个抓取结构）** 下面查找子元素。

### handler
`handler` 是处理函数，支持jQuery（cheerio）的函数，比如：`text`（$.text()）、`html`（默认，$.html()）、`attr:xxx`（实际是$.attr('xxx'))

处理jQuery的函数外，还支持自定义函数，自定义函数接受两个参数，第一个是选择器之后处理的jQuery（cheerio）对象，第二个是全局的jQuery（cheerio）对象， **handler必须要有返回数据**，不然抓取的就是`undefined`：
```
{
    selector: 'li',
    handler: function($li, $){
        return $li.eq(0).text();
    }
}
```


### 抓取结构示例
```js
{
  content: {
    selector: '.box694 li',
    handler: 'text'
  }
}
```
上面的实际是查找页面`.box94 li`的节点，然后返回其`text()`内容，如果li是多个，那么是返回一个数组，最终会在callback函数获取data的格式是：
```js
{
    content: []
}
```

再看一个复杂的：
```js
{
  content: {
    selector: '.box694 li',
    handler: {
      ip: {
        selector: '.ip'
      },
      port: {
        selector: '.port'
      }
    }
  }
}
```
上面实际是抓取结构嵌套的示例，首先查找页面的`.box94 li`的节点，然后执行两个选择器：`'.ip'` 和 `'.port'`，最后传递给`callback`的数据结构是：

```js
{
    content: [{
        ip: 'xxx',
        port: 'xxx'
    },{
        ip: 'xxx',
        port: 'xxx'
    }, ...]
}
```

## 实例
```js
var spider = require('../lib/spider');

spider.get('http://guangdiu.com', function(err, $) {
    $('.gooditem').each(function(i, e) {
        console.log($(e).find('h2').text().trim());
    });
});

```


```js
var spider = require('../lib/spider');

var now = Date.now();
spider({
    proxy: 'http://42.62.61.245:80',
    uri: 'http://guangdiu.com',
    timeout: 5e3
}, function(error, data, req) {
    if (!error && data) {
        var t = Date.now();
        console.log(t - now);
    }
}, {
    item: {
        selector: '.gooditem',
        handler: {
            title: {
                selector: 'h2',
                handler: 'text'
            },
            prices: {
                selector: 'h2 .emphricepart',
                handler: 'text'
            },
            image: {
                selector: '.showpic img',
                handler: 'attr:src'
            }
        }
    }
});

```
