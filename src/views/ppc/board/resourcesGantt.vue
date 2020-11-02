<template>
  <div id="top">
    <div>
      <el-form :model="queryForm" :inline="true" class="demo-form-inline" ref="queryForm">
        <el-form-item label="任务单号" prop="taskNo">
          <el-input v-model="taskNo" @blur="showTask"></el-input>
        </el-form-item>
        <el-form-item label="下单日期" prop="planStart">
          <el-date-picker type="date" v-model="queryForm.planStart" value-format="yyyy-MM-dd" />
          <span>~</span>
        </el-form-item>
        <el-form-item prop="planEnd">
          <el-date-picker type="date" v-model="queryForm.planEnd" value-format="yyyy-MM-dd" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getDataSource()">查询</el-button>
          <el-button type="primary" icon="el-icon-refresh-left" @click="reset">重置</el-button>
        </el-form-item>
        <el-form-item style="right: 10px;position:fixed">
          <el-radio-group size="medium" v-model="selectValue" @change="setLevel">
            <el-radio-button label="日"></el-radio-button>
            <el-radio-button label="月"></el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <div id="ganttArea" style="height: calc(100% - 52px);"></div>
    <el-dialog
      title="修改工单"
      :visible.sync="dialogVisible"
      width="55%"
      style="height: 80%;margin-top: 50px"
      :close-on-click-modal="true"
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
  </div>
</template>

