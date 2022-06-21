import Vue from "vue";
import VueRouter from "vue-router";
// import Article from '../views/article/Article'
// import ArticleList from '../views/article/ArticleList'
// import Category from '../views/category/Category'
Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "登录",
    hidden: true,
    component: () => import("../views/login/Login.vue")
  },
  {
    path: "/",
    name: "主页",
    component: () => import("../layout/index.vue"),
    children: [
      // { path: 'articles', name: "新增文章",component: Article },
      // { path: 'articles/:id', component: Article},
      // { path: 'article-list', name:"文章列表", component: ArticleList},
      // { path: 'categories', name: "分类管理", component: Category}
    ],
  },
];

const createRouter = () =>
  new VueRouter({
    mode: "history",
    routes: routes
  });

const router = createRouter();

export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher;
}

export default router;
