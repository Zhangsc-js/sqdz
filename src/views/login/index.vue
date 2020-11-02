<template>
  <div class="bg-login" :style="bgStyle">
    <!-- 图片 -->
    <!-- <div class="official">
      <el-image
        style="width: 100px; height: 100px;display:block"
        :src="require('../../assets/images/companyQRcode.jpg')"
        fit="fill"
        class="img"
      ></el-image>
      <span class="text">捷创微信公众号</span>
    </div>-->
    <el-form class="content01" ref="loginForm" :model="loginForm" :rules="loginRules">
      <div class="tit00">多租户系统</div>
      <div class="cont_txt01">
        <!--企业名-->
        <!--<el-form-item class="cont01" prop="companyName">
          <div class="tit01 fl">企业名</div>
          <div class="txt01 fr">
            <input
              type="text"
              @keydown.enter="handleLogin"
              v-model="loginForm.companyName"
              class="input01"
            />
          </div>
          <div class="clear"></div>
        </el-form-item>-->
        <!--用户名-->
        <el-form-item class="cont01" prop="username">
          <div class="tit01 fl">用户名</div>
          <div class="txt01 fr">
            <input
              @keydown.enter="handleLogin"
              type="text"
              v-model="loginForm.username"
              class="input01"
            />
          </div>
          <div class="clear"></div>
        </el-form-item>
        <!--密码-->
        <el-form-item class="cont01" prop="password">
          <div class="tit01 fl">密码</div>
          <div class="txt01 fr">
            <input
              @keydown.enter="handleLogin"
              type="password"
              v-model="loginForm.password"
              class="input01"
            />
          </div>
          <div class="clear"></div>
        </el-form-item>

        <!--验证码-->
        <el-form-item class="cont01 cont00" prop="verifyCode">
          <div class="tit01 fl">验证码</div>
          <div class="txt01 fr">
            <input
              type="text"
              @keydown.enter="handleLogin"
              v-model="loginForm.verifyCode"
              class="input01"
            />
          </div>
          <div class="yzm01" id="verificationCode" @click="refreshCode">
            <identify :identifyCode="identifyCode"></identify>
          </div>
          <div class="clear"></div>
        </el-form-item>

        <!--立即登录-->
        <el-button class="btn01" @click="handleLogin">立即登录</el-button>
      </div>
    </el-form>
    <!-- 底部标题 -->
    <!-- <p class="bottomTit">
      <span class="one">联系人：杜经理</span>
      <span class="two">联系电话：15666435578</span>
      <span>固定电话：0574-87861204</span>
    </p>-->
  </div>
</template>
<script>
import { isvalidUsername } from "@/utils/validate";
import identify from "@/components/identify";
import { getCompInfo } from "@/api/sys";

export default {
  name: "Login1",
  components: {
    identify
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error("请输入正确的用户名"));
      } else {
        callback();
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error("密码不能小于5位"));
      } else {
        callback();
      }
    };
    const validateCode = (rule, value, callback) => {
      if (value.toLowerCase() != this.identifyCode.toLowerCase()) {
        callback(new Error("验证码错误"));
      } else {
        callback();
      }
    };
    const validateCompName = (rule, value, callback) => {
      if (value.length == 0) {
        callback(new Error("请输入公司名"));
      } else {
        callback();
      }
    };
    return {
      bgStyle: {
        backgroundImage:
          "url(" + require("../../assets/images/login_bg.png") + ")"
      },
      verifyCode: "",
      identifyCode: "",
      identifyCodes:
        "0123456789abcdefghijklnmopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
      loginForm: {
        username: "",
        password: "",
        companyName: "",
        verifyCode: ""
      },
      //   img:require,
      loginRules: {
        // username: [
        //   { required: true, trigger: "blur", validator: validateUsername }
        // ],
        password: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: validatePass
          }
        ],
        companyName: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: validateCompName
          }
        ],
        username: [
          {
            required: true,
            trigger: ["blur", "change"],
            message: "用户名不能为空"
          }
        ],
        verifyCode: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: validateCode
          }
        ]
      },
      loading: false,
      pwdType: "password",
      redirect: undefined,
      adminId: ""
    };
  },
  mounted() {
    this.identifyCode = "";
    this.makeCode(this.identifyCodes, 4);
  },
  methods: {
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },
    refreshCode() {
      this.identifyCode = "";
      this.makeCode(this.identifyCodes, 4);
    },
    makeCode(o, l) {
      let code = "";
      for (let i = 0; i < l; i++) {
        code += this.identifyCodes[
          this.randomNum(0, this.identifyCodes.length)
        ];
      }
      this.identifyCode = code;
      // this.loginForm.verifyCode = code;
      //   this.$set(this.loginForm, "verifyCode", code);
    },
    login(params) {
      let self = this;
      self.$store
        .dispatch("Login", params)
        .then(() => {
          self.$router.push("/");
          this.$store.dispatch("delAllViews"); //调用关闭所有
          self.loading = false;
        })
        .catch(() => {
          self.loading = false;
        });
      //   }
      // })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          let params = { ...this.loginForm };
          delete params["verifyCode"];
          this.login(params);
        } else {
          this.$message.error("请输入正确的登录信息");
          return false;
        }
      });
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  }
};
</script>
<style scoped lang='scss'>
* {
  margin: 0;
  padding: 0;
  text-decoration: none;
  list-style: none;
  border: 0;
  font-family: Arial, "微软雅黑";
  outline: none;
  color: #fff;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
}
img {
  border: none;
}
a {
  list-style: none;
  text-decoration: none;
  color: #000;
  outline: none;
  -webkit-tap-highlight-color: rgba(255, 0, 0, 0);
  transition: all 0.5s;
}
a:hover {
  text-decoration: none;
  opacity: 0.9;
}
ul,
li {
  list-style: none;
}
.clear {
  clear: both;
}
.b {
  font-weight: bold;
}
.fl {
  float: left;
}
.fr {
  float: right;
}

