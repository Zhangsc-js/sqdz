import {findMeteringInfo,getDevImg,} from "@/api/energy";
import {isEmptyArray} from "@/utils/index";

const tableData = {
  sbmc: '',
  sbmcEn: '',
  sbdm: '',
  standard: '',
  measureScope: '',
  useWorkshop: '',
  useDepartment: '',
  useProcess: '',
  cycleReport: '',
  meteringUpper: '',
  meteringLower: '',
  abcFl: '',
  jd: '',
  ccTime: '',
  ccCode: '',
  bz: ''
};

const eneDev = {

    namespaced: true,

    //初始化
    state: {
      activeName: 'elect',
      isElect: 1,
      isWater: '',
      isGas: '',
      tableData: tableData, //表的数据
      selectNo: '',//当前选中树的设备的code
      devName: '',//当前选中树的设备的名字
      equipId:'',//当前选中树的设备的id

      showInfo: true,
      flag: false,
      isAble: true,
      proImgList: [],
    },

    //对应事件回调的对象dh
    mutations: {
      SET_AVTIVENAME: (state, activeName) => {
        state.activeName = activeName
      },
      SET_ENERGYTYPE: (state, energyType) => {
        if (energyType === 'elect') {
          state.isElect = 1;
          state.isWater = '';
          state.isGas = '';
        } else if (energyType === 'water') {
          state.isElect = '';
          state.isWater = 1;
          state.isGas = '';
        } else if (energyType === 'gas') {
          state.isElect = '';
          state.isWater = '';
          state.isGas = 1;
        }
      },
      SET_TABLE_DATA: (state, tableData) => {
        state.tableData = tableData
      },
      SET_SELECTNO: (state, selectNo) => {
        state.selectNo = selectNo
      },
      SET_DEVNAME: (state, devName) => {
        state.devName = devName
      },
      SET_FLAG: (state, flag) => {
        state.flag = flag
      },
      SET_SHOWIMG: (state, showImg) => {
        state.showImg = showImg
      },
      SET_PROIMG_LIST: (state, proImgList) => {
        state.proImgList = proImgList
      },
      SET_EQUIPID: (state, equipId) => {
        state.equipId = equipId
      },
    },

    actions: {
      async findMetering({commit}, code) {   //暴露给外面的方法名
        return new Promise((resolve, reject) => {
          findMeteringInfo(code)
            .then(res => {
              //有数据则显示
              if (!isEmptyArray(res.data.data.rows)) {
                commit('SET_FLAG',true);
                commit('SET_TABLE_DATA',res.data.data.rows[0]);
                commit('SET_EQUIPID',res.data.data.rows[0].id);
                if (this.tableData) {
                  commit('SET_SHOWIMG',true);
                }
                resolve();
              } else {
                //无数据则制空
                commit('SET_FLAG',false);
                commit('SET_SHOWIMG',false);
                commit('SET_TABLE_DATA',{});
              }
            })
            .catch(e => {
              this.$message.error(e);
              reject(e);
            });
        })
      },
      async getDevImgX({ commit },params) {
        return new Promise((resolve, reject) => {
          getDevImg(params).then(res => {
            const result = res.data.data;
            if (!isEmptyArray(res.data.data)) {
              //无图片
              commit('SET_SHOWIMG',true);
            } else {
              commit('SET_SHOWIMG',false);
            }
            // 将原有数据置空
            const images = [];
            if (result) {
              for (let item of result) {
                images.push({
                  id: item.id,
                  name: item.fileName,
                  url: process.env.VUE_APP_DEV_IMAGE_URL + item.uploadName
                });
              }
            }
            commit('SET_PROIMG_LIST',images);
            resolve();
          })
            .catch(e => {
              this.$message.error(e.message);
              reject(e);
            });
        })
      }
    }
    ,

  }
;

export default eneDev
