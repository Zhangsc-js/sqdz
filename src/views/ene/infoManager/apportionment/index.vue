<template>
  <el-tabs
    class="table apportionment"
    v-model="activeName"
    @tab-click="handleClick"
    type="border-card"
    style="height:100%;overflow:hidden"
  >
    <el-tab-pane style="height:0%" label="电" name="elect"></el-tab-pane>
    <el-tab-pane style="height:0%" label="水" name="water"></el-tab-pane>
    <el-tab-pane style="height:0%" label="气" name="gas"></el-tab-pane>
    <el-container style="width: 100%;height:calc(100% - 39px);">
      <el-aside width="20%" style="height:100%;margin-left:-3px;overflow:auto;" class="tableshadow">
        <el-tree
          :data="treeData"
          node-key="id"
          accordion
          highlight-current
          default-expand-all
          :expand-on-click-node="false"
          @node-click="handleNodeClick"
          style="height: 100%;"
        >
          <!-- <template v-slot="{data}">
            <span
              class="el-icon-folder"
              style="font-size:14px"
              :class="{'textColor':data.isReal == 0}"
            >{{data.label}}</span>
          </template>-->
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <i
              class="el-icon-stopwatch"
              v-if="data.isElect==1"
              :class="{red:data.isReal!=1}"
              style="font-size:14px"
            ></i>
            <i
              class="el-icon-timer"
              v-else-if="data.isWater==1"
              :class="{red:data.isReal!=1}"
              style="font-size:14px"
            ></i>
            <i
              class="el-icon-odometer"
              v-else-if="data.isGas==1"
              :class="{red:data.isReal!=1}"
              style="font-size:14px"
            ></i>
            <i class="el-icon-folder" v-else style="font-size:14px"></i>
            <span style="font-size:14px">{{ node.label }}</span>
            <!-- <span>
              <el-button type="text" size="mini" @click="() => append(data)">Append</el-button>
              <el-button type="text" size="mini" @click="() => remove(node, data)">Delete</el-button>
            </span>-->
          </span>
        </el-tree>
      </el-aside>
      <div v-show="!isEne" class="tableshadow" style="width:100%">
        <div>
          <el-button
            v-show="!flag"
            style="margin:10px 0 0 10px"
            type="primary"
            @click="eneAppAdd()"
            icon="el-icon-plus"
            :disabled="isAble"
          >新增</el-button>
        </div>
        <el-table :data="tableData" style="width: 100%;height:82%">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="procName" align="center" label="设备名称"></el-table-column>
          <el-table-column prop="proRataShare" :formatter="formatter" align="center" label="分摊比(%)"></el-table-column>
          <el-table-column
            prop="canUseOn"
            sortable
            align="center"
            label="生效时间"
            :formatter="toMonth"
          ></el-table-column>
          <!--          <el-table-column prop="isUse" align="center" label="启用状态">-->
          <!--            <template v-slot="scope">-->
          <!--              <span v-if="scope.row.isUse === 0" style="color: orangered">未启用</span>-->
          <!--              <span v-if="scope.row.isUse === 1" style="color:deepskyblue">已启用</span>-->
          <!--            </template>-->
          <!--          </el-table-column>-->
          <el-table-column prop="createdOn" align="center" label="创建时间"></el-table-column>
          <el-table-column align="center" label="操作" width="180px">
            <template v-slot="scope">
              <el-button
                type="text"
                size="small"
                @click="updateEneApp(scope.row)"
                :disabled="checkUpdateAble(scope.row.canUseOn)"
              >更新</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="position:fixed;bottom:1px;right: 0;">
          <pagination
            :total="this.total"
            :page.sync="page.pageNum"
            :limit.sync="page.pageSize"
            @pagination="getData"
          />
        </div>
        <el-dialog :title="title" :visible.sync="dialogVisible" width="65%">
          <eneUpdate
            @hidenDialog="hidenDialog"
            :equipId="equipId"
            :energyType="energyType"
            :flagTime="new Date().getTime()"
          />
        </el-dialog>
        <el-dialog :title="title" :visible.sync="addDialogVisible" width="65%">
          <eneAppAdd
            @hidenDialog="hidenDialog"
            :selectNo="selectNo"
            :selectProcName="selectProcName"
            :energyType="energyType"
          />
        </el-dialog>
      </div>
    </el-container>
  </el-tabs>
</template>

<script>
import { getEneDevTree, getEneAppList } from "@/api/energy";
import Pagination from "@/components/Pagination";
import eneUpdate from "./update";
import eneAppAdd from "./eneAppAdd";
import { simpleDateFormat } from "@/utils/index";

