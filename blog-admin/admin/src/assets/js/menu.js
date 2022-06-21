import Layout from "@/layout/index.vue";
import router from "../../router";
import store from "../../store";
import axios from "axios";
import Vue from "vue";
export function generaMenu() {
  // 查询用户菜单
  axios.get("/admin/user/menus").then(({ data }) => {
    console.log("success find menu! ",data)

    if (data.flag) {
      // console.log("success find menu! ")
      var userMenuList = data.data;
      console.log("userMenuList",userMenuList)
      userMenuList.forEach(item => {
        //父级菜单的转化 => 

        if (item.icon != null) {
          item.icon = "iconfont " + item.icon;
        }
        if (item.component == "Layout") {
          //父级菜单 => 后面都是子级菜单
          item.component = Layout;
          //全部都是子集菜单啊！！！！
        }
        if (item.children && item.children.length > 0) {
          item.children.forEach(route => {
            route.icon = "iconfont " + route.icon;
            // console.log("really compoent", route.component)
            route.component = loadView(route.component);
            // console.log("lazy load", route.component)
            router.addRoute('主页',route)
          });
        }
      });
      // 添加侧边栏菜单
      store.commit("saveUserMenuList", userMenuList);
      // 添加菜单到路由
      let test = [];
      test.push(userMenuList[4])
      // test.push(userMenuList[6])
      // console.log("userMenuList",userMenuList)
      test.forEach(function(route){
        route.component = loadView(route.component);
        // console.log("route", route)
        router.addRoute(route);
      })
      // router.addRoute({ path: '/about', component: About})
      // console.log(" userMenuList[1]", userMenuList[1])
      // console.log("all routes",router.options.routes)
      // router.push({path: "/setting"})

      // console.log("all router",this.$route.router._recognizer.names)
    } else {
      Vue.prototype.$message.error(data.message);
      router.push({ path: "/login" });
    }
  });
}

export const loadView = view => {
  // 路由懒加载
  return resolve => require([`@/views${view}`], resolve);
};

