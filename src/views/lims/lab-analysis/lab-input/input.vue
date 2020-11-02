<template>
  <div>
    <el-form :model="addInput" ref="addInput" :rules="addRules" label-width="100px" size="mini">
      <el-col :span="12">
        <el-form-item label="化验物料" prop>
          <el-input readonly v-model="selItem.labMain.proName"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="化验指标" prop="labIndicName">
          <el-input readonly v-model="selItem.labIndicName"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="车间" prop>
          <el-input readonly v-model="selItem.labMain.workShop"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="取样地点 " prop>
          <el-input readonly v-model="selItem.labMain.sampPlace"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="收样地点" prop>
          <el-input readonly v-model="selItem.labMain.receivePlace"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="实验室" prop="lab">
          <el-select style="width:256px;" v-model="addInput.lab" value-key="id" placeholder="请选择">
            <el-option
              v-for="item in selectLab"
              :key="item.id"
              :label="item.departName"
              :value="{labName:item.departName,id:item.departCode}"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="化验小组" prop="labGroup">
          <el-select
            style="width:256px;"
            v-model="addInput.labGroup"
            value-key="id"
            placeholder="请选择"
            @change="getUser"
          >
            <el-option
              v-for="item in selectGroup"
              :key="item.id"
              :label="item.departName"
              :value="{ departName: item.departName,  id: item.id }"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="化验时间" prop="laboratoryTime">
          <el-date-picker
            v-model="addInput.laboratoryTime"
            type="datetime"
            placeholder="选择日期时间"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width:256px;"
          ></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="化验人员" prop="labPro">
          <!-- <div v-if="user.length !== 0"> -->
          <el-select
            v-model="addInput.labPro"
            placeholder="请选择化验人员"
            style="width:256px;"
            @change="setUser"
            value-key="userCode"
          >
            <el-option
              v-for="(item,i) in user"
              :key="i"
              :label="item.userName"
              :value="{userName:item.userName,userCode:item.userCode}"
            ></el-option>
          </el-select>
          <!-- </div> -->
          <!-- <div v-else>
                <el-input v-model="addInput.labPro" placeholder="请输入化验人员（姓名,工号）"/>
          </div>-->
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="备注" prop="remark">
          <el-input v-model="addInput.remark" />
        </el-form-item>
      </el-col>
      <div v-if="!!formula.theFormula">
        <div class="clear_both formula">
          <span>
            计算公式：{{ formula.theFormula }}
            <!-- <el-button type="text" @click="calcIndic()">计算</el-button> -->
          </span>
          <span>计算结果：{{ addInput.calculateResult }}</span>
        </div>
        <el-table :data="indicList" style="margin-top:10px;">
          <el-table-column prop="indicName" label="参数"></el-table-column>
          <el-table-column label="参数值">
            <template v-slot="scope">
              <el-input
                :ref="'input_'+scope.$index"
                v-model="scope.row.indicValue"
                @change="changeIndicVal"
                :class="'outId'+scope.row.indic"
                placeholder="请输入参数值"
              >
                  <template slot="append" v-if="inFormulaOutId.indexOf(scope.row.indic) > -1">
                      <el-button type="text" style="color: #67c23a;font-size: 9px" @click="takeIn(scope.row.indic)">代入
                      </el-button>
                  </template>
              </el-input>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-else>
        <el-col :span="24">
          <el-form-item label="结果">
            <el-input v-model="addInput.calculateResult" />
          </el-form-item>
        </el-col>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer" style="margin-top:10px;">
      <!-- <el-button size="medium" @click="cancel()">取 消</el-button> -->
      <el-button
        size="medium"
        type="primary"
        @click="calcIndic()"
        v-if="this.addInput.calculateResult===''&& this.formula.theFormula"
      >计算</el-button>
      <el-button size="medium" type="primary" @click="save(0)" v-else>提交</el-button>
      <el-button size="medium" type="primary" @click="save(1)">存草稿</el-button>
    </div>
      <el-dialog title="公式代入：" :visible.sync="innerDialogVisible" width="75%" append-to-body>
          <div class="clear_both formula">
              <span>
                计算公式：{{ innerFormula.theFormula }}
              </span>
              <span>计算结果：{{ calcResult }}</span>
          </div>
          <el-table :data="innerIndicator" style="margin-top:10px;">
              <el-table-column prop="indicName" label="参数"></el-table-column>
              <el-table-column label="参数值">
                  <template v-slot="scope">
                      <el-input
                          :ref="'input_'+scope.$index"
                          v-model="scope.row.indicValue"
                          placeholder="请输入参数值"
                      >
                      </el-input>
                  </template>
              </el-table-column>
          </el-table>
          <span slot="footer" class="dialog-footer">
              <el-button @click="closeInner()">取 消</el-button>
              <el-button type="primary" @click="calculateIn()">计算</el-button>
              <el-button type="primary" @click="confirmInner()">确 定</el-button>
            </span>
      </el-dialog>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import { simpleDateFormat } from "@/utils/index";
