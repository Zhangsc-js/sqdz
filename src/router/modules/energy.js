import Layout from "../../views/layout/Layout"

export default [
  {
    path: '/v1',
    component: Layout,
    redirect: '/',
    hidden: false,
    meta: {title: '能源管理', icon: 'ene_manager', requiresArg: false},
    children: [
      {
        path: '/ene/index',
        name: 'index',
        component: () => import('@/views/ene/dataSpectaculars/index'),
        meta: {title: '能耗看板', icon: 'ene_manager', requiresArg: false}
      },
      {
        path: '/ene/infoManager',
        name: 'infoManager',
        component: () => import('@/views/ene/infoManager/index'),
        meta: {title: '信息中心', icon: 'ene_devicemanager', requiresArg: false, breadcrumb: false},
        children: [
          {
            path: '/ene/enePrice',
            name: 'enePrice',
            component: () => import('@/views/ene/infoManager/ene-price/ene-price'),
            hidden: false,
            meta: {title: '能源价格维护', icon: 'ene_typemanager', requiresArg: false}
          },
          {
            path: '/ene/dev1',
            name: 'WaterDevTree',
            component: () => import( '@/views/ene/infoManager/dev-tree/WaterDevTree'),
            hidden: false,
            meta: {title: '能源设备管理(水)', icon: 'ene_modeltree', requiresArg: false}
          },
          {
            path: '/ene/dev2',
            name: 'ElectDevTree',
            component: () => import( '@/views/ene/infoManager/dev-tree/ElectDevTree'),
            hidden: false,
            meta: {title: '能源设备管理(电)', icon: 'ene_modeltree', requiresArg: false}
          },
          {
            path: '/ene/dev3',
            name: 'GasDevTree',
            component: () => import( '@/views/ene/infoManager/dev-tree/GasDevTree'),
            hidden: false,
            meta: {title: '能源设备管理(气)', icon: 'ene_modeltree', requiresArg: false}
          },
          {
            path: '/ene/apportionment',
            name: 'apportionment',
            component: () => import('@/views/ene/infoManager/apportionment/index'),
            hidden: false,
            meta: {title: '能耗分摊管理', icon: 'ene_dictionary', requiresArg: false}
          },
          {
            path: '/reportConfig',
            name: 'reportConfig',
            component: () => import('@/views/ene/infoManager/reportConfig/reportConfig'),
            hidden: false,
            meta: {title: '报表配置', icon: 'ene_dictionary', requiresArg: false}
          },
          {
            path: '/meteringPoint',
            name: 'meteringPoint',
            component: () => import('@/views/ene/infoManager/meteringPoint/index'),
            hidden: false,
            meta: {title: '计量点管理', icon: 'ene_dictionary', requiresArg: false}
          },
        ]
      },
      {
        path: '/ene/infoShow',
        name: 'infoShow',
        component: () => import('@/views/ene/infoShow/index'),
        hidden: false,
        meta: {title: '能耗分析', icon: 'ene_monitor', requiresArg: false, breadcrumb: false},
        children: [
          {
            path: '/ene/apportionmentReport',
            name: 'apportionmentReport',
            component: () => import('@/views/ene/infoShow/apportionmentReport/index'),
            hidden: false,
            meta: {title: '分摊报表', icon: 'ene_water', requiresArg: false, breadcrumb: false},
            children: [
              {
                path: '/ene/water/apportionment/report',
                name: 'waterApportionmentReport',
                component: () => import('@/views/ene/infoShow/apportionment/reportIndex'),
                hidden: false,
                meta: {title: '能耗分摊报表', icon: 'dashboard', requiresArg: false, report: 'water'}
              },
              {
                path: '/ene/elect/cost/report',
                name: 'costReport',
                component: () => import('@/views/ene/infoShow/apportionment/eneCostReport-elect'),
                hidden: false,
                meta: {title: '金额分摊报表', icon: 'dashboard', requiresArg: false, breadcrumb: false},
              },
            ]
          },
          {
            path: '/ene/consumeReport',
            name: 'consumeReport',
            component: () => import('@/views/ene/infoShow/apportionmentReport/index'),
            hidden: false,
            meta: {title: '能耗报表', icon: 'ene_water', requiresArg: false, breadcrumb: false},
            children: [
              //环比
              {
                path: '/ene/water/compared/1',
                name: 'energyCompared1',
                component: () => import('@/views/ene/infoShow/report/reportCardShow'),
                hidden: false,
                meta: {title: '对比分析', icon: 'ene_water', requiresArg: false, breadcrumb: false, compared: 'compared'},
              },
              //同比
              {
                path: '/ene/water/compared/2',
                name: 'energyCompared2',
                component: () => import('@/views/ene/infoShow/report/reportCardShow'),
                hidden: false,
                meta: {title: '同比分析', icon: 'ene_water', requiresArg: false, breadcrumb: false, compared: 'compared'},
              },
              //对比
              {
                path: '/ene/water/compared/3',
                name: 'energyCompared3',
                component: () => import('@/views/ene/infoShow/report/reportCardShow'),
                hidden: false,
                meta: {title: '环比分析', icon: 'ene_water', requiresArg: false, breadcrumb: false, compared: 'compared'},
              },
              {
                path: '/ene/elect/uc/report',
                name: 'ucReport',
                component: () => import('@/views/ene/infoShow/apportionment/unitConsumption-elect'),
                hidden: false,
                meta: {title: '产品单耗报表', icon: 'ene_water', requiresArg: false, breadcrumb: false},
              },
              {
                path: '/ene/compared/template/1',
                name: 'waterReportCATemplate',
                component: () => import('@/views/ene/infoShow/report/reportCATemplate'),
                hidden: true,
                meta: {title: '对比分析模板', icon: 'dashboard', requiresArg: false, caTemplate: 'caTemplate'}
              },
              {
                path: '/ene/compared/template/2',
                name: 'waterReportYOYTemplate',
                component: () => import('@/views/ene/infoShow/report/reportYOYTemplate'),
                hidden: true,
                meta: {title: '同比分析模板', icon: 'dashboard', requiresArg: false, yoyTemplate: 'yoyTemplate'}
              },
              {
                path: '/ene/compared/template/3',
                name: 'waterReportChainTemplate',
                component: () => import('@/views/ene/infoShow/report/reportChainTemplate'),
                hidden: true,
                meta: {title: '环比分析模板', icon: 'dashboard', requiresArg: false, chainTemplate: 'chainTemplate'}
              },
            ]

          },
          // {
          //     path: '/ene/water',
          //     name: 'water',
          //     component: () => import('@/views/ene/infoShow/water/index'),
          //     hidden: false,
          //     meta: {title: '水', icon: 'ene_water', requiresArg: false, breadcrumb: false},
          //     children:[
          //         //1。对比分析
          //         {
          //             path: '/ene/water/compared/1',
          //             name: 'waterCompared1',
          //             component: () => import('@/views/ene/infoShow/report/reportCardShow'),
          //             hidden: false,
          //             meta: {title: '水-对比分析', icon: 'dashboard', requiresArg: false,compared:'water'}
          //         },
          //         //2。同比分析
          //         {
          //             path: '/ene/water/compared/2',
          //             name: 'waterCompared2',
          //             component: () => import('@/views/ene/infoShow/report/reportCardShow'),
          //             hidden: false,
          //             meta: {title: '水-同比分析', icon: 'dashboard', requiresArg: false,compared:'water'}
          //         },
          //         //3。环比分析
          //         {
          //             path: '/ene/water/compared/3',
          //             name: 'waterCompared3',
          //             component: () => import('@/views/ene/infoShow/report/reportCardShow'),
          //             hidden: false,
          //             meta: {title: '水-环比分析', icon: 'dashboard', requiresArg: false,compared:'water'}
          //         },
          //         //隐藏模板

          //         {
          //             path: '/ene/water/apportionment/report',
          //             name: 'waterApportionmentReport',
          //             component: () => import('@/views/ene/infoShow/apportionment/reportIndex'),
          //             hidden: false,
          //             meta: {title: '水-能耗分摊报表', icon: 'dashboard', requiresArg: false,report:'water'}
          //         },
          //         {
          //             path: '/ene/water/cost/report',
          //             name: 'costReportWater',
          //             component: () => import('@/views/ene/infoShow/apportionment/eneCostReport-water'),
          //             hidden: false,
          //             meta: {title: '水-能耗明细报表', icon: 'dashboard', requiresArg: false,report:'water'}
          //         },
          //         {
          //             path: '/ene/elect/uc/reportWater',
          //             name: 'ucReportWater',
          //             component: () =>import('@/views/ene/infoShow/apportionment/unitConsumption-water'),
          //             hidden: false,
          //             meta:{title: '水-产品单耗报表', icon: 'dashboard', requiresArg: false, report:'elect'}
          //         }
          //     ]
          // },
          // {
          //     path: '/ene/elect/index',
          //     name: 'elect',
          //     component: () => import('@/views/ene/infoShow/elect/index'),
          //     hidden: false,
          //     meta: {title: '电', icon: 'ene_electric', requiresArg: false, breadcrumb: false},
          //     children: [
          //         //1。对比分析
          //         {
          //             path: '/ene/elect/compared/1',
          //             name: 'electCompared1',
          //             component: () => import('@/views/ene/infoShow/report/reportCardShow'),
          //             hidden: false,
          //             meta: {title: '电-对比分析', icon: 'dashboard', requiresArg: false,compared:'elect'},
          //             query:{
          //                 t:new Date().getTime()
          //             }
          //         },
          //         //2。同比分析
          //         {
          //             path: '/ene/elect/compared/2',
          //             name: 'electCompared2',
          //             component: () => import('@/views/ene/infoShow/report/reportCardShow'),
          //             hidden: false,
          //             meta: {title: '电-同比分析', icon: 'dashboard', requiresArg: false,compared:'elect'},
          //         },
          //         //3。环比分析
          //         {
          //             path: '/ene/elect/compared/3',
          //             name: 'electCompared3',
          //             component: () => import('@/views/ene/infoShow/report/reportCardShow'),
          //             hidden: false,
          //             meta: {title: '电-环比分析', icon: 'dashboard', requiresArg: false,compared:'elect'},
          //         },
          //         //隐藏模板
          //         {
          //             path: '/ene/elect/compared/template/1',
          //             name: 'electReportCATemplate',
          //             component: () => import('@/views/ene/infoShow/report/reportCATemplate'),
          //             hidden: true,
          //             meta: {title: '对比分析模板', icon: 'dashboard', requiresArg: false,caTemplate:'elect'},
          //         },
          //         {
          //             path: '/ene/elect/compared/template/2',
          //             name: 'electReportYOYTemplate',
          //             component: () => import('@/views/ene/infoShow/report/reportYOYTemplate'),
          //             hidden: true,
          //             meta: {title: '同比分析模板', icon: 'dashboard', requiresArg: false,yoyTemplate:'elect'},
          //         },
          //         {
          //             path: '/ene/elect/compared/template/3',
          //             name: 'electReportChainTemplate',
          //             component: () => import('@/views/ene/infoShow/report/reportChainTemplate'),
          //             hidden: true,
          //             meta: {title: '环比分析模板', icon: 'dashboard', requiresArg: false,chainTemplate:'elect'},
          //         },
          //         /*           {
          //                        path: '/ene/elect/workshop',
          //                        name: 'electWorkshop',
          //                        component: () => import('@/views/ene/online/elect/electWorkshop'),
          //                        hidden: false,
          //                        meta: {title: '车间用电报表', icon: 'dashboard', requiresArg: false}
          //                    }, {
          //                        path: '/ene/elect/process',
          //                        name: 'electProcess',
          //                        component: () => import('@/views/ene/online/elect/electProcess'),
          //                        hidden: false,
          //                        meta: {title: '工序用电报表', icon: 'dashboard', requiresArg: false}
          //                    }, {
          //                        path: '/ene/elect/department',
          //                        name: 'electDepartment',
          //                        component: () => import('@/views/ene/online/elect/electDepartment'),
          //                        hidden: false,
          //                        meta: {title: '单位用电报表', icon: 'dashboard', requiresArg: false}
          //                    },
          //                    {
          //                        path: '/ene/elect/expend',
          //                        name: 'electExpend',
          //                        component: () => import('@/views/ene/online/elect/electExpend'),
          //                        hidden: false,
          //                        meta: {title: '车间耗能', icon: 'dashboard', requiresArg: false}
          //                    }, {
          //                        path: '/ene/elect/fee',
          //                        name: 'electFee',
          //                        component: () => import('@/views/ene/online/elect/electFee'),
          //                        hidden: false,
          //                        meta: {title: '分时段用电', icon: 'dashboard', requiresArg: false}
          //                    },*/
          //         {
          //             path: '/ene/elect/apportionment/report',
          //             name: 'electApportionmentReport',
          //             component: () => import('@/views/ene/infoShow/apportionment/reportIndex'),
          //             // component: () => import('@/views/ene/infoManager/apportionment/eneCostReport'),
          //             hidden: false,
          //             meta: {title: '电-能耗分摊报表', icon: 'dashboard', requiresArg: false,report:'elect'}
          //         },
          //         {
          //             path: '/ene/elect/cost/report',
          //             name: 'costReport',
          //             component: () => import('@/views/ene/infoShow/apportionment/eneCostReport-elect'),
          //             hidden: false,
          //             meta: {title: '电-能耗明细报表', icon: 'dashboard', requiresArg: false,report:'elect'}
          //         },
          //         {
          //             path: '/ene/elect/uc/reportElect',
          //             name: 'ucReportElect',
          //             component: () =>import('@/views/ene/infoShow/apportionment/unitConsumption-elect'),
          //             hidden: false,
          //             meta:{title: '电-产品单耗报表', icon: 'dashboard', requiresArg: false, report:'elect'}
          //         }
          //     ]
          // },
          // {
          //     path: '/ene/gas',
          //     name: 'gas',
          //     component: () => import('@/views/ene/infoShow/gas/index'),
          //     hidden: false,
          //     meta: {title: '气', icon: 'ene_gas', requiresArg: false, breadcrumb: false},
          //     children:[
          //         //1。对比分析
          //         {
          //             path: '/ene/gas/compared/1',
          //             name: 'gasCompared1',
          //             component: () => import('@/views/ene/infoShow/report/reportCardShow'),
          //             hidden: false,
          //             meta: {title: '气-对比分析', icon: 'dashboard', requiresArg: false,compared:'gas'}
          //         },
          //         //2。同比分析
          //         {
          //             path: '/ene/gas/compared/2',
          //             name: 'gasCompared2',
          //             component: () => import('@/views/ene/infoShow/report/reportCardShow'),
          //             hidden: false,
          //             meta: {title: '气-同比分析', icon: 'dashboard', requiresArg: false,compared:'gas'}
          //         },
          //         //3。环比分析
          //         {
          //             path: '/ene/gas/compared/3',
          //             name: 'gasCompared3',
          //             component: () => import('@/views/ene/infoShow/report/reportCardShow'),
          //             hidden: false,
          //             meta: {title: '气-环比分析', icon: 'dashboard', requiresArg: false,compared:'gas'}
          //         },
          //         //隐藏模板
          //         {
          //             path: '/ene/gas/compared/template/1',
          //             name: 'gasReportCATemplate',
          //             component: () => import('@/views/ene/infoShow/report/reportCATemplate'),
          //             hidden: true,
          //             meta: {title: '对比分析模板', icon: 'dashboard', requiresArg: false,caTemplate:'gas'}
          //         },
          //         {
          //             path: '/ene/gas/compared/template/2',
          //             name: 'gasReportYOYTemplate',
          //             component: () => import('@/views/ene/infoShow/report/reportYOYTemplate'),
          //             hidden: true,
          //             meta: {title: '同比分析模板', icon: 'dashboard', requiresArg: false,yoyTemplate:'gas'}
          //         },
          //         {
          //             path: '/ene/gas/compared/template/3',
          //             name: 'gasReportChainTemplate',
          //             component: () => import('@/views/ene/infoShow/report/reportChainTemplate'),
          //             hidden: true,
          //             meta: {title: '环比分析模板', icon: 'dashboard', requiresArg: false,chainTemplate:'gas'}
          //         },
          //         {
          //             path: '/ene/gas/apportionment/report',
          //             name: 'gasApportionmentReport',
          //             component: () => import('@/views/ene/infoShow/apportionment/reportIndex'),
          //             hidden: false,
          //             meta: {title: '气-能耗分摊报表', icon: 'dashboard', requiresArg: false,report:'gas'}
          //         },
          //         {
          //             path: '/ene/gas/cost/report',
          //             name: 'costReportGas',
          //             component: () => import('@/views/ene/infoShow/apportionment/eneCostReport-gas'),
          //             hidden: false,
          //             meta: {title: '气-能耗明细报表', icon: 'dashboard', requiresArg: false,report:'elect'}
          //         },
          //         {
          //             path: '/ene/elect/uc/reportGas',
          //             name: 'ucReportGas',
          //             component: () =>import('@/views/ene/infoShow/apportionment/unitConsumption-gas'),
          //             hidden: false,
          //             meta:{title: '气-产品单耗报表', icon: 'dashboard', requiresArg: false, report:'elect'}
          //         }
          //     ]
          // },
        ]
      },
      /*{
          path: '/ene/eneWarning',
          name: 'eneWarning',
          component: () => import( '@/views/ene/warning/index'),
          hidden: false,
          meta: {title: '能耗告警', icon: 'ene_warning', requiresArg: false, breadcrumb: false},
          children: [
              {
                  path: '/ene/warningType',
                  name: 'warningType',
                  component: () => import('@/views/ene/warning/warning-type/warningType'),
                  hidden: false,
                  meta: {title: '告警类型维护', icon: 'ene_warningtype', requiresArg: false}
              },
              {
                  path: '/ene/warningCondition',
                  name: 'warningCondition',
                  component: () => import('@/views/ene/warning/warning-condition/warningCondition'),
                  hidden: false,
                  meta: {title: '告警条件设置', icon: 'ene_warningset', requiresArg: false}
              },
              {
                  path: '/ene/warningRecord',
                  name: 'warningRecord',
                  component: () => import('@/views/ene/warning/warning-record/warningRecord'),
                  hidden: false,
                  meta: {title: '告警记录查询', icon: 'ene_warningrecord', requiresArg: false}
              }

          ]
      },*/
      /*{
          path: '/ene/report',
          name: 'report',
          component: () => import('@/views/ene/infoShow/report/reportYOYTemplate'),
          hidden: false,
          meta: {title: '能源报表数据展示', icon: 'ene_report', requiresArg: false},
      },*/
      /*{
          path: '/ene',   //页面显示地址
          name: 'eneDict',  //跟你暴露出来的组件名字要一   致
          component: () => import('@/views/ene/page/index'),
          hidden: false,
          meta: {title: '数据字典维护', icon: 'ene_dictionary', requiresArg: false}
      },*/

    ]
  },
]
