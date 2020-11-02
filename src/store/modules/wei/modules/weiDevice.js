import { getWeiDevTree, getWeiDevAttrs, addWeiDevAttr, delWeiDevAttr, getWeiDevAttrDetail, updateWeiDevAttr } from '@/api/weighing'
import { Message } from "element-ui";
const emptyWeiDevAttr = {
    sbmc: '',
    sbmcEn: '',
    zzcs: '',
    gybh: '',
    sbxh: '',
    ggxn: '',
    dw: '',
    sl: '',
    azdd: '',
    sbccbh: '',
    wlbm: '',
    glJddw: '',
    abcFl: '',
    jd: '',
    cgsj: null,
    tysj: null,
    sfWbjkbm: null,
    sfGcsj: null,
    sfQtsj: null,
    sfHysj: null,
    sfLsqs: null,
    sfKpiZb: null,
    sfJkglwhd: null,
    sfHbtxgld: null,
    sfZltxgld: null,
    sfJlbzq: null,
    sfLcwlsb: null,
    sfNyjlsb: null,
    sfWhsb: null,
    sfYb: null,
    sfTzsb: null,
    sfGysfx: null,
    sfHq: null,
    sfCbgl: null,
    sf3dSb: null,
    bz: ''
}

const weiDevice = {

    namespaced: true,
    state: {
        weiTreeData: [],
        tableData: [],
        selectNodeNO: '',
        addWeiDevAttr: emptyWeiDevAttr,
        selectedRowId: '',
        weiDevAttr: {},
        disabled: false,
        tempName: '',
        // 默认展开
        defaultExpanded: []
    },
    mutations: {
        SET_WEI_TREE_DATA: (state, weiTreeData) => {
            state.weiTreeData = weiTreeData
            if (!weiTreeData[0].children) {
                return
            }
            state.defaultExpanded = [weiTreeData[0].children[0].id]
            let node = weiTreeData[0].children[0]
            for (let i = 0; i < 5; i++) {
                if (node.children) {
                    if (node.children.length > 0) {
                        state.defaultExpanded.push(node.children[0].id)
                        node = node.children[0]
                    }
                }
            }
        },
        SET_NODE_NO: (state, selectNodeNO) => {
            state.selectNodeNO = selectNodeNO
        },
        SET_TEMPNAME: (state, tempName) => {
            state.addWeiDevAttr.sbmc = tempName
        },
        SET_TABLE_DATA: (state, tableData) => {
            state.tableData = tableData
        },
        SET_ADD_WEI_DEV_ATTR: (state, addWeiDevAttr) => {
            state.addWeiDevAttr = addWeiDevAttr
        },
        SET_SELECTED_ROW_ID: (state, rowId) => {
            state.selectedRowId = rowId
        },
        SET_DISABLED: (state, disabled) => {
            state.disabled = disabled
        },
        SET_WEI_DEV_ATTR: (state, weiDevAttr) => {
            state.weiDevAttr = weiDevAttr
        }
    },
    actions: {
        async getWeiTreeData({ commit }, param) {
            return new Promise((resolve, reject) => {
                getWeiDevTree(param).then(response => {
                    const data = response.data
                    commit('SET_WEI_TREE_DATA', data.data)
                    resolve()
                }).catch(e => {
                    reject(e)
                })
            })
        },
        async getTableData({ commit }, params) {
            return new Promise((resolve, reject) => {
                getWeiDevAttrs(params).then(response => {
                    const data = response.data
                    commit('SET_TABLE_DATA', data.rows)
                    resolve()
                }).catch(e => {
                    reject(e)
                })
            })
        },
        async addWeiDevData({ commit }, params) {
            return new Promise((resolve, reject) => {
                addWeiDevAttr(params).then(() => {
                    commit('SET_ADD_WEI_DEV_ATTR', emptyWeiDevAttr)
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
        async updateWeiDevData({ }, params) {
            return new Promise((resolve, reject) => {
                updateWeiDevAttr(params).then(response => {
                    const result = response.data
                    if (result.success) {
                        Message({
                            message: '保存成功',
                            type: 'success',
                            duration: 3 * 1000
                        })
                        resolve()
                    } else {
                        Message({
                            message: result.message,
                            type: 'error',
                            duration: 3 * 1000
                        })
                        reject(result.message)
                    }
                }).catch(e => {
                    reject(e)
                })
            })
        },
        async getWeiDevDetail({ commit }, params) {
            return new Promise((resolve, reject) => {
                getWeiDevAttrDetail(params).then(response => {
                    const data = response.data.data
                    commit('SET_WEI_DEV_ATTR', data, data)
                    resolve()
                }).catch(e => {
                    reject(e)
                })
            })
        },
        async delWeiDevData({ }, params) {
            return new Promise((resolve, reject) => {
                delWeiDevAttr(params).then(() => {
                    resolve()
                }).catch(e => {
                    reject(e)
                })
            })
        },


    }
}

export default weiDevice
