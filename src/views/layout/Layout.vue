<template>
  <div :class="classObj" class="app-wrapper">
    <el-container style="min-height: 100%; ">
      <el-aside width="238px">
        <div
          v-if="device==='mobile'&&sidebar.opened"
          class="drawer-bg"
          @click="handleClickOutside"
        />
        <sidebar class="sidebar-container" />
      </el-aside>
      <el-container class="main-wrapper">
        <el-header>
          <div class="app-version">
            <i
              :class="[sidebar.opened ? 'el-icon-s-fold' : 'el-icon-s-unfold','hamburger']"
              style="cursor:pointer;"
              @click="toggleSideBar"
            ></i>
            {{companyName}}
<!--            <span class="btn-version">体验版</span>-->
          </div>
          <div class="right-menu">
            <span class="btn-msg">
              <i
                class="el-icon-thumb btn-msg msg-container"
                style="color:#fff;margin-right:10px"
                @click="stationBinding"
              ></i>
            </span>
            <el-dropdown calss="msg-container" placement="bottom" trigger="click">
              <el-badge :is-dot="msgCounts.total>0" class="dot-item">
                <i class="el-icon-date btn-msg"></i>
              </el-badge>
              <el-dropdown-menu slot="dropdown" class="msg-dropdown">
                <clockin-calendar />
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown calss="msg-container" placement="bottom" trigger="click">
              <el-badge :is-dot="msgCounts.total>0" class="dot-item">
                <i class="el-icon-message-solid btn-msg"></i>
              </el-badge>
              <el-dropdown-menu slot="dropdown" class="msg-dropdown">
                <el-dropdown-item>
                  <router-link class="inlineBlock" to="/lims/labAnls/dataReview">
                    化验审核
                    <el-badge
                      :value="msgCounts.LabSubCount"
                      :max="99"
                      class="count-item"
                      :hidden="msgCounts.LabSubCount==0"
                    />
                  </router-link>
                </el-dropdown-item>
                <el-dropdown-item>
                  <router-link class="inlineBlock" to="/lims/labAnls/lab-recheck">
                    复验审核
                    <el-badge
                      :value="msgCounts.reExaminationCount"
                      :max="99"
                      class="count-item"
                      :hidden="msgCounts.reExaminationCount==0"
                    />
                  </router-link>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown class="avatar-container" trigger="click">
              <div class="avatar-wrapper">
                <!-- <img src="@/assets/images/wangye.jpg" class="user-avatar" /> -->
                <el-avatar>{{userName.substring(0,1)}}</el-avatar>
                <span class="username">{{userName}}</span>
                <i class="el-icon-caret-bottom" />
              </div>
              <el-dropdown-menu slot="dropdown" class="user-dropdown">
                <router-link class="inlineBlock" to="/">
                  <el-dropdown-item @click.native="changePassword">修改密码</el-dropdown-item>
                </router-link>
                <el-dropdown-item divided>
                  <span style="display:block;" @click="logout">退出登录</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-header>
        <el-main>
          <layout-tabs></layout-tabs>
          <app-main />
        </el-main>
      </el-container>
    </el-container>
    <!-- 修改密码对话框 -->
    <el-dialog title="修改密码" :visible.sync="changePasswordDialog" width="30%" @close="closeDialog">
      <el-form
        :model="dialogForm"
        label-position="right"
        label-width="150px"
        :rules="rules"
        ref="dialogForm"
      >
        <el-form-item label="旧密码：" style="height:50px" prop="oldPass">
          <el-input show-password v-model="dialogForm.oldPass"></el-input>
        </el-form-item>
        <el-form-item label="新密码：" style="height:50px" prop="pass">
          <el-input show-password v-model="dialogForm.pass"></el-input>
        </el-form-item>
        <el-form-item label="再次输入新密码：" style="height:50px" prop="checkPass">
          <el-input show-password v-model="dialogForm.checkPass"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            :icon="isDisabled?'el-icon-close':'el-icon-check'"
            :disabled="isDisabled"
            :type="isDisabled?'danger':'primary'"
            @click="submit"
          >确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 工位绑定 -->
    <el-dialog title="工位绑定" :visible.sync="stationBindingDialog" width="60%">
      <stationBind @close="close"></stationBind>
    </el-dialog>
  </div>
