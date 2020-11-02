<template>
  <div>
    <el-form :inline="true" :model="queryForm" class="demo-form-inline" ref="queryForm">
      <el-form-item label="单号" prop="taskNo">
        <el-input clearable v-model="taskNo" @blur="showTask"></el-input>
      </el-form-item>
      <el-form-item label="计划日期" prop="planStart">
        <el-date-picker
          type="date"
          v-model="queryForm.planStart"
          value-format="yyyy-MM-dd"
          clearable
        />
        <span>~</span>
      </el-form-item>
      <el-form-item prop="planEnd">
        <el-date-picker
          type="date"
          v-model="queryForm.planEnd"
          value-format="yyyy-MM-dd"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getDataSource()">查询</el-button>
        <el-button type="primary" icon="el-icon-reflesf-left" @click="resetQuery()">重置</el-button>
      </el-form-item>
      <el-form-item style="right: 10px;position:fixed">
        <el-radio-group size="medium" v-model="selectValue" @change="setLevel">
          <el-radio-button label="日"></el-radio-button>
          <el-radio-button label="月"></el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div id="gantt_here" style="height: calc(100% - 52px);"></div>

    <el-dialog title="选择物料" :visible.sync="MaterialDialogVisible" width="65%" z-index="10002">
      <sltMaterial @save="materialDialog" @cancel="hidenDialogCancel" />
    </el-dialog>

    <el-dialog
      title="修改工单"
      :visible.sync="dialogVisible"
      width="55%"
      style="height: 80%;margin-top: 50px"
    >
      <uptwork-order
        @save="categoryDialog"
        @cancel="hidenDialogCancel"
        :wo-no="woNo"
        :trigger="Math.random()"
      />
    </el-dialog>

    <el-dialog
      title="新增计划"
      :visible.sync="planDialogVisible"
      width="55%"
      style="height:80%;margin-top:50px"
    >
      <insert-produce-plan @save="categoryDialog" @cancel="hidenDialogCancel" />
    </el-dialog>
    <el-dialog
      title="更新计划"
      :visible.sync="planDialogVisibleUpdate"
      width="55%"
      style="height:80%;margin-top:50px"
    >
      <uptProducePlan
        @save="categoryDialog"
        @cancel="hidenDialogCancel"
        :ppId="ppId"
        :trigger="Math.random()"
      />
    </el-dialog>
  </div>
</template>

<script>
// import "dhtmlx-gantt/codebase/ext/dhtmlxgantt_quick_info";
// import "dhtmlx-gantt/codebase/ext/dhtmlxgantt_tooltip";
// import "dhtmlx-gantt/codebase/ext/dhtmlxgantt_auto_scheduling";
// import "dhtmlx-gantt/codebase/ext/dhtmlxgantt_marker";
// import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
// // import 'dhtmlx-gantt/codebase/skins/dhtmlxgantt_material.css'
// import "dhtmlx-gantt/codebase/locale/locale_cn";
import {
  planGantt,
  SavePlanGantt,
  dltPlanGantt,
  uptPlanGantt,
  dltProducePlan,
  issuePp
} from "@/api/productionPlanning";
import {
  deleteWo,
  issueWo,
  initData,
  splitWo
} from "@/api/ppc/workshopDispatch";
import sltMaterial from "../plannedProduction/ppc-bom/materialInfo";
import UptworkOrder from "./uptWorkOrder";
import uptProducePlan from "./uptProducePlan";
import InsertProducePlan from "./insertProducePlan";
import { resetQueryForm } from "@/utils/common";

