const mysql = require('mysql')

//生产环境
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'zh1998501',
  port: '3306', // 端口
  database: 'HuiBlog',
})
//上线环境
// const db = mysql.createPool({
//   host: 'localhost',
//   user: 'huiblog',
//   password: 'zh1998501',
//   port: '3306', // 端口
//   database: 'huiblog',
// })

module.exports = db
