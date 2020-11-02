<template>
  <div class="tags-view-container">
    <scroll-pane class="tags-view-wrapper" ref="scrollPane">
      <router-link
        ref="tag"
        class="tags-view-item"
        :class="isActive(tag)?'active':''"
        v-for="tag in Array.from(visitedViews)"
        :to="tag.path"
        :key="tag.path"
        @contextmenu.prevent.native="openMenu(tag,$event)"
      >
        <span @click="click(tag.title)">{{tag.title}}</span>
        <span
          class="el-icon-close"
          v-if='tag.path!=="/"'
          @click.prevent.stop="closeSelectedTag(tag)"
        ></span>
      </router-link>
    </scroll-pane>
    <ul class="contextmenu" v-show="visible" :style="{left:left+'px',top:top+'px'}">
      <li @click="closeSelectedTag(selectedTag)" v-if='selectedTag.path!=="/"'>关闭</li>
      <li @click="closeOthersTags">关闭其他</li>
      <li @click="closeAllTags" v-if='selectedTag.path!=="/"'>关闭所有</li>
    </ul>
  </div>
</template>

<script>
import ScrollPane from "@/components/ScrollPane";

export default {
  name: "LayoutTabs",
  components: { ScrollPane },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {}
    };
  },
  computed: {
    visitedViews() {
      return this.$store.state.tagsView.visitedViews;
    },
    cachedViews() {
      return this.$store.state.tagsView.cachedViews;
    }
  },
  watch: {
    $route() {
      this.addViewTags();
      this.moveToCurrentTag();
    },
    visible(value) {
      if (value) {
        document.body.addEventListener("click", this.closeMenu);
      } else {
        document.body.removeEventListener("click", this.closeMenu);
      }
    }
  },
  mounted() {
    this.addViewTags();
  },
  methods: {
    generateRoute() {
      if (this.$route.name) {
        return this.$route;
      }
      return false;
    },
    isActive(route) {
      return route.path === this.$route.path || route.name === this.$route.name;
    },
    addViewTags() {
      const route = this.generateRoute();
      if (!route) {
        return false;
      }
      this.$store.dispatch("addVisitedViews", route);
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag;
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to === this.$route.path) {
            this.$refs.scrollPane.moveToTarget(tag.$el);
            break;
          }
        }
      });
    },
    closeSelectedTag(view) {
      this.$store.dispatch("delVisitedViews", view).then(views => {
        if (this.isActive(view)) {
          const latestView = views.slice(-1)[0];
          if (latestView) {
            this.$router.push(latestView.path);
          } else {
            this.$router.push("/");
          }
        }
      });
    },
    closeOthersTags() {
      this.$router.push(this.selectedTag.path);
      this.$store.dispatch("delOthersViews", this.selectedTag).then(() => {
        this.moveToCurrentTag();
      });
    },
    closeAllTags() {
      this.$store.dispatch("delAllViews");
      this.$router.push("/");
    },
    openMenu(tag, e) {
      this.visible = true;
      this.selectedTag = tag;
      this.left = e.clientX;
      this.top = e.clientY;
    },
    closeMenu() {
      this.visible = false;
    },
    click(title){
        if(title!=='对比分析模板'){
            this.$store.commit('filterVisitedViews','对比分析模板')
        }
         if(title!=='同比分析模板'){
            this.$store.commit('filterVisitedViews','同比分析模板')
        }
        if(title!=='环比分析模板'){
            this.$store.commit('filterVisitedViews','环比分析模板')
        }
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.tags-view-container {
  .tags-view-wrapper {
    background: #fff;
    height: 34px;
    border-bottom: 1px solid #d8dce5;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
    .tags-view-item {
      display: inline-block;
      position: relative;
      height: 30px;
      line-height: 30px;
      border: 1px solid #d8dce5;
      border-radius: 5px 5px 0px 0px;
      color: #495060;
      background: #fff;
      padding: 0 10px;
      padding-left:15px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      &:first-of-type {
        margin-left: 15px;
      }
      &.active {
        background-color: #41485b;
        color: #fff;
        border-color: #41485b;
        &::before {
          content: "";
          background: #fff;
          display: /*inline-block*/ none;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 2;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}

//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      vertical-align: 3px;
      border-radius: 50%;
      text-align: center;
      margin-left:5px;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;
      &:before {
        transform: scale(0.6);
        display: inline-block;
        vertical-align: -3px;
      }
      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>
