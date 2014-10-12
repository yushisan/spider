var DB = require('../lib/db');
var dbConfig = {
    connectionLimit: 100,
    host: 'localhost',
    port: 3306,
    user: 'root',
    passord: '',
    database: 'spider'
};
//设置
var db = new DB(dbConfig, 10e3);
db.query('set names utf8;');
module.exports = db;
