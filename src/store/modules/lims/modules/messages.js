import Stomp from "stompjs";
import { getMsgCount } from "@/api/sys/activiti"

const messages = {
    state: {
        total: 0,
        labSubCount: 0, //待化验审核
        reExaminationCount: 0 //待复验审核
    },
    mutations: {
        SET_TOTAL: (state, total) => {
            state.total = total;
        },
        SET_LAB_COUNT: (state, count) => {
            state.labSubCount = count;
        },
        SET_RECHECK_COUNT: (state, count) => {
            state.reExaminationCount = count;
        }
    },
    actions: {
        // async getNewMsg({ commit }, workCode) {
        //     return new Promise((resolve, reject) => {
        //         getMsgCount({workCode:workCode}).then(response => {
        //             const data = response.data;
        //             if(data.success){
        //             commit('SET_TOTAL', data.data.total)
        //             commit('SET_LAB_COUNT', data.data.LabSubCount)
        //             commit('SET_RECHECK_COUNT', data.data.reExaminationCount)
        //             }
        //             resolve()
        //         }).catch(e => {
        //             reject(e)
        //         })
        //     })
        // }
    }
}

export default messages
