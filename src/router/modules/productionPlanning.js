import Layout from '@/views/layout/Layout'

export default [
    {
        path:'/productionPlan',
        component:Layout,
        redirect:'/',
        meta:{title:'生产计划',icon:'dashboard',requiresArg:false},
        children:[
            {
                path:'/ppc/plannedProduction',
                name: 'plannedProduction',
                component:() =>import('@/views/ppc/plannedProduction/index'),
                meta:{title:'生产计划',icon:'ppc_producePlan',requiresArg:false},
                children:[
                    {
                        path:'/ppc/plannedProduction/order',
                        name:'SaleList',
                        component:() =>import('@/views/ppc/plannedProduction/ppc-order/order'),
                        meta:{title:'销售订单',icon:'ppc_sale',requiresArg:false},
                    },
                    {
                        path:'/ppc/plannedProduction/proPlan',
                        name:'proPlan',
                        component:() =>import('@/views/ppc/plannedProduction/ppc-order/productPlan/planOrder'),
                        meta:{title:'生产计划列表',icon:'ppc_plan_list',requiresArg:false},
                    },
                    {
                        path:'/ppc/workshop/workshopDispatch',
                        name:'scheduling',
                        component:() =>import('@/views/ppc/workshop/workshopDispatch.vue'),
                        meta:{title:'车间排产',icon:'ppc_workshop_dispath',requiresArg:false},
                    },
                    {
                        path:'/ppc/productionInfo/workShopIpad',
                        name:'workOrder',
                        component:() =>import('@/views/ppc/productionInfo/workShopIpad/ShopIPAD'),
                        meta:{title:'班组作业',icon:'ppc_workshop_task',requiresArg:false},
                    },
                    {
                        path:'/ppc/productionInfo/inspection',
                        name:'inspection',
                        component:() =>import('@/views/ppc/productionInfo/inspection/inspectionInfo'),
                        meta:{title:'作业质检',icon:'ppc_inspection',requiresArg:false},
                    },
                    {
                        path:'/ppc/productionInfo/teamPlan',
                        name:'teamPlan',
                        component:() =>import('@/views/ppc/planSchedul/planDaily'),
                        meta:{title:'排班计划',icon:'ppc_inspection',requiresArg:false},
                    },
                    {
                        path:'/ppc/board/resourcesGantt',
                        name:'materialListBoard',
                        component:() =>import('@/views/ppc/board/resourcesGantt'),
                        meta:{title:'资源gantt排产',icon:'ppc_gantt',requiresArg:false},
                    },
                    {
                        path:'/ppc/board/coorProdScheduling',
                        name:'coorProdScheduling',
                        component:() =>import('@/views/ppc/board/coorProdScheduling'),
                        meta:{title:'协同gantt排产',icon:'ppc_gantt',requiresArg:false},
                    },
                    {
                        path:'/ppc/flow/produceOutput',
                        name:'produceOutput',
                        component:() =>import('@/views/ppc/flow/produceOutput'),
                        meta:{title:'每日报产',icon:'ppc_gantt',requiresArg:false},
                    },
                    {
                        path:'/ppc/flow/dayOutpuOfMaterial',
                        name:'materialOutput',
                        component:() =>import('@/views/ppc/flow/dayOutPutOfMaterial'),
                        meta:{title:'物料日产出汇总',icon:'ppc_gantt',requiresArg:false},
                    },
                    {
                        path:'/ppc/flow/MonthPriceOfEmployess',
                        name:'monthPriceOfWorker',
                        component:() =>import('@/views/ppc/flow/MonthPriceOfEmployess'),
                        meta:{title:'员工月统计汇总',icon:'ppc_gantt', requiresArg:false}
                    }

                ]
            },
            {
                path:'/ppc/productionControl',
                name:'productionControl',
                component:() =>import('@/views/ppc/plannedProduction/index'),
                meta:{title:'进度跟踪',icon:'ppc_control',requiresArg:false},
                children:[
                    {
                        path:'/ppc/progressTracking/producePlan',
                        name:'producePlanProgress',
                        component:() =>import('@/views/ppc/progressTracking/producePlan'),
                        meta:{title:'生产计划进度跟踪',icon:'ppc_producePlan_progress',requiresArg:false},
                    },
                    {
                        path:'/ppc/progressTracking/workOrder',
                        name:'workOrderProgress',
                        component:() =>import('@/views/ppc/progressTracking/workOrder'),
                        meta:{title:'派工任务进度跟踪',icon:'ppc_workorder_progress',requiresArg:false}
                    },
                    /*{
                        path:'/ppc/productionControl/1',
                        component:() =>import('@/views/ppc/plannedProduction/index'),
                        meta:{title:'能源消耗数据分析',icon:'ppc_eneConsumption',requiresArg:false},
                    },
                    {
                        path:'/ppc/productionControl/2',
                        component:() =>import('@/views/ppc/plannedProduction/index'),
                        meta:{title:'生产工艺统计分析',icon:'ppc_statistical_analysis',requiresArg:false},
                    },
                    {
                        path:'/ppc/productionControl/3',
                        component:() =>import('@/views/ppc/plannedProduction/index'),
                        meta:{title:'设备运行数据分析',icon:'ppc_devData_analysis',requiresArg:false},
                    },
                    {
                        path:'/ppc/productionControl/4',
                        component:() =>import('@/views/ppc/plannedProduction/index'),
                        meta:{title:'调度日志',icon:'ppc_dispatch_log',requiresArg:false},
                        children:[
                            {
                                path:'/ppc/productionControl/4/1',
                                component:() =>import('@/views/ppc/plannedProduction/index'),
                                meta:{title:'岗位人员排班表',icon:'ppc_peoper_shift',requiresArg:false},
                            },
                            {
                                path:'/ppc/productionControl/4/2',
                                component:() =>import('@/views/ppc/plannedProduction/index'),
                                meta:{title:'岗位人员上岗作业状态',icon:'ppc_peoper_workStatus',requiresArg:false},
                            }
                        ]

                    },*/
                    /*{
                        path:'/ppc/productionControl/5',
                        component:() =>import('@/views/ppc/plannedProduction/index'),
                        meta:{title:'生产技术指标管理',icon:'ppc_technology_manegement',requiresArg:false},
                        children:[
                            {
                                path:'/ppc/productionControl/5/1',
                                component:() =>import('@/views/ppc/plannedProduction/index'),
                                meta:{title:'监控点安全值管理',icon:'ppc_montor_manegement',requiresArg:false},
                            },
                            {
                                path:'/ppc/productionControl/5/2',
                                component:() =>import('@/views/ppc/plannedProduction/index'),
                                meta:{title:'生产工艺参数管理',icon:'ppc_statistical_manege',requiresArg:false},
                            },
                            {
                                path:'/ppc/productionControl/5/3',
                                component:() =>import('@/views/ppc/plannedProduction/index'),
                                meta:{title:'设备运行参数管理',icon:'ppc_dev_param',requiresArg:false},
                            },
                            {
                                path:'/ppc/productionControl/5/4',
                                component:() =>import('@/views/ppc/plannedProduction/index'),
                                meta:{title:'产量指标管理',icon:'ppc_output_menege',requiresArg:false},
                            },
                            {
                                path:'/ppc/productionControl/5/5',
                                component:() =>import('@/views/ppc/plannedProduction/index'),
                                meta:{title:'操作边界值管理',icon:'ppc_operation_manege',requiresArg:false},
                            },
                        ]
                    },*/
                    /*{
                        path:'/ppc/productionControl/6',
                        component:() =>import('@/views/ppc/plannedProduction/index'),
                        meta:{title:'生产数据实时监控',icon:'ppc_data_montor',requiresArg:false},
                        children:[
                            {
                                path:'/ppc/productionControl/6/1',
                                component:() =>import('@/views/ppc/plannedProduction/index'),
                                meta:{title:'生产监控',icon:'ppc_montor',requiresArg:false},
                            },
                            {
                                path:'/ppc/productionControl/6/2',
                                component:() =>import('@/views/ppc/plannedProduction/index'),
                                meta:{title:'各车间总貌',icon:'ppc_workShop_status',requiresArg:false},
                            },
                            {
                                path:'/ppc/productionControl/6/3',
                                component:() =>import('@/views/ppc/plannedProduction/index'),
                                meta:{title:'磨矿',icon:'ppc_workShop_grinding',requiresArg:false},
                            },
                            {
                                path:'/ppc/productionControl/6/4',
                                component:() =>import('@/views/ppc/plannedProduction/index'),
                                meta:{title:'磷酸',icon:'ppc_workShop_acid',requiresArg:false},
                            },
                            {
                                path:'/ppc/productionControl/6/5',
                                component:() =>import('@/views/ppc/plannedProduction/index'),
                                meta:{title:'硫酸',icon:'ppc_workShop_vitriol',requiresArg:false},
                            },
                            {
                                path:'/ppc/productionControl/6/6',
                                component:() =>import('@/views/ppc/plannedProduction/index'),
                                meta:{title:'磷铵',icon:'ppc_workShop_phosphate',requiresArg:false},
                            }
                        ]
                    },*/
                    /*{
                        path:'/ppc/productionControl/7',
                        component:() =>import('@/views/ppc/plannedProduction/index'),
                        meta:{title:'技术指标分析报表',icon:'ppc_analysis_report',requiresArg:false},
                        children:[
                            {
                                path:'/ppc/productionControl/7/1',
                                component:() =>import('@/views/ppc/plannedProduction/index'),
                                meta:{title:'公司工艺指标',icon:'ppc_process_index',requiresArg:false},
                            },
                            {
                                path:'/ppc/productionControl/7/2',
                                component:() =>import('@/views/ppc/plannedProduction/index'),
                                meta:{title:'磨矿二车间',icon:'ppc_workShop_grinding2',requiresArg:false},
                            },
                            {
                                path:'/ppc/productionControl/7/3',
                                component:() =>import('@/views/ppc/plannedProduction/index'),
                                meta:{title:'磷酸二车间',icon:'ppc_workShop_acid2',requiresArg:false},
                            },
                            {
                                path:'/ppc/productionControl/7/4',
                                component:() =>import('@/views/ppc/plannedProduction/index'),
                                meta:{title:'硫酸二车间',icon:'ppc_workShop_vitriol2',requiresArg:false},
                            },
                            {
                                path:'/ppc/productionControl/7/5',
                                component:() =>import('@/views/ppc/plannedProduction/index'),
                                meta:{title:'磷铵四车间',icon:'ppc_workShop_phosphate4',requiresArg:false},
                            }
                        ]
                    },*/

                ]
            },

            {
                path:'/ppc/coorProdScheduling',
                name: 'ProductionMaterialBoard',
                component:() =>import('@/views/ppc/plannedProduction/index'),
                meta:{title:'生产报表',icon:'dashboard',requiresArg:false},
                children:[
                    {
                        path:'/ppc/report/WorkShopOutput',
                        name:'shopOutPut',
                        component:() =>import('@/views/ppc/report/WorkShopOutput'),
                        meta:{title:'车间产量报表',icon:'ppc_workshop_output',requiresArg:false},
                    },
                    {
                        path:'/ppc/report/producePlanFinish',
                        name:'producePlanFinish',
                        component:() =>import('@/views/ppc/report/producePlanFinish'),
                        meta:{title:'计划按期完成率统计',icon:'ppc_proplan_finished',requiresArg:false},
                    },
                    {
                        path:'/ppc/report/processFinish',
                        name:'processFinish',
                        component:() =>import('@/views/ppc/report/processFinish'),
                        meta:{title:'工序合格率统计',icon:'ppc_workShop_grinding2',requiresArg:false},
                    },
                    {
                        path:'/ppc/report/materialRate',
                        name:'materialRate',
                        component:() =>import('@/views/ppc/report/materialFinishRate'),
                        meta:{title:'物料成品率',icon:'ppc_workShop_phosphate4',requiresArg:false}
                    },
                    {
                        path:'/ppc/report/workShopRate',
                        name:'workShopRate',
                        component:() =>import('@/views/ppc/report/workShopRate'),
                        meta:{title:'车间成品率',icon:'ppc_workShop_phosphate4',requiresArg:false}
                    },
                    {
                        path:'/ppc/Kanban/index',
                        name:'KanbanIndex',
                        component:() =>import('@/views/ppc/Kanban/index'),
                        props:{
                            code:'021021'
                        },
                        meta:{title:'生产车间看板',icon:'ppc_sale',requiresArg:false},
                    },
                ]
            },


        ]
    }
]
