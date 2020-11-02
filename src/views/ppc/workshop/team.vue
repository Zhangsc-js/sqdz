<template>
  <el-container style="height: 100%;">
    <el-aside width="50%">
      <!--style="height: 100%;"-->
      <el-form ref="inqu" :model="inqu" label-width="100px" inline>
        <el-divider content-position="left">班组信息</el-divider>
        <el-row>
          <el-form-item label="班组名称" prop="teamName">
            <el-input v-model="inqu.teamName" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary " icon="el-icon-search" @click="getData(1)">查询</el-button>
            <el-button type="primary " icon="el-icon-refresh-left" @click="reset">重置</el-button>
          </el-form-item>
        </el-row>
      </el-form>
      <edit-table
        :tableData="tableData"
        :opts.sync="tableColumnMain"
        @jc-row-click="getPersonByTeamId"
        :page="page"
        @getData="getData"
        :total="total"
        :showAddBtn="showAddBtn"
        @savaData="saveTeam"
        style="width: 100%;"
        height="600px"
        @deleteRow="deleteTeam"
        pageName="SYS-TEAM"
      ></edit-table>
    </el-aside>
    <el-main style="border: 1px solid #eee;">
      <el-divider content-position="left">成员信息</el-divider>
      <edit-table
        :tableData="tablePersonData"
        :opts.sync="tableColumnMain1"
        :showAddBtn="false"
        :page="page1"
        @getData="getStaffList"
        :total="total1"
        @savaData="savePerson"
        style="width: 100%;"
        height="600px"
        @deleteRow="deletePerson"
        :selectionChange="handleSelectionChange"
        :showSelectBtn="true"
        pageName="SYS-TMUSER"
      >
        <template slot="footer">
          <el-row>
            <el-col :span="12">
              <el-button
                type="primary "
                icon="el-icon-plus"
                @click="staffInfo"
                :disabled="teamCode==''"
                v-has="'SYS-TMUSER-ADD'"
              >新增</el-button>
              <el-button
                :disabled="batchBtnVisibles"
                type="danger "
                @click="batchDelPerson"
                v-has="'SYS-TMUSER-BATDLT'"
              >批量删除</el-button>
            </el-col>
          </el-row>
        </template>
      </edit-table>
    </el-main>
    <el-dialog title="员工信息" :visible.sync="dialogFormVisible" width="65%">
      <staff-info @save="success" @flu="fresh()" />
    </el-dialog>
    <el-dialog :title="title" :visible.sync="dialogVisible" width="65%">
      <component :is="dialogForm" @hidenDialog="hidenDialog" :disabled="disabled1" :personId="id"></component>
    </el-dialog>
  </el-container>
</template>


<script>
import Pagination from "@/components/Pagination";
import { isEmptyArray } from "@/utils/index";
import {
  getTeamData,
  saveTeam,
  deleteTeam,
  batchDelPerson,
  queryPersonByTeamId,
  savePerson,
  deletePerson,
  addStaffToPerson
} from "@/api/productionPlanning";
import EditTable from "@/components/EditTable";
import StaffInfo from "./staffInfo";
import PersonUD from "./personUD";
import { resetQueryForm } from "@/utils/common";

