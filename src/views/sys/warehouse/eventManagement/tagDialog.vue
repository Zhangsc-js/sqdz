<template>
  <div class="tag" style="height:100%">
    <el-card class="left">
      <el-divider content-position="left">已选</el-divider>
      <!-- 查询表单 -->
      <el-form inline :model="queryForm_left">
        <el-form-item label="tag点定位">
          <el-input v-model="queryForm_left.tagCode"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">查询</el-button>
        </el-form-item>
      </el-form>
      <!-- 表格 -->
      <el-table
        height="55vh"
        :data="tableData_left"
        border
        stripe
        style="width: 100%"
        ref="leftTable"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="triggerCode" label="触发源编码"></el-table-column>
        <el-table-column prop="tagCode" label="tag点定位"></el-table-column>
        <el-table-column prop="tagDesc" label="tag点位描述"></el-table-column>
        <el-table-column prop="triggerType" label="触发条件">
          <template v-slot="{row}">
            <span>{{triggerType(row.triggerType)}}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <div class="center">
      <div class="tag_left">
        <svg-icon
          icon-class="tag_right"
          class="icon_svg icon_tag"
          style="display:block"
          @click.native="rightCilck"
        />
        <svg-icon
          icon-class="tag_left"
          class="icon_svg icon_tag"
          style="display:block"
          @click.native="leftCilck"
        />
      </div>
    </div>
    <el-card class="right">
      <el-divider content-position="left">所有</el-divider>
      <!-- 查询表单 -->
      <el-form inline :model="queryForm_right">
        <el-form-item label="tag点定位">
          <el-input v-model="queryForm_right.tagCode"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">查询</el-button>
        </el-form-item>
      </el-form>
      <!-- 表格 -->
      <el-table
        height="55vh"
        :data="tableData_right"
        border
        stripe
        style="width: 100%"
        ref="rightTable"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="triggerCode" label="触发源编码"></el-table-column>
        <el-table-column prop="tagCode" label="tag点定位"></el-table-column>
        <el-table-column prop="tagDesc" label="tag点位描述"></el-table-column>
        <el-table-column prop="triggerType" label="触发条件">
          <template v-slot="{row}">
            <span>{{triggerType(row.triggerType)}}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import {
  findTriggerToTag,
  addEventMainTagTrigger,
  dltEventMainTagTrigger
} from "@/api/sys";

export default {
  props: {
    mainId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      queryForm_left: {
        tagCode: ""
      },
      tableData_left: [],
      queryForm_right: {
        tagCode: ""
      },
      tableData_right: []
    };
  },
  watch: {
    mainId() {
      this.getData();
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      findTriggerToTag(this.mainId).then(response => {
        let data = response.data;
        if (data.success) {
          this.tableData_left = data.data.leftList;
          this.tableData_right = data.data.rightTable;
          let arr = this.tableData_left.map(item => item.triggerCode);
          let right = [];
          this.tableData_right.forEach(item => {
            if (arr.indexOf(item.triggerCode) == "-1") {
              right.push(item);
            }
          });
          this.tableData_right = right;
        }
      });
    },
    //   左箭头
    leftCilck() {
      let rightSel = this.$refs.rightTable.selection; //右侧勾选的
      addEventMainTagTrigger(this.mainId, rightSel).then(response => {
        let data = response.data;
        if (data.success) {
          this.getData();
        } else {
          this.$message.success(data.message + ":" + data.data);
        }
      });
    },
    // 右箭头
    rightCilck() {
      let leftSel = this.$refs.leftTable.selection; //左侧勾选的
      dltEventMainTagTrigger(this.mainId, leftSel).then(response => {
        let data = response.data;
        if (data.success) {
          this.getData();
        } else {
          this.$message.success(data.message + ":" + data.data);
        }
      });
    }
  },
  computed: {
    triggerType() {
      return function(type) {
        if (type === "1") {
          return "高限";
        } else if (type === "2") {
          return "低限";
        } else if (type === "3") {
          return "超限";
        } else if (type === "4") {
          return "偏差";
        } else if (type === "5") {
          return "打开";
        } else if (type === "6") {
          return "关闭";
        } else {
          return "变位";
        }
      };
    }
  }
};
</script>

<style scoped lang='scss'>
.tag {
  display: flex;

  .left {
    width: 47%;
    height: 100%;
  }

  .center {
    height: 100%;
    width: 6%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .right {
    width: 47%;
    height: 100%;
  }

  .icon_tag {
    font-size: 45px;
    margin: 5px 0;
    cursor: pointer;
  }
}
</style>
