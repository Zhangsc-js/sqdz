<template>
  <div class="assignRoles">
    <el-transfer
      filterable
      :titles="['现有角色', '所有角色']"
      v-model="value"
      :data="data"
      @change="change"
      style="width:100%;height:90%"
    ></el-transfer>
    <el-row style="text-align:center">
      <el-button class="closeBtn" type="primary" icon="el-icon-circle-close" @click="close">关闭</el-button>
    </el-row>
  </div>
</template>

<script>
import { queryRole, getRole, saveRoleUser, moveRole } from "@/api/sys";

export default {
  props: {
    id: {
      type: String,
      required: true
    },
    count: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      data: [],
      value: [],
      loginUserCode: ""
    };
  },
  created() {
    this.init();
  },
  watch: {
    count() {
      this.init();
    }
  },
  methods: {
    async init() {
      // 所有
      let users = [];
      this.loginUserCode = this.$store.getters.userCode;
      const response = await queryRole(this.loginUserCode);
      let data = response.data;
      if (data.success) {
        users = data.data;
        this.data = users;
      }
      // 已有角色
      let hasUser = [];
      getRole(this.id).then(response => {
        let data = response.data;
        if (data.success) {
          hasUser = data.data;

          const arr = []; //hasUser的 id
          const value = []; //所有-已有
          hasUser.forEach(item => {
            arr.push(item.key);
          });
          users.forEach(item => {
            //   已有的在 所有的里面找 找不到就赋值给 value
            if (arr.indexOf(item.key) == "-1") {
              value.push(item.key);
            }
          });
          this.value = value;
        }
      });
    },
    close() {
      this.$emit("close");
    },
    async change(val, direction, movedKeys) {
      let boo = true;
      // if (direction == "right") {
      //   //判断当前用户是否分配了右移角色
      //   let response = await moveRole(this.loginUserCode, movedKeys);
      //   let data = response.data;
      //   if (!data.success) {
      //     this.$message.error(data.message + ":" + data.data);
      //     boo = false;
      //   }
      // }
      // if (boo) {
      const arr = [];
      this.data.forEach(item => {
        if (val.indexOf(item.key) == "-1") {
          arr.push(item);
        }
      });
      saveRoleUser(this.id, arr).then(response => {
        let data = response.data;
        if (data.success) {
          this.$message.success("保存成功");
        }
      });
      // }
    }
  }
};
</script>

<style>
.assignRoles {
  height: 55vh;
}
.assignRoles .el-transfer-panel {
  height: 90%;
  border: 1px solid #000;
  width: 40%;
}

.assignRoles .el-transfer-panel__list.is-filterable {
  height: 90%;
}

.assignRoles .el-checkbox__label span {
  font-size: 16px;
}

.assignRoles .el-checkbox {
  display: block;
  margin: 0 auto;
}

.assignRoles .el-transfer-panel__body {
  height: auto;
}

.closeBtn {
  position: relative;
  left: -30px;
}

.assignRoles .el-transfer-panel {
  overflow: auto;
}
</style>