</template>

<script>
import { Sidebar, AppMain, LayoutTabs, ClockinCalendar } from "./components";
import { uptPassword } from "@/api/sys";
import ResizeMixin from "./mixin/ResizeHandler";
import { mapGetters } from "vuex";
import Stomp from "stompjs";
import { resetRouter } from "@/router";
import store from "@/store";
import stationBind from "./stationBind";

export default {
  name: "Layout",
  components: {
    Sidebar,
    AppMain,
    LayoutTabs,
    ClockinCalendar,
    stationBind
  },
  mixins: [ResizeMixin],
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
        this.isDisabled = true;
      } else {
        if (this.dialogForm.checkPass !== "") {
          this.$refs.dialogForm.validateField("checkPass");
          this.isDisabled = true;
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
        this.isDisabled = true;
      } else if (value !== this.dialogForm.pass) {
        callback(new Error("两次输入密码不一致!"));
        this.isDisabled = true;
      } else {
        callback();
        this.isDisabled = false;
      }
    };
    return {
      adminName: "欢迎管理员adminstrator",
      counts: {},
      // client: Stomp.client(process.env.VUE_APP_MQ_SERVICE),
      members: this.$store.state.user.userMember,
      changePasswordDialog: false,
      dialogForm: {
        oldPass: "",
        pass: "",
        checkPass: ""
      },
      rules: {
        pass: [
          {
            validator: validatePass,
            required: true,
            trigger: ["blur", "change"]
          }
        ],
        checkPass: [
          {
            validator: validatePass2,
            required: true,
            trigger: ["blur", "change"]
          }
        ],
        oldPass: [
          {
            required: true,
            message: "请输入旧密码",
            trigger: ["blur", "change"]
          }
        ]
      },
      isDisabled: true,
      stationBindingDialog: false
    };
  },
  computed: {
    userName() {
      return this.$store.state.user.userName;
    },
    sidebar() {
      return this.$store.state.app.sidebar;
    },
    device() {
      return this.$store.state.app.device;
    },
    companyName() {
      return this.$store.state.user.companyName;
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened, //控制菜单收起展开状态
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === "mobile"
      };
    },
    ...mapGetters(["avatar", "sidebar"]),
    msgCounts() {
      return this.$store.state.messages;
    }
  },
  created() {
    // TODO 待服务器配置
    // this.connect();
    this.$store.dispatch("getNewMsg", this.$store.state.user.workCode);
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch("CloseSideBar", { withoutAnimation: false });
    },
    close(){
        this.stationBindingDialog = false
    },
    logout() {
      this.$store.dispatch("LogOut").then(() => {
        // location.reload(); // 为了重新实例化vue-router对象 避免bug
        resetRouter();
      });
    },
    toggleSideBar() {
      this.$store.dispatch("ToggleSideBar");
    },
    onConnected(frame) {
      //订阅频道
      this.client.subscribe(
        process.env.VUE_APP_MQ_SUBSCRIPT,
        this.responseCallback,
        this.onFailed
      );
    },
    onFailed(frame) {
      console.log("MQ Failed: " + frame);
    },
    responseCallback(frame) {
      // console.log("MQ msg=>" + frame);
      //接收消息处理
      let self = this;
      if (self.members.indexOf(frame.body) > -1) {
        self.$store.dispatch("getNewMsg", this.$store.state.user.workCode);
      }
    },
    connect() {
      //初始化mqtt客户端，并连接mqtt服务
      this.client.connect(
        process.env.VUE_APP_MQ_USERNAME,
        process.env.VUE_APP_MQ_PASSWORD,
        this.onConnected,
        this.onFailed,
        process.env.VUE_APP_MQ_SERVICE_NAME
      );
    },
    // 修改密码
    changePassword() {
      this.changePasswordDialog = true;
    },
    closeDialog() {
      this.$refs["dialogForm"].resetFields();
    },
    submit() {
      this.$refs["dialogForm"].validate(vaild => {
        if (vaild) {
          let userCode = this.$store.getters.userCode;
          if (this.dialogForm.oldPass == this.dialogForm.pass) {
            this.$message.error("新密码不能与旧密码相同！");
            return;
          }
          if (this.dialogForm.pass.length < 5) {
            this.$message.error("新密码长度不能小于5位！");
            return;
          }
          if (this.dialogForm.pass != this.dialogForm.checkPass) {
            this.$message.error("两次输入的密码不同！");
            return;
          }
          uptPassword(userCode, this.dialogForm).then(response => {
            let data = response.data;
            if (data.success) {
              this.$message.success("修改成功！！");
              this.changePasswordDialog = false;
              // TODO 后端将该userCode下所有的用户登出
              store.dispatch("TimeoutLogOut").then(() => {
                resetRouter();
              });
            } else {
              this.$message.error(
                response.data.message + ":" + response.data.data
              );
            }
          });
        } else {
          this.$message.error("请输入正确的信息");
        }
      });
    },
    // 工位绑定
    stationBinding() {
      this.stationBindingDialog = true;
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.sidebar-container {
  background-color: #41485b;
}
.el-aside {
  margin: 0;
  padding: 0;
}
.openSidebar {
  .el-aside {
    width: 238px;
  }
}
.hideSidebar {
  .el-aside {
    width: 36px !important;
  }
}
.mobile.hideSidebar {
  .el-aside {
    width: 0 !important;
  }
}
.main-wrapper {
  overflow: hidden;
  height: 100vh;
}
.el-header {
  width: 100%;
  margin: 0;
  padding: 0;
  height: 60px;
  line-height: 60px;
  background-image: -webkit-linear-gradient(left, #41485b, #323744);
  .app-version {
    color: #fff;
    float: left;
    font-size: 18px;
    padding: 0 15px;
    .btn-version {
      background: #fff;
      font-size: 14px;
      padding: 0 10px;
      display: inline-block;
      height: 30px;
      line-height: 30px;
      border-radius: 10px;
      margin-left: 15px;
      color: #323744;
    }
  }
  .right-menu {
    float: right;
    margin-right: 40px;
    .username {
      color: #fff;
      font-size: 12px;
      padding-left: 6px;
      padding-right: 6px;
      top: -15px;
      position: relative;
    }
    .avatar-container {
      height: 60px;
      vertical-align: middle;
      // display: inline-block;
      // position: absolute;
      // right: 35px;
      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;
        line-height: initial;
        .user-avatar {
          width: 25px;
          height: 25px;
          margin-top: 10px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -15px;
          top: 9px;
          font-size: 20px;
        }
      }
    }
    .msg-container {
      height: 32px;
      line-height: 32px;
      margin-top: -10px;
      vertical-align: middle;
      cursor: pointer;
    }
    .dot-item {
      height: 32px;
      line-height: 32px;
      margin-right: 10px;
      margin-top: -10px;
      cursor: pointer;
      .btn-msg {
        line-height: 32px;
        height: 32px;
        color: #fff;
      }
    }
    .count-item {
      top: 10px;
      right: 0;
    }
    .btn-check {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
    .calendar-box {
      position: absolute;
      right: 5 0px;
      top: 0;
      width: 500px;
      height: 650px;
    }
  }
}
</style>
<style lang="scss">
.right-menu .el-badge__content.is-fixed.is-dot {
  right: 5px;
  top: 5px;
}
.msg-dropdown {
  top: 50px !important;
}
</style>
