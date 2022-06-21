<template>
  <div id="app" class="home" >
    <!-- banner -->
    <div class="home-banner">
      <div class="banner-container">
        <h1 class = "animate__animated animate__zoomIn">HUI 的个人博客</h1>
        <div class="blog-intro animate__animated animate__zoomIn">
          {{ obj.output }} <span class="typed-cursor">|</span>
        </div>
        <!-- 向下滚动 -->
        <div class="scroll-down" @click="scrollDown">
          <v-icon color="#fff" class="scroll-down-effects">
            mdi-chevron-down
          </v-icon>
        </div>
      </div>
    </div>
    <div class="home-body">
      <v-row class="home-container">
        <!-- 文章 -->
        <v-col md="7" sm="12" cols="12" offset-md="1" >
          <!--左边博客列表-->
          <div class="grid-content bg-purple">
            <!--BlogList header-->
            <div class="blog-header">
              <div class="blog-title">
                <span class="name">博客</span>
              </div>
              <div>
                <p class="stats">共<span class="high-light">{{articleNum}}</span>篇</p>
              </div>
            </div>

            <!--BlogList content-->
            <v-card v-for="(item,index) in articleList" :key="item.id" class="article-card animate__animated animate__zoomIn">

              <!-- 文章封面图 -->
              <div :class="isRight(index)">
                <router-link :to="'/articles/'">
                  <v-img
                    class="on-hover"
                    width="100%"
                    height="100%"
                    :src="item.article_cover"
                  />
                </router-link>
              </div>
              <!-- 文章信息 -->
              <div class="article-wrapper">
                <div style="line-height:2.4">
                  <router-link :to="'/articles/' + item.id">
                    <span class="title"> {{ item.article_title }}</span>
                  </router-link>
                </div>

                <div class = "article-info">
                  <!--是否置顶-->
                  <span v-if="item.is_top == 1">
                    <span style="color:#ff7242">
                      <i class="iconfont icon-zhiding" /> 置顶
                    </span>
                    <span class="separator">|</span>
                  </span>

                  <!-- 发表时间 -->
                  <v-icon size="14">mdi-calendar-month-outline</v-icon>
                   {{ item.create_time | date }}
                  <span class="separator">|</span>

                  <!-- 文章分类 -->
                  <router-link :to="'/categories/'">
                  <v-icon size="14">mdi-inbox-full</v-icon>
                   {{ item.category_name }}
                  </router-link>
                  <span class="separator">|</span>

                  <!-- 文章标签 -->
                  <router-link
                    style="display:inline-block"
                    :to="'/tags/'"
                    class="mr-1"
                    v-for="tag of item.tagDTOList"
                    :key="tag.id"
                  >
                    <v-icon size="14">mdi-tag-multiple</v-icon>{{tag.tag_name}}
                  </router-link>

                  <!-- 文章内容 -->
                  <div class="article-content">
                   {{item.article_content}}
                  </div>
                </div>
              </div>
            </v-card>

            <!-- Blog Pagination -->
            <div class="blog-pagination">
              <!-- <span class="blog-pagination-total">共196条</span>
              <div class="blog-pagination-select">
                <v-select
                  :items="paginationChoice"
                ></v-select>
              </div> -->
              <v-pagination
              v-model="page"
              color="#00C4B6"
              :length="pageLength"
              :total-visible="7"
            ></v-pagination>
              <!-- <div class="blog-pagination-skip">
                <span>前往</span>
                <v-text-field class="pagination-input"></v-text-field>
                <span>页</span>
              </div> -->
            </div>
          </div>
        </v-col>
        <!--博主信息  -->
      <v-col md="3" cols="12" class="d-md-block d-none">
          <div class="blog-wrapper">
            <v-card class="animated zoomIn blog-card">
               <div class="author-wrapper">
                  <!-- 博主头像 -->
                  <v-avatar size="110">
                    <img
                      class="author-avatar"
                      src="../../public/icon.jpg"
                    />
                  </v-avatar>
                  <div style="font-size: 1.375rem;margin-top:0.625rem">
                    Byrce
                  </div>
                  <div style="font-size: 0.875rem;">
                    全栈小白
                  </div>
                  <!-- 社交信息 -->
                  <div class="card-info-social">
                    <a
                      class="mr-5 iconfont icon-QQ"
                      target="_blank"
                    />
                    <a

                      target="_blank"
                      class="mr-5 iconfont icon-weixin"
                    />
                    <a
                      href="https://github.com/giraffecat"
                      class="iconfont icon-github"
                    />
                  </div>
               </div>
            </v-card>
          </div>
        </v-col>

      </v-row>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import EasyTyper from 'easy-typer-js'
import MD from "markdown-it";
import {Article} from '../api/api';