.bg-login {
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-position: center;
}

.content01 {
  width: 360px;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 20px;
  position: absolute;
  right: 25%;
  top: calc(50vh - 190px);
}
.cont_txt01 {
  width: 100%;
  margin-top: 10px;
  overflow: hidden;
}
.cont01 {
  width: 100%;
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 0 10px;
  transition: 1s;
  margin-bottom: 15px;
}
.cont00 {
  width: calc(100% - 110px);
  position: relative;
}

.tit00 {
  width: 100%;
  font-size: 28px;
  text-align: center;
  font-weight: bolder;
  letter-spacing: 2px;
  line-height: 50px;
  color: #007eff;
  background-image: -webkit-linear-gradient(92deg, #007eff, #5f3ddd);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.tit01 {
  width: 50px;
  height: 40px;
  font-size: 14px;
  color: #ccc;
  line-height: 40px;
  text-align: justify;
  text-align-last: justify;
  text-justify: inter-ideograph;
  transition: 1s;
}
.txt01 {
  width: calc(100% - 60px);
  height: 38px;
}
input {
  appearance: none;
  background-color: transparent;
}
.input01 {
  width: 100%;
  height: 38px;
  line-height: 38px;
  color: #666;
  font-size: 16px;
}

.cont01:hover,
.cont01:visited {
  border: 1px solid #1989fa;
}
.cont01:hover .tit01,
.cont01:visited .tit01 {
  color: #1989fa;
}

.yzm01 {
  width: 100px;
  height: 40px;
  background-color: #999;
  position: absolute;
  top: 0px;
  right: -120px;
}

.btn01 {
  width: 100%;
  height: 50px;
  text-align: center;
  line-height: 50px;
  font-size: 16px;
  color: #fff;
  letter-spacing: 3px;
  border-radius: 5px;
  background-color: #1989fa;
  transition: 1s;
  cursor: pointer;
  margin-bottom: 10px;
}
.btn01:hover {
  background-color: #4c58e0;
}
:root input:-webkit-autofill,
textarea:-webkit-autofill,
select:-webkit-autofill {
  box-shadow: 0 0 50px 50px #fff inset;
  background-color: transparent;
  /*阴影大小等于input框宽度一半 利用内阴影覆盖原背景色*/

  -webkit-text-fill-color: #666; /*利用文本填充属性覆盖原有文本颜色*/
}
/* 媒体查询 */
@media screen and (max-width: 750px) {
  .content01 {
    width: 80%;
    margin: 0 auto;
    left: 50%;
    transform: translateX(-50%);
  }
}
.official {
  display: inline-block;
  position: absolute;
  bottom: 20px;
  left: 5vh;
  .img {
    text-align: center;
    margin: 0 auto;
  }
  .text {
    // color: #ccc;
    padding-top: 10px;
    display: inline-block;
  }
}
.bottomTit {
  position: absolute;
  bottom: 20px;
  text-align: center;
  width: 100%;
  .two {
    margin: 0 20px;
  }
}
</style>
