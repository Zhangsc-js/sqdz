<template>
  <!--<div title="历史趋势" :id="chartName" style="height: 285px;width: 600px;"></div>-->
  <div style="height: 100%;">
    <!-- 下拉 -->
    <el-row style="text-align:left;padding:10px">
      <el-select v-model="value" placeholder="请选择" @change="changeSrc">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.paramName"
          :value="item.searchPoint"
        ></el-option>
      </el-select>
    </el-row>
    <div style="height:calc(100% - 52px)">
      <iframe
        @click="dialogVisible = true"
        v-if="showData"
        class="process"
        frameborder="0"
        width="100%"
        scrolling="no"
        height="100%"
        :src="viewURL"
      ></iframe>
    </div>
    <el-dialog :visible.sync="dialogVisible" width="80%" center>
      <iframe
        v-if="showData"
        class="process"
        frameborder="0"
        width="100%"
        scrolling="no"
        height="100%"
        :src="viewURL"
      ></iframe>
    </el-dialog>
  </div>
</template>

<script>
import { isNotEmpty } from "@/utils";
import { getDevParameters, getPointNames, findAllNoCut } from "@/api/sys/dev";

export default {
  name: "HistoryTrend",
  data() {
    return {
      dialogVisible: false,
      showData: true,
      pointDataURL:
        "http://http://61.130.105.158:38080/hi/gview.html?token=7965a3bd-95bb-307c-867c-7e79a788a0d7&id=486",
      deviceName: "",
      pointFix: "",
      viewURL: "",
      //模拟点位后端数据
      pointList: [
        "V9607",
        "TEST",
        "TEST2",
        "V2403A",
        "V2404B",
        "V2402A",
        "V2401",
        "V2402",
        "V2403B"
      ],
      pointListByQuery: [],
      value: "",
      options: [],
      currActiveName: "historyTrend"
    };
  },
  props: {
    activeName: {
      type: String,
      required: true,
      default: ""
    }
  },
  computed: {
    selectNodeNO() {
      return this.$store.state.sysDev.selectNodeNO;
    }
  },
  watch: {
    selectNodeNO() {
      if (this.activeName == this.currActiveName) {
        this.getFindAllNoCut();
        this.value = "";
        this.viewURL = "";
      }
    },
    activeName() {
      if (this.activeName == this.currActiveName) {
        this.getFindAllNoCut();
        this.value = "";
        this.viewURL = "";
      }
    },
    viewURL() {
      if (this.activeName == this.currActiveName) {
        this.getFindAllNoCut();
      }
    }
  },
  mounted() {
    //this.queryProcessDBPointNames()
    if (isNotEmpty(this.selectNodeNO)) {
      this.getFindAllNoCut();
      //this.getURL();
    }
  },
  methods: {
    /*async getURL() {
        const params = {
          ...this.page,
          devNo: this.selectNodeNO
        };
        getDevParameters(params)
          .then(response => {
            const result = response.data;
            if (result.success) {
              let pointNames = [];
              for (let i = 0; i < result.data.rows.length; i++) {
                let pointFullname = result.data.rows[i].searchPoint;
                let start = pointFullname.lastIndexOf('.') + 1;
                let pointNameList = pointFullname.substr(start);
                pointNames.push(pointNameList);
                console.log(pointNames);
              }
              this.pointListByQuery = pointNames;

              let arrEqual = this.getArrEqual(
                this.pointList,
                this.pointListByQuery
              );
              let temPointList = arrEqual.join(",");
              if (temPointList.length > 0) {
                let pointNames = "p=" + temPointList;
                let list = new Array(
                  this.pointDataURL,
                  this.deviceName,
                  pointNames
                );
                let temURL = list.join("&");
                this.viewURL = temURL;
                this.showData = true;
              } else {
                this.showData = false;
              }
            } else {
              this.$message.error(result.message);
            }
          })
          .catch(e => {
            this.$message.error(e.getMessage);
          });
      },*/
    getArrEqual(arr1, arr2) {
      let newArr = [];
      for (let i = 0; i < arr2.length; i++) {
        for (let j = 0; j < arr1.length; j++) {
          if (arr1[j] === arr2[i]) {
            newArr.push(arr1[j]);
          }
        }
      }
      return newArr;
    },
    //do后端获取点位列表
    /*queryProcessDBPointNames() {
          getPointNames().then(response => {
            let arr = response.data
            this.pointList = arr.data
          }).catch(e => {
            this.$message.error(e.message);
          });
        }*/
    getFindAllNoCut() {
      findAllNoCut({ devCode: this.selectNodeNO }).then(res => {
        this.options = res.data.data;
        if (this.value == "" && this.options.length > 0) {
          this.value = this.options[0].searchPoint;
          this.changeSrc(this.value);
        }
      });
    },
    changeSrc(val) {
      //console.log(val)
      let tableName = val.substring(val.indexOf(".") + 1, val.lastIndexOf("."));
      let pointName = val.substring(val.lastIndexOf(".") + 1, val.length);
      this.deviceName = "d=" + tableName;
      let pointFullName = "p=" + pointName;
      let list = new Array(this.pointDataURL, this.deviceName, pointFullName);
      this.viewURL = list.join("&");

      console.log(this.viewURL);
    }
  }
};
</script>
<style lang='scss'>
iframe {
  html {
    height: 100%;
    width: 100%;
    body {
      height: 100%;
      width: 100%;
    }
  }
}
</style>
