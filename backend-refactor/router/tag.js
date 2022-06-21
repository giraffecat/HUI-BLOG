// 文章的路由模块
const express = require('express')
const router = express.Router()

// 导入需要的处理函数模块
const tag_handler = require('../router_handler/tag')

// 获取菜单信息的路由
router.get('/admin/tags/search', tag_handler.getTag)

// 将路由对象共享出去
module.exports = router