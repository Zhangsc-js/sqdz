<template>
    <div style="height: 100%;">
        <el-form :inline="true" :model="queryForm" class="demo-form-inline" ref="queryForm">
            <el-form-item label="图片名称">
                <el-input v-model="queryForm.picName" placeholder="请输入图片名称"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="getData(1)">查询</el-button>
            </el-form-item>
        </el-form>

        <edit-table
            :tableData="tableData"
            :opts.sync="tableColumn"
            highlight-current-row
            :page="page"
            :total="total"
            :showAddBtn="showAddBtn"
            @getData="getData"
            @savaData="savePic"
            style="width: 100%;"
            height="calc(100% - 54px - 50px)"
            @deleteRow="delPic"
            pageName="PPC-PIC"
        ></edit-table>
    </div>
</template>

<script>
  import EditTable from "@/components/EditTable";
  import { hasBtn } from "@/utils/index";
  import { getToken } from "@/utils/auth";
  import Pagination from "@/components/Pagination";
  import { queryPics, delPic,savePic } from "@/api/ppc/ppcPic";

  export default {
    name: "ppcPic",
    components: {

      Pagination,
      EditTable
    },
    data() {
      return {
        page: {
          pageNum: 1,
          pageSize: 10
        },
        total: 0,
        title: "",
        token: {
          Authorization: `Bearer ${getToken()}`
        },
        queryForm: {
          picName: "",
        },
        tableColumn:[
          {
            type:'input',
            label: "图片名称",
            prop: "picName"
          },
          {
            type:'input',
            label: "像素说明",
            prop: "pixel"
          },
          {
            type:'input',
            label: "图片网络地址",
            prop: "picUrl"
          },
        ],
        tableData: [],
        showAddBtn:true

      };
    },
    methods: {
      hasBtn,
      getData(current) {
        if (current === 1) {
          this.page.pageNum = current;
        }
        const params = {
          ...this.page,
          ...this.queryForm
        };
        queryPics(params)
          .then(response => {
            let data = response.data.data;
            this.tableData = data.result;
            this.total = data.total;
          })
          .catch(e => {
            this.$message({
              type: "error",
              message: e.message,
              duration: 3 * 1000
            });
          });
      },
      delPic(id) {
        delPic({id:id}).then(response => {
          if (response.data.success) {
            this.getData(1);
            this.$message.success("删除成功!");
          } else
            this.$message.error(
              response.data.message + ":" + response.data.data
            );
        });
      },
      savePic(data) {
        savePic(data)
          .then(response => {
            if (response.data.success) {
              this.$message.success("保存成功");
              this.getData();
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
    },
    mounted() {
      this.getData();
    }
  };
</script>

<style scoped>
</style>
