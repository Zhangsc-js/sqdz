import{ addInMeters,getAllInMeter,delInMeter,updateInMeter,getInMeterById,getEmptyInMeters,getFullInMeters}from '@/api/weighing'
import {Message} from 'element-ui'
const emptyInMeters={
    weighingNo:'',
    truckNo:'',
    supplier:'',
    goodsName:'',
    gross:'',
    tare:'',
    net:'',
    weiUnit:'',
    emptyWeiTime:'',
    loadWeiTime:'',
    status:'',
    createdBy:'',
    createdOn:'',
    updatedBy:'',
    updatedOn:'',
    weighingPlace:''
}
const emptyInMeter={
    weighingNo:'',
    truckNo:'',
    supplier:'',
    goodsName:'',
    gross:'',
    tare:'',
    net:'',
    weiUnit:'',
    emptyWeiTime:'',
    loadWeiTime:'',
    status:'',
    createdBy:'',
    createdOn:'',
    updatedBy:'',
    updatedOn:'',
    weighingPlace:''
}
const inMeter = {
    namespaced: true,
    state: {
        total: 0,
        emptyTotal:0,
        fullTotal:0,
        inMetersData: [],
        emptyInMetersData:[],
        fullInMetersData:[],
        selectedRowId:'',
        inMeters:{},
        disable: false,
        addFullInMeter: emptyInMeter,
        addInMeters:emptyInMeters
    },
    mutations: {
        SET_TOTAL: (state, total) => {
            state.total = total
        },
        SET_EMPTY_TOTAL:(state,emptyTotal)=>{
            state.emptyTotal = emptyTotal
        },
        SET_FULL_TOTAL:(state,fullTotal)=>{
            state.fullTotal = fullTotal
        },
        SET_IN_METERS_DATA: (state, inMetersData) => {
            state.inMetersData = inMetersData
        },
        SET_EMPTY_IN_METERS_DATA:(state,emptyInMetersData)=>{
            state.emptyInMetersData= emptyInMetersData
        },
        SET_FULL_IN_METERS_DATA:(state,fullInMetersData)=>{
            state.fullInMetersData = fullInMetersData
        },
        SET_ADD_FULL_IN_METER: (state, addFullInMeter) => {
            state.addFullInMeter = addFullInMeter
        },
        SET_ADD_IN_METERS: (state, addInMeters) => {
            state.addInMeters = addInMeters
        },
        SET_IN_METERS: (state, inMeters) => {
            state.inMeters = inMeters
        },
        SET_DISABLED: (state, disabled) => {
            state.disabled = disabled
        },
        SET_SELECTED_ROW_ID:(state,rowId)=>{
            state.selectedRowId=rowId
        }
    },
    actions:{
        addFullInMeterData:function ({commit},params) {
              return new Promise((resolve,reject) =>{
                   addInMeters(params).then(()=>{
                       commit('SET_ADD_FULL_IN_METER',emptyInMeter)
                       Message({
                           message:'新增成功',
                           type:'success',
                            duration:3*1000
                       })
                       resolve()
                   }).catch(e=>{
                       reject(e)
                   })
              })
        },
        addInMetersData:function ({commit},params) {
            return new Promise((resolve,reject) =>{
                addInMeters(params).then(()=>{
                    commit('SET_ADD_IN_METERS',emptyInMeters)
                    Message({
                        message:'新增成功',
                        type:'success',
                        duration:3*1000
                    })
                    resolve()
                }).catch(e=>{
                    reject(e)
                })
            })
        },
        async getAllInMeters({commit},params){
            return new Promise((resolve, reject) =>{
                getAllInMeter(params).then(response=>{
                    const responseData = response.data;
                    commit('SET_TOTAL',responseData.data.total);
                    commit('SET_IN_METERS_DATA',responseData.data.rows);
                    resolve()
                }).catch(e=>{
                    reject(e)
                })
            } )
        },
        async getEmptyInMeter({commit},params){
            return new Promise((resolve, reject) =>{
                getEmptyInMeters(params).then(response=>{
                    const responseData = response.data;
                    commit('SET_EMPTY_TOTAL',responseData.data.total);
                    commit('SET_EMPTY_IN_METERS_DATA',responseData.data.rows);
                    resolve()
                }).catch(e=>{
                    reject(e)
                })
            } )
        },
        async getFullInMeter({commit},params){
          return new Promise((resolve,reject)=>{
              getFullInMeters(params).then(response=>{
                  const responseData = response.data;
                  commit('SET_FULL_TOTAL',responseData.data.total);
                  commit('SET_FULL_IN_METERS_DATA',responseData.data.rows);
                  resolve()
              }).catch(e=>{
                  reject(e)
              })
          })
        },
        async delInMeterById({},params){
            return new Promise((resolve, reject) => {
                delInMeter(params).then(response=>{
                    resolve()
                }).catch(e=>{
                    reject(e)
                })
            })
        },
        async getInMeterDtl({commit},params){
            return new Promise((resolve, reject) => {
                getInMeterById(params).then(response=>{
                    const data = response.data
                    commit('SET_IN_METERS',data.data)
                    resolve()
                }).catch(e=>{
                    reject(e)
                })
            })
        },
        updateInMeterData({},params){
            return new Promise((resolve, reject) => {
                updateInMeter(params).then(()=>{
                    Message({
                        message:'保存成功',
                        type:'success',
                        duration:3*1000
                    })
                    resolve()
                }).catch( e =>{
                    reject(e)
                })
            })
        }
    }
};
export default inMeter
