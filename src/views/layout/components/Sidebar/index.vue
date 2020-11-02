<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :show-timeout="200"
      mode="vertical"
      :default-active="$route.path"
      :collapse="isCollapse"
      text-color="#f0f0f0"
      class="sidebarBg"
      active-text-color="#f0f0f0"
      :unique-opened="true"
    >
      <!-- <router-link to="/">
        <div class="sidebar-logo">
          <img src="@/assets/images/logo.png" class="logo" />
        </div>
        <div class="sidebar-logo-mini">
          <img src="@/assets/images/logo.png" class="logo" />
        </div>
      </router-link>-->
      <transition name="el-zoom-in-top">
        <div class="search-box">
          <el-input
            v-model="inputMenu"
            @change="searchMenu"
            placeholder="搜索菜单"
            suffix-icon="el-icon-search"
            style="margin:10px"
          ></el-input>
          <div class="search-result" v-if="searchRes.length>0">
            <el-scrollbar class="scrollbar-wrapper search-wrapper">
              <sidebar-item
                v-for="route in searchRes"
                :key="route.path"
                :item="route"
                :base-path="route.path"
              />
            </el-scrollbar>
          </div>
        </div>
      </transition>

      <sidebar-item
        v-for="(route,index) in routes"
        :key="index"
        :item="route"
        :base-path="route.path"
      />
    </el-menu>
  </el-scrollbar>
</template>
<script>
import { mapGetters } from "vuex";
import SidebarItem from "./SidebarItem";

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters(["sidebar", "permissionRouters"]),
    routes() {
      // return JSON.parse(window.sessionStorage.getItem('menu'))
      return this.$store.getters.permissionRouters;
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  },
  data() {
    return {
      searchRes: [],
      inputMenu: ""
    };
  },
  methods: {
    searchMenu(value) {
      if (!value) {
        this.searchRes = "";
      } else {
        let routes = this.routes;
        this.searchRes = this.deal(
          routes,
          node => node.meta.title.indexOf(value) > -1
        );
        if (this.searchRes.length == 0) {
          this.searchRes.push({
            path: "",
            meta: { title: "无匹配结果...", requiresArg: false }
          });
        }
      }
    },
    deal(nodes, predicate) {
      // 如果已经没有节点了，结束递归
      if (!(nodes && nodes.length)) {
        return [];
      }
      const newChildren = [];
      for (const node of nodes) {
        if (node.meta && predicate(node)) {
          // 如果节点符合条件，直接加入新的节点集
          newChildren.push(node);
          node.children = node.children;
        } else {
          // 如果当前节点不符合条件，递归过滤子节点，
          // 把符合条件的子节点提升上来，并入新节点集
          newChildren.push(...this.deal(node.children, predicate));
        }
      }
      return newChildren;
    }
  },
  watch: {
    $route: {
      handler: function() {
        this.searchRes = [];
        this.inputMenu = "";
      }
    }
  }
};
</script>
<style>
#app .sidebar-container .scrollbar-wrapper.search-wrapper .el-scrollbar__wrap {
  overflow-x: hidden !important;
}
</style>
<style lang="scss">
#app .sidebar-container .el-submenu__title:hover,
.el-menu,
.el-submenu__title:hover,
.el-menu-item:focus,
.el-menu-item:hover {
  background-color: #41485b;
}
#app .sidebar-container .el-submenu__title:hover,
.el-submenu__title:hover,
.el-menu-item:focus,
.el-menu-item:hover {
  background-color: #409eff;
}
.search-box {
  position: relative;
  background-color: #323744;
  .search-input,
  .el-input__inner {
    padding: 0 30px 0 20px;
    background-color: #323744;
    border: none;
    color: #fff;
  }
  /deep/ .el-input__icon.el-input__icon {
    line-height: 32px;
    color: #fff;
  }
  .el-input__suffix {
    top: 0;
    right: 15px;
  }
  input::-webkit-input-placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  input::-moz-input-placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  input::-ms-input-placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  .search-result {
    position: fixed;
    z-index: 100;
    top: 92px;
    left: 0;
    width: 238px;
    height: calc(100vh - 92px);
    background-color: #41485b;
    .search-wrapper {
      overflow-x: hidden;
      height: 100%;
    }
  }
}
</style>