import { isNumber } from "@/utils/common";
import {
  getPreInput,
  subInput,
  subCalc,
  getLabSubGroup,
  getGroupStaffs
} from "@/api/lims";
export default {
  name: "inputcont",
  data() {
    return {
      addInput: {
        calculateResult: "",
        remark: "",
        labPro: "",
        labGroup: { departName: "", id: "" }
      },
        innerDialogVisible: false,
        innerIndicator: [],
        innerFormula: {},
        calcResult: "",
      addRules: {
        laboratoryTime: [
          { required: true, message: "请选择化验时间", trigger: "blur" }
        ],
        lab: [
          { required: true, message: "请选择实验室", trigger: "blur" }
        ],
        labGroup: [
          { required: true, message: "请选择化验小组", trigger: "blur" }
        ],
        labPro: [
          { required: true, message: "请选择化验人员", trigger: "blur" }
        ],
      },
      tableData: [{}],
      formula: {},
      inFormula: [],
      inFormulaOutId: [],
      labSub: {},
      user: [],
      indicList: [],
      selUser: {},
      selectGroup: [],
      selectLab: [],
      isSaved: false
    };
  },
  props: {
    selItem: {
      type: Object,
      required: true
    }
  },
  mounted() {
    this.getData();
  },
  computed: {
    tableH() {
      let H = window.innerHeight;
      return H - 440;
    }
  },

  methods: {
    calculateIn(){
        let inputParam = this.innerFormula.inputIndic.split(",");
        let inputArr = this.innerIndicator.filter(i=>{
            return inputParam.indexOf(i.indic) > -1;
        });
        let flag = 0;
        let values = inputArr.map((item, i) => {
            const indicValue = item.indicValue.replace(/\s*/g, "");
            item.indicValue = indicValue;
            if (!isNumber(indicValue)) {
                flag = 1;
            }
            return indicValue;
        });
        if(flag === 1){
            this.$message.warning("参数值必须为数字");
            return false;
        }
        let names = inputArr.map((item, i) => {
            return item.indicName
        });
        let params = {
            nowInputIndic: values.join(","),
            inputIndicName: names.join("@,,,@"),
            labIndic: this.innerFormula.outIndic,
            theFormula: this.innerFormula.theFormula
        };
        subCalc(params).then(res => {
            let data = res.data;
            if (data.code !== 10000) {
                this.$message.error(data.message);
            } else {
                this.calcResult = data.data;
                this.addInput.calculateResult = '';
            }
        }).catch(e => {
            this.$message.error(e.message);
        });
    },
    closeInner(){
      this.innerDialogVisible = false;
    },
      confirmInner(){
        if(this.calcResult.trim() === ''){
            this.$message.warning("请先计算再确认");
            return false;
        }
        for(let i = 0;i < this.indicList.length;i++){
            if(this.indicList[i].indic === this.innerFormula.outIndic){
                this.indicList[i].indicValue = this.calcResult;
                break;
            }
        }
        this.closeInner();
      },
    getData() {
      let item = this.selItem;
      // this.getLabGroup(item.labMain.receivePlaceCode);
      let params = {
        labGroupId: item.labGroupId ? item.labGroupId : "",
        labSubId: item.labSubId ? item.labSubId : ""
      };
      getPreInput(params)
        .then(res => {
          let data = res.data;
          if (data.code == 10000) {
            data = data.data;
            // this.user = data.user;
            let indicList = [];
            let indicNameList = [];
            if (!!data.formula) {
              this.formula = data.formula;
              this.inFormula = data.inFormula;
              this.inFormulaOutId = data.inFormula.map((item,index) =>{
                  return item.outIndic
              });
              indicList = data.formula.inputIndic.split(",");
              indicNameList = data.formula.inputIndicName.split("@,,,@");
            }
            this.selectGroup = data.bz;
            this.selectLab = data.hys;
            let indicDataList;
            let labSub = data.labSub;
            if (!!labSub) {
              indicDataList = labSub.inindicData.split(",");
              this.addInput.calculateResult = labSub.outindicData;
              this.addInput.remark = labSub.remark;
              this.$nextTick(() => {
                this.$set(this.addInput, "laboratoryTime", labSub.labTime);
              });
              !!labSub.labOperatorName &&
                this.$set(this.addInput, "labPro", {
                  userName: labSub.labOperatorName,
                  userCode: labSub.labOperatorWork
                });
                console.log
              !!labSub.labId &&
                this.$set(this.addInput, "lab", {
                  labName: labSub.labName,
                  id: labSub.labId
                });
              if (!!labSub.labGroupId) {
                this.$set(this.addInput, "labGroup", {
                  departName: labSub.labGroup,
                  id: labSub.labGroupId
                });
                this.getUser({id:labSub.labGroupId});
              }
              this.selUser = {
                labOperatorWork: labSub.labOperatorWork,
                labOperatorName: labSub.labOperatorName
              };
            } else {
              indicDataList = [];
              // let labOperator = Cookies.get("inputLabOperator");
              // if (!!labOperator && (labOperator = JSON.parse(labOperator))) {
              //   let isUser = data.user.filter(item => {
              //     return item.workNumber == labOperator.labOperatorWork;
              //   });
              //   if (isUser.length > 0) {
              //     this.selUser = labOperator;
              //     this.addInput.labPro =
              //       labOperator.labOperatorName +
              //       "," +
              //       labOperator.labOperatorWork;
              //   }
              // }
            }
            let arr = new Array();
            for (let i = 0; i < indicList.length; i++) {
              const obj = {
                indic: indicList[i],
                indicName: indicNameList[i],
                indicValue: indicDataList[i] ? indicDataList[i] : ""
              };
              arr.push(obj);
            }
            this.indicList = arr;
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
      takeIn(outId){
        this.innerIndicator = [];
        this.innerFormula = {};
        this.calcResult = "";
        let arr = this.inFormula.filter(i=>{
           return i.outIndic === outId;
        });
        this.innerFormula = arr[0];
        let inputIndicator = this.innerFormula.inputIndic.split(",");
        let indicatorNameList = this.innerFormula.inputIndicName.split("@,,,@");
        for (let i = 0; i < inputIndicator.length; i++) {
            const obj = {
                indic: inputIndicator[i],
                indicName: indicatorNameList[i],
                indicValue: ""
            };
            this.innerIndicator.push(obj);
        }
        this.innerDialogVisible = true;
    },
    save(type) {
      let addInput = { ...this.addInput };
      console.log(addInput);
      let time = this.addInput.laboratoryTime;
      this.$refs.addInput.validate(valid => {
        if (valid || type === 1) {
          let params = {
            isTemporary: type + "",
            labSubId: this.selItem.labSubId,
            laboratoryTime: !!time ? time : null,
            temporaryDataStorageUserName: this.$store.state.user.userName,
            //暂时
            laboratoryPersonnelName: this.selUser.labOperatorName,
            laboratoryPersonnelWork: this.selUser.labOperatorWork,
            calculateResult: addInput.calculateResult + "",
            remark: addInput.remark,
            calculateParam: "",
            labIndicName: this.selItem.inputCode,
            proName: this.selItem.labMain.proName,
            receivePlace: this.selItem.labMain.receivePlace,
            nowOperatorName: this.$store.state.user.userName,
            nowOperatorWork: this.$store.state.user.workCode
          };
          if(!!addInput.labGroup){
            params.labGroupId = addInput.labGroup.id;
            params.labGroup = addInput.labGroup.departName;
          }
          if(!!addInput.lab){
             params.labId = addInput.lab.id;
            params.labName = addInput.lab.labName;
          }
          let values = this.indicList.map(item => {
            return item.indicValue;
          });
          params.calculateParam = !!this.formula.inputIndic
            ? values.join(",")
            : addInput.calculateResult + "";
          this.doSave(params);
        }
      });
    },
    changeIndicVal(val) {
      this.$set(this.addInput, "calculateResult", "");
    },
    doSave(params) {
      subInput(params)
        .then(res => {
          let data = res.data;
          if (data.code !== 10000) {
            this.$message.error(data.message);
          } else {
            this.isSaved = true;
            if (params.isTemporary == 0) {
              this.$message.success(data.message);
            } else {
              this.$message.info("已存草稿");
            }
            this.$emit("hidenDialog");
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    cancel() {
      this.$emit("hidenDialog");
    },
    calcIndic() {
      let emptyValue = false;
      let isError = null;
      let values = this.indicList.map((item, i) => {
        const indicValue = item.indicValue.replace(/\s*/g, "");
        item.indicValue = indicValue;
        if (!isNumber(indicValue) && !isError) {
          isError = true;
          this.$refs[`input_${i}`].focus();
          this.$message.error("参数值必须为数字");
        }
        return indicValue;
      });
      // if (values.indexOf("") > -1) {
      //   this.$message.error("请填写所有参数值再进行计算");
      //   return false;
      // }
      if (isError !== null) return false;
      let params = {
        nowInputIndic: values.join(","),
        inputIndicName: this.formula.inputIndicName,
        labIndic: this.selItem.labIndic,
        theFormula: this.formula.theFormula
      };
      subCalc(params)
        .then(res => {
          let data = res.data;
          if (data.code !== 10000) {
            this.$message.error(data.message);
          } else {
            this.addInput.calculateResult = data.data;
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    setUser(val) {
      let name = val.userName;
      let code = val.userCode;
      this.selUser = {
        labOperatorWork: code,
        labOperatorName: name
      };
      Cookies.set("inputLabOperator", JSON.stringify(this.selUser));
    },
    getLabGroup(labId) {
      let param = {
        deptId: labId
      };
      getLabSubGroup(param)
        .then(response => {
          const result = response.data;
          if (result.success) {
            this.selectGroup = result.data;
          } else {
            this.$message.error(result.message);
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    getUser(val) {
      let param = {
        id: val.id
      };
      getGroupStaffs(param)
        .then(response => {
          const result = response.data;
          if (result.success) {
            this.user = result.data;
            console.log(this.user);
          } else {
            this.$message.error(result.message);
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    }
  },
  beforeDestroy() {
    if (!this.isSaved) {
      this.save(1);
      this.$emit("hidenDialog");
    }
  }
};
</script>

<style scoped>
.clear_both {
  clear: both;
}
.formula > span {
  min-width: 200px;
  display: inline-block;
  margin-right: 20px;
}
.formula > span + span {
  min-width: 200px;
}
</style>
