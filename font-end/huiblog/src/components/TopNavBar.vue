<template>
  <div :class="navClass" >
  <!-- 手机端导航栏 -->
  <div class="d-md-none nav-mobile-container">
      <div style="font-size:18px;font-weight:bold">
        <router-link to="/">
          HUI BLOG
        </router-link>
      </div>
      <div style="margin-left:auto">
        <a @click="openDrawer">
          <i class="icon-mulu iconfont" style="font-size:1.5rem"/>
        </a>
      </div>
    </div>
  <!-- 电脑端导航栏 -->
    <div class="d-md-block d-none nav-container">
    <div class="float-right nav-title">
      <div class="float-left blog-title">
        <router-link to="/">
          HUI BLOG
        </router-link>
      </div>
      <div class="menus-item">
        <a>
          <i class="icon-search iconfont"/><span style="margin: 5px">SEARCH</span>
        </a>
      </div>

      <div class="menus-item">
        <router-link to="/category">
          <i class="icon-fenlei iconfont" /><span style="margin: 5px">CATEOGRY</span>
        </router-link>
      </div>

      <div class="menus-item">
        <router-link to="/archive">
          <i class="icon-guidangrenwu iconfont"  /><span style="margin: 5px">ARCHIVE</span>
        </router-link>
      </div>

      <div class="menus-item">
        <router-link to="/">
          <i class="icon-home-fill iconfont" /><span style=" margin: 5px">HOME</span>
        </router-link>
      </div>
    </div>
  </div>
  </div>
  
</template>

<script>
export default {
 mounted() {
    window.addEventListener("scroll", this.scroll);
  },
  data: function() {
    return {
      navClass: "nav-class"
    };
  },
  methods: {
    openDrawer(){
      console.log("clicl open")
      this.$store.state.drawer = true;

    },
    scroll() {
      const that = this;
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
        that.scrollTop = scrollTop;
      if (that.scrollTop > 0) {
        that.navClass = "nav-fixed ";
      } else {
        that.navClass = "nav-class";
      }
    },
  }
}
</script>

<style scoped>
.nav-class{
  position:fixed; /* 绝对定位，fixed是相对于浏览器窗口定位。 */
  /*position: relative;*/
  z-index:99; /* 层叠顺序，数值越大就越高。页面滚动的时候就不会被其他内容所遮挡。 */
  width: 100%;
  height: 50px;
}
.nav-class a {
  color: whitesmoke !important;
}
.nav-fixed{
  position:fixed; /* 绝对定位，fixed是相对于浏览器窗口定位。 */
  /*position: relative;*/
  z-index:99; /* 层叠顺序，数值越大就越高。页面滚动的时候就不会被其他内容所遮挡。 */
  width: 100%;
  height: 40px;
  background: rgba(255, 255, 255, 0.8) !important;
  /* box-shadow: 0 5px 6px -5px rgba(133, 133, 133, 0.6); */
}
/* .navClass a{
} */
.nav-container {
  width: 100%;
  padding: 5px;
  float: right  
}
.nav-title {
  display: flex;
  align-items: center;
  height: 100%;
}
.blog-title{
  position: absolute;
  left:50px;
  font-size: 18px;
  font-weight: bold;
}
.menus-item {
  position: relative;
  display: inline-block;
  margin: 0 0 0 0.875rem;
}


.menus-item a {
  transition: all 0.2s;
}
.menus-item a:hover:after {
  width: 100%;
}
.menus-item a:after {
  position: absolute;
  bottom: -5px;
  left: 0;
  z-index: -1;
  width: 0;
  height: 3px;
  background-color: #80c8f8;
  content: "";
  transition: all 0.3s ease-in-out;
}

.nav-mobile-container {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 5px;

}
</style>