export default {
  components: {
    Pagination,
    EditTable,
    StaffInfo,
    PersonUD
  },
  mounted() {
    this.getData();
  },
  data() {
    return {
      dialogFormVisible: false,
      inqu: {},
      tableColumnMain: [
        {
          type: "input",
          label: "班组名称",
          prop: "teamName"
        },
        {
          type: "input",
          label: "班组编码",
          prop: "teamCode"
        },
        {
          type: "select",
          label: "班组类型",
          prop: "teamType",
          options: [
            {
              label: "生产班组",
              value: 1
            },
            {
              label: "化验班组",
              value: 2
            },
            {
              label: "巡检班组",
              value: 3
            },
            {
              label: "维修班组",
              value: 4
            },
            {
              label: "仓库班组",
              value: 5
            }
          ]
        }
      ],
      showAddBtn: true,
      page: {
        pageNum: 1,
        pageSize: 10
      },
      page1: {
        pageNum: 1,
        pageSize: 10
      },
      tableData: [],
      tablePersonData: [],
      total: 0,
      total1: 0,
      selectMainInfo: {},
      tableDataPart: [],
      sels: [],
      batchBtnVisibles: true,
      teamCode: "",
      disabled: false,
      id: null,
      dialogVisible: false,
      dialogForm: null,
      disabled1: null,
      title: "",
      tableColumnMain1: [
        {
          label: "工号",
          prop: "personCode"
        },
        {
          label: "姓名",
          prop: "personName"
        },
        {
          type: "select",
          label: "组长",
          prop: "isLeader",
          options: [
            {
              label: "是",
              value: 1
            },
            {
              label: "否",
              value: 0
            }
          ]
        },
        {
          type: "select",
          label: "副组长",
          prop: "isDeputyLeader",
          options: [
            {
              label: "是",
              value: 1
            },
            {
              label: "否",
              value: 0
            }
          ]
        }
      ],
      selectIds: []
    };
  },
  methods: {
    getData(pageNum) {
      if (pageNum === 1) {
        this.page.pageNum = pageNum;
      }
      let params = {
        ...this.page,
        ...this.inqu
      };
      getTeamData(params)
        .then(response => {
          this.tableData = response.data.data.list;
          this.total = response.data.data.size;
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    getPersonByTeamId(data) {
      (this.teamCode = data.teamCode),
        (this.teamCode = data.teamCode),
        this.getStaffList();
    },
    getStaffList() {
      let params = {
        ...this.page1,
        teamCode: this.teamCode
      };
      queryPersonByTeamId(params)
        .then(response => {
          if (response.data.success) {
            this.tablePersonData = response.data.data.rows;
            this.total1 = response.data.data.total;
            //console.log(response);
          } else {
            this.$message.error(
              response.data.message + ":" + response.data.data
            );
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    saveTeam(data) {
      if (!data.teamName || !data.teamCode) {
        this.$message.error("请输入班组名称和班组编码！");
        return;
      }
      saveTeam(data)
        .then(response => {
          if (response.data.success) {
            this.$message.success("保存成功");
            this.getData();
          } else {
            this.$message.error(
              response.data.message
            );
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    savePerson(data) {
      if (data.personName == undefined || data.personCode == undefined) {
        this.$message.error("请输入工号和姓名！");
        this.fresh();
        return;
      }
      savePerson(data)
        .then(response => {
          if (response.data.success) {
            this.$message.success("保存成功");
            this.fresh();
          } else {
            this.$message.error(
              response.data.message + ":" + response.data.data
            );
            this.fresh();
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    deleteTeam(data) {
      let params = {
        id: data
      };
      deleteTeam(params)
        .then(response => {
          if (response.data.success) {
            this.$message.success("删除成功");
            this.getData();
          } else {
            this.$message.error(
              response.data.message + ":" + response.data.data
            );
          }
          //console.log(data)
        })
        .catch(e => {
          this.$message.error(e.message);
        });
      this.fresh();
    },
    deletePerson(data) {
      let params = {
        id: data
      };
      deletePerson(params)
        .then(response => {
          if (response.data.success) {
            this.$message.success("删除成功");
            this.fresh();
          } else {
            this.$message.error(
              response.data.message + ":" + response.data.data
            );
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
      //this.fresh()
    },
    batchDelPerson() {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (isEmptyArray(this.selectIds)) {
            this.$message.error("请选择要删除的数据");
            return;
          }
          batchDelPerson(this.selectIds)
            .then(response => {
              const result = response.data;
              if (result.success) {
                this.$message.success("删除成功");
              } else {
                this.$message.error(result.message);
              }
              this.getStaffList();
            })
            .catch(e => {
              this.$message.error(e.message);
            });
        })
        .catch(e => {
          this.$message.info("已取消删除");
        });
    },
    staffInfo() {
      this.dialogFormVisible = true;
    },
    success(staffIds, staffNames) {
      let params = {
        staffIds: staffIds,
        staffNames: staffNames,
        objectCode: this.teamCode
        //processId:this.mainInfo.id
      };
      //this.$refs.dialogTable.clearSelection();
      addStaffToPerson(params)
        .then(response => {
          if (response.data.success) {
            this.$message.success("新增成功");
            this.dialogFormVisible = false;
            this.fresh();
          } else {
            this.$message.error(
              response.data.message + ":" + response.data.data
            );
          }
          this.$emit("flu");
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    fresh() {
      this.getStaffList();
    },
    hidenDialog() {
      this.dialogVisible = false;
      this.getStaffList();
    },
    handleSelectionChange(data) {
      this.selectIds = [];
      for (let e of data) {
        this.selectIds.push(e.id);
      }

      if (!isEmptyArray(this.selectIds)) {
        this.batchBtnVisibles = false;
      } else {
        this.batchBtnVisibles = true;
      }
    },
    reset() {
      resetQueryForm(this, "inqu");
    }
  }
};
</script>

