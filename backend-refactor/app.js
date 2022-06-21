// 导入 express 模块
const express = require('express')
// 创建 express 的服务器实例
const app = express()

// 导入并配置 cors 中间件
const cors = require('cors')
app.use(cors())

// 导入并配置解析body的中间件
const bodyParser = require('body-parser');
app.use(bodyParser())

// 配置静态资源目录
app.use(express.static('uploads'));

// 配置网站静态资源目录
app.use("/public",express.static('public'));

// 配置解析表单数据的中间件，注意：这个中间件，只能解析 application/x-www-form-urlencoded 格式的表单数据
app.use(express.urlencoded({ extended: false }))

// write your code here...

// 导入并使用用户路由模块
const userRouter = require('./router/user')
app.use('/', userRouter)

//导入并使用文章路由模块
const articleRouter = require('./router/article')
app.use('/', articleRouter)

//导入并使用归档路由模块
const archiveRouter = require('./router/archive')
app.use('/', archiveRouter)

//导入并使用分类路由模块
const categoryRouter = require('./router/category')
app.use('/', categoryRouter)

//导入并使用菜单路由模块
const menuRouter = require('./router/menu')
app.use('/', menuRouter)

//导入并使用菜单路由模块
const tagRouter = require('./router/tag')
app.use('/', tagRouter)

// 调用 app.listen 方法，指定端口号并启动web服务器
app.listen(3000, function () {
  console.log('api server running at http://localhost:3000')
})