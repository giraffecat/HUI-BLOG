import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: "/archive",
    component: resolve => require(["../views/Archive.vue"], resolve)
  },
  {
    path: "/category",
    component: resolve => require(["../views/Category.vue"], resolve)
  },
  {
    path: "/categories/:categoryID",
    component: resolve => require(["../views/ArticleList.vue"], resolve)
  },
  {
    path: "/articles/:articleId",
    component: resolve => require(["../views/Article.vue"], resolve)
  },

]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
