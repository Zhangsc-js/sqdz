<template  >
  <!--<template style="height: 100%;" class="workshopClass">-->
  <el-container style="height: 100%;" class="workshopClass">
    <el-aside width="25%" style="height: 100%;">
      <el-divider content-position="left">车间班组</el-divider>
      <el-tree
        :data="treeData"
        :props="defaultProps"
        :default-expand-all="true"
        :expand-on-click-node="false"
        :highlight-current="true"
        @node-click="treeNodeClick"
        style="height: calc(100% - 50px);"
      ></el-tree>
    </el-aside>

    <el-main style="height: 100%;">
      <el-divider content-position="left">班组列表</el-divider>
      <el-table stripe :data="tableDataTeam" style="width: 100%;" height="40%">
        <el-table-column prop="teamCode" align="center" label="班组编码"></el-table-column>
        <el-table-column prop="teamName" align="center" label="班组名称"></el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="deleteTeam(scope.row.id)" type="text" size="small" v-has="'SYS-WSTEAM-DELETE'">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <el-col :span="12">
          <el-button
            type="primary "
            icon="el-icon-plus"
            @click="showDialogTeam"
            :disabled="mainInfo.objectType == null || mainInfo.objectType == '2' "
            v-has="'SYS-WSTEAM-SAVE'"
          >新增</el-button>
        </el-col>
      </el-row>

      <el-divider content-position="left">成员信息</el-divider>
      <edit-table
        :tableData="tableDataStaff"
        :opts.sync="tableColumnStaff"
        highlight-current-row
        :showAddBtn="false"
        @savaData="saveStaff"
        style="width: 100%;"
        height="40%"
        @deleteRow="removeStaffFromTeam"
        pageName="SYS-WSUSER"
      ></edit-table>
      <el-row>
        <el-col :span="12">
          <el-button
            type="primary "
            icon="el-icon-plus"
            @click="showDialogPerson"
            :disabled="mainInfo.objectCode == null"
            v-has="'SYS-WSUSER-ADD'"
          >新增</el-button>
        </el-col>
      </el-row>

      <el-divider content-position="left">工序信息</el-divider>
      <el-table
        stripe
        :data="tableDataProcess"
        style="width: 100%;"
        height="40%"
        @selection-change="selectionChangeProcess"
      >
        <el-table-column fixed type="selection" width="55px"></el-table-column>
        <el-table-column prop="processCode" align="center" label="工序编码"></el-table-column>
        <el-table-column prop="processName" align="center" label="工序名称"></el-table-column>
        <el-table-column prop="level" align="center" label="工序层级"></el-table-column>
      </el-table>
      <el-row>
        <el-col :span="12">
          <el-button
            type="primary "
            icon="el-icon-plus"
            @click="showDialogProcess"
            :disabled="mainInfo.objectCode == null"
            v-has="'SYS-WSPROC-SAVE'"
          >新增</el-button>
          <el-button
            type="primary "
            icon="el-icon-delete"
            @click="removeProcessFromTeam"
            :disabled="selectedProcess.length==0"
            v-has="'SYS-WSPROC-DELETE'"
          >删除</el-button>
        </el-col>
      </el-row>
    </el-main>

    <el-dialog title="班组选择" :visible.sync="dialogVisibleTeam" width="60%">
      <el-form ref="inquProcess" :model="inquTeam" label-width="100px">
        <el-row>
          <el-col :span="10">
            <el-form-item label="班组名称：" prop="teamName">
              <el-input v-model="inquTeam.teamName" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button type="primary " icon="el-icon-search" @click="queryDialogListTeam">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-table
        ref="dialogTableTeam"
        stripe
        :data="dialogDataTeam"
        style="width: 100%;"
        height="300px"
        @selection-change="selectionChangeDialogTeam"
      >
        <el-table-column fixed type="selection" width="55px"></el-table-column>
        <el-table-column prop="teamName" align="center" label="班组名称"></el-table-column>
        <el-table-column prop="teamCode" align="center" label="班组编码"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <Pagination
          :total="dialogTotalTeam.total"
          :page.sync="dialogTotalTeam.pageNum"
          :limit.sync="dialogTotalTeam.pageSize"
          @pagination="queryDialogListTeam"
        />
        <el-button type="primary " icon="el-icon-check" @click="confirmDialogTeam">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="员工信息" :visible.sync="dialogVisiblePerson" width="65%">
      <staff-info @save="confirmDialogPerson" :trigger="Math.random()" />
    </el-dialog>

    <el-dialog title="工序选择" :visible.sync="dialogVisibleProcess" width="40%">
      <el-form ref="inquProcess" :model="inquProcess" label-width="100px">
        <el-row>
          <el-col :span="10">
            <el-form-item label="工序编码：" prop="processCode">
              <el-input v-model="inquProcess.processCode" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="工序名称：" prop="processName">
              <el-input v-model="inquProcess.processName" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button
              type="primary "
              icon="el-icon-search"
              @click="queryDialogListProcess(true)"
            >查询</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-table
        ref="dialogTableProcess"
        stripe
        :data="dialogDataProcess"
        style="width: 100%;"
        height="300px"
        @selection-change="selectionChangeDialogProcess"
      >
        <el-table-column fixed type="selection" width="55px"></el-table-column>
        <el-table-column prop="processCode" align="center" label="工序编码"></el-table-column>
        <el-table-column prop="processName" align="center" label="工序名称"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <Pagination
          :total="dialogTotalProcess.total"
          :page.sync="dialogTotalProcess.pageNum"
          :limit.sync="dialogTotalProcess.pageSize"
          @pagination="queryDialogListProcess(false)"
        />
        <el-button type="primary " icon="el-icon-check" @click="confirmDialogProcess">确定</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import Pagination from "@/components/Pagination";
