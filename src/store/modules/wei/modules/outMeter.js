import{ addOutMeters,getAllOutMeter,delOutMeter,updateOutMeter,getOutMeterById,getEmptyOutMeters,getFullOutMeters}from '@/api/weighing'
import {Message} from 'element-ui'
// import ca from "element-ui/src/locale/lang/ca";
const emptyOutMeters={
    weighingNo:'',
    truckNo:'',
    clientele:'',
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
const emptyOutMeter={
    weighingNo:'',
    truckNo:'',
    clientele:'',
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
const outMeter = {
    namespaced: true,
    state: {
        total: 0,
        emptyTotal:0,
        fullTotal:0,
        outMetersData: [],
        emptyOutMetersData:[],
        fullOutMetersData:[],
        selectedRowId:'',
        outMeters:{},
        disable: false,
        addOutMeters: emptyOutMeters,
        addEmptyOutMeter:emptyOutMeter,
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
        SET_OUT_METERS_DATA: (state, outMetersData) => {
            state.outMetersData = outMetersData
        },
        SET_EMPTY_OUT_METERS_DATA:(state,emptyOutMetersData)=>{
            state.emptyOutMetersData= emptyOutMetersData
        },
        SET_FULL_OUT_METERS_DATA:(state,fullOutMetersData)=>{
            state.fullOutMetersData = fullOutMetersData
        },
        SET_ADD_EMPTY_OUT_METER: (state, addEmptyOutMeter) => {
            state.addEmptyOutMeter = addEmptyOutMeter
        },
        SET_ADD_OUT_METERS: (state, addOutMeters) => {
            state.addOutMeters = addOutMeters
        },
        SET_OUT_METERS: (state, outMeters) => {
            state.outMeters = outMeters
        },
        SET_DISABLED: (state, disabled) => {
            state.disabled = disabled
        },
        SET_SELECTED_ROW_ID:(state,rowId)=>{
            state.selectedRowId=rowId
        }
    },
    actions:{
        addEmptyOutMeterData:function ({commit},params) {
            return new Promise((resolve,reject) =>{
                addOutMeters(params).then(()=>{
                    commit('SET_ADD_EMPTY_OUT_METER',emptyOutMeter)
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
        addOutMetersData:function ({commit},params) {
            return new Promise((resolve,reject) =>{
                addOutMeters(params).then(()=>{
                    commit('SET_ADD_OUT_METERS',emptyOutMeters)
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
        async getAllOutMeters({commit},params){
            return new Promise((resolve, reject) =>{
                getAllOutMeter(params).then(response=>{
                    const responseData = response.data;
                    commit('SET_TOTAL',responseData.data.total);
                    commit('SET_OUT_METERS_DATA',responseData.data.rows);
                    resolve()
                }).catch(e=>{
                    reject(e)
                })
            } )
        },
        async getEmptyOutMeter({commit},params){
            return new Promise((resolve, reject) =>{
                getEmptyOutMeters(params).then(response=>{
                    const responseData = response.data;
                    commit('SET_EMPTY_TOTAL',responseData.data.total);
                    commit('SET_EMPTY_OUT_METERS_DATA',responseData.data.rows);
                    resolve()
                }).catch(e=>{
                    reject(e)
                })
            } )
        },
        async getFullOutMeter({commit},params){
            return new Promise((resolve,reject)=>{
                getFullOutMeters(params).then(response=>{
                    const responseData = response.data;
                    commit('SET_FULL_TOTAL',responseData.data.total);
                    commit('SET_FULL_OUT_METERS_DATA',responseData.data.rows);
                    resolve()
                }).catch(e=>{
                    reject(e)
                })
            })
        },
        async delOutMeterById({},params){
            return new Promise((resolve, reject) => {
                delOutMeter(params).then(response=>{
                    resolve()
                }).catch(e=>{
                    reject(e)
                })
            })
        },
        async getOutMeterDtl({commit},params){
            return new Promise((resolve, reject) => {
                getOutMeterById(params).then(response=>{
                    const data = response.data
                    commit('SET_OUT_METERS',data.data)
                    resolve()
                }).catch(e=>{
                    reject(e)
                })
            })
        },
        updateOutMeterData({},params){
            return new Promise((resolve, reject) => {
                updateOutMeter(params).then(()=>{
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
export default outMeter
