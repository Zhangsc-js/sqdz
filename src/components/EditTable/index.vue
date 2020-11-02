<template>
  <div :style="{'width': '100%','height':height}" class="editTable">
    <header>
      <slot name="header"></slot>
    </header>
    <div>
      <span v-if="title" class="edit-table-title">{{title}}</span>
      <el-button
        v-if="showAddBtn"
        class="edit-table-class btn-add"
        type="primary"
        @click="addRow"
        icon="el-icon-plus"
        v-has="pageName+'-SAVE'"
      >新增</el-button>
      <el-button
        v-if="showDelRows"
        class="edit-table-class btn-add"
        type="danger"
        @click="delRows"
        icon="el-icon-delete"
        v-has="pageName+'-DELETE'"
        :disabled="disabled"
      >删除</el-button>
      <el-button v-if="showBatchBtn" type="primary" @click="batchSave" icon="el-icon-check">保存</el-button>
      <slot name="query"></slot>
    </div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" style="height:100%">
      <el-table
        stripe
        border
        :data="data"
        style="width: 100%;"
        highlight-current-row
        @row-click="rowClick"
        :height="(showAddBtn && total>-1) || title ? 'calc(100% - 80px)' : 'calc(100% - 32px)'"
        @selection-change="selectionChange"
        @select="select"
        @select-all="select"
        ref="multipleTable"
      >
        <el-table-column v-if="showSelectBtn" :fixed="fixed" type="selection" width="55"></el-table-column>
        <template v-for="(column, index) in opts">
          <el-table-column
            :label="column.label"
            :width="column.width"
            :key="index"
            :prop="column.prop"
          >
            <template v-slot="scope">
              <el-form-item
                :prop="'data.' + scope.$index + '.'+column.prop"
                :rules="column.rule?rules.common:[]"
              >
                <span v-if="column.type === 'input'">
                  <el-input
                    :type="column.number?'number':''"
                    v-model="scope.row[column.prop]"
                    v-if="scope.row.seen&&(!column.NoEdit || scope.row.isEdit)"
                  ></el-input>
                  <span v-else>{{ scope.row[column.prop] }}</span>
                </span>
                <span v-else-if="column.type === 'date'">
                  <el-date-picker
                    v-model="scope.row[column.prop]"
                    v-if="scope.row.seen"
                    :type="column.dateType"
                    :format="column.format"
                    :value-format="column.format"
                    placeholder="选择日期时间"
                  ></el-date-picker>
                  <span v-else>{{ scope.row[column.prop] }}</span>
                </span>
                <span v-else-if="column.type === 'time'">
                  <el-time-picker
                    v-model="scope.row[column.prop]"
                    v-if="scope.row.seen"
                    :format="column.format"
                    :value-format="column.format"
                    placeholder="选择日期时间"
                  ></el-time-picker>
                  <span v-else>{{ scope.row[column.prop] }}</span>
                </span>
                <span v-else-if="column.type === 'select'">
                  <el-select
                    v-model="scope.row[column.prop]"
                    v-if="scope.row.seen"
                    filterable
                    placeholder="请选择"
                    :multiple="column.multiple"
                    :collapse-tags="column.multiple"
                    @change="change(column,scope.row[column.prop],scope.row)"
                  >
                    <el-option
                      v-for="item in column.options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                  <span v-else>{{ formatDataMap(column.options, scope.row[column.prop]) }}</span>
                </span>
                <span v-else-if="column.type === 'specialSelect'">
                  <el-select
                    v-model="scope.row[column.prop]"
                    v-if="scope.row.seen"
                    filterable
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in scope.row['options']"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                  <span v-else>{{ formatDataMap(scope.row.options, scope.row[column.prop]) }}</span>
                </span>
                <span v-else>
                  <span>{{ scope.row[column.prop] }}</span>
                </span>
              </el-form-item>
            </template>
          </el-table-column>
        </template>
        <el-table-column
          v-if="showOptBtn && hasBtn([pageName+'-UPDATE',pageName+'-DELETE',pageName+'-SAVE']) "
          align="center"
          label="操作"
          :width="optWidth"
        >
          <template v-slot="scope">
            <template v-if="!scope.row.visibleCancel">
              <slot name="customizeOpt" :scope="scope"></slot>
            </template>
            <el-button
              type="text"
              v-if="!scope.row.visibleCancel  && scope.row.visibleOptBtn && showUpdateBtn"
              size="small"
              @click.stop="edit(scope.row)"
              v-has="pageName+'-UPDATE'"
            >更新</el-button>
            <el-button
              type="text"
              v-if="scope.row.visibleCancel  && scope.row.visibleOptBtn"
              size="small"
              @click.stop="save(scope.row)"
            >保存</el-button>
            <el-button
              type="text"
              v-if="scope.row.visibleCancel  && scope.row.visibleOptBtn"
              size="small"
              @click.stop="cancel(scope.row)"
            >取消</el-button>
            <el-button
              type="text"
              v-if="scope.row.id && !scope.row.visibleCancel && scope.row.visibleOptBtn && showDelBtn"
              size="small"
              @click.stop="deleteRow(scope.row.id)"
              v-has="pageName+'-DELETE'"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <footer>
        <slot name="footer"></slot>
      </footer>
      <Pagination
        v-if="total > -1"
        :total="total"
        :page.sync="page.pageNum"
        :limit.sync="page.pageSize"
        :pageSizes="pageSizes"
        @pagination="pageChange"
      />
    </el-form>
  </div>
