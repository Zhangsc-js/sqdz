<template>
  <div class="margin20 mr15" style="width:calc(100% - 40px);">
    <el-form inline ref="weiListForm" style="margin-left:20px">
      <el-form-item label="货物名称" prop="goodsName">
        <el-input
          id="goodsName"
          v-model="weiListForm.goodsName"
          :maxlength="20"
          plain="true"
          placeholder="请输入货物名称"
        />
      </el-form-item>
      <el-form-item label="磅单号" prop="weighingNO">
        <el-input
          id="weighing_no"
          v-model="weiListForm.weighingNo"
          :maxlength="21"
          plain="true"
          placeholder="请输入磅单号"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          icon="el-icon-search"
          href="javascript:void(0)"
          type="primary"
          class="btn-b"
          @click="submitSearch(1)"
        >查询</el-button>
        <el-button href="javascript:void(0)" class="btn-w" @click="clearSearchBox()">清空</el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-table :data="weiData" style="width:100%">
        <el-table-column prop="weighingNo" align="center" label="磅单号" width="180"></el-table-column>
        <el-table-column prop="truckNo" align="center" label="车号"></el-table-column>
        <el-table-column prop="weighingPlace" align="center" label="过磅地点"></el-table-column>
        <el-table-column prop="goodsName" align="center" label="货物名称"></el-table-column>
        <el-table-column prop="gross" align="center" label="毛重(KG)"></el-table-column>
        <el-table-column prop="tare" align="center" label="皮重(KG)"></el-table-column>
        <el-table-column prop="net" align="center" label="净重(KG)"></el-table-column>
        <el-table-column prop="createdBy" align="center" label="司磅员"></el-table-column>
        <el-table-column prop="createdOn" align="center" label="过磅时间" width="180"></el-table-column>
        <!--                <el-table-column prop="remarks" align="center" label="备注" width="120"></el-table-column>-->
        <!--                <el-table-column fixed="right" align="center" label="操作" width="100px">-->
        <!--                    <template v-slot="scope">-->
        <!--                        <el-button type="text" size="small" @click="delWeighing(scope.row.id)">删除</el-button>-->
        <!--                    </template>-->
        <!--                </el-table-column>-->
      </el-table>
    </div>
    <div style="height: 60px;">
      <pagination
        :total="total"
        :page.sync="page.pageNum"
        :limit.sync="page.pageSize"
        @pagination="getData"
      />
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import Pagination from "../../../components/Pagination/index";
// import { isEmpty } from '@/utils/index'
const { mapState, mapActions } = createNamespacedHelpers("weighingList");
export default {
  name: "WeighingList",
  components: { Pagination },
  data() {
    return {
      dialogVisible: false,
      addDialogVisible: false,
      title: "",
      page: {
        pageNum: 1,
        pageSize: 10
      },
      weiListForm: {
        goods_name: "",
        weighing_no: ""
      }
    };
  },
  computed: {
    ...mapState(["weiData", "total"])
  },
  watch: {
    selectNodeNO() {
      this.getData();
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    ...mapActions(["getAllWeiLists", "delectData"]),
    getData(pageNum) {
      if (pageNum === 1) {
        this.page.pageNum = pageNum;
      }
      this.getAllWeiLists({
        ...this.page,
        ...this.weiListForm
      });
    },
    delWeighing(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delectData(id).then(() => {
            this.getData();
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
    hidenDialog() {
      this.dialogVisible = false;
      this.addDialogVisible = false;
      this.getData();
    },
    submitSearch(pageNum) {
      this.getData(pageNum);
      // console.log(this.getData())
    },
    clearSearchBox() {
      this.weiListForm = {
        goods_name: "",
        weighing_no: ""
      };
    }
  }
};
</script>

<style scoped>
</style>
