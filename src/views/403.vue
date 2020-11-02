<template>
<body class="body02">
  <div class="content02">
    <div class="img01">
      <img src="@/assets/404_images/403.png">
    </div>
    <div class="tit02">{{ message }}</div>
    <div class="fr">
      <el-button type="primary" @click="backHome">返回首页</el-button>
    </div>
  </div>
</body>
</template>

<script>
export default {
  name: "Page403",
  computed: {
    message() {
      return "您没有该页面的访问权限..."
    }
  },
  methods: {
    backHome() {
      window.location.href = ""
    }
  }
};
</script>

<style rel="stylesheet/css" lang="css" scoped>
.body02 {
  width: 100%;
  height: 100%;
  background: #fff url(../assets/404_images/bg01.png) no-repeat center;
}

.content02 {
  width: 50%;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -25%;
  margin-top: -12%;
  transition: 0.5s;
}

.img01 {
  width: 100%;
}
.img01 img {
  width: 100%;
  height: 100%;
}

.tit02 {
  font-size: 40px;
  text-align: center;
  color: #1e88e5;
  text-transform: uppercase;
  letter-spacing: 3px;
  margin-top: 20px;
  transition: 0.5s;
}

@media screen and (max-width: 1600px) {
  .content02 {
    width: 40%;
    margin-left: -20%;
  }
  .tit02 {
    font-size: 30px;
  }
}

@media screen and (max-width: 1600px) {
}

@media screen and (max-width: 610px) {
}
</style>
