<template>
  <div style="height: 100%;overflow:auto">
    <dev-attrs-ud :formData="formData" @cancel="getData" :activeName="activeName"></dev-attrs-ud>
  </div>
</template>
<script>
import { createNamespacedHelpers } from "vuex";
import { isEmpty } from "@/utils/index";
import DevAttrsUd from "./dev-attrs-ud";
import {
  getDevCardAttrByNo,
  deleteDevAttr,
  updateDevCardAttr,
  addDevCardAttr
} from "@/api/sys/dev";
const { mapMutations } = createNamespacedHelpers("sysDev");

export default {
  name: "DevAttrs",
  components: {
    DevAttrsUd
  },
  data() {
    return {
      title: "",
      disabled: true,
      emptyForm: {
        sbmc: "",
        sbmcEn: "",
        zzcs: "",
        gybh: "",
        sbxh: "",
        ggxn: "",
        dw: "",
        sl: "",
        azdd: "",
        sbccbh: "",
        wlbm: "",
        glJddw: "",
        abcFl: "",
        jd: "",
        cgsj: null,
        tysj: null,
        sfWbjkbm: null,
        sfGcsj: null,
        sfQtsj: null,
        sfHysj: null,
        sfLsqs: null,
        sfKpiZb: null,
        sfJkglwhd: null,
        sfHbtxgld: null,
        sfZltxgld: null,
        sfJlbzq: null,
        sfLcwlsb: null,
        sfNyjlsb: null,
        sfWhsb: null,
        sfYb: null,
        sfTzsb: null,
        sfGysfx: null,
        sfHq: null,
        sfCbgl: null,
        sf3dSb: null,
        bz: ""
      },
      formData: {},
      currActiveName: "devAttrs"
    };
  },
  props: {
    activeName: {
      type: String,
      required: false,
      default: ''
    }
  },
  computed: {
    selectNodeNO() {
      return this.$store.state.sysDev.selectNodeNO;
    },
    sbmc() {
      return this.$store.state.sysDev.sbmc;
    }
  },
  watch: {
    selectNodeNO() {
      if (this.activeName == this.currActiveName) {
        this.getData();
      }
    },
    activeName() {
      if (this.activeName == this.currActiveName) {
        this.getData();
      }
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    ...mapMutations(["SET_SELECTED_ROW_ID"]),
    getData() {
      getDevCardAttrByNo(this.selectNodeNO)
        .then(response => {
          const result = response.data;
          if (result.data) {
            if (result.success) {
              this.formData = Object.assign({}, result.data);
            } else {
              this.$message.error(result.message);
            }
          } else {
            this.formData = Object.assign({}, this.emptyForm);
          }
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    }
    // updateDev() {
    //   this.disabled = false;
    // },
    // deleteDev() {
    //   if (!this.formData.id) {
    //     this.$message.error("暂无数据，删除失败!");
    //     return;
    //   }
    //   this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning"
    //   })
    //     .then(() => {
    //       deleteDevAttr(this.formData.id).then(() => {
    //         this.getData();
    //         this.$message.success("删除成功!");
    //       });
    //     })
    //     .catch(() => {
    //       this.$message.info("已取消删除");
    //     });
    // },
    // addDevAttr() {
    //   if (isEmpty(this.selectNodeNO)) {
    //     this.$message.error("请先选择一个设备。");
    //   } else {
    //     this.addDialogVisible = true;
    //   }
    // },
    // addSpareParts() {
    //   this.SET_SELECTED_ROW_ID(this.formData.id);
    // },
    // add() {
    //   const form = {
    //     ...this.formData,
    //     sbdm: this.selectNodeNO
    //   };
    //   if (isEmpty(form.sbdm) || isEmpty(form.sbmc)) {
    //     this.$message.error("请正确填写表单");
    //     return;
    //   }
    //   addDevCardAttr(form)
    //     .then(response => {
    //       if (response.data.success) {
    //         this.$message.success("保存成功");
    //         this.getData();
    //         this.disabled = true;
    //       }
    //     })
    //     .catch(e => {
    //       this.$message.error(e.message);
    //     });
    // },
    // saveInfo() {
    //   this.disabled = true;
    //   if (this.showAddForm) {
    //     this.add();
    //     this.showAddForm = false;
    //   } else {
    //     updateDevCardAttr(this.formData)
    //       .then(response => {
    //         if (response.data.data.success) {
    //           this.$message.success("保存成功");
    //           this.getData();
    //         }
    //       })
    //       .catch(e => {
    //         this.$message.error(e.message);
    //       });
    //   }
    // },
    // changDisabeld() {
    //   this.disabled = !this.disabled;
    // }
  }
};
</script>
