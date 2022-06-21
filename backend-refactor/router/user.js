const express = require('express')
// 创建路由对象
const router = express.Router()

const userHandler = require('../router_handler/user')


// 后台管理界面登录
router.post('/login', userHandler.login)

//注册新用户
router.post('/register', userHandler.register)


// 将路由对象共享出去
module.exports = router