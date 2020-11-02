<template>
  <div class="runStateTable">
    <el-table :data="tableData" border stripe style="width: 100%">
      <el-table-column prop="devName" label="设备名称"></el-table-column>
      <el-table-column prop="onOff" label="运行状态" align="center">
        <template v-slot="{row}">
          <jt-badge v-show="row.onOff=='1'" status="processing" textValue />
          <jt-badge v-show="row.onOff=='0'" status="error" textValue />
        </template>
      </el-table-column>
      <el-table-column prop="continuedTime" label="持续时间" align="center"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import JtBadge from "@/components/JtBadge";
export default {
  components: {
    JtBadge
  },
  props: {
    tableData: {
      type: Array,
      required: true,
      default: () => []
    }
  }
};
</script>

<style>
</style>