export default {

  name: 'Home',
  data () {
    return {
      obj: {
        output: "",
        isEnd: false,
        speed: 300,
        singleBack: false,
        sleep: 0,
        type: "rollback",
        backSpeed: 40,
        sentencePause: true
      },
      articleNum:null,
      articleList:[],
      page: 1,
      paginationChoice:["4条/页", "5条/页", "8条/页"],
      paginationLimit: 5,
      pageLength: 0,
    }
  },
  mounted() {
    this.init()
  },
  created(){
    this.getArticleList();
    this.getArticleStats();
  },
  watch:{
    page() {
        this.getArticleList();
    }
  },
  components: {
  },
  computed: {
    isRight() {
      return function(index) {
        console.log("index",index)
        if (index % 2 == 0) {
          return "article-cover left-radius";
        }
        return "article-cover right-radius";
      };
    }
  },
  methods: {
     // 初始化
   init() {
      // 一言Api进行打字机循环输出效果
      fetch("https://v1.hitokoto.cn?j=i")
        .then(res => {
          return res.json();
        })
        .then(({ hitokoto }) => {
          this.initTyped(hitokoto);
        });
    },
    initTyped(input, fn, hooks) {
      const obj = this.obj;
      // eslint-disable-next-line no-unused-vars
      const typed = new EasyTyper(obj, input, fn, hooks);
    },
    //获取文章列表
    async getArticleList(){
      let params = {
        current: this.page,
        paginationLimit: this.paginationLimit
      }
      const data = await Article.GetArticleList(params);   
      //去除markdown的东西
      let md = new MD()
      data.data.data.forEach(item => {
        console.log("item.article_content",item.article_content)
        item.article_content = md
          .render(item.article_content)
          .replace(/<\/?[^>]*>/g, "")
          .replace(/[|]*\n/, "")
          .replace(/&npsp;/gi, "");
      });
      this.articleList = [...data.data.data];
      console.log("articleList",this.articleList)
    },
    //获取文章统计数据
    async getArticleStats(){
      const data = await Article.GetArticleStats();   
      this.articleNum = data.data.data[0].articleNum;
      this.pageLength = Math.ceil(this.articleNum / this.paginationLimit)
    },

    // 初始化
    scrollDown () {
      window.scrollTo({
        behavior: 'smooth',
        top: document.documentElement.clientHeight
      })
    },
  }
}
</script>


<style lang="stylus" scoped>
.typed-cursor
  opacity: 1
  animation: blink 0.7s infinite
@keyframes blink
  0%
    opacity: 1
  50%
    opacity: 0
  100%
    opacity: 1
</style>


<style scoped>
.home-banner {
  position: absolute;
  top: 0px;
  left: 0;
  right: 0;
  height: 100vh;
  background: url("http://18.222.123.50:3000/public/home.jpg") center /
  cover no-repeat;
  background-color: #49b1f5;
  background-attachment: fixed;
  text-align: center;
  animation: header-effect 1s !important;
}
.banner-container {
  margin-top: 43vh;
  line-height: 1.5;
  color: #eee;
}
.blog-contact {
  line-height: 40px;
  text-align: center;
  font-size: 1.5rem;
  margin: 6px 0 -6px;
}

.blog-intro {
  font-size: 1.5rem;
}
.blog-contact a {
  color: #fff !important;
  font-size: 30px
}
.pop{
  margin: 30px;
}
.scroll-down {
  cursor: pointer;
  position: absolute;
  bottom: 0;
  width: 100%;
  font-size: 20px;
}

.scroll-down-effects {
  color: #eee !important;
  text-align: center;
  text-shadow: 0.1rem 0.1rem 0.2rem rgba(0, 0, 0, 0.15);
  line-height: 1.5;
  display: inline-block;
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;
  animation: scroll-down-effect 1.5s infinite;
}
@keyframes scroll-down-effect {
  0% {
    top: 0;
    opacity: 0.4;
    filter: alpha(opacity=40);
  }
  50% {
    top: -16px;
    opacity: 1;
    filter: none;
  }
  100% {
    top: 0;
    opacity: 0.4;
    filter: alpha(opacity=40);
  }
}

.home-body {
  padding-top: 105vh !important;
  margin-bottom: 50px;
}

.blog-header{
  width: 100%;
  background-color: white;
  box-shadow: 0 4px 8px 6px rgba(7,17,27,.06);
  border-radius: 5px;
  padding: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.blog-header:hover{
  box-shadow: 0 5px 10px 12px rgba(7,17,27,.06);
}
.blog-header .name{
  margin: 10px;
  font-size: 20px;
  font-weight: 500;
  color: #1685a9;
}
.blog-header .stats{
  margin: 10px;
  font-size: 15px;
  font-weight: 500;
  line-height: 100%;
}
.blog-header .high-light{
  color: #f2711c;
  font-size: 25px;
}

@media (max-width: 759px) {
  .home-container{
    width: 100%;
    margin: auto auto 0 auto;
  }
}

.article-card {
  display: flex;
  align-items: center;
  height: 280px;
  width: 100%;
  margin-top: 20px;
}
.on-hover {
  transition: all 0.6s;
}
.article-card:hover .on-hover {
  transform: scale(1.1);
}
.article-wrapper {
  width: 60%;
  font-size: 14px;
}
.article-wrapper a:hover {
  color: #8e8cd8;
}

.article-wrapper .title {
  font-size: 1.5rem !important;
  transition: all 0.3s;
}

.left-radius {
  border-radius: 8px 0 0 8px !important;
  order: 0;
}
.right-radius {
  border-radius: 0 8px 8px 0 !important;
  order: 1;
}

.article-content {
  line-height: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
.article-cover {
  overflow: hidden;
  height: 100%;
  width: 45%;
}
.right-radius {
  border-radius: 0 8px 8px 0 !important;
  order: 1;
}

.blog-pagination{
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
  width: 100%;
  margin-top: 20px;
  background: #fff;
  box-shadow: 0 4px 8px 6px rgba(7,17,27,.06);
  border-radius: 5px;

}
.blog-pagination-total{
  font-size:15px;
  color: grey;
  margin: 20px;
}
.blog-pagination-select{
  margin: 20px;
  width:100px;
}
.blog-wrapper {
  position: sticky;
  top: 10px;
}
.blog-card {
  line-height: 2;
  padding: 1.25rem 1.5rem;
}
.author-wrapper {
  text-align: center;
}
.card-info-social {
  line-height: 40px;
  text-align: center;
  margin: 6px 0 -6px;
}
.card-info-social a {
  font-size: 1.5rem;
}
</style>
