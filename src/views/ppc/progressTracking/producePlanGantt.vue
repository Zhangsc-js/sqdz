<template>
    <div class="producePlanGrannt">
        <div>
            <el-form  class="demo-form-inline" ref="queryForm">
                <el-form-item style="float: right;margin-right: 10px" >
                    <el-radio-group  size="medium" v-model="selectValue" @change="setLevel">
                        <el-radio-button label="日"></el-radio-button>
                        <el-radio-button label="月"></el-radio-button>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        </div>
        <div id="gantt_here" style="height: calc(100% - 52px);"></div>
    </div>
</template>

<script>
    import {producePlanGanttQuery} from "@/api/productionPlanning";
    import {initData} from "@/api/ppc/workshopDispatch"

    let myGantt = Gantt.getGanttInstance()
    export default {
        name: "producePlanGantt",
        data() {
            return {
                selectValue:'月',
                opts: [],
                woNo: '',
                taskIds: '',
                MaterialDialogVisible: false,
                planDialogVisible: false,
                planDialogVisibleUpdate: false,
                dialogVisible: false,
                treeData:[],
                WO_STATUS:[],
                PP_STATUS:[],
            }

        },
        props: {
            ppId: {
                type: String,
                required: true
            },
            ppNo: {
                type: String,
                required: true
            },
            trigger:{
                type:Number,
                required:true
            }
        },
        watch: {
            trigger(){
                this.getData();
            }
        },
        activated(){
            this.getData()
        },
        deactivated(){
            //解决页面切换title残留问题
            myGantt.clearAll()
        },
        mounted() {
            this.initData()
            this.initGantt()
            this.getData()
        },
        methods: {
            initData(){
                initData().then((response) => {
                    if(response.data.success){
                        this.WO_STATUS=response.data.data.WO_STATUS;
                        this.PP_STATUS=response.data.data.PP_STATUS;
                    }else{
                        this.$message.error(response.data.message+":"+response.data.data)
                    }
                }).catch(e => {
                    this.$message.error(e.message)
                })
            },
            showTask(){
                if(this.ppNo){
                    for (let i=0;i<this.treeData.data.length;i++){
                        let _taskNo=this.treeData.data[i].text;
                        if(_taskNo.indexOf(this.ppNo)!=-1){
                            let task=myGantt.getTaskBy("text", _taskNo);
                            myGantt.showTask(task[0].id);
                            //需要判定工序层是否展开，如果close，则open
                            this.parentOpen(task[0]);
                            this.reset(task[0].id);
                            myGantt.render();
                            return;
                        }
                    }
                    this.$message.warning("未找到该任务")
                }
            },
            parentOpen(task){
                if(task.parent!='0'){
                    let parent=myGantt.getTask(task.parent);
                    myGantt.open(parent.id)
                    this.parentOpen(parent)
                }else{
                    myGantt.open(task.parent)
                }
            },
            setLevel(type) {
                if(type=='日'){
                    myGantt.config.duration_unit = "hour";
                    myGantt.config.duration_step=1;
                    myGantt.getGridColumns()[3].name="prodHour"
                    myGantt.getGridColumns()[3].label="排程(时)"
                    myGantt.ext.zoom.setLevel("day");
                    myGantt.render();
                }else{
                    myGantt.config.duration_unit = "day";
                    myGantt.config.duration_step=1;
                    myGantt.getGridColumns()[3].name="prodDay"
                    myGantt.getGridColumns()[3].label="排程(天)"
                    myGantt.ext.zoom.setLevel("month");
                    myGantt.render();

                }
            },
            getData() {
                if(!this.ppId)  return;
                producePlanGanttQuery(this.ppId).then((response) => {
                    const data = response.data
                    if (data.success) {
                        myGantt.hideQuickInfo();
                        myGantt.clearAll()
                        this.setMarker()
                        myGantt.parse(data.data)
                        this.treeData=data.data;
                        this.showTask();
                    } else {
                        this.$message.error(data.message + ":" + data.data)
                    }
                })
            },
            setMarker(){
                let dateToStr = myGantt.date.date_to_str("%Y-%m-%d");
                let today = new Date();
                myGantt.addMarker({
                    start_date: today,
                    css: "today",
                    text: "时刻线",
                    title: "时刻线: " + dateToStr(today)
                });
            },
            initGantt() {
                //11111111111111111111myGantt属性配置
                myGantt.config.auto_types = false;
                myGantt.config.drag_move = false;//不可操作
                myGantt.config.drag_progress = false;//进度条不可操作
                myGantt.config.drag_resize = false;//不可操作
                myGantt.config.drag_links = false;//禁用连线
                myGantt.config.details_on_dblclick  = false;//禁用连线
                //左侧title内容
                myGantt.config.columns = [
                    {name: "no", label: "计划/任务单号", width: "140", tree: true,resize:true},
                    {name: "workShopName", label: "车间", align: "center",resize:true},
                    {name: "materialCode", label: "物料", align: "center",width:"140",resize:true},
                    {name: "prod",label: "排程", align: "center",width: "60"},
                ]
                //日期显示格式(日/月)
                let zoomConfig = {
                    levels: [
                        {
                            name: "day",
                            scale_height: 50,
                            min_column_width: 40,
                            scales: [
                                {unit: "day", format: "%F %d"},
                                {unit: "hour", step: 3, format: "%H:%i"}
                            ]
                        },
                        {
                            name: "month",
                            scale_height: 50,
                            min_column_width: 120,
                            scales: [
                                {unit: "month", format: "%F, %Y"},
                                {unit: "day", format: "%M/%d"}
                            ]
                        }
                    ]
                };
                myGantt.ext.zoom.init(zoomConfig);
                //渲染数据的日期格式
                myGantt.config.date_format = "%Y-%m-%d %H:%i:%s";
                myGantt.init("gantt_here");
                document.getElementById("gantt_here").style.position='static';
                this.setLevel("月")
                myGantt.config.open_tree_initially = true;//自动展开tree
                //22222222222222222222222myGantt按钮事件
                myGantt.attachEvent("onTaskClick",(id) =>{
                    this.reset(id)
                    return true;
                });
                //33333333333333333333myGantt触发事件
                //4444444444444444myGantt方法重写
                myGantt.templates.tooltip_text = (start,end,task)=>{
                    if(task.taskType=='1'){
                        for(let i=0;i<this.PP_STATUS.length;i++){
                            if(this.PP_STATUS[i].code==task.status){
                                task.statusName=this.PP_STATUS[i].label;
                            }
                        }
                        return "<b>单号:</b> "+task.no+"<br/><b>开始时间:</b> " + myGantt.templates.tooltip_date_format_s(start)+
                            "<br/><b>截止时间:</b> "+myGantt.templates.tooltip_date_format_s(end)+
                            "<br/><b>完成进度:</b> "+task.progress*100+'%'+
                            "<br/><b>工单状态:</b> "+task.statusName;
                    }else{
                        for(let i=0;i<this.WO_STATUS.length;i++){
                            if(this.WO_STATUS[i].code==task.status){
                                task.statusName=this.WO_STATUS[i].label;
                            }
                        }
                        return "<b>单号:</b> "+task.no+"<br/><b>开始时间:</b> " + myGantt.templates.tooltip_date_format(start)+
                            "<br/><b>截止时间:</b> "+myGantt.templates.tooltip_date_format(end)+
                            "<br/><b>加工工序:</b> "+task.processNo+"-"+task.processName+""+
                            "<br/><b>完成进度:</b> "+task.progress*100+'%'+
                            "<br/><b>工单状态:</b> "+task.statusName;
                    }
                };
                myGantt.templates.task_class = (start, end, task) =>{
                    if (this.taskIds.indexOf(task.id) != -1){
                        return "task_groups";
                    }
                    return "";
                };
                myGantt.templates.tooltip_date_format=function (date){
                    let formatFunc = myGantt.date.date_to_str("%Y-%m-%d %H:%i");
                    return formatFunc(date);
                };
                myGantt.templates.tooltip_date_format_s=function (date){
                    let formatFunc = myGantt.date.date_to_str("%Y-%m-%d");
                    return formatFunc(date);
                };
                myGantt.templates.quick_info_content = function(start, end, task){
                    return task.materialCode;
                };
                myGantt.templates.quick_info_title = (start, end, task)=>{
                    if(task.taskType=='1'){
                        for(let i=0;i<this.PP_STATUS.length;i++){
                            if(this.PP_STATUS[i].code==task.status){
                                task.statusName=this.PP_STATUS[i].label;
                            }
                        }
                    }else{
                        for(let i=0;i<this.WO_STATUS.length;i++){
                            if(this.WO_STATUS[i].code==task.status){
                                task.statusName=this.WO_STATUS[i].label;
                            }
                        }
                    }
                    return task.no+"：<b>"+task.progress*100+'%</b>  '+task.statusName;
                };
                myGantt.templates.quick_info_date = function(start, end, task){
                    if(task.taskType=='1'){
                        return myGantt.date.date_to_str("%Y-%m-%d")(task.start_date)+" ~ "+myGantt.date.date_to_str("%Y-%m-%d")(task.end_date);
                    }else{
                        return myGantt.date.date_to_str("%Y-%m-%d %H:%i")(task.start_date)+" ~ "+myGantt.date.date_to_str("%Y-%m-%d %H:%i")(task.end_date);
                    }
                };
                myGantt.templates.task_text=function(start, end, task){
                    return task.index+"#---"+task.text;
                };
                myGantt.templates.scale_cell_class = function (date) {
                    if (date.getDay() == 0 || date.getDay() == 6) {
                        return "weekend";
                    }
                };
                myGantt.templates.timeline_cell_class = function (item, date) {
                    if (date.getDay() == 0 || date.getDay() == 6) {
                        return "weekend"
                    }
                };
            },
            GetDateStr(AddDayCount) {
                let dd = new Date();
                dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
                let y = dd.getFullYear();
                let m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1);//获取当前月份的日期，不足10补0
                let d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();//获取当前几号，不足10补0
                return y + "-" + m + "-" + d;
            },
            reset(value) {
                if (value) {
                    this.taskIds = [value]
                } else{
                    this.taskIds = []
                }
                myGantt.render();
            }
        }
    }
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
    .drag_handle{
        background-image: radial-gradient(plum, orange,white);
        opacity: 0.2;
        width: 60px;
        height: 34px;
    }

    .task_drag{
        /*display: inline;*/
        float:left;
        width: 100%;
    }


    .task_groups {
        background-color: #409EFF !important;
    }
    .task_groups>.gantt_task_progress_wrapper>.gantt_task_progress{
        background-color: #5f3ddd !important;
    }
    .gantt_qi_big_icon{
        border: solid 1px;
    }
    #gantt_here .gantt_marker{
        background-color:#de1053
    }
    .weekend {
        background: #f4f7f4;
    }
    .plus{
        color:rgb(139,213,229);
        font-size: 29px;
        cursor: pointer;
        vertical-align: middle;
    }
</style>
