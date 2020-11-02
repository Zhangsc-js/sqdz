<template>
  <div class="margin20 mr15">
    <el-form inline ref="outMeterOrder" style="margin-left:20px">
      <el-form-item label="车牌号" prop="truckNo">
        <el-input
          id="truckNo"
          v-model="weiCarsForm.truckNo"
          :maxlength="15"
          plain="true"
          placeholder="请输入车牌号"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          icon="el-icon-search"
          href="javascript:void(0)"
          type="primary"
          class="btn-b"
          @click="getData(1)"
        >查询</el-button>
        <el-button href="javascript:void(0)" class="btn-w" @click="clearSearchBox()">清空</el-button>
        <el-button type="primary" @click="addWeiCars()" icon="el-icon-plus">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="weiCarData" style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="truckNo" align="center" label="车号"></el-table-column>
      <el-table-column prop="truckType" align="center" label="型号"></el-table-column>
      <el-table-column prop="tare" align="center" label="皮重(KG)"></el-table-column>
      <el-table-column prop="driver" align="center" label="驾驶员"></el-table-column>
      <el-table-column prop="toleranceRatio" align="center" label="允差比(%)"></el-table-column>
      <el-table-column prop="createdOn" align="center" label="创建时间"></el-table-column>
      <el-table-column prop="remarks" align="center" label="备注"></el-table-column>
      <el-table-column fixed="right" align="center" label="操作">
        <template v-slot="scope">
          <el-button type="text" size="small" @click="updateWeiCar(scope.row.id)">更新</el-button>
          <el-button type="text" size="small" @click="delWeiCar(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="height: 60px">
      <pagination
        :total="total"
        :page.sync="page.pageNum"
        :limit.sync="page.pageSize"
        @pagination="getData"
      />
    </div>
    <el-dialog :title="title" :visible.sync="dialogVisible" width="65%">
      <wei-car-ud @hidenDialog="hidenDialog" />
    </el-dialog>
    <el-dialog title="新增" :visible.sync="addDialogVisible" width="65%">
      <wei-cars-add @hidenDialog="hidenDialog" />
    </el-dialog>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import Pagination from "../../../components/Pagination/index";
import WeiCarsAdd from "./wei-car-add";
import WeiCarUd from "./wei-car-ud";

const { mapState, mapActions, mapMutations } = createNamespacedHelpers(
  "weiCars"
);
export default {
  name: "weiCars",
  components: { Pagination, WeiCarsAdd, WeiCarUd },
  data() {
    return {
      dialogVisible: false,
      addDialogVisible: false,
      title: "",
      page: {
        pageNum: 1,
        pageSize: 10
      },
      weiCarsForm: {
        truckNo: ""
      }
      // total:0,
    };
  },
  computed: {
    ...mapState(["weiCarData", "total"])
  },
  mounted() {
    this.getData();
  },
  methods: {
    ...mapActions(["getAllWeiCars", "delWeiCarsData"]),
    ...mapMutations(["SET_SELECTED_ROW_ID", "SET_DISABLED"]),
    getData(type) {
      if (type === 1) {
        this.page.pageNum = 1;
      }

      this.getAllWeiCars({
        ...this.page,
        ...this.weiCarsForm
      });
    },

    delWeiCar(id) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delWeiCarsData(id).then(() => {
            this.getData(1);
            // console.log(this.getData())
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    updateWeiCar(id) {
      this.SET_SELECTED_ROW_ID(id);
      this.SET_DISABLED(false);
      this.title = "更新";
      this.dialogVisible = true;
    },
    // submitSearch(pageNum) {
    //     this.getData(pageNum)
    // },
    clearSearchBox() {
      this.weiCarsForm = {
        truckNo: ""
      };
    },
    hidenDialog() {
      this.dialogVisible = false;
      this.addDialogVisible = false;
      this.getData();
    },
    addWeiCars() {
      this.addDialogVisible = true;
      this.getData();
    }
  }
};
</script>

<style scoped>
</style>