</template>

<script>
import { hasBtn } from "@/utils/index";
import Pagination from "@/components/Pagination";
import { isEmptyArray } from "@/utils";

export default {
  name: "EditTable",
  components: {
    Pagination
  },
  props: {
    tableData: {
      type: Array,
      required: true,
      default: () => []
    },
    opts: {
      type: Array,
      required: true,
      default: () => []
    },
    pageName: {
      required: false,
      type: String,
      default: ""
    },
    /**
     * 分页参数
     * {
     *  pageNum: 当前页数
     *  pageSize：分页大小
     * }
     */
    page: {
      type: Object
    },
    // 总条数
    total: {
      type: Number,
      default: -1
    },
    // 显示的可分也数组
    pageSizes: {
      type: Array
    },
    // 是否显示新增按钮
    showAddBtn: {
      type: Boolean,
      default: true
    },
    // 是否显示批量删除按钮
    showDelRows: {
      type: Boolean,
      default: false
    },
    // 组件高度
    height: {
      type: String,
      default: "100%"
    },
    // 操作栏宽度
    optWidth: {
      type: String,
      default: "120px"
    },
    // 首次加载时是否展示为可编辑状态
    firstLoadEdit: {
      type: Boolean,
      default: false
    },
    // 分页触发事件
    pageChangeAction: {
      type: Function,
      default: null
    },
    // 是否显示操作栏
    showOptBtn: {
      type: Boolean,
      default: true
    },
    // 是否显示多选按钮
    showSelectBtn: {
      type: Boolean,
      default: false
    },
    // 是否显示批量保存按钮
    showBatchBtn: {
      type: Boolean,
      default: false
    },
    // 复选框选择改变回调方法
    selectionChange: {
      type: Function,
      default: () => {}
    },
    // 标题
    title: {
      type: String,
      default: ""
    },
    // 是否显示删除按钮
    showDelBtn: {
      type: Boolean,
      default: true
    },
    fixed: {
      type: Boolean,
      default: true
    },
    // 是否显示更新按钮
    showUpdateBtn: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      data: [],
      rules: {
        common: [
          {
            required: true,
            message: "请输入正确信息",
            trigger: ["blur", "change"]
          }
        ]
      },
      disabled: true
    };
  },
  watch: {
    tableData() {
      this.formatData();
    },
    pageName(newVal) {
      // console.log(newVal);
    }
  },
  mounted() {
    this.formatData();
  },
  computed: {
    ruleForm() {
      return {
        data: this.data
      };
    }
  },
  methods: {
    hasBtn,
    getData() {
      this.$emit("getData");
    },
    formatData() {
      this.data = this.tableData.map(v => {
        this.$set(v, "visibleCancel", v.visibleCancel || this.firstLoadEdit);
        this.$set(v, "seen", v.seen || this.firstLoadEdit);
        if (!v.hasOwnProperty("visibleOptBtn")) {
          this.$set(v, "visibleOptBtn", true);
        }
        return v;
      });
    },
    edit(row) {
      this.$emit("setEdit", row);
      row.visibleCancel = true;
      row.seen = true;
      row.isEdit = false;
    },
    cancel(row) {
      row.visibleCancel = false;
      this.$refs["ruleForm"].resetFields();
      row.seen = false;
      this.$emit("getData");
    },
    formatDataMap(options, id) {
      // 判断id是否为数组
      if (id instanceof Array) {
        let arr = [];
        id.forEach(item => {
          options.forEach(e => {
            if (e.value == item) {
              arr.push(e.label);
            }
          });
        });
        return arr.join(",");
      } else {
        let r = options.find(e => {
          return e.value == id;
        });
        return r == null ? null : r.label;
      }
    },
    save(row) {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          let flag = false;
          // 深度拷贝
          const data = Object.assign({}, row);
          // 删除额外添加的属性
          delete data.seen;
          delete data.visibleCancel;
          const done = () => {
            flag = true;
          };
          this.$emit("savaData", data, done);
          if (flag) {
            row.visibleCancel = false;
            row.seen = false;
          }
        } else {
          this.$message.error("请输入或选择正确的信息");
        }
      });
    },
    addRow() {
      this.$emit("setAdd");
      const row = {
        seen: true,
        visibleCancel: true,
        visibleOptBtn: true,
        isEdit: true
      };
      this.data.unshift(row);
    },
    delRows() {
      this.$emit("delRows", this.$refs.multipleTable.store.states.selection);
    },
    deleteRow(id) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (this.total > -1) {
            if (+this.total % +this.page.pageSize == 1) {
              this.page.pageNum--;
            }
            this.$emit("deleteRow", id);
          } else {
            this.$emit("deleteRow", id);
          }
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    rowClick(data) {
      this.$emit("jc-row-click", data);
    },
    pageChange(val) {
      if (this.pageChangeAction) {
        this.pageChangeAction(val);
      } else {
        this.getData();
      }
    },
    batchSave() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          let changeData = [];
          let el = null;
          for (const e of this.data) {
            if (e.visibleCancel) {
              el = Object.assign({}, e);
              // 删除额外添加的属性
              delete el.seen;
              delete el.visibleCancel;
              changeData.push(el);
            }
          }
          if (!isEmptyArray(changeData)) {
            this.$emit("batchSave", changeData);
          }
        } else {
          this.$message.error("请输入或选择正确的信息");
        }
      });
    },
    select(val) {
      if (val.length > 0) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    },
    change(opt, val, row) {
      this.$emit("selectChange", opt, val, row);
    }
  }
};
</script>

<style>
.editTable .is-scrolling-none {
  height: 100%;
}
.editTable .el-form-item__content {
  line-height: 16px;
  margin-bottom: 8px;
}
/* .editTable .el-form-item {
  margin-bottom: 12px;
} */
</style>
<style  lang='scss' scoped>
div .edit-table-class {
  position: relative;
  top: 4px;
  left: 12px;
}
.el-table {
  position: relative;
  .el-table-column {
    position: absolute;
    right: 0;
  }
}
.btn-add {
  position: relative;
  top: 8px;
  left: 8px;
  vertical-align: middle;
}
.edit-table-title {
  display: inline-block;
  line-height: 32px;
  font-size: 1.17em;
  font-weight: bold;
  vertical-align: middle;
}
</style>


