<template>
  <div>
    <div class="margin20">
      <el-button type="primary" @click="addNode()">
        <i class="el-icon-plus"></i>新增节点
      </el-button>
    </div>
    <div class="tableshadow margin20">
      <el-table :data="nodeList" ref="nodeTable">
        <el-table-column label="节点名称" align="center">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.editParams.name"
              placeholder="请输入节点名称"
              v-if="scope.row.edit"
            ></el-input>
            <span v-else>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="节点类型" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.edit">
              <el-select v-model="scope.row.editParams.type" placeholder="请选择节点类型">
                <el-option
                  v-for="item in typeList"
                  :key="item.name"
                  :label="item.label"
                  :value="item.name"
                ></el-option>
              </el-select>
            </span>
            <span v-else>{{ scope.row.type }}</span>
          </template>e_adda
        </el-table-column>
        <el-table-column label="上流节点" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.edit">
              <el-select v-model="scope.row.editParams.from" placeholder="请选择上流节点类型">
                <el-option value="all" label="任意"></el-option>
                <el-option
                  v-for="item in typeList"
                  :key="item.name"
                  :label="item.label"
                  :value="item.name"
                ></el-option>
              </el-select>
            </span>
            <span v-else>{{ scope.row.from }}</span>
          </template>e_adda
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" width="180">
          <template slot-scope="scope">
            <el-button
              @click="preEdit(scope.$index,scope.row)"
              type="text"
              size="small"
              v-if="!scope.row.edit"
            >修改</el-button>
            <span v-if="scope.row.edit">
              <el-button @click="editRow(scope.$index,scope.row)" type="text" size="small">保存</el-button>
              <el-button @click="cancel(scope.$index,scope.row)" type="text" size="small">取消</el-button>
            </span>
            <el-button v-else @click="delNode(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div>
        <Pagination
          :total="total"
          :page.sync="page.pageNum"
          :limit.sync="page.pageSize"
          @pagination="getData"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";

export default {
  name: "nodes-config",
  components: { Pagination },
  data() {
    return {
      nodeList: [
        {id: "123456678",name: "开始",type: "start",from: "根节点"},
        {id: "123456778",name: "过程1",type: "process",from: "任意"},
        {id: "123456788",name: "过程2",type: "process",from: "过程节点"},
        {id: "123456788",name: "审核1",type: "audit",from: "过程节点"},
        {id: "123456788",name: "审核2",type: "audit",from: "过程节点"},
        {id: "123456708",name: "结束",type: "end",from: "任意"}
      ],
      typeList: [
        { label: "开始节点", name: "start" },
        { label: "完成节点", name: "end" },
        { label: "过程节点", name: "process" },
        { label: "审批节点", name: "audit" }
      ],
      total: 0,
      page: {
        pageNum: 1,
        pageSize: 10
      }
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      let data = this.nodeList;
      let nodeList = data.map(v => {
        console.log(v)
        v.editParams = v;
        v.edit = false;
        this.$set(v, "edit", false);
        console.log(v)
        return v;
      });
      this.nodeList = nodeList;
    },
    preEdit(i, item) {
      item.edit = true;
      this.$set(this.nodeList, i, item);
    },
    cancel(i, item) {
      item.edit = false;
      this.$set(this.nodeList, i, item);
      if (!item.id) {
        this.nodeList.splice(i, 1);
      }
    },
    addNode() {
      this.nodeList.unshift({
        id: null,
        name: null,
        type: null,
        from: null,
        editParams: {
          name: null,
          type: null,
          from: null
        },
        edit: true
      });
    },
    editRow(i, item) {},
    delNode(item){

    }
  }
};
</script>
<style scoped>
</style>
