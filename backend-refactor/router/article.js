// 文章的路由模块

const express = require('express')
const router = express.Router()

// 导入需要的处理函数模块
const article_handler = require('../router_handler/article')

// 导入 multer 和 path
const multer = require('multer')
const path = require('path')

// 创建 multer 的实例
const uploads = multer({ dest: path.join(__dirname, '../uploads') })

// 获取全部文章的路由
router.get('/articles', article_handler.getArticles)


// 根据文章id获取文章
router.get('/articles/:id', article_handler.getArticleById)

// 获取文章统计信息
router.get('/articleStats', article_handler.getArticleStats)

//上传图片
router.post('/admin/articles/images', uploads.single('file'), article_handler.upLoadArticleImage)

//新增文章
router.post('/admin/articles', article_handler.addNewArticle)

// 获取后台文章列表
router.get('/admin/articles', article_handler.getArticlesByAdmin)

//更新文章删除状态
router.put('/admin/articles/delete', article_handler.UpdateDeleteByAdmin)

// 根据id获取后台文章
// 获取后台文章列表
router.get('/admin/articles/:id', article_handler.getArticlesByIdAdmin)
// 将路由对象共享出去
module.exports = router