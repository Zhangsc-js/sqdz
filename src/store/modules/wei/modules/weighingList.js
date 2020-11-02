import {getAllLists,delWeighingList} from '@/api/weighing'

const weighingList ={

    namespaced :true,
    state:{
        total:0,
        weiData:[],
        // selectedRowId:'',

    },
    mutations:{
        SET_TOTAL:(state,total)=>{
            state.total=total
        },
        SET_WEI_DATA:(state,weiData)=>{
            state.weiData = weiData
        }
    },
    actions:{
        async getAllWeiLists({commit},params){
            return new Promise((resolve, reject)=>{
                getAllLists(params).then(response=>{
                    const responseData = response.data;
                    commit('SET_TOTAL',responseData.data.total)
                    commit('SET_WEI_DATA',responseData.data.rows);
                    resolve()
                }).catch(e => {
                    reject(e)
                })
            })
        },
        async delectData({},params){
            return new Promise((resolve,reject)=>{
                delWeighingList(params).then(response=>{
                    resolve()
                }).catch(e=>{
                    reject(e)
                })
            })
        }
    }
};
export default weighingList
