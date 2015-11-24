var request = require('request');
var parser = require('./parser');
var fs = require('fs');
var path = require('path');
var $ = require('cheerio');


/**
 * Spider
 */
var Spider = function(options, callback, handlerMap) {
    if (typeof callback !== 'object') {
        handlerMap = callback;
        callback = function() {};
    }
    options.transform = options.transform || autoParse;
    return request.apply(this, [options, getHandler(callback, handlerMap)]);
};

Spider.get = function(url, callback, handlerMap) {
    if (typeof callback !== 'object') {
        handlerMap = callback;
        callback = function() {};
    }
    var options = typeof url === 'string' ? {
        url: url
    } : url;
    options.transform = options.transform || autoParse;
    return request.get(options, getHandler(callback, handlerMap));
};
Spider.post = function(url, data, callback, handlerMap) {
    if (typeof callback !== 'object') {
        handlerMap = callback;
        callback = function() {};
    }
    var options = typeof url === 'string' ? {
        url: url
    } : url;
    options.transform = options.transform || autoParse;
    return request.post(options, getHandler(callback, handlerMap));
};

//保存
Spider.save = function(url, output, callback) {
    if (typeof output === 'function') {
        callback = output;
        output = path.basename(url);
    } else {
        output = output || path.basename(url);
    }
    return request(url)
        .on('error', callback)
        .on('end', callback)
        .pipe(fs.createWriteStream(output));
};

Spider.request = request;

module.exports = Spider;

function getHandler(callback, handlerMap) {
    return function(error, response, body) {
        if (!error) {
            callback(parser(body, handlerMap));
        } else {
            callback(body, error, response);
        }
    };
}


function autoParse(body, response, resolveWithFullResponse) {
    if (response.headers['content-type'].indexOf('application/json') !== -1) {
        return JSON.parse(body);
    } else if (response.headers['content-type'].indexOf('text/html') !== -1) {
        return $.load(body);
    } else {
        return body;
    }
}
