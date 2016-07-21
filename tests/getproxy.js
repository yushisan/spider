var spider = require('../lib/spider');
spider('http://www.cz88.net/proxy/', function(err, data) {
  console.log(data);
}, {
  content: {
    selector: '.box694 li .ip',
    handler: 'text'
  }
});
