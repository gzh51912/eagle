//做sql语句查询
//引入MySQL
const mysql = require('mysql');

//建立连接池
var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    database: 'eagle',
    multipleStatements: true
});

//封装函数返回一个promise对象
function query(sql) {
    return new Promise((resolve, reject) => {
        pool.query(sql, (error, data) => {
            if (error) reject(error);//如果有错误就返回错误
            resolve(data);//否则就把data数据传到声明体
        });

    });
};
//导出query
module.exports = query;
