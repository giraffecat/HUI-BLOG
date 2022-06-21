// 导入数据库操作模块
const db = require('../db/index')
// 导入 bcryptjs 这个包
const bcrypt = require('bcryptjs')
// 导入生成 Token 的包
const jwt = require('jsonwebtoken')
// 导入全局的配置文件
const config = require('../config')

const { responseClient } = require('../utils/util');




exports.regUser = async (req, res) => {
  res.send('reguser OK')
}

// 登录的处理函数
exports.login =  async (req, res) =>{
  // 接收表单的数据
  const userinfo = req.body;
  // 定义 SQL 语句
  const sql = `select * from tb_user_auth where username=?`
  let result = await new Promise(function(resolve, reject) {
    db.query(sql, userinfo.username, (err, results) => {
      resolve(results)
    })
  })
  console.log("result",result)
  // 执行 SQL 语句成功，但是获取到的数据条数不等于 1
  if (result.length !== 1) return  responseClient(res, 200, 3, "登录失败！", {}, false)
  // TODO：判断密码是否正确
  const compareResult = bcrypt.compareSync(userinfo.password, result[0].password)
  console.log("compareResult",compareResult)
  if (!compareResult) return responseClient(res, 200, 3, "登录失败！", {}, false)

  // TODO：在服务器端生成 Token 的字符串
  const user = { ...result[0]}
  // 对用户的信息进行加密，生成 Token 字符串
  const tokenStr = 'Bearer ' + jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn });
  result.tokenStr = tokenStr;
  let data = {...result[0], tokenStr: tokenStr}
  responseClient(res, 200, 3, "登录成功！", data)
}

exports.register = async (req, res) => {
  console.log("reqasda",req.body)

  // 获取客户端提交到服务器的用户信息
  const userinfo = req.body
  // 定义 SQL 语句，查询用户名是否被占用
  const sqlStr = 'select * from tb_user_auth where username=?'
  let result = await new Promise(function(resolve, reject) {
    db.query(sqlStr, userinfo.username, (err, results) => {
      resolve(results)
    })
  })
  console.log("result", result)
  // 判断用户名是否被占用
  if (result.length > 0) {
    // return res.send({ status: 1, message: '用户名被占用，请更换其他用户名！' })
    responseClient(res, 200, 3, "用户名被占用，请更换其他用户名！", {})
  }

  // 调用 bcrypt.hashSync() 对密码进行加密
  userinfo.password = bcrypt.hashSync(userinfo.password, 10)
  console.log("hashSync",userinfo)
  res.send("register")
}