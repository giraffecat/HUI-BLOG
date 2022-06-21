// 文章的路由模块

const express = require('express')
const router = express.Router()

// 导入需要的处理函数模块
const category_handler = require('../router_handler/category')


// 获取分类信息的路由
router.get('/categories', category_handler.getCategory)

// 根据分类id查找文章
router.get('/categories/:id', category_handler.getCategoryById)

//后台查询分类
router.get('/admin/categories/search',category_handler.getCategoryByAdmin)

// 获取后台分类信息的路由
router.get('/admin/categories', category_handler.AdminGetCategoryList)

// 新增分类
router.post('/admin/categories/add', category_handler.AdminAddCategory)

// 将路由对象共享出去
module.exports = router