export default {
  name: "apportionment",
  data() {
    return {
      treeData: [],
      defaultExpanded: [],
      equipId: "",
      dialogVisible: false,
      addDialogVisible: false,
      disabled: false,
      title: "",
      selectNo: "",
      selectProcName: "",
      devData: {},
      nowData: "",
      testData: "2019-09-01",
      flag: false,
      activeName: "elect",
      isElect: 1,
      isWater: "",
      isGas: "",
      isMeter: 0,
      isAble: true,
      tableData: [],
      params: {
        proccode: ""
      },
      page: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      energyType: "elect",
      isEne: false
    };
  },
  mounted() {
    this.getEneDevTree();
  },
  methods: {
    toMonth(row, column, cellValue) {
      return simpleDateFormat(new Date(cellValue), "yyyy-MM");
    },
    getEneDevTree() {
      this.isAble = true;
      const params = {
        isElect: this.isElect,
        isWater: this.isWater,
        isGas: this.isGas
        // isMeter: this.isMeter
      };
      getEneDevTree(params)
        .then(res => {
          this.treeData = res.data.data;
          this.defaultExpanded = [];
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    //点击树，code做参数，调用该方法
    handleNodeClick(data) {
      if (data.isWater || data.isElect || data.isGas) {
        this.isEne = true;
      } else {
        this.isEne = false;
      }
      console.log(data);
      this.isAble = false;
      this.proImgList = [];
      this.selectProcName = data.label;
      this.selectNo = data.code;
      this.getData();
    },
    //查询该树的某一设备信息
    getData() {
      this.params.proccode = this.selectNo;
      const params = {
        ...this.page,
        ...this.params,
        energyType: this.energyType
      };
      getEneAppList(params)
        .then(res => {
          if (res.data.success) {
            this.tableData = res.data.data.rows;
            this.total = res.data.data.total;
            if (this.tableData.length > 0) {
              this.flag = true;
            } else {
              this.flag = false;
            }
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    //检查更新按钮是否可选
    checkUpdateAble(canUseOn) {
      this.nowData = simpleDateFormat(new Date(), "yyyy-MM");
      return simpleDateFormat(new Date(canUseOn), "yyyy-MM") !== this.nowData;
    },
    //更新
    updateEneApp(row) {
      this.equipId = row.id;
      this.title = "编辑页面";
      this.disabled = true;
      this.dialogVisible = true;
    },
    //添加
    eneAppAdd() {
      this.title = "配比添加页面";
      this.disabled = true;
      this.addDialogVisible = true;
    },
    //函数回调
    hidenDialog() {
      this.dialogVisible = false;
      this.addDialogVisible = false;
      this.getData();
    },

    //tab页切换
    handleClick(tab) {
      let name = tab.name;
      if (name == "elect") {
        this.isElect = 1;
        this.isWater = "";
        this.isGas = "";
        this.energyType = "elect";
      } else if (name == "water") {
        this.isElect = "";
        this.isWater = 1;
        this.isGas = "";
        this.energyType = "water";
      } else if (name == "gas") {
        this.isElect = "";
        this.isWater = "";
        this.isGas = 1;
        this.energyType = "gas";
      }
      this.tableData = [];
      this.getEneDevTree();
    },
    formatter(row) {
      return (row.proRataShare * 100).toFixed(2) + "%";
    }
  },
  components: {
    Pagination,
    eneUpdate,
    eneAppAdd
  }
};
</script>

<style scoped>
.red {
  color: red;
}
.el-col {
  margin-bottom: 20px;
}

.grid-content {
  padding: 0 12px;
  border-radius: 4px;
  min-height: 36px;
  line-height: 36px;
}

.span {
  display: inline-block;
  width: 120px;
}

.span {
  display: inline-block;
  width: 120px;
}
.el-aside {
  border-right: 5px solid #fff;
}
.tableshadow {
  border-left: 2px solid #e4e7ed;
}
.pagination {
  position: absolute;
  bottom: 10px;
}
.el-aside {
  border-right: 5px solid #fff;
  overflow: scroll;
}

.tableshadow {
  border-left: 2px solid #e4e7ed;
}
</style>
<style>
.table.apportionment .el-tabs__content {
  height: 100%;
  padding: 0 !important;
}

/* .table.apportionment div[data-v-9ba1728a] {
  height: 100%;
} */

.table.apportionment .el-tabs__header.is-top {
  background-color: #f5f7fa;
  border-bottom: 1px solid #e4e7ed;
  margin: 0;
}
.textColor {
  color: orangered;
}
.apportionment #pane-elect {
  height: 0;
}
</style>
