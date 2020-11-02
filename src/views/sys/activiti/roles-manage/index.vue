<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="12">
        <div class="tableshadow margin20">
          <span>角色表</span>
          <el-button type="primary" @click="addGroup()">
            <i class="el-icon-plus"></i>新增
          </el-button>
          <el-table :data="group" ref="roleTable" :height="height">
            <el-table-column label="角色" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.editId" placeholder="请输入角色名" v-if="scope.row.edit"></el-input>
                <span v-else>{{ scope.row.id }}</span>
              </template>e_adda
            </el-table-column>
            <el-table-column prop="revision" label="版本" align="center"></el-table-column>
            <el-table-column fixed="right" label="操作" align="center" width="180">
              <template slot-scope="scope">
                <!-- <el-button
                  @click="preEdit(scope.row)"
                  type="text"
                  size="small"
                  v-if="!scope.row.edit"
                >修改</el-button>-->
                <span v-if="scope.row.edit">
                  <el-button @click="editGroup(scope.row)" type="text" size="small">保存</el-button>
                  <el-button @click="preEdit(scope.row, 'group')" type="text" size="small">取消</el-button>
                </span>
                <el-button v-else @click="delGroup(scope.row)" type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="height:32px;">
            <Pagination
              :total="total2"
              :page.sync="page2.pageNum"
              :limit.sync="page2.pageSize"
              @pagination="getData"
            />
          </div>
        </div>
      </el-col>

      <el-col :span="12">
        <div class="tableshadow margin20">
          <span>用户表</span>
          <el-button type="primary" @click="dialogVisible=true">
            <i class="el-icon-plus"></i>新增
          </el-button>
          <el-table :data="user" ref="userTable" :height="height">
            <el-table-column prop="firstName" label="名字" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.firstName" v-if="scope.row.edit"></el-input>
                <span v-else>{{ scope.row.firstName }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="lastName" label="工号" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.id" v-if="scope.row.edit"></el-input>
                <span v-else>{{ scope.row.id }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="revision" label="版本" align="center"></el-table-column>
            <el-table-column fixed="right" label="操作" align="center" width="180">
              <template slot-scope="scope">
                <!-- <el-button
                  @click="preEdit(scope.row)"
                  type="text"
                  size="small"
                  v-if="!scope.row.edit"
                  >修改</el-button
                >-->
                <span v-if="scope.row.edit">
                  <el-button @click="editUser(scope.row)" type="text" size="small">保存</el-button>
                  <el-button @click="preEdit(scope.row, 'user')" type="text" size="small">取消</el-button>
                </span>

                <el-button v-else @click="delUser(scope.row)" type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="height:32px;">
            <Pagination
              :total="total1"
              :page.sync="page1.pageNum"
              :limit.sync="page1.pageSize"
              @pagination="getData"
            />
          </div>
        </div>
      </el-col>
      <el-col :span="24">
        <div class="tableshadow margin20">
          <span>角色用户关联表</span>
          <el-button type="primary" @click="addMember">
            <i class="el-icon-plus"></i>新增
          </el-button>
          <el-table :data="membershipMap" ref="memberTable" :height="height">
            <el-table-column prop="USER_ID_" label="用户" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.edit">
                  <el-select
                    v-model="scope.row.editUserId"
                    filterable
                    reserve-keyword
                    placeholder="请输入用户工号"
                    :loading="loading"
                    loading-text="查询中..."
                    no-match-text="无数据"
                  >
                    <el-option
                      v-for="item in userOptions"
                      :key="item.id"
                      :label="item.firstName"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </span>
                <span v-else>{{ scope.row.FIRST_ }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="GROUP_ID_" label="角色" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.edit">
                  <el-select
                    v-model="scope.row.editGroupId"
                    filterable
                    reserve-keyword
                    placeholder="请输入角色名称"
                    :loading="loading"
                    loading-text="查询中..."
                    no-match-text="无数据"
                  >
                    <el-option
                      v-for="item in groupOptions"
                      :key="item.id"
                      :label="item.id"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </span>
                <span v-else>{{ scope.row.GROUP_ID_ }}</span>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.edit">
                  <el-button @click="editMember(scope.row)" type="text" size="small">保存</el-button>
                  <el-button
                    @click="preEdit(scope.row, 'membershipMap')"
                    type="text"
                    size="small"
                  >取消</el-button>
                </span>
                <el-button v-else @click="delMember(scope.row)" type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="height:32px;">
            <Pagination
              :total="total"
              :page.sync="page.pageNum"
              :limit.sync="page.pageSize"
              @pagination="getData"
            />
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog title="请查询并选择用户" :visible.sync="dialogVisible" v-if="dialogVisible" width="1000px">
      <el-form ref="queryForm" :inline="true" label-width="100px">
        <el-form-item label="用户名称" prop="proName">
          <el-input
            :maxlength="12"
            plain="true"
            v-model="queryForm.userName"
            placeholder="请输入用户名称"
          />
        </el-form-item>
        <el-form-item label="用户工号" prop="proName">
          <el-input
            :maxlength="12"
            plain="true"
            v-model="queryForm.workNumber"
            placeholder="请输入用户工号"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            icon="el-icon-search"
            href="javascript:void(0)"
            type="primary"
            class="btn-b"
            @click="getQuery"
          >查询</el-button>
          <el-button href="javascript:void(0)" type="primary" class="btn-b" @click="saveUser">确认</el-button>
        </el-form-item>
      </el-form>
      <el-table
        class="userTable"
        :data="mesUserData"
        highlight-current-row
        @current-change="handleUserChange"
      >
        <el-table-column prop="userName" align="center" label="用户名"></el-table-column>
        <el-table-column prop="userCode" align="center" label="工号"></el-table-column>
        <!-- <el-table-column prop="departmentName" label="部门"></el-table-column> -->
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import {
  getActRoles,
  addActRole,
  delActRole,
  addActUser,
  delActUser,
  addUserRole,
  delUserRole,
  getMesUser,
  getActUserAll,
  getActRolesAll
} from "@/api/sys/activiti";
import Pagination from "@/components/Pagination";
export default {
  name: "activiti",
  components: {
    Pagination
  },
  data() {
    return {
      page: {
        pageNum: 1,
        pageSize: 10
      },
      page1: {
        pageNum: 1,
        pageSize: 10
      },
      page2: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      total1: 0,
      total2: 0,
      membershipMap: [],
      user: [],
      group: [],
      typing: false,
      dialogVisible: false,
      queryForm: {
        userName: "",
        workNumber: ""
      },
      mesUserData: [],
      total3: 0,
      page3: {
        pageNum: 1,
        pageSize: 10
      },
      selAddUser: null,
      loading: false,
      loading1: false,
      userOptions: [],
      groupOptions: []
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      getActRoles(this.params).then(res => {
        this.membershipMap = res.data.membershipMap.map(v => {
          v.edit = false;
          this.$set(v, "edit", false);
          v.editUserId = v.USER_ID_;
          v.editGroupId = v.GROUP_ID_;
          return v;
        });
        this.user = res.data.user.map(v => {
          v.edit = false;
          this.$set(v, "edit", false);
          v.editId = v.id;
          v.editFirstName = v.firstName;
          return v;
        });
        this.group = res.data.group.map(v => {
          v.edit = false;
          this.$set(v, "edit", false);
          v.editId = v.id;
          return v;
        });
        this.total = res.data.membershipMapCount;
        this.total1 = res.data.userCount;
        this.total2 = res.data.groupCount;
      });
    },
    getQuery() {
      let params = { ...this.queryForm };
      if (!params.workNumber && !params.userName) {
        this.$message.error("请至少输入一个查询条件");
        return false;
      } else {
        getMesUser(params)
          .then(res => {
            this.mesUserData = res.data;
          })
          .catch(res => {
            this.$message.error(res.data.message);
          });
      }
    },
    addMember() {
      if (
        this.membershipMap.length > 0 &&
        !this.membershipMap[0].USER_ID_
      ) {
        this.$message.error("有未保存的信息，请保存");
        return false;
      }
      if (!this.userOptions.length && !this.groupOptions.length) {
        this.remoteUser();
        this.remoteGroup();
      }
      this.membershipMap.unshift({
        USER_ID_: null,
        GROUP_ID_: null,
        editUserId: null,
        editGroupId: null,
        edit: true
      });
      this.$refs.memberTable.bodyWrapper.scrollTop = 0;
    },
    editMember(item) {
      if (!(item.editUserId && item.editGroupId)) {
        this.$message.error("请选择用户及角色");
        return false;
      } else {
        let params = {
          groupId: item.editGroupId,
          userWork: item.editUserId
        };
        addUserRole(params)
          .then(res => {
            if (res.data.code != 10000) {
              this.$message.error(res.data.message);
            } else {
              this.$message.success(res.data.message);
              this.getData();
            }
          })
          .catch(res => {
            this.$message.error(res.data.message);
          });
      }
    },
    delMember(item) {
      this.$confirm("确认解除用户与角色的关联？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            userId: item.USER_ID_,
            groupId: item.GROUP_ID_
          };
          delUserRole(params)
            .then(res => {
              if (res.data.code != 10000) {
                this.$message.error(res.data.message);
              } else {
                this.$message(res.data.message);
                this.getData();
              }
            })
            .catch(res => {
              this.$message.error(res.data.message);
            });
        })
        .catch(res => {
          this.$message.info("已取消");
        });
    },
    handleUserChange(val) {
      this.selAddUser = val;
    },
    saveUser() {
      let selAddUser = this.selAddUser;
      if (!selAddUser) {
        this.$message.error("请选择用户");
        return false;
      } else {
        let params = {
          id: selAddUser.id,
          userName: selAddUser.userName,
          userWork: selAddUser.userCode
        };
        addActUser(params)
          .then(res => {
            if (res.data.code != 10000) {
              this.$message.error(res.data.message);
            } else {
              this.$message(res.data.message);
              this.getData();
              this.dialogVisible = false;
            }
          })
          .catch(res => {
            this.$message.error(res.data.message);
          });
      }
    },
    delUser(item) {
      this.$confirm("确认删除用户？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            id: item.id
          };
          delActUser(params)
            .then(res => {
              if (res.data.code != 10000) {
                this.$message.error(res.data.message);
              } else {
                this.$message(res.data.message);
                this.getData();
              }
            })
            .catch(res => {
              this.$message.error(res.data.message);
            });
        })
        .catch(res => {
          this.$message.info("已取消");
        });
    },
    editUser(item) {
      if (!item.e_id) {
        this.$message.error("请填写角色名");
        return false;
      } else {
        addActUser({ username: item.editFirstName, id: item.editId })
          .then(res => {
            if (res.data.code != 10000) {
              this.$message.error(res.data.message);
            } else {
              this.$message.success(res.data.message);
              this.getData();
            }
          })
          .catch(res => {
            this.$message.error(res.data.message);
          });
      }
    },
    addGroup() {
      if (
        this.group.length > 0 &&
        !this.group[0].revisionNext
      ) {
        this.$message.error("有未保存的信息，请保存");
        return false;
      }
      this.group.unshift({ id: null, e_id: null, revision: 1, edit: true });
      this.$refs.roleTable.bodyWrapper.scrollTop = 0;
    },
    delGroup(item) {
      this.$confirm("确认删除该角色以及该角色下的所有用户？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            groupId: item.id
          };
          delActRole(params)
            .then(res => {
              if (res.data.code != 10000) {
                this.$message.error(res.data.message);
              } else {
                this.$message.success(res.data.message);
                this.getData();
              }
            })
            .catch(res => {
              this.$message.error(res.data.message);
            });
        })
        .catch(res => {
          this.$message.info("已取消");
        });
    },
    editGroup(item) {
      if (!item.editId) {
        this.$message.error("请填写角色名");
        return false;
      } else {
        addActRole({ groupName: item.editId }).then(res => {
          if (res.data.code != 10000) {
            this.$message.error(res.data.message);
          } else {
            this.$message.success(res.data.message);
            this.getData();
          }
        });
      }
    },
    preEdit(item, type) {
      item.edit = this.$set(item, "edit", !item.edit);
      console.log(this[type])
      if (!item.revisionNext) {
        let index = this[type].indexOf(item);
        this[type].splice(index, 1);
      }
    },
    remoteUser(query) {
      let params = { userWork: query==undefined?" ":query };
      if (query !== "") {
        this.loading = true;
        getActUserAll(params).then(res => {
          this.loading = false;
          this.userOptions = res.data;
        });
      } else {
        this.userOptions = [];
      }
    },
    remoteGroup(query) {
      let params = { id: query==undefined?" ":query};
      if (query !== "") {
        this.loading = true;
        getActRolesAll(params).then(res => {
          this.loading = false;
          this.groupOptions = res.data;
        });
      } else {
        this.groupOptions = [];
      }
    }
  },
  computed: {
    params() {
      let data = {
        userPageNumber: this.page1.pageNum,
        userPageSize: this.page1.pageSize,
        groupPageNumber: this.page2.pageNum,
        groupPageSize: this.page2.pageSize,
        membershipPageNumber: this.page.pageNum,
        membershipSize: this.page.pageSize
      };
      return data;
    },
    height(){
        let height = document.body.clientHeight / 2 - 230;

        return height
      }
  }
};
</script>

<style lang="scss" scoped>
.tableshadow {
  padding: 20px 10px;
  min-height: 20vh;
  > .el-button {
    margin-left: 20px;
  }
}
.userTable {
  max-height: calc(100vh - 350px);
  overflow-y: auto;
}
</style>
