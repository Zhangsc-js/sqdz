<template>
  <div>
    <el-form :model="addInput" ref="addInput" label-width="100px">
      <el-col :span="12">
        <el-form-item label="菜单名称" prop="title">
          <el-input v-model="addInput.meta.title" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="路由名称" prop="name">
          <el-input v-model="addInput.name" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="外部链接" prop="isExternal">
          <el-switch
            v-model="addInput.isExternal"
            :active-value="1"
            :inactive-value="0"
            active-text="是"
            inactive-text="否"
          ></el-switch>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item
          :label="!!addInput.isExternal ? '访问地址' : '访问路径'"
          prop="path"
        >
          <el-input v-model="addInput.path" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item
          label="文件路径"
          prop="component"
          v-if="addInput.isExternal == 0"
        >
          <el-input v-model="addInput.component" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="快捷访问码" prop="code">
          <el-input maxlength="6" v-model="addInput.code" />
        </el-form-item>
      </el-col>
       <el-col :span="12">
        <el-form-item label="图标" prop="icon">
          <el-input maxlength="6" v-model="addInput.meta.icon" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label prop="hidden">
          <el-switch
            v-model="addInput.hidden"
            :active-value="0"
            :inactive-value="1"
            active-text="可见"
            inactive-text="隐藏"
          ></el-switch>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="是否缓存" prop="hidden">
          <el-switch
            v-model="addInput.meta.keepAlive"
            :active-value="true"
            :inactive-value="false"
            active-text="是"
            inactive-text="否"
          ></el-switch>
        </el-form-item>
      </el-col>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel()">取 消</el-button>
      <el-button type="primary" @click="update()">保存</el-button>
    </div>
  </div>
</template>

<script>
import { updateMenu } from "@/api/sys";
export default {
  name: "update-menu",
  data() {
    return {
      addInput: { meta: { title: "", icon: "dashboard", requiresArg: false ,keepAlive:false} }
    };
  },
  props: {
    selData: {
      type: Object,
      required: true
    }
  },
  mounted() {
    this.addInput = this.selData;
  },
  activated() {
    this.addInput = this.selData;
  },
  methods: {
    update() {
      let data = { ...this.addInput };
      data.meta = JSON.stringify(data.meta);
      !!data.children && delete data.children;
      updateMenu(data.id, data)
        .then(res => { 
          this.$emit("hideDialog");
          if (res.data.code == 10000) {
            this.$emit("getData");

            this.$message(res.data.message);
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    cancel() {
      this.$emit("hideDialog");
    }
  }
};
</script>
<style scoped>
.dialog-footer{
  clear:left;
}
</style>
