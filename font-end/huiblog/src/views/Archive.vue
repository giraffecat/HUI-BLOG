<template>
  <div>
    <!-- banner -->
    <div class="banner cover">
      <h1 class="banner-title">归档</h1>
    </div>
    <!-- 归档列表 -->
    <v-card class="blog-container">
      <timeline>
        <timeline-title> 目前共计{{ count }}篇文章，继续加油 </timeline-title>
        <timeline-item class="animate__animated animate__fadeIn" v-for="item of archiveList" :key="item.id">
          <!-- 日期 -->
          <span class="time">{{ item.create_time | date }}</span>
          <!-- 文章标题 -->
          <router-link
            :to="'/articles/' + item.id"
            style="color:#666;text-decoration: none"
          >
            {{ item.article_title }}
          </router-link>
        </timeline-item>
      </timeline>
      <!-- 分页按钮 -->
      <v-pagination
        color="#00C4B6"
        v-model="current"
        :length="Math.ceil(count / 10)"
        total-visible="7"
      />
    </v-card>
  </div>
</template>

<script>
import { Timeline, TimelineItem, TimelineTitle } from "vue-cute-timeline";
import 'vue-cute-timeline/dist/index.css'
import {Archives} from "../api/api"
export default {
  created() {
    this.listArchives();
  },
  components: {
    Timeline,
    TimelineItem,
    TimelineTitle
  },
  data: function() {
    return {
      current: 1,
      count: 0,
      archiveList: []
    };
  },
  methods: {
    async listArchives() {
      let params = {
        current: this.current 
      }
      const data = await Archives.GetArchiveList(params);  
      console.log("asdas",data.data.data)
      this.archiveList = data.data.data.recordList;
      this.count = data.data.data.count;
    }
  },
  watch: {
    current(value) {
      this.listArchives()
    }
  }
};
</script>

<style scoped>
.time {
  font-size: 0.75rem;
  color: #555;
  margin-right: 1rem;
}
.cover{
  background: url("http://18.222.123.50:3000/public/achive.jpg") center center / cover no-repeat
}
</style>