<script>
import { resetQueryForm } from "@/utils/common";
import {
  ResourcesGantt,
  uptResourceGantt,
  uptworkOrder
} from "@/api/productionPlanning";
import {
  deleteWo,
  issueWo,
  initData,
  splitWo
} from "@/api/ppc/workshopDispatch";
import UptworkOrder from "./uptWorkOrder";
import InsertProducePlan from "./insertProducePlan";
let myGantt = Gantt.getGanttInstance();
export default {
  components: {
    InsertProducePlan,
    UptworkOrder
  },
  data() {
    return {
      taskNo: "",
      selectValue: "月",
      queryForm: {
        devCode: "",
        planStart: "",
        planEnd: ""
      },
      radio: "day",
      dialogVisible: false,
      planDialogVisible: false,
      statusDialogVisible: false,
      woNo: "",
      orderId: "",
      visible: false,
      treeData: [],
      WO_STATUS: []
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
    this.$nextTick(() => {
      //默认开始结束时间
      this.queryForm.planStart = this.GetDateStr(-15);
      this.queryForm.planEnd = this.GetDateStr(15);
      this.initData();
      this.initGantt();
      this.getData();
    });
  },
  methods: {
    initData() {
      initData()
        .then(response => {
          if (response.data.success) {
            this.WO_STATUS = response.data.data.WO_STATUS;
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
          let _taskType = this.treeData.data[i].type;
          if (_taskNo.indexOf(this.taskNo) != -1 && _taskType == "task") {
            let task = myGantt.getTaskBy("text", _taskNo);
            myGantt.showTask(task[0].id);
            this.$message.success("已成功定位:" + _taskNo);
            //需要判定工序层是否展开，如果close，则open
            let devTask = myGantt.getTask(task[0].parent);
            let processTask = myGantt.getTask(devTask.parent);
            if (!processTask.$open) {
              myGantt.open(processTask.id);
              myGantt.render();
            }
            myGantt.selectTask(task[0].id);
            return;
          }
        }
        this.$message.warning("未找到该任务");
      }
    },
    setLevel(type) {
      if (type == "日") {
        myGantt.config.duration_unit = "hour";
        myGantt.config.duration_step = 1;
        myGantt.getGridColumns()[1].name = "prodHour";
        myGantt.getGridColumns()[1].label = "排程(时)";
        myGantt.ext.zoom.setLevel("day");
        myGantt.render();
      } else {
        myGantt.config.duration_unit = "day";
        myGantt.config.duration_step = 1;
        myGantt.getGridColumns()[1].name = "prodDay";
        myGantt.getGridColumns()[1].label = "排程(天)";
        myGantt.ext.zoom.setLevel("month");
        myGantt.render();
      }
    },
    getDataSource() {
      this.getData();
    },
    categoryDialog(data) {
      this.taskNo = data;
      this.dialogVisible = false;
      this.planDialogVisible = false;
      this.getData(); //重新获取数据
    },
    hidenDialogCancel() {
      this.dialogVisible = false;
      this.planDialogVisible = false;
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
    getData() {
      ResourcesGantt(this.queryForm).then(response => {
        const data = response.data;
        if (data.success) {
          myGantt.hideQuickInfo();
          myGantt.clearAll();
          this.setMarker(); //今日线--clearALL()方法会清除今日线
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
    taskBack(id) {
      let task = myGantt.getTask(id);
      task.start_date = new Date(task.oldstime);
      task.end_date = new Date(task.oldetime);
      myGantt.refreshTask(id);
    },
    initGantt() {
      //myGantt配置
      myGantt.config.auto_types = true; //设置true，渲染时触发更改task属性，有子task，则其自动升级为project，并计算duration，同时再触发update事件
      myGantt.config.drag_progress = false; //进度条不可操作
      myGantt.config.drag_links = false; //禁用连线
      //左侧title内容
      myGantt.config.columns = [
        {
          name: "text",
          label: "车间产线<b class='plus' onclick='Gantt.CreatePlan()'>+</b>",
          width: "200",
          tree: true,
          resize: true
        },
        { name: "prodDay", label: "排产(天)", align: "center", width: "60" }
      ];
      myGantt.config.fit_tasks = true; //自适应
      myGantt.config.open_tree_initially = true; //自动展开tree
      let zoomConfig = {
        levels: [
          {
            name: "day",
            scale_height: 50,
            min_column_width: 40,
            scales: [
              { unit: "day", format: "%F %d" },
              { unit: "hour", step: 1, format: "%H:%i" }
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
      myGantt.config.date_format = "%Y-%m-%d %H:%i:%s"; //渲染数据的日期格式
      myGantt.init(
        "ganttArea",
        new Date(this.queryForm.planStart),
        new Date(this.queryForm.planEnd)
      );
      this.setLevel("月");
      document.getElementById("ganttArea").style.position = "static";
      myGantt.config.quickinfo_buttons = [
        "update",
        "delete",
        "release",
        "split"
      ];
      //按钮名称
      myGantt.locale.labels["update"] = "修改";
      myGantt.locale.labels["delete"] = "删除";
      myGantt.locale.labels["release"] = "下达";
      myGantt.locale.labels["split"] = "拆分";

      //myGantt事件
      let dragging_task_id = 0; //拖动的taskid
      let dragging_task = {}; //用于时刻记录拖动的taks信息
      myGantt.attachEvent("onAfterTaskDrag", (id, mode, e) => {
        //上下左右拖动完成事件
        var modes = myGantt.config.drag_mode;
        let task = myGantt.getTask(id);
        if (mode == modes.move) {
          if (dragging_task_id && id == dragging_task_id) {
            /*开始************前端解决残影问题，切换不同unit时，开始结束时间未考虑到unit颗粒度*/
            task.start_date = dragging_task.start_date;
            task.end_date = dragging_task.end_date;
            myGantt.refreshTask(id);
            /*结束************前端解决残影问题，切换不同unit时，开始结束时间未考虑到unit颗粒度*/

            let bigBox = document.getElementsByClassName("gantt_data_area")[0];
            let target_index = Math.floor(
              (y_pos - 54 + bigBox.scrollTop) / myGantt.config.row_height
            );
            let target_dev = myGantt.getTaskByIndex(target_index);
            //如果开始时间、结束时间、设备都一样，则不触发更新，触发情况是选中任务时，刚触发拖动后松开鼠标，造成肉眼难见的更新
            if (
              new Date(task.oldstime).getTime() == task.start_date.getTime() &&
              new Date(task.oldetime).getTime() == task.end_date.getTime() &&
              task.parent == target_dev.id
            ) {
              return false;
            } else if (target_dev.parent != "0") {
              //工序层，所有parent都为0;设备层、工单层都非0
              let oldParent = myGantt.getTask(task.parent);
              oldParent.unscheduled = true;
              if (oldParent.parent != target_dev.parent) {
                //判定是否同工序
                this.$message.warning("不同工序，不可拖动");
                this.taskBack(id);
              } else {
                task.parent = target_dev.id;
                this.updateGantt(task);
              }
            } else {
              this.$message.warning("不可操作");
              this.taskBack(id);
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
        //上下左右拖动时事件
        renderer: devTask => {
          let task = myGantt.getTask(dragging_task_id);
          let sizes = myGantt.getTaskPosition(
            task,
            task.start_date,
            task.end_date
          );
          let bigBox = document.getElementsByClassName("gantt_data_area")[0];
          let el = document.createElement("div");
          el.className = "gantt_task_line";
          el.style.top = y_pos - 54 + bigBox.scrollTop + "px";
          el.style.left = sizes.left + "px";
          el.style.width = sizes.width + "px";
          el.style.height = sizes.height + "px";
          el.style.opacity = 0.2;
          dragging_task.start_date = task.start_date;
          dragging_task.end_date = task.end_date;
          if (dragging_task_id) return el;
          return true;
        },
        filter: function(task) {
          return dragging_task_id == myGantt.getState().drag_id;
        }
      });

      let y_pos;
      myGantt.attachEvent("onMouseMove", function(id, e) {
        //鼠标移动事件
        y_pos = e.clientY - 90 - 52;
      });

      myGantt.attachEvent("onBeforeTaskDrag", (id, mode, e) => {
        //拖动前事件
        let task = myGantt.getTask(id);
        if (task.status >= "30") {
          this.$message.warning("状态为:【" + task.statusName + "】，不可更改");
          return false;
        }
        let modes = myGantt.config.drag_mode;
        if (mode == modes.move || mode == modes.resize) {
          //move/resize/progress
          dragging_task_id = id;
          task.dragMode = mode;
          myGantt.refreshTask(id);

          let processTaskId = myGantt.getTask(task.parent).parent;
          let gridRow = document.getElementsByClassName("gantt_row");
          for (let i = 0; i < gridRow.length; i++) {
            let _devTaskId = gridRow[i].attributes.task_id.value;
            let _devTask = myGantt.getTask(_devTaskId);
            if (_devTask.parent == processTaskId) {
              continue;
            }
            gridRow[i].classList.add("moveModalGrid");
          }
          let taskRow = document.getElementsByClassName("gantt_task_row");
          for (let i = 0; i < taskRow.length; i++) {
            let _devTaskId = taskRow[i].attributes.task_id.value;
            let _devTask = myGantt.getTask(_devTaskId);
            if (_devTask.parent == processTaskId) {
              continue;
            }
            taskRow[i].classList.add("moveModalGantt");
          }
        }
        return true;
      });
      myGantt.$click.buttons.update = id => {
        let task = myGantt.getTask(id);
        this.woNo = task.text;
        this.dialogVisible = true;
        this.statusDialogVisible = false;
      };
      myGantt.$click.buttons.delete = id => {
        let task = myGantt.getTask(id);
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
      };
      myGantt.$click.buttons.release = id => {
        let task = myGantt.getTask(id);
        if (task.status != "10") {
          this.$message.warning("当前状态不可下达");
          return;
        }
        this.taskNo = task.text;
        issueWo(id).then(response => {
          let data = response.data;
          if (data.success) {
            this.$message.success("下达成功");
            this.getData();
          } else {
            this.$message.error(data.message + ":" + data.data);
          }
        });
      };
      myGantt.$click.buttons.split = id => {
        let task = myGantt.getTask(id);
        if (task.status >= "30") {
          this.$message.warning("当前状态不可拆分");
          return;
        }
        this.taskNo = task.text;
        splitWo(id).then(response => {
          let data = response.data;
          if (data.success) {
            this.$message.success("拆分成功");
            this.getData();
          } else {
            this.$message.error(data.message + ":" + data.data);
          }
        });
      };

      //增，删，改方法（一次更改，出现多次调用）
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

      Gantt.CreatePlan = () => {
        this.planDialogVisible = true;
      };
      myGantt.attachEvent("onTaskClick", id => {
        let task = myGantt.getTask(id);
        if (task.taskType == "process") {
          return true;
        } else if (task.taskType == "dev") {
          let woTasks = myGantt.getTaskBy("parent", id);
          if (woTasks.length != 0) {
            myGantt.showQuickInfo(woTasks[0].id, true);
          } else {
            return false;
          }
        } else {
          myGantt.showQuickInfo(id, true);
        }
        return true;
      });
      //双击任务时触发
      myGantt.attachEvent("onTaskDblClick", (id, e) => {
        let task = myGantt.getTask(id);
        if (task.taskType != "wo") return false;
        this.woNo = task.text;
        this.dialogVisible = true;
        this.statusDialogVisible = false;
      });

      myGantt.attachEvent("onTaskSelected", function(id) {
        let task = myGantt.getTask(id);
        if (task.type == "task") {
          myGantt.showQuickInfo(id, true);
        } else {
          myGantt.showQuickInfo(id, false);
        }
        task.selected = true;
        myGantt.render();
        return true;
      });
      myGantt.attachEvent("onTaskUnselected", function(id) {
        let task = myGantt.getTask(id);
        task.selected = false;
        myGantt.render();
        return true;
      });
      //4444444444444myGantt方法重写
      myGantt.templates.tooltip_text = (start, end, task) => {
        if (task.taskType != "wo") return false;
        for (let i = 0; i < this.WO_STATUS.length; i++) {
          if (this.WO_STATUS[i].code == task.status) {
            task.statusName = this.WO_STATUS[i].label;
          }
        }
        return (
          "<b>派工单号:</b> " +
          task.text +
          "<br/><b>开始时间:</b> " +
          myGantt.templates.tooltip_date_format(start) +
          "<br/><b>开始时间:</b> " +
          myGantt.templates.tooltip_date_format(end) +
          "<br/><b>完成进度:</b> " +
          task.progress * 100 +
          "%" +
          "<br/><b>工单状态:</b> " +
          task.statusName
        );
      };
      myGantt.templates.tooltip_date_format = function(date) {
        let formatFunc = myGantt.date.date_to_str("%Y-%m-%d %H:%i");
        return formatFunc(date);
      };
      myGantt.templates.quick_info_content = function(start, end, task) {
        return task.materialCode;
      };
      myGantt.templates.quick_info_title = (start, end, task) => {
        for (let i = 0; i < this.WO_STATUS.length; i++) {
          if (this.WO_STATUS[i].code == task.status) {
            task.statusName = this.WO_STATUS[i].label;
          }
        }
        return (
          task.text +
          "：<b>" +
          task.progress * 100 +
          "%</b>  " +
          task.statusName
        );
      };
      myGantt.templates.quick_info_date = function(start, end, task) {
        if (task.taskType == "1") {
        }
        return myGantt.templates.task_time(start, end, task);
      };
      myGantt.templates.task_time = function(start, end, task) {
        return (
          myGantt.templates.task_date(start) +
          " - " +
          myGantt.templates.task_date(end)
        );
      };
      myGantt.templates.task_date = function(date) {
        let formatFunc = myGantt.date.date_to_str("%Y-%m-%d %H:%i");
        return formatFunc(date);
      };
      myGantt.templates.task_class = function(start, end, task) {
        if (task.selected == true) {
          return "selectedCss";
        } else {
          return "";
        }
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
    reset() {
      resetQueryForm(this, "queryForm", "");
      this.queryForm.planStart = this.GetDateStr(-15);
      this.queryForm.planEnd = this.GetDateStr(15);
      this.taskNo = "";
      this.initData();
      this.initGantt();
      this.getData();
    },
    updateGantt(data) {
      this.taskNo = data.text;
      uptResourceGantt(data).then(response => {
        let data = response.data;
        if (data.success) {
          this.$message.success("更新成功");
        } else {
          this.$message.error(data.message + ":" + data.data);
        }
        this.getData();
      });
    },
    GetDateStr(AddDayCount) {
      var dd = new Date();
      dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
      var y = dd.getFullYear();
      var m =
        dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1) : dd.getMonth() + 1; //获取当前月份的日期，不足10补0
      var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate(); //获取当前几号，不足10补0
      return y + "-" + m + "-" + d;
    }
  }
};
</script>

<style scoped>
.app-main > div {
  height: 100%;
}
form {
  float: left;
}
.el-dialog {
  height: 100%;
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
  float: left;
  width: 100%;
}
.gantt_task_line.gantt_milestone {
  opacity: 0;
}
.selectedCss {
  background-color: #409eff;
}
.selectedCss > .gantt_task_progress_wrapper > .gantt_task_progress {
  background-color: #5f3ddd !important;
}
#ganttArea .gantt_marker {
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

.moveModalGrid.gantt_row,
.moveModalGrid.gantt_row div {
  background-color: #cccccc !important;
  border-bottom: 1px solid #cccccc;
}
.moveModalGantt.gantt_task_row,
.moveModalGantt.gantt_task_row div {
  background-color: #cccccc !important;
  border-bottom: 1px solid #cccccc;
  border-right: 1px solid #cccccc;
}
</style>
