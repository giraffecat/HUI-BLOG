<template>
  <v-navigation-drawer
    app
    v-model="drawer"
    width="250"
    disable-resize-watcher
    right
    overlay-opacity="0.8"
  >
    <!-- 页面导航 -->
    <div class="menu-container">
      <div class="menus-item">
        <router-link to="/">
          <i class="iconfont iconzhuye" /> 首页
        </router-link>
      </div>
    </div> 
    <div class="menu-container">
      <div class="menus-item">
        <router-link to="/category">
          <i class="iconfont iconzhuye" /> 分类
        </router-link>
      </div>
    </div> 
    <div class="menu-container">
      <div class="menus-item">
        <router-link to="/archive">
          <i class="iconfont iconzhuye" /> 归档
        </router-link>
      </div>
    </div> 
  </v-navigation-drawer>
</template>

<style scoped>
.blogger-info {
  padding: 26px 30px 0;
  text-align: center;
}
.blog-info-wrapper {
  display: flex;
  align-items: center;
  padding: 12px 10px 0;
}
.blog-info-data {
  flex: 1;
  line-height: 2;
  text-align: center;
}
hr {
  border: 2px dashed #d2ebfd;
  margin: 20px 0;
}
.menu-container {
  padding: 0 10px 40px;
  animation: 0.8s ease 0s 1 normal none running sidebarItem;
}
.menus-item a {
  padding: 6px 30px;
  display: block;
  line-height: 2;
}
.menus-item i {
  margin-right: 2rem;
}
@keyframes sidebarItem {
  0% {
    transform: translateX(200px);
  }
  100% {
    transform: translateX(0);
  }
}
</style>

<script>
export default {
  computed: {
    drawer: {
      set(value) {
        this.$store.state.drawer = value;
      },
      get() {
        return this.$store.state.drawer;
      }
    },
    isLogin() {
      return this.$store.state.userId;
    }
  },
  methods: {
    openLogin() {
      this.$store.state.loginFlag = true;
    },
    logout() {
      //如果在个人中心则跳回上一页
      if (this.$route.path == "/user") {
        this.$router.go(-1);
      }
      this.axios.get("/api/logout").then(({ data }) => {
        if (data.flag) {
          this.$store.commit("logout");
          this.$toast({ type: "success", message: "注销成功" });
        } else {
          this.$toast({ type: "error", message: data.message });
        }
      });
    }
  }
};
</script>
