import { getDevTree } from '@/api/sys/dev'

/**
 * 设备树
 */
const sys = {

    namespaced: true,

    state: {
        treeData: [],
        selectNodeNO: '',     // 选中节点的设备编码
        sbmc: '',
        // 默认展开
        defaultExpanded: [],
        orderNO: '',
        exceptIds: [],
        planCode: '',
        planCategory: '',
        id: ''
    },

    mutations: {
        SET_TREE_DATA: (state, treeData) => {
            state.treeData = treeData
            if (state.id) {
                state.defaultExpanded = [state.id]
            } else {
                console.log(treeData)
                if (!treeData || !treeData[0] || !treeData[0].children || treeData[0].children.length == 0) {
                    return;
                } else if (treeData[0].children) {
                    state.defaultExpanded = [treeData[0].children[0].id]
                    let node = treeData[0].children[0]
                    for (let i = 0; i < 5; i++) {
                        if (node.children && node.children.length > 0) {
                            state.defaultExpanded.push(node.children[0].id)
                            node = node.children[0]
                        }
                    }
                }
            }

        },
        SET_NODE_NO: (state, selectNodeNO) => {
            state.selectNodeNO = selectNodeNO
        },
        SET_TEMPNAME: (state, sbmc) => {
            state.sbmc = sbmc
        },
        SET_ORDERNO: (state, orderNO) => {
            state.orderNO = orderNO
        },
        SET_EXCEPTIDS: (state, exceptIds) => {
            state.exceptIds = exceptIds
        },
        SET_PLANCODE: (state, planCode) => {
            state.planCode = planCode
        },
        SET_PLANCATEGORY: (state, planCategory) => {
            state.planCategory = planCategory
        },
        SET_NODE_ID: (state, id) => {
            state.id = id
        },
    },

    actions: {
        async getTreeData({ commit }, params) {
            return new Promise((resolve, reject) => {
                getDevTree(params).then(response => {
                    const data = response.data
                    commit('SET_TREE_DATA', data.data)
                    resolve()
                }).catch(e => {
                    reject(e)
                })
            })
        }
    }
}

export default sys
