import Layout from "../../views/layout/Layout"

export default [{
    path: '/limsQm',
    component: Layout,
    redirect: '/',
    hidden: false,
    meta: {
        title: '质量管理',
        icon: 'lims_qm',
        requiresArg: false
    },
    children: [{
        path: '/lims/limsBasic',
        name: 'basic',
        component: () => import('@/views/lims/lims-basic/index'),
        hidden: false,
        meta: {
            title: '基础信息维护',
            icon: 'lims_basic',
            requiresArg: false
        },
        children: [{
            path: '/lims/limsIndicator',
            name: 'indicator',
            component: () => import('@/views/lims/lims-indicator/index'),
            hidden: false,
            meta: {
                title: '指标管理',
                icon: 'lims_index_manage',
                requiresArg: false
            },
            children: [{
                path: '/lims/input',
                name: 'inputManager',
                component: () => import('@/views/lims/lims-indicator/input/index'),
                hidden: false,
                meta: {
                    title: '输入指标',
                    icon: 'lims_input',
                    requiresArg: false
                }
            },
                {
                    path: '/lims/output',
                    name: 'outputManager',
                    component: () => import('@/views/lims/lims-indicator/output/index'),
                    hidden: false,
                    meta: {
                        title: '输出指标',
                        icon: 'lims_output',
                        requiresArg: false
                    }
                },
                {
                    path: '/lims/formula',
                    name: 'formula',
                    component: () => import('@/views/lims/lims-basic/formula/index'),
                    hidden: false,
                    meta: {
                        title: '公式维护',
                        icon: 'lims_formula',
                        requiresArg: false
                    }
                }
            ]
        },
            {
                path: '/lims/allocation',
                name: 'allocation',
                component: () => import('@/views/lims/lims-basic/allocation/index'),
                hidden: false,
                meta: {
                    title: '化验项目配置',
                    icon: 'lims_speci_manage',
                    requiresArg: false
                },
                children: [{
                    path: '/lims/program',
                    name: 'program',
                    component: () => import('@/views/lims/lims-basic/allocation/program/index'),
                    hidden: false,
                    meta: {
                        title: '化验项目--指标',
                        icon: 'lims_program',
                        requiresArg: false
                    }
                },
                    {
                        path: '/lims/deptIndicator',
                        name: 'deptIndicator',
                        component: () => import('@/views/lims/lims-basic/allocation/dept-indicator/dept-assay'),
                        hidden: false,
                        meta: {
                            title: '化验室--指标',
                            icon: 'lims_process',
                            requiresArg: false
                        }
                    },
                ]
            },
            {
                path: '/lims/limsLabarrange',
                name: 'labarrange',
                component: () => import('@/views/lims/lims-labarrange/index'),
                hidden: false,
                meta: {
                    title: '化验项目安排',
                    icon: 'lims_lab_plan',
                    requiresArg: false
                },
                children: [{
                    path: '/lims/speciFixed',
                    name: 'speciFixed',
                    component: () => import('@/views/lims/lims-labarrange/speci-fixed/index'),
                    hidden: false,
                    meta: {
                        title: '定点设定',
                        icon: 'lims_plan_spot',
                        requiresArg: false
                    }
                }, {
                    path: '/lims/rawPurchased',
                    name: 'rawPurchased',
                    component: () => import('@/views/lims/lims-labarrange/raw-purchased/index'),
                    hidden: false,
                    meta: {
                        title: '随机样',
                        icon: 'lims_plan_raw',
                        requiresArg: false
                    }
                },
                    {
                        path: '/lims/speciRandom',
                        name: 'speciRandom',
                        component: () => import('@/views/lims/lims-labarrange/speci-random/index'),
                        hidden: false,
                        meta: {
                            title: '临时化验',
                            icon: 'lims_plan_random',
                            requiresArg: false
                        }
                    }
                ]
            }
        ]
    },
        {
            path: '/lims/labAnls',
            name: 'labAnls',
            component: () => import('@/views/lims/lab-analysis/index'),
            hidden: false,
            meta: {
                title: 'lims化验分析',
                icon: 'lims_program',
                requiresArg: false
            },
            children: [{
                path: '/lims/labAnls/prelab',
                name: 'prelab',
                component: () => import('@/views/lims/lab-analysis/pre-laboratory/index'),
                hidden: false,
                meta: {
                    title: '待化验项目',
                    icon: 'lims_pre_lab',
                    requiresArg: false
                }
            },
                {
                    path: '/lims/labAnls/labInput',
                    name: 'labinput',
                    component: () => import('@/views/lims/lab-analysis/lab-input/index'),
                    hidden: false,
                    meta: {
                        title: '化验录入',
                        icon: 'lims_lab_input',
                        requiresArg: false
                    },
                    children: [{
                        path: '/lims/labAnls/labOff',
                        name: 'laboff',
                        component: () => import('@/views/lims/lab-analysis/lab-input/lab-off/index'),
                        hidden: false,
                        meta: {
                            title: '未化验',
                            icon: 'lims_lab_off',
                            requiresArg: false
                        }
                    },
                        {
                            path: '/lims/labAnls/labFail',
                            name: 'labfail',
                            component: () => import('@/views/lims/lab-analysis/lab-input/lab-fail/index'),
                            hidden: false,
                            meta: {
                                title: '退审重验',
                                icon: 'lims_lab_fail',
                                requiresArg: false
                            }
                        }
                    ]
                },
                {
                    path: '/lims/labAnls/dataReview',
                    name: 'labreview',
                    component: () => import('@/views/lims/lab-analysis/data-review/index'),
                    hidden: false,
                    meta: {
                        title: '化验数据审核',
                        icon: 'lims_lab_review',
                        requiresArg: false
                    }
                },
                {
                    path: '/lims/labAnls/inspected',
                    name: 'inspected',
                    component: () => import('@/views/lims/lab-analysis/inspected/index'),
                    hidden: false,
                    meta: {
                        title: '已化验项目',
                        icon: 'lims_lab_inspected',
                        requiresArg: false
                    }
                },
                {
                    path: '/lims/labAnls/lab-recheck',
                    name: 'lab-recheck',
                    component: () => import('@/views/lims/lab-analysis/lab-recheck/index'),
                    hidden: false,
                    meta: {
                        title: '复验申请审核',
                        icon: 'lims_lab_inspected',
                        requiresArg: false
                    }
                },
                {
                    path: '/lims/labAnls/prolist',
                    name: 'lab-prolist',
                    component: () => import('@/views/lims/lab-analysis/lab-prolist/index'),
                    hidden: false,
                    meta: {
                        title: '化验项目明细',
                        icon: 'lims_lab_prolist',
                        requiresArg: false
                    }
                },
                {
                    path: '/lims/labAnls/data-trace',
                    name: 'data-trace',
                    component: () => import('@/views/lims/lab-analysis/data-trace/index'),
                    hidden: false,
                    meta: {
                        title: '审核人员数据追踪',
                        icon: 'lims_lab_prolist',
                        requiresArg: false
                    }
                }
            ]
        },
        {
            path: '/lims/labReport',
            name: 'labReport',
            component: () => import('@/views/lims/lab-report/index'),
            hidden: false,
            meta: {
                title: '化验情況',
                icon: 'lims_lab_report',
                requiresArg: false
            },
            children: [{
              path: '/lims/labReport/send',
              name: 'send',
              component: () => import('@/views/lims/lab-report/send'),
              hidden: false,
              meta: {
                title: '送样检测情况',
                icon: 'lims_plan_spot',
                requiresArg: false
              }
            }, {
              path: '/lims/labReport/lab',
              name: 'lab',
              component: () => import('@/views/lims/lab-report/lab'),
              hidden: false,
              meta: {
                title: '样品化验情况',
                icon: 'lims_plan_raw',
                requiresArg: false
              }
            },
              {
                path: '/lims/labReport/labAvg',
                name: 'labAvg',
                component: () => import('@/views/lims/lab-report/lab-avg'),
                hidden: false,
                meta: {
                  title: '化验平均情况',
                  icon: 'lims_plan_raw',
                  requiresArg: false
                }
              },
                {
                    path: '/lims/labReport/noSpecimen',
                    name: 'noSpecimen',
                    component: () => import('@/views/lims/lab-report/no-specimen'),
                    hidden: false,
                    meta: {
                        title: '不合格样品情况',
                        icon: 'lims_plan_raw',
                        requiresArg: false
                    }
                },
            ]
        },
        {
            path: '/lims/qualityReport',
            name: 'qualityreport',
            component: () => import('@/views/lims/quality-report/index'),
            hidden: false,
            meta: {
                title: '质量看板',
                icon: 'lims_quality_report',
                requiresArg: false
            }
        },
        {
            path: '/lims/curve',
            name: 'limscurve',
            component: () => import('@/views/lims/simulation-curve/index'),
            hidden: false,
            meta: {
                title: '曲线模拟',
                icon: 'lims_curve',
                requiresArg: false
            }
        }, {
            path: '/lims/sampler',
            name: 'sampler',
            component: () => import('@/views/lims/sampler/index'),
            hidden: false,
            meta: {
                title: '取样工面板',
                icon: 'lims_sampler',
                requiresArg: false
            }
        }
    ]
}]
