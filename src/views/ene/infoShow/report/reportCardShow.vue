<template>
  <!--    配置展示页面-->
  <div :key="appKey">
    <el-row>
      <el-col :span="24" style="margin-left:20px">
        <span>能源类型：</span>
        <el-select v-model="energyType" value="selectValue" placeholder="能源类型">
          <el-option
            v-for="item in eneType"
            :key="item.code"
            :label="item.label"
            :value="item.code"
          ></el-option>
        </el-select>
        <el-button type="primary" @click="getData()">查询</el-button>
      </el-col>
    </el-row>

    <el-row>
      <el-col v-for="(item,index) in oneData" :key="index" :span="6" v-model="oneData">
        <el-card shadow="hover" style="width: 90%;margin:10px;height:300px" aria-hidden="false">
          <div @click="clearAll(item)">
            <img src="@/assets/images/report.jpg" class="image" />
            <div>
              <span>{{ item.name }}</span>
            </div>
            <hr />
            <div>
              <span>{{ item.procName }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getAllShare, getAllEneType } from "@/api/energy";

export default {
  name: "reportCardShow",
  data() {
    return {
      appKey: "",
      oneData: [],
      isCompareType: 1,
      energyType: "elect",
      eneType: []
    };
  },
  components: {},
  mounted() {
    this.getData(),
      getAllEneType()
        .then(response => {
          if (response.data.success) {
            this.eneType = response.data.data;
          } else {
            this.$message.error(response.data.message);
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
  },

  methods: {
    clearAll(item) {
      if (!isNaN(+this.isCompareType)) {
        this.$router.push({
          path: "/ene/compared/template/" + this.isCompareType,
          query: {
            titleName: item.name,
            proccode: item.proccode,
            years: item.day,
            procName: item.procName,
            dateType: item.dateType,
            energyType: this.energyType
          }
        });
      }
    }, //这个cardshow页面，就是外面的图片 ， 然后我点进这图片的   页面去
    getData() {
      let path = this.$route.path;
      this.isCompareType = path.substring(path.length - 1, path.length);
      if (isNaN(+this.isCompareType)) return;
      const params = {
        isCompareType: this.isCompareType,
        energyType: this.energyType
      };
      getAllShare(params)
        .then(response => {
          if (response.data.success) {
            this.oneData = response.data.data;
            if (this.oneData.length === 0) {
              this.$message("暂无数据");
            }
          } else {
            this.$message.error(response.data.message);
          }
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    }
  },
  // watch: {
  //     // 监听配置报表展示
  //     $route() {
  //         this.appKey = new Date().getTime();
  //         this.getData()
  //     }
  // },
  watch: {
    $route: function() {
      //查看compared是否是展示页面
      this.getData();
    }
  }
};
</script>

<style scoped>
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
  height: 190px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

.outBox {
  overflow-y: auto;
}

.el-row .el-col {
  padding-top: 11px;
}
</style>

