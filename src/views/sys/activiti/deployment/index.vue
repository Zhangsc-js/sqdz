<template>
  <div>
    <div class="tableshadow margin20">
      <h3>部署对象表</h3>
      <el-table :data="deployment">
        <el-table-column prop="name" label="流程名称"></el-table-column>
        <el-table-column prop="deploymentTime" label="时间"></el-table-column>
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
    <div class="tableshadow margin20">
      <h3>流程定义表</h3>
      <el-table :data="processDefinition">
        <el-table-column prop="name" label="流程名称"></el-table-column>
        <el-table-column prop="resourceName" label="规则文件"></el-table-column>
        <el-table-column
          prop="diagramResourceName"
          label="规则图片"
        ></el-table-column>
        <el-table-column prop="version" label="版本"></el-table-column>
        <el-table-column prop="key" label="KEY"></el-table-column>
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
  </div>
</template>

<script>
import { getDeployment } from "@/api/sys/activiti";
import Pagination from "@/components/Pagination";

const imgUrl = process.env.VUE_APP_DEV_IMAGE_URL;
export default {
  name: "deployment",
  components: {
    Pagination
  },
  data() {
    return {
      imgUrl: imgUrl,
      page: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      deployment: [],
      page1: {
        pageNum: 1,
        pageSize: 10
      },
      total1: 0,
      processDefinition: []
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      let params = {
        deploymentPageNumber: this.page.pageNum,
        deploymentPageSize: this.page.pageSize,
        processDefinitionPageNumber: this.page1.pageNum,
        processDefinitionPageSize: this.page1.pageSize
      };
      getDeployment(params).then(res => {
        this.deployment = res.data.Deployment;
        this.processDefinition = res.data.ProcessDefinition;
        this.total = res.data.DeploymentCount;
        this.total1 = res.data.ProcessDefinitionCount;
      });
    }
  }
};
</script>

<style scoped>
.tableshadow {
  padding: 15px;
}
</style>
