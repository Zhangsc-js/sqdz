<template>
  <div class="margin20 mr15">
    <el-form :inline="true" class="demo-form-inline" ref="outMeterMisForm">
      <el-form-item label="货物名称" prop="goodsName">
        <el-input
          id="goodsName"
          v-model="outMeterMisForm.goodsName"
          :maxlength="20"
          plain="true"
          placeholder="请输入货物名称"
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item label="车号" prop="truckNo">
        <el-select v-model="outMeterMisForm.truckNo" filterable placeholder="请选择" id="truckNo">
          <el-option
            v-for="item in carsList"
            :key="item.value"
            :label="item.truckNo"
            :value="item.truckNo"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="客户" prop="clientele">
        <el-input
          id="clientele"
          v-model="outMeterMisForm.clientele"
          :maxlength="20"
          plain="true"
          placeholder="客户名称"
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="submitSearch(1)">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button href="javascript:void(0)" class="btn-w" @click="clearSearchBox()">清空</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="outMetersData">
      <el-table-column type="selection" width="30"></el-table-column>
      <el-table-column prop="weighingNo" align="center" label="检斤序号" width="180"></el-table-column>
      <el-table-column prop="truckNo" align="center" label="车号"></el-table-column>
      <el-table-column prop="clientele" align="center" label="客户" width="200"></el-table-column>
      <el-table-column prop="goodsName" align="center" label="货物名称"></el-table-column>
      <el-table-column prop="gross" align="center" label="毛重(KG)"></el-table-column>
      <el-table-column prop="tare" align="center" label="皮重(KG)"></el-table-column>
      <el-table-column prop="net" align="center" label="净重(KG)"></el-table-column>
      <el-table-column prop="createdBy" align="center" label="司磅员"></el-table-column>
      <el-table-column prop="createdOn" align="center" label="称重时间" width="160"></el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="140px">
        <template v-slot="scope">
          <el-button type="text" size="small" @click="updateOutMeter(scope.row.id)">更新</el-button>
          <el-button type="text" size="small" @click="delOutMeter(scope.row.id)">删除</el-button>
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
      <OutMeterMisUd @hidenDialog="hidenDialog" />
    </el-dialog>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import Pagination from "@/components/Pagination/index";
import OutMeterMisUd from "./outMeter-mistake-ud";

const { mapState, mapActions, mapMutations } = createNamespacedHelpers(
  "outMeter"
);
export default {
  name: "OutMeterMistake",
  components: { Pagination, OutMeterMisUd },
  data() {
    return {
      dialogVisible: false,
      // addDialogVisible:false,
      page: {
        pageNum: 0,
        pageSize: 10
      },
      outMeterMisForm: {
        goodsName: "",
        truckNo: "",
        clientele: ""
      },
      title: ""
    };
  },
  computed: {
    ...mapState(["outMetersData", "total"]),
    carsList() {
      return this.$store.state.weiCars.weiCarData;
    }
  },
  mounted() {
    this.getData();
    this.selectCars();
  },
  methods: {
    ...mapActions(["getAllOutMeters", "delOutMeterById"]),
    ...mapMutations(["SET_SELECTED_ROW_ID", "SET_DISABLED"]),
    selectCars() {
      this.$store.dispatch("weiCars/getAllWeiCars");
    },
    getData(pageNum) {
      if(pageNum ===1){
        this.page.pageNum = pageNum;
      }
      this.getAllOutMeters({
        ...this.page,
        ...this.outMeterMisForm
      });
    },
    submitSearch(pageNum) {
      this.getData(pageNum);
    },
    clearSearchBox() {
      this.outMeterMisForm = {
        goodsName: "",
        truckNo: "",
        clientele: ""
      };
    },
    delOutMeter(id) {
      this.$confirm("此操作将永久删除该记录，是否继续", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "取消"
      })
        .then(() => {
          this.delOutMeterById(id).then(() => {
            this.$message({
              type: "success",
              message: "删除成功！"
            });
            this.getData(1);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    hidenDialog() {
      this.dialogVisible = false;
      this.addDialogVisible = false;
      this.getData();
    },
    updateOutMeter(id) {
      this.SET_SELECTED_ROW_ID(id);
      this.SET_DISABLED(false);
      this.title = "更新";
      this.dialogVisible = true;
    }
  }
};
</script>

<style scoped>

</style>