import {
  initData,
  getTree,
  queryTeamList,
  saveTeam,
  deleteTeam,
  deleteTeams,
  queryDialogListTeam,
  queryDialogListProcess,
  addTeamToWorkshop,
  addStaffToTeam,
  saveStaff,
  removeStaffFromTeam,
  addProcessToTeam,
  queryWorkshopPersonList,
  queryWorkshopProcessList,
  deleteProcess
} from "@/api/ppc/workshopTeam";
import EditTable from "@/components/EditTable";
import StaffInfo from "./staffInfo";
export default {
  components: {
    Pagination,
    EditTable,
    StaffInfo
  },
  mounted() {
    this.initData();
  },
  data() {
    return {
      mainInfo: {},
      WORKSHOP_ALL: [],
      IS_OR_NOT: [],
      treeData: [],
      defaultProps: {
        children: "children",
        label: "objectName"
      },
      tableDataTeam: [],
      tableDataStaff: [],
      tableColumnStaff: [
        {
          label: "员工工号",
          prop: "personCode"
        },
        {
          label: "员工名称",
          prop: "personName"
        },
        {
          type: "select",
          label: "是否组长",
          prop: "isLeader",
          options: []
        },
        {
          type: "select",
          label: "是否副组长",
          prop: "isDeputyLeader",
          options: []
        }
      ],
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      inquTeam: {
        teamName: ""
      },
      inquProcess: {
        processCode: "",
        processName: ""
      },
      tableDataProcess: [],
      dialogVisibleTeam: false,
      dialogVisiblePerson: false,
      dialogVisibleProcess: false,
      dialogDataTeam: [],
      dialogDataProcess: [],
      dialogTotalTeam: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      dialogTotalProcess: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      selectedTeam: [],
      selectedProcess: [],
      selectedDialogTeam: [],
      selectedDialogProcess: []
    };
  },
  methods: {
    initData() {
      initData()
        .then(response => {
          if (response.data.success) {
            this.WORKSHOP_ALL = response.data.data.WORKSHOP_ALL;
            let isOrNot = response.data.data.IS_OR_NOT;
            for (let i = 0; i < isOrNot.length; i++) {
              isOrNot[i].value = isOrNot[i].code;
            }
            this.IS_OR_NOT = isOrNot;
            this.getData();
            this.tableColumnStaff[2].options = this.IS_OR_NOT;
            this.tableColumnStaff[3].options = this.IS_OR_NOT;
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
    getData() {
      getTree()
        .then(response => {
          if (response.data.success) {
            this.treeData = response.data.data.resultTree;
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
    treeNodeClick(data) {
      this.mainInfo = data;
      this.queryTeamList(data.workshopCode);
      this.queryWorkshopPersonList();
      this.queryWorkshopProcessList();
    },
    queryTeamList(workshopCode) {
      queryTeamList(workshopCode)
        .then(response => {
          if (response.data.success) {
            this.tableDataTeam = response.data.data.teamList;
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
      saveTeam(data)
        .then(response => {
          if (response.data.success) {
            this.$message.success("保存成功");
            this.queryTeamList(this.mainInfo.workshopCode);
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
    deleteTeam(id) {
      this.$confirm("此操作将删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteTeam(id)
          .then(response => {
            if (response.data.success) {
              this.$message.success("删除成功");
              this.queryTeamList(this.mainInfo.workshopCode);
            } else {
              this.$message.error(
                response.data.message + ":" + response.data.data
              );
            }
          })
          .catch(e => {
            this.$message.error(e.message);
          });
      });
    },
    addStaffToTeam(data) {
      addStaffToTeam(data)
        .then(response => {
          if (response.data.success) {
            this.$message.success("保存成功");
            this.queryWorkshopPersonList();
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
    saveStaff(data) {
      saveStaff(data)
        .then(response => {
          if (response.data.success) {
            this.$message.success("保存成功");
            this.queryWorkshopPersonList();
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
    removeStaffFromTeam(id) {
      removeStaffFromTeam(id)
        .then(response => {
          if (response.data.success) {
            this.$message.success("删除成功");
            this.queryWorkshopPersonList();
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
    showDialogPerson() {
      this.dialogVisiblePerson = true;
    },
    removePersonFromTeam() {},
    showDialogTeam() {
      this.dialogVisibleTeam = true;
      this.queryDialogListTeam();
    },
    showDialogProcess() {
      this.dialogVisibleProcess = true;
      this.queryDialogListProcess();
    },
    removeTeamFromWorkshop() {
      if (this.selectedTeam.length == 0) {
        this.$message.error("至少选择一条删除");
        return;
      }
      this.$confirm("此操作将删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteTeams(this.selectedTeam.join(","))
          .then(response => {
            if (response.data.success) {
              this.$message.success("删除成功");
              this.queryTeamList(this.mainInfo.workshopCode);
            } else {
              this.$message.error(
                response.data.message + ":" + response.data.data
              );
            }
          })
          .catch(e => {
            this.$message.error(e.message);
          });
      });
    },
    removeProcessFromTeam() {
      if (this.selectedProcess.length == 0) {
        this.$message.error("至少选择一条删除");
        return;
      }
      this.$confirm("此操作将删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteProcess(this.selectedProcess.join(","))
          .then(response => {
            if (response.data.success) {
              this.$message.success("删除成功");
              this.queryWorkshopProcessList(this.mainInfo.objectCode);
            } else {
              this.$message.error(
                response.data.message + ":" + response.data.data
              );
            }
          })
          .catch(e => {
            this.$message.error(e.message);
          });
      });
    },
    selectionChangeStaff() {},
    queryWorkshopPersonList() {
      let param = {
        objectCode: this.mainInfo.objectCode,
        objectType: this.mainInfo.objectType
      };
      queryWorkshopPersonList(param)
        .then(response => {
          if (response.data.success) {
            let data = response.data.data.personList;
            for (var i = 0; i < data.length; i++) {
              for (let j = 0; j < this.IS_OR_NOT.length; j++) {
                if (this.IS_OR_NOT[j].code == data[i].isLeader) {
                  data.isLeaderName = this.IS_OR_NOT[j].label;
                  break;
                }
              }
              for (let j = 0; j < this.IS_OR_NOT.length; j++) {
                if (this.IS_OR_NOT[j].code == data[i].isDeputyLeader) {
                  data.isDeputyLeaderName = this.IS_OR_NOT[j].label;
                  break;
                }
              }
            }
            this.tableDataStaff = data;
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
    queryWorkshopProcessList() {
      let param = {
        objectCode: this.mainInfo.objectCode,
        objectType: this.mainInfo.objectType
      };
      queryWorkshopProcessList(param)
        .then(response => {
          if (response.data.success) {
            this.tableDataProcess = response.data.data;
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
    queryDialogListTeam() {
      let param = {
        ...this.inquTeam,
        ...this.dialogTotalTeam
      };
      queryDialogListTeam(param)
        .then(response => {
          if (response.data.success) {
            this.dialogDataTeam = response.data.data.list;
            this.dialogTotalTeam.total = response.data.data.total;
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
    queryDialogListProcess(flag) {
      // 重置当前页
      if (flag) {
        this.dialogTotalProcess.pageNum = 1;
      }
      let param = {
        ...this.inquProcess,
        ...this.dialogTotalProcess
      };
      queryDialogListProcess(param)
        .then(response => {
          if (response.data.success) {
            this.dialogDataProcess = response.data.data.list;
            this.dialogTotalProcess.total = response.data.data.total;
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
    selectionChangeProcess(data) {
      this.selectedProcess = [];
      for (let i = 0; i < data.length; i++) {
        this.selectedProcess.push(data[i].id);
      }
    },
    selectionChangeDialogTeam(data) {
      this.selectedDialogTeam = [];
      for (let i = 0; i < data.length; i++) {
        this.selectedDialogTeam.push(data[i].teamCode);
      }
    },
    selectionChangeDialogProcess(data) {
      this.selectedDialogProcess = [];
      for (let i = 0; i < data.length; i++) {
        this.selectedDialogProcess.push(data[i].processCode);
      }
    },
    confirmDialogTeam() {
      this.dialogVisibleTeam = false;
      if (this.selectedDialogTeam.length == 0) {
        return;
      }
      let params = {
        teamCodes: this.selectedDialogTeam.join(","),
        workshopCode: this.mainInfo.objectCode
      };
      this.$refs.dialogTableTeam.clearSelection();
      addTeamToWorkshop(params)
        .then(response => {
          if (response.data.success) {
            this.$message.success("新增成功");
            this.getData();
            this.queryTeamList(this.mainInfo.workshopCode);
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
    confirmDialogPerson(userCodes, userNames) {
      this.dialogVisiblePerson = false;
      let params = {
        userCodes: userCodes,
        userNames: userNames,
        objectCode: this.mainInfo.objectCode,
        objectType: this.mainInfo.objectType
      };
      addStaffToTeam(params)
        .then(response => {
          if (response.data.success) {
            this.$message.success("新增成功");
            this.queryWorkshopPersonList();
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
    confirmDialogProcess() {
      this.dialogVisibleProcess = false;
      if (this.selectedDialogProcess.length == 0) {
        //dialogVisibleProcess
        return;
      }
      let params = {
        processCodes: this.selectedDialogProcess.join(","),
        objectCode: this.mainInfo.objectCode,
        objectType: this.mainInfo.objectType
      };
      this.$refs.dialogTableProcess.clearSelection();
      addProcessToTeam(params)
        .then(response => {
          if (response.data.success) {
            this.$message.success("新增成功");
            this.queryWorkshopProcessList();
          } else {
            this.$message.error(
              response.data.message + ":" + response.data.data
            );
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    }
  }
};
</script>
<style scoped>
.app-main {
  overflow-y: hidden;
}
.app-main > div {
  height: 100%;
}
.workshopClass > .el-main {
  overflow-y: scroll;
}
</style>
