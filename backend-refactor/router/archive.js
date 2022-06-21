// 文章的路由模块

const express = require('express')
const router = express.Router()

// 导入需要的处理函数模块
const archive_handler = require('../router_handler/archive')


// 获取归档信息的路由
router.get('/archives', archive_handler.getArchive)

// 将路由对象共享出去
module.exports = router