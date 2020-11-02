import Layout from '@/views/layout/Layout'

export default [
    {
        path: '/dev/manage',
        component: Layout,
        redirect: '/',
        meta: { title: '设备管理', icon: 'device', requiresAuth: false },
        children: [
            {
                path: '/dev',
                name: 'DeviceTree',
                component: () => import('@/views/dev/dev-tree/index'),
                meta: { title: '设备谱系树', icon: 'dev_tree', requiresAuth: false, breadcrumb: false },
                children: [
                    {
                        path: '/dev/v3',
                        name: 'Device3',
                        component: () => import('@/views/dev/dev-tree/fectory-model/FactoryModel'),
                        meta: { title: '工厂模型', icon: 'dev_factory_model', requiresAuth: false }
                    },
                    {
                        path: '/dev/v4',
                        name: 'DevAccount',
                        component: () => import('@/views/dev/dev-tree/dev-account/DevAccount'),
                        meta: { title: '台帐维护', icon: 'dev_account', requiresAuth: false }
                    }
                ]
            },
            {
                path: '/dev/v6',
                name: 'DevMaintain',
                component: () => import('@/views/dev/dev-ops/dev-maintain/index'),
                meta: { title: '设备维护', icon: 'dev_maintenance', requiresAuth: false, breadcrumb: false },
                children: [
                    {
                        path: '/dev/v10',
                        name: 'SpotCheck',
                        component: () => import('@/views/dev/dev-ops/dev-maintain/spot-check/index'),
                        meta: { title: '设备点检管理', icon: 'dashboard', requiresAuth: false, breadcrumb: false },
                        children: [
                            {
                                path: '/dev/v14',
                                name: 'CheckingPlane',
                                component: () => import('@/views/dev/dev-ops/dev-maintain/spot-check/checking-plan/index'),
                                meta: { title: '点检计划', icon: 'dev_sc_plan', requiresAuth: false }
                            },
                            {
                                path: '/dev/v16',
                                name: 'CheckingConfirmed',
                                component: () => import('@/views/dev/dev-ops/dev-maintain/spot-check/checking-confirmed/index'),
                                meta: { title: '点检确认', icon: 'dev_sc_ confirmed', requiresAuth: false }
                            },
                            {
                                path: '/dev/v18',
                                name: 'Device18',
                                component: () => import('@/views/dev/dev-ops/dev-maintain/spot-check/checking-item-info/index'),
                                meta: { title: '点检项信息', icon: 'dev_sc_info', requiresAuth: false }
                            }
                        ]
                    },
                    {
                        path: '/dev/v11',
                        name: 'Inspection',
                        component: () => import('@/views/dev/dev-ops/dev-maintain/Inspection/index'),
                        meta: { title: '设备巡检管理', icon: 'example', requiresAuth: false, breadcrumb: false },
                        children: [
                            {
                                path: '/dev/v19',
                                name: 'Device19',
                                component: () => import('@/views/dev/dev-ops/dev-maintain/Inspection/inspection-plan/index'),
                                meta: { title: '巡检计划', icon: 'dev_maintain', requiresAuth: false }
                            },
                            {
                                path: '/dev/v21',
                                name: 'InspectionConfirmed',
                                component: () => import('@/views/dev/dev-ops/dev-maintain/Inspection/inspection-confirmed/index'),
                                meta: { title: '巡检确认', icon: 'dev_sc_ confirmed', requiresAuth: false }
                            },
                            {
                                path: '/dev/v22',
                                name: 'Device22',
                                component: () => import('@/views/dev/dev-ops/dev-maintain/Inspection/inspection-item-info/index'),
                                meta: { title: '巡检项信息', icon: 'dev_sc_info', requiresAuth: false }
                            }
                        ]
                    },
                    {
                        path: '/dev/v24',
                        name: 'lubrication',
                        component: () => import('@/views/dev/dev-ops/dev-maintain/lubrication/index'),
                        meta: { title: '设备润滑管理', icon: 'example', requiresAuth: false, breadcrumb: false },
                        children: [
                            {
                                path: '/dev/v24/1',
                                name: 'lubricationPlan',
                                component: () => import('@/views/dev/dev-ops/dev-maintain/lubrication/lubrication-plan/index'),
                                meta: { title: '润滑计划', icon: 'example', requiresAuth: false }
                            },
                            {
                                path: '/dev/v24/2',
                                name: 'lubricationRecord',
                                component: () => import('@/views/dev/dev-ops/dev-maintain/lubrication/lubrication-confirmed/index'),
                                meta: { title: '润滑确认', icon: 'example', requiresAuth: false }
                            },
                            {
                                path: '/dev/v24/4',
                                name: 'Device24',
                                component: () => import('@/views/dev/dev-ops/dev-maintain/lubrication/lubrication-item-info/index'),
                                meta: { title: '润滑项信息', icon: 'dev_maintain', requiresAuth: false }
                            },
                        ]

                    },
                    {
                      path: '/dev/v25',
                      name: 'DevRepair',
                      component: () => import('@/views/dev/dev-ops/dev-repair/index'),
                      meta: { title: '设备维修管理', icon: 'example', requiresAuth: false, breadcrumb: false },
                      children: [
                          {
                              path: '/dev/v25/order',
                              name: 'DevRepairOrder',
                              component: () => import('@/views/dev/dev-ops/dev-repair/order/index'),
                              meta: { title: '维修单', icon: 'example', requiresAuth: false }
                          },
                          {
                              path: '/dev/v25/record',
                              name: 'DevRepairRecord',
                              component: () => import('@/views/dev/dev-ops/dev-repair/record/index'),
                              meta: { title: '维修记录', icon: 'dev_maintain_record', requiresAuth: false }
                          }
                      ]

                  }
                ]
            },

            /*      {
                    path: '/dev/v1',
                    name: 'DevOps',
                    component: () => import('@/views/dev/dev-ops/index'),
                    meta: { title: '设备运行管理', icon: 'dev_ops', requiresAuth: false, breadcrumb: false },
                    children: [


                      {
                        path: '/dev/v7',
                        name: 'Device7',
                        component: () => import('@/views/dev/dev-tree/index'),
                        meta: { title: '设备运行数据管理', icon: 'dev_opt_data', requiresAuth: false }
                      },
                      {
                        path: '/dev/v8',
                        name: 'Device8',
                        component: () => import('@/views/dev/dev-tree/index'),
                        meta: { title: '设备运行状态查询', icon: 'dev_opt_status', requiresAuth: false }
                      },
                      {
                        path: '/dev/v9',
                        name: 'Device9',
                        component: () => import('@/views/dev/dev-tree/index'),
                        meta: { title: '设备报警历史查询', icon: 'dev_woring_history', requiresAuth: false }
                      }
                    ]
                  },
                  {
                    path: '/dev/v2',
                    name: 'DevReport',
                    component: () => import('@/views/dev/dev-report/index'),
                    meta: { title: '设备报表', icon: 'dev_report', requiresAuth: false }
                  }*/
        ]
    }
]

