<template>
  <div style="height: 100%;" >
    <el-table :data="tableData" stripe style="width: 100%" >
     
      <el-table-column prop="materialCode" label="物料编码" width="100"></el-table-column>
      <el-table-column prop="materialName" label="物料名称" width="100"></el-table-column>
      <el-table-column prop="batch" label="批次" width="100"></el-table-column>
      <el-table-column prop="oldOnhandQty" label="原始库存" width="100"></el-table-column>
      <el-table-column prop="newOnhandQty" label="实时库存" width="100"></el-table-column>
      <el-table-column prop="qty" label="库存变化数量" width="100"></el-table-column>
       <el-table-column prop="ftyCode"  label="工厂" width="100">
            <template v-slot="scope">
          <span style="width: 100;">{{ formatFactory(scope.row) }}</span>
        </template>
        </el-table-column>
      <el-table-column prop="whCode"  label="仓库" width="100">
            <template v-slot="scope">
          <span style="width: 100;">{{ formatWh(scope.row) }}</span>
        </template>
        </el-table-column>
        <el-table-column prop="areaCode"  label="存储区" width="100">
            <template v-slot="scope">
          <span style="width: 100;">{{ formatArea(scope.row) }}</span>
        </template>
        </el-table-column>
      <el-table-column prop="binCode" label="仓位" width="100"></el-table-column>
      
      <el-table-column prop="optionType" label="操作类型" width="100">
          <template v-slot="scope">
          <span style="width: 100;">{{ formatOptionType(scope.row) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancel" icon="el-icon-close">关闭</el-button>
    </div> -->
    <Pagination
      :total="total"
      :page.sync="page.pageNum"
      :limit.sync="page.pageSize"
      :pageSizes="pageSizes"
      @pagination="getData"
    />
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import {
  findWmsStockHistoryByBatch,
  findFactory,
  findWhAll,
  findAreaAll
} from "@/api/sys/wms/warehouse";
export default {
  data() {
    return {
      tableData: [],
      page: {
        pageSize: 5,
        pageNum: 1
      },
      pageSizes: [5, 10, 15,20],
      total: 0,
      whList: [],
      areaList: [],
      ftyArr: []
    };
  },
  props: {
    id: {
      type: String,
      required: true
    },
    trigger: {
      type: Boolean,
      required: true
    }
  },
  components: {
    Pagination
  },
  methods: {
    getData() {
      findFactory().then(response => {
        if (response.data.success) {
          this.ftyArr = response.data.data.list;
        } else {
          this.$message.error(response.data.message + ":" + response.data.data);
        }
      });
      findWhAll().then(response => {
        if (response.data.success) {
          this.whList = response.data.data.list;
        } else {
          this.$message.error(response.data.message + ":" + response.data.data);
        }
      });
      findAreaAll().then(response => {
        if (response.data.success) {
          this.areaList = response.data.data.list;
        } else {
          this.$message.error(response.data.message + ":" + response.data.data);
        }
      });
      const params = {
        ...this.page,
      };
      params.batch=this.id;
      findWmsStockHistoryByBatch(params)
      .then(response => {
          if(response.data.success){
              this.tableData=response.data.data.list;
              this.total=response.data.data.total;
          } else {
          this.$message.error(response.data.message + ":" + response.data.data);
        }
      });
    },
    cancel(){
        this.$emit("cancel");
    }
  },
  watch: {
    id() {
       this.getData();
    }
  },
  mounted(){
      this.getData();
  },
  computed:{
      formatArea() {
      return function(row) {
        for (let index = 0; index < this.areaList.length; index++) {
          const element = this.areaList[index];
          if (
            row.whCode == element.whCode &&
            row.areaCode == element.areaCode
          ) {
            return element.areaName;
          }
        }
      };
    },
    formatWh() {
      return function(row) {
        for (let index = 0; index < this.whList.length; index++) {
          const element = this.whList[index];
          if (element.warehouseCode == row.whCode) {
            return element.warehouseName;
          }
        }
      };
    },
    formatFactory() {
      return function(row) {
        for (let index = 0; index < this.ftyArr.length; index++) {
          const element = this.ftyArr[index];
          if (element.depart_code == row.ftyCode) {
            return element.depart_name;
          }
        }
      };
    },
    formatOptionType(){
        return function(row){
            if(row.optionType=="1"){
                return "入库";
            }else if(row.optionType=="2"){
                return "出库";
            }
        }
    }
  }
};
</script>
<style scoped>
</style>