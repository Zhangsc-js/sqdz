<template>
  <div style="height: 100%">
    <el-container style="height: 100%;padding:20px;padding-top: 20px !important">
      <!-- 左边模块 -->
      <el-aside class="conf-aside">
          <p class="type" style="text-align:center">映射树类型</p>
        <ul>
          <li
            v-for="item in modules"
            :key="item.id"
            @click="click(item)"
            :class="{selected: item.light}"
          >{{ item.label }}</li>
        </ul>
      </el-aside>
      <el-main class="conf-main">
          <p class="type">卡片类型</p>
        <el-checkbox
          v-for="(item,index) in cards"
          :key="item.id"
          v-model="flag[index]"
          @change="change(item, flag[index])"
        >{{ item.label }}</el-checkbox>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import {
  getInitData,
  getEquipCardType,
  saveEquipCardType,
  deleteEquipCardType
} from "@/api/sys/devCardType";
export default {
  name: "TreeCardConfig",
  data() {
    return {
      modules: [],
      cards: [],
      //  两边关系
      data: [],
      left: "",
      flag: [false, false, false, false, false],
      moduleCode: ""
    };
  },
  created() {
    // 初始化数据
    this.getData();
  },
  methods: {
    getData() {
      getInitData().then(response => {
        const result = response.data;
        if (result.success) {
          this.modules = result.data.modules;
          this.cards = result.data.cards;
          // 获取配置关系
          this.getModuleAndCardRel();
        } else {
          this.$message.error(result.message);
        }
      });
    },
    getModuleAndCardRel() {
      getEquipCardType().then(response => {
        const result = response.data;
        if (result.success) {
          this.data = result.data;
          // 默认选择第一个模块
          if (this.modules.length > 0) {
            this.modules[0].light = true;
            this.moduleCode = this.modules[0].code
            let newData = this.data.filter(item => item.moduleNo === "01");
            newData.forEach(item => {
              this.$set(this.flag, + item.cardNo - 1, true);
            })
          }
        } else {
          this.$message.error(result.message);
        }
      });
    },
    // 数据库新增
    save(equipCardType) {
      saveEquipCardType(equipCardType).then(response => {
        const result = response.data;
        if (result.success) {
          this.$message.success("保存成功");
        } else {
          this.$message.error(result.message);
        }
      });
    },
    // 取消勾选，数据库删除
    delete(cond) {
      deleteEquipCardType(cond).then(response => {
        const result = response.data;
        if (!result.success) {
          this.$message.error(result.message);
        }
      });
    },
    // 选择左边模块
    click(item) {
      // 排他高亮
      this.modules.forEach(item => {
        item.light = false;
      });
      item.light = true;

      //   初始化flag
      this.flag = [false, false, false, false, false];

      // 把data中的01 03 转换成true和false
      this.moduleCode = item.code;
      let newData = this.data.filter(item => item.moduleNo === this.moduleCode);
      newData.forEach(item => {
        this.$set(this.flag, +item.cardNo - 1, true);
      });
    },
    // 打钩的时候 => 01 03 =>保存在data中  或者  在data中删除
    change(item, flag) {
      let code = item.code;
      //   判断多选框是否勾选,若没有则在数组中添加,若有则在数组中删除
      if (flag) {
        this.save({
          cardNo: code,
          moduleNo: this.moduleCode
        })
        this.data.push({ cardNo: code, moduleNo: this.moduleCode });
      } else {
        this.delete({
          cardNo: code,
          moduleNo: this.moduleCode
        })
        this.data = this.data.filter(
          item => !(item.cardNo === code && item.moduleNo === this.moduleCode)
        );
      }
    }
  }
};
</script>

<style scoped lang='scss'>
.conf-aside {
  width: 20%;
  height: 100%;
  padding-top: 50px;
  font-size: 16px;
}
.conf-main {
  width: 77%;
  height: 100%;
  margin-left: 3%;
  padding-top: 50px;
  padding-left: 10%;
}
ul {
  padding-left: 0;
  li {
    list-style: none;
    height: 40px;
    line-height: 40px;
    text-align: center;
    cursor: pointer;
  }
  .selected {
    font-weight: 700;
    color: #000;
  }
}
.type{
    font-size: 20px;
}
</style>
<style lang='scss'>
.conf-main label {
  display: block;
  .el-checkbox__label {
    height: 40px;
    line-height: 40px;
    font-size: 16px;
  }
  .el-checkbox__inner {
    width: 20px;
    height: 20px;
  }
}
</style>
