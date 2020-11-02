import {getWeiCars,addWeiCars,updateWeiCars,getWeiCarsDetails,delWeiCars} from '@/api/weighing'
import {Message} from 'element-ui'
const emptyWeiCars ={
    truckNo:'',
    truckType:'',
    tare:'',
    driver:'',
    createdOn:'',
    remarks:''
}
const weiCars ={
    namespaced:true,
    state:{
        total:0,
        weiCarData:[],
        selectedRowId:'',
        weiCars:{},
        disabled:false,
        addWeiCars:emptyWeiCars

    },
    mutations:{
        SET_TOTAL:(state,total)=>{
            state.total=total
        },
        SET_WEICAR_DATA:(state,weiCarData)=>{
            state.weiCarData=weiCarData
        },
        SET_ADD_WEI_CARS:(state,addWeiCars)=>{
            state.addWeiCars=addWeiCars
        },
        SET_SELECTED_ROW_ID:(state,rowId)=>{
            state.selectedRowId=rowId
        },
        SET_WEICARS:(state,weiCars)=>{
            state.weiCars=weiCars
        },
        SET_DISABLED: (state, disabled) => {
            state.disabled = disabled
        },
    },
    actions:{
        async getAllWeiCars({commit},params){
            return new Promise((resolve,reject)=>{
             getWeiCars(params).then(response=>{
                 const responseData = response.data;
                 commit('SET_TOTAL',responseData.data.total);
                 commit('SET_WEICAR_DATA',responseData.data.rows);
                 resolve()
             }).catch(e=>{
                 reject(e)
             })
            })
        },
        async delWeiCarsData({},params){
            return new Promise((resolve, reject) => {
                delWeiCars(params).then(response=>{
                    resolve()
                }).catch(e=>{
                        reject(e)
                })
            })
        },
        async getWeiCarsDetailData({commit},params){
          return new Promise((resolve, reject) => {
              getWeiCarsDetails(params).then(response=>{
                  const data = response.data.data
                  commit('SET_WEICARS',data,data)
                  resolve()
              }).catch(e=>{
                  reject(e)
              })
          })
        },
        addWeiCarsData: function ({commit}, params) {
            return new Promise((resolve, reject) => {
                addWeiCars(params).then(() => {
                    commit('SET_ADD_WEI_CARS', emptyWeiCars)
                    Message({
                        message: '新增成功',
                        type: 'success',
                        duration: 3 * 1000
                    })
                    resolve()
                }).catch(e => {
                    reject(e)
                })
            })
        },

        updateWeiCarsData({},params){
            return new Promise((resolve, reject) => {
                updateWeiCars(params).then(()=>{
                    Message({
                        message:'保存成功',
                        type:'success',
                        duration:3*1000
                    })
                    resolve()
                }).catch(e=>{
                    reject(e)
                })
            })
        }
    }
};
export default weiCars
