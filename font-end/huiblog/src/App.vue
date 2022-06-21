<template>
 <v-app id="app">
    <!-- 导航栏 -->
    <TopNavBar></TopNavBar>
    <!-- 侧边导航栏 -->
    <SideNavBar></SideNavBar>

    <v-content>
      <router-view :key="$route.fullPath" />
    </v-content>
    <!-- 页脚 -->
    <Footer></Footer>
 </v-app>
</template>

<script>
import TopNavBar from './components/TopNavBar'
import SideNavBar from "./components/SideNavBar";

import Footer from "./components/Footer";

export default {
  name: 'App',
  components:{
    TopNavBar,
    Footer,
    SideNavBar
  },
  data: () => ({
    //
  }),
};
</script>