let myGantt = Gantt.getGanttInstance();
export default {
  components: {
    sltMaterial,
    InsertProducePlan,
    UptworkOrder,
    uptProducePlan
  },
  data() {
    return {
      taskNo: "",
      selectValue: "月",
      queryForm: {
        planStart: "",
        planEnd: ""
      },
      opts: [],
      woNo: "",
      ppId: "",
      MaterialDialogVisible: false,
      planDialogVisible: false,
      planDialogVisibleUpdate: false,
      dialogVisible: false,
      materialName: "",
      materialCode: "",
      highlightTasks: [],
      highlightSearch: {},
      taskIds: [],
      treeData: [],
      WO_STATUS: [],
      PP_STATUS: []
    };
  },
  activated() {
    this.queryForm.planStart = this.GetDateStr(-15);
    this.queryForm.planEnd = this.GetDateStr(15);
    this.getData();
  },
  deactivated() {
    //解决页面切换title残留问题
    myGantt.clearAll();
  },
  mounted() {
    this.queryForm.planStart = this.GetDateStr(-15);
    this.queryForm.planEnd = this.GetDateStr(15);
    this.initData();
    this.initGantt();
    this.getData();
  },
  methods: {
    initData() {
      initData()
        .then(response => {
          if (response.data.success) {
            this.WO_STATUS = response.data.data.WO_STATUS;
            this.PP_STATUS = response.data.data.PP_STATUS;
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
    showTask() {
      if (this.taskNo) {
        for (let i = 0; i < this.treeData.data.length; i++) {
          let _taskNo = this.treeData.data[i].text;
          if (_taskNo.indexOf(this.taskNo) != -1) {
            let task = myGantt.getTaskBy("text", _taskNo);
            myGantt.showTask(task[0].id);
            this.$message.success("已成功定位:" + _taskNo);
            //需要判定工序层是否展开，如果close，则open
            this.parentOpen(task[0]);
            this.reset(task[0].id);
            myGantt.render();
            return;
          }
        }
        this.$message.warning("未找到该任务");
      }
    },
    parentOpen(task) {
      if (task.parent != "0") {
        let parent = myGantt.getTask(task.parent);
        myGantt.open(parent.id);
        this.parentOpen(parent);
      } else {
        myGantt.open(task.parent);
      }
    },
    setLevel(type) {
      if (type == "日") {
        myGantt.config.duration_unit = "hour";
        myGantt.config.duration_step = 1;
        myGantt.getGridColumns()[3].name = "prodHour";
        myGantt.getGridColumns()[3].label = "排程(时)";
        myGantt.ext.zoom.setLevel("day");
        myGantt.render();
      } else {
        myGantt.config.duration_unit = "day";
        myGantt.config.duration_step = 1;
        myGantt.getGridColumns()[3].name = "prodDay";
        myGantt.getGridColumns()[3].label = "排程(天)";
        myGantt.ext.zoom.setLevel("month");
        myGantt.render();
      }
    },
    getData() {
      this.getDataSource();
    },
    materialDialog(data) {
      this.materialName = data.materialName;
      this.materialCode = data.materialCode;
      this.MaterialDialogVisible = false;
      myGantt.getLightboxSection("material").setValue(this.materialName);
    },
    categoryDialog(data) {
      this.taskNo = data;
      this.planDialogVisible = false;
      this.planDialogVisibleUpdate = false;
      this.dialogVisible = false;
      this.getDataSource();
    },
    hidenDialogCancel() {
      this.planDialogVisible = false;
      this.planDialogVisibleUpdate = false;
      this.dialogVisible = false;
    },
    setMarker() {
      let dateToStr = myGantt.date.date_to_str("%Y-%m-%d");
      let today = new Date();
      myGantt.addMarker({
        start_date: today,
        css: "today",
        text: "时刻线",
        title: "时刻线: " + dateToStr(today)
      });
    },
    getDataSource() {
      // 获取数据源
      planGantt(this.queryForm).then(response => {
        const data = response.data;
        if (data.success) {
          myGantt.hideQuickInfo();
          myGantt.clearAll();
          this.setMarker();
          myGantt.parse(data.data);
          myGantt.config.start_date = new Date(this.queryForm.planStart);
          myGantt.config.end_date = new Date(this.queryForm.planEnd);
          myGantt.render();
          this.treeData = data.data;
          this.showTask();
        } else {
          this.$message.error(data.message + ":" + data.data);
        }
      });
    },
    initGantt() {
      //11111111111111111111myGantt属性配置
      myGantt.config.auto_types = false;
      myGantt.config.drag_progress = false; //进度条不可操作
      myGantt.config.drag_links = false; //禁用连线
      //左侧title内容
      myGantt.config.columns = [
        {
          name: "no",
          label:
            "计划/任务单号<b class='plus' onclick='Gantt.CreatePlan()'>+</b>",
          width: "140",
          tree: true,
          resize: true
        },
        { name: "workShopName", label: "车间", align: "center", resize: true },
        {
          name: "materialCode",
          label: "物料",
          align: "center",
          width: "140",
          resize: true
        },
        { name: "prod", label: "排程", align: "center", width: "60" }
      ];
      //日期显示格式(日/月)
      let zoomConfig = {
        levels: [
          {
            name: "day",
            scale_height: 50,
            min_column_width: 40,
            scales: [
              { unit: "day", format: "%F %d" },
              { unit: "hour", step: 3, format: "%H:%i" }
            ]
          },
          {
            name: "month",
            scale_height: 50,
            min_column_width: 120,
            scales: [
              { unit: "month", format: "%F, %Y" },
              { unit: "day", format: "%M/%d" }
            ]
          }
        ]
      };
      myGantt.ext.zoom.init(zoomConfig);
      //渲染数据的日期格式
      myGantt.config.date_format = "%Y-%m-%d %H:%i:%s";
      myGantt.init(
        "gantt_here",
        new Date(this.queryForm.planStart),
        new Date(this.queryForm.planEnd)
      );
      document.getElementById("gantt_here").style.position = "static";
      this.setLevel("月");

      myGantt.config.quickinfo_buttons = [
        "update",
        "delete",
        "release",
        "split"
      ];
      myGantt.config.open_tree_initially = true; //自动展开tree
      //按钮名称
      myGantt.locale.labels["update"] = "修改";
      myGantt.locale.labels["delete"] = "删除";
      myGantt.locale.labels["release"] = "下达";
      myGantt.locale.labels["split"] = "拆分";
      //22222222222222222222222myGantt按钮事件
      myGantt.attachEvent("onTaskClick", id => {
        let task = myGantt.getTask(id);
        myGantt.showQuickInfo(id, true);
        if (task.taskType == "1") {
          document.getElementsByClassName(
            "gantt_qi_big_icon split"
          )[0].style.display = "none";
        } else {
          document.getElementsByClassName(
            "gantt_qi_big_icon split"
          )[0].style.display = "block";
        }
        setTimeout(() => {
          this.reset(id);
        }, 0); //由于rander()方法会阻止双击事件，异步执行可避免这个问题
        return true;
      });
      Gantt.CreatePlan = () => {
        this.planDialogVisible = true;
      };
      myGantt.$click.buttons.update = id => {
        let task = myGantt.getTask(id);
        if (task.taskType == "1") {
          this.ppId = task.id;
          this.planDialogVisibleUpdate = true;
        } else {
          this.woNo = task.no;
          this.dialogVisible = true;
        }
      };
      myGantt.$click.buttons.delete = id => {
        let task = myGantt.getTask(id);
        if (task.taskType == "1") {
          if (task.status >= "30") {
            this.$message.warning("当前状态不可删除计划！！");
            return;
          }
          this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              dltProducePlan(id).then(response => {
                let data = response.data;
                if (data.success) {
                  this.$message.success("删除成功！！");
                  this.getData();
                } else {
                  this.$message.error(data.message + ":" + data.data);
                }
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消删除"
              });
            });
        } else if (task.taskType == "2") {
          if (task.status >= "30") {
            this.$message.warning("当前状态不可删除工单！！");
            return;
          }
          this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              deleteWo(id).then(response => {
                let data = response.data;
                if (data.success) {
                  this.$message.success("删除成功！！");
                  this.getData();
                } else {
                  this.$message.error(data.message + ":" + data.data);
                }
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消删除"
              });
            });
        }
      };
      myGantt.$click.buttons.release = id => {
        let task = myGantt.getTask(id);
        if (task.taskType == "1") {
          if (task.status >= "20") {
            this.$message.warning("当前状态不可下达计划！！");
            return;
          }
          issuePp(id).then(response => {
            let data = response.data;
            if (data.success) {
              this.$message.success("下达成功");
              this.getData();
            } else {
              this.$message.error(data.message + ":" + data.data);
            }
          });
        } else if (task.taskType == "2") {
          if (task.status >= "20") {
            this.$message.warning("当前状态不可下达工单！！");
            return;
          }
          issueWo(id).then(response => {
            let data = response.data;
            if (data.success) {
              this.$message.success("下达成功");
              this.getData();
            } else {
              this.$message.error(data.message + ":" + data.data);
            }
          });
        }
        this.taskNo = task.text;
      };
      myGantt.$click.buttons.split = id => {
        let task = myGantt.getTask(id);
        if (task.taskType == "2") {
          if (task.status >= "30") {
            this.$message.warning("当前状态不可拆分工单");
            return;
          }
          this.taskNo = task.text;
          splitWo(id).then(response => {
            let data = response.data;
            if (data.success) {
              this.$message.success("下达成功");
              this.getData();
            } else {
              this.$message.error(data.message + ":" + data.data);
            }
          });
        }
      };

      //点击‘+’时触发
      myGantt.attachEvent("onTaskCreated", task => {
        this.planDialogVisible = true;
      });

      //双击任务时触发
      myGantt.attachEvent("onTaskDblClick", (id, e) => {
        let task = myGantt.getTask(id);
        if (task.taskType == "1") {
          this.ppId = task.id;
          this.planDialogVisibleUpdate = true;
        } else {
          this.woNo = task.no;
          this.dialogVisible = true;
        }
      });
      //增，删，改方法
      myGantt.createDataProcessor({
        task: {
          create: data => {},
          update: (data, id) => {},
          delete: id => {
            console.log(id);
          }
        },
        link: {
          create: function(data) {},
          update: function(data, id) {},
          delete: function(id) {}
        }
      });
      //33333333333333333333myGantt触发事件
      //移动时分秒
      let dragging_task_id = 0; //拖动的taskid
      let dragging_task = {}; //用于时刻记录拖动的taks信息
      myGantt.attachEvent("onAfterTaskDrag", (id, mode, e) => {
        //上下左右拖动完成事件
        var modes = myGantt.config.drag_mode;
        let task = myGantt.getTask(id);
        if (mode == modes.move) {
          if (dragging_task_id && id == dragging_task_id) {
            task.start_date = dragging_task.start_date;
            task.end_date = dragging_task.end_date;
            myGantt.refreshTask(id);
            //如果开始时间、结束时，则不触发更新，触发情况是选中任务时，刚触发拖动后松开鼠标，造成肉眼难见的更新
            if (
              new Date(task.oldstime).getTime() == task.start_date.getTime() &&
              new Date(task.oldetime).getTime() == task.end_date.getTime()
            ) {
              return false;
            } else {
              this.updateGantt(task);
            }
          }
          dragging_task_id = 0;
        } else if (mode == modes.resize) {
          task.start_date = dragging_task.start_date;
          task.end_date = dragging_task.end_date;
          myGantt.refreshTask(id);
          this.updateGantt(task);
          dragging_task_id = 0;
        }
      });
      myGantt.addTaskLayer({
        //左右拖动时事件
        renderer: () => {
          let task = myGantt.getTask(dragging_task_id);
          dragging_task.start_date = task.start_date;
          dragging_task.end_date = task.end_date;
        },
        filter: function(task) {
          return dragging_task_id == myGantt.getState().drag_id;
        }
      });
      myGantt.attachEvent("onBeforeTaskDrag", (id, mode, e) => {
        //拖动前事件
        let task = myGantt.getTask(id);
        if (task.taskType == "1") {
          //计划
          if (task.status >= "30") {
            //这里的计划更改不受已派工影响
            this.$message.warning(
              "状态为:【" + task.statusName + "】，不可更改"
            );
            return false;
          }
        } else {
          if (task.status >= "30") {
            //派工
            this.$message.warning(
              "状态为:【" + task.statusName + "】，不可更改"
            );
            return false;
          }
        }
        if (
          task.start_date.getTime() <
            new Date(this.queryForm.planStart).getTime() ||
          task.end_date.getTime() > new Date(this.queryForm.planEnd).getTime()
        ) {
          this.$message.warning("时间范围已超出，不可拖动");
          return false;
        } else {
          let modes = myGantt.config.drag_mode;
          if (mode == modes.move || mode == modes.resize) {
            //move/resize/progress
            dragging_task_id = id;
            myGantt.refreshTask(id);
          }
          return true;
        }
      });
      myGantt.attachEvent("onEmptyClick", () => {
        this.reset();
      });
      //4444444444444444myGantt方法重写
      myGantt.templates.tooltip_text = (start, end, task) => {
        if (task.taskType == "1") {
          for (let i = 0; i < this.PP_STATUS.length; i++) {
            if (this.PP_STATUS[i].code == task.status) {
              task.statusName = this.PP_STATUS[i].label;
            }
          }
          return (
            "<b>单号:</b> " +
            task.no +
            "<br/><b>开始时间:</b> " +
            myGantt.templates.tooltip_date_format_s(start) +
            "<br/><b>截止时间:</b> " +
            myGantt.templates.tooltip_date_format_s(end) +
            "<br/><b>完成进度:</b> " +
            task.progress * 100 +
            "%" +
            "<br/><b>工单状态:</b> " +
            task.statusName
          );
        } else {
          for (let i = 0; i < this.WO_STATUS.length; i++) {
            if (this.WO_STATUS[i].code == task.status) {
              task.statusName = this.WO_STATUS[i].label;
            }
          }
          return (
            "<b>单号:</b> " +
            task.no +
            "<br/><b>开始时间:</b> " +
            myGantt.templates.tooltip_date_format(start) +
            "<br/><b>截止时间:</b> " +
            myGantt.templates.tooltip_date_format(end) +
            "<br/><b>加工工序:</b> " +
            task.processNo +
            "-" +
            task.processName +
            "<br/><b>完成进度:</b> " +
            task.progress * 100 +
            "%" +
            "<br/><b>工单状态:</b> " +
            task.statusName
          );
        }
      };
      myGantt.templates.tooltip_date_format = function(date) {
        let formatFunc = myGantt.date.date_to_str("%Y-%m-%d %H:%i");
        return formatFunc(date);
      };
      myGantt.templates.tooltip_date_format_s = function(date) {
        let formatFunc = myGantt.date.date_to_str("%Y-%m-%d");
        return formatFunc(date);
      };
      myGantt.templates.quick_info_content = function(start, end, task) {
        return task.materialCode;
      };
      myGantt.templates.quick_info_title = (start, end, task) => {
        if (task.taskType == "1") {
          for (let i = 0; i < this.PP_STATUS.length; i++) {
            if (this.PP_STATUS[i].code == task.status) {
              task.statusName = this.PP_STATUS[i].label;
            }
          }
        } else {
          for (let i = 0; i < this.WO_STATUS.length; i++) {
            if (this.WO_STATUS[i].code == task.status) {
              task.statusName = this.WO_STATUS[i].label;
            }
          }
        }
        return (
          task.no + "：<b>" + task.progress * 100 + "%</b>  " + task.statusName
        );
      };
      myGantt.templates.quick_info_date = function(start, end, task) {
        if (task.taskType == "1") {
          return (
            myGantt.date.date_to_str("%Y-%m-%d")(task.start_date) +
            " ~ " +
            myGantt.date.date_to_str("%Y-%m-%d")(task.end_date)
          );
        } else {
          return (
            myGantt.date.date_to_str("%Y-%m-%d %H:%i")(task.start_date) +
            " ~ " +
            myGantt.date.date_to_str("%Y-%m-%d %H:%i")(task.end_date)
          );
        }
      };
      myGantt.templates.task_class = (start, end, task) => {
        if (
          this.taskIds.indexOf(task.parent) != -1 ||
          this.taskIds.indexOf(task.id) != -1
        ) {
          this.taskIds.push(task.id);
          return "task_groups alignLeft";
        }
        return "alignLeft";
      };
      myGantt.templates.task_text = function(start, end, task) {
        return task.index + "#---" + task.text;
      };
      myGantt.templates.scale_cell_class = function(date) {
        if (date.getDay() == 0 || date.getDay() == 6) {
          return "weekend";
        }
      };
      myGantt.templates.timeline_cell_class = function(item, date) {
        if (date.getDay() == 0 || date.getDay() == 6) {
          return "weekend";
        }
      };
    },
    updateGantt(data) {
      data.start_date = myGantt.date.date_to_str("%Y-%m-%d %H:%i")(
        data.start_date
      );
      data.end_date = myGantt.date.date_to_str("%Y-%m-%d %H:%i")(data.end_date);
      //如果开始时间、结束时间，则不触发更新，触发情况是选中任务时，刚触发拖动后松开鼠标，造成肉眼难见的更新
      if (data.oldstime == data.start_date && data.oldetime == data.end_date) {
        return false;
      }
      this.taskNo = data.text;
      uptPlanGantt(data).then(response => {
        let data = response.data;
        if (data.success) {
          this.$message.success("更新成功");
        } else {
          this.$message.error(data.message + ":" + data.data);
        }
        this.getData();
      });
    },
    createGantt(data) {
      data.materialCode = this.materialCode;
      SavePlanGantt(data).then(response => {
        let data = response.data;
        if (data.success) {
          this.getDataSource();
        } else {
          this.$message.error(data.message + ":" + data.data);
        }
      });
    },
    deleteGantt(id) {
      dltPlanGantt(id).then(response => {
        let data = response.data;
        if (data.success) {
          this.$message.success("删除成功");
        } else {
          this.$message.error(data.message + ":" + data.data);
        }
      });
    },
    GetDateStr(AddDayCount) {
      let dd = new Date();
      dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
      let y = dd.getFullYear();
      let m =
        dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1) : dd.getMonth() + 1; //获取当前月份的日期，不足10补0
      let d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate(); //获取当前几号，不足10补0
      return y + "-" + m + "-" + d;
    },
    reset(value) {
      if (value) {
        this.taskIds = [value];
      } else {
        this.taskIds = [];
      }
      myGantt.render();
    },
    resetQuery() {
      resetQueryForm(this, "queryForm", "");
      this.queryForm.planStart = this.GetDateStr(-15);
      this.queryForm.planEnd = this.GetDateStr(15);
      this.taskNo = "";
      this.initData();
      this.initGantt();
      this.getData();
    }
  }
};
</script>

<style scoped>
.app-main > div {
  height: 100%;
  padding: 0px;
  margin: 0px;
  overflow: hidden;
}
</style>
<style>
.drag_handle {
  background-image: radial-gradient(plum, orange, white);
  opacity: 0.2;
  width: 60px;
  height: 34px;
}

.task_drag {
  /*display: inline;*/
  float: left;
  width: 100%;
}

.task_groups {
  background-color: #409eff !important;
}
.task_groups > .gantt_task_progress_wrapper > .gantt_task_progress {
  background-color: #5f3ddd !important;
}
.gantt_qi_big_icon {
  border: solid 1px;
}
.alignLeft .gantt_task_content {
  text-align: left !important;
}
#gantt_here .gantt_marker {
  background-color: #de1053;
}
.weekend {
  background: #f4f7f4;
}
.plus {
  color: rgb(139, 213, 229);
  font-size: 29px;
  cursor: pointer;
  vertical-align: middle;
}
</style>
