// 文章的路由模块
const express = require('express')
const router = express.Router()

// 导入需要的处理函数模块
const menu_handler = require('../router_handler/menu')

// 获取菜单信息的路由
router.get('/admin/user/menus', menu_handler.getMenu)

// 获取菜单信息的路由By Admin
router.get('/admin/menus', menu_handler.getMenuByAdmin)

// 将路由对象共享出去
module.exports = router