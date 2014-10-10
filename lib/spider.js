var request = require('request');
var parser = require('./parser');



var Spider = function(options, callback, handlerMap) {
    return request.apply(this, [options, getHandler(callback, handlerMap)]);
};

Spider.get = function(url, callback, handlerMap) {
    return request.get(url, getHandler(callback, handlerMap));
};
Spider.post = function(url, data, callback, handlerMap) {
    return request.post(url, getHandler(callback, handlerMap));
};

module.exports = Spider;


function getHandler(callback, handlerMap) {
    return function(error, response, body) {
        if (!error) {
            callback(parser(body, handlerMap));
        } else {
            callback(body, error, response);
        }
    }

};
