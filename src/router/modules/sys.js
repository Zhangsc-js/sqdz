import Layout from '@/views/layout/Layout'
export default [
    {
        path: '/sys/manage',
        component: Layout,
        redirect: '/',
        meta: { title: '系统管理', icon: 'device', requiresAuth: false },
        children: [
            {
                path: '/sys/autocode',
                name: 'autocode',
                component: () => import('@/views/sys/autocode'),
                meta: { title: '自动编码管理', icon: 'dev_report', requiresAuth: false }
            },
            // {
            //     path: '/menu-manage',
            //     name: 'menu-manage',
            //     component: () => import('@/views/sys/menu-manage/index'),
            //     meta: { keepAlive: true, title: '菜单管理', icon: 'lims_speci_manage', requiresAuth: false }
            // },
            {
                path: '/sys/dict',
                name: 'dict',
                component: () => import('@/views/sys/dict'),
                meta: { title: '数据字典', icon: 'dev_report', requiresAuth: false }
            },
            {
                path: '/sys/unit',
                name: 'unit',
                component: () => import('@/views/sys/unitmanage'),
                meta: { title: '量纲维护', icon: 'dev_report', requiresAuth: false }
            },
            {
                path: '/sys/base',
                name: 'BaseData',
                component: () => import('@/views/sys/baseData/index'),
                meta: { title: '设备配置', icon: 'dev_report', requiresAuth: false },
                children: [
                    {
                        path: '/sys/base/tree',
                        name: 'DevTree',
                        component: () => import('@/views/sys/baseData/devTree/fectory-model/index'),
                        meta: { title: '设备谱系树', icon: 'dev_tree', requiresAuth: false }
                    },
                    {
                        path: '/sys/base/account',
                        name: 'SysDevAccount',
                        component: () => import('@/views/sys/baseData/devTree/dev-account/index'),
                        meta: { title: '设备台帐', icon: 'dev_account', requiresAuth: false }
                    },
                    {
                        path: '/sys/base/tree/card/config',
                        name: 'TreeCardConfig',
                        component: () => import('@/views/sys/baseData/devTree/treeCardConfig/index'),
                        meta: { title: '设备卡片配置', icon: 'dev_account', requiresAuth: false }
                    },
                    {
                        path: '/sys/base/tree/card/factoryMapping',
                        name: 'factoryMapping',
                        component: () => import('@/views/sys/baseData/devTree/factoryMapping/index'),
                        meta: { title: '工厂映射树', icon: 'dev_account', requiresAuth: false }
                    },
                ]
            },
            {
                path: '/ppc/power',
                name: 'power',
                component: () => import('@/views/sys/warehouse/index'),
                meta: { title: '权限配置', icon: 'dev_report', requiresArg: false },
                children: [
                    {
                        path: '/sys/staffManagement',
                        name: 'staffManagement',
                        component: () => import('@/views/sys/warehouse/staffManagement/index'),
                        meta: { title: '员工管理', icon: 'dev_report', requiresAuth: false },
                    },
                    {
                        path: '/sys/roleManagement',
                        name: 'roleManagement',
                        component: () => import('@/views/sys/warehouse/roleManagement/index'),
                        meta: { title: '角色管理', icon: 'dev_report', requiresAuth: false },
                    },
                    {
                        path: '/sys/menuManagement',
                        name: 'menuManagement',
                        component: () => import('@/views/sys/warehouse/menuManagement/index'),
                        meta: { title: '菜单管理', icon: 'dev_report', requiresAuth: false },
                    },
                    {
                        path: '/sys/departManagement',
                        name: 'departManagement',
                        component: () => import('@/views/sys/warehouse/departManagement/index'),
                        meta: { title: '部门管理', icon: 'dev_report', requiresAuth: false },
                    }
                ]
            },

            {
                path: '/ppc/material',
                name: 'ProductionMaterial',
                component: () => import('@/views/ppc/plannedProduction/index'),
                meta: { title: '生产配置', icon: 'ppc_config', requiresArg: false },
                children: [
                    {
                        path: '/ppc/plannedProduction/material',
                        name: 'materialList',
                        component: () => import('@/views/ppc/plannedProduction/ppc-material/material'),
                        meta: { title: '物料基本信息', icon: 'ppc_material', requiresArg: false },
                    },
                    {
                        path: '/ppc/plannedProduction/Bom',
                        name: 'bomList',
                        component: () => import('@/views/ppc/plannedProduction/ppc-bom/bomInfo'),
                        meta: { title: 'BOM基本信息', icon: 'ppc_bom', requiresArg: false },
                    },
                    {
                        path: '/ppc/plannedProduction/process',
                        name: 'Porcess',
                        component: () => import('@/views/ppc/plannedProduction/ppc-process/process.vue'),
                        meta: { title: '工序', icon: 'ppc_process', requiresArg: false },
                    },
                    {
                        path: '/ppc/plannedProduction/manufacturingProcedure',
                        name: 'manufacturingProcedure',
                        component: () => import('@/views/ppc/plannedProduction/processRoute/routeTest'),
                        meta: { title: '工艺路线配置', icon: 'ppc_route', requiresArg: false },
                    },
                    {
                        path: '/autocode/workshopTeam',
                        name: 'workshopTeam',
                        component: () => import('@/views/ppc/workshop/workshopTeam'),
                        meta: { title: '车间配置', icon: 'ppc_workshop_config', requiresAuth: false }
                    },
                    {
                        path: '/ppc/team',
                        name: 'team',
                        component: () => import('@/views/ppc/workshop/team'),
                        meta: { title: '班组配置', icon: 'ppc_team_config', requiresAuth: false }
                    },
                    {
                        path: '/ppc/schedul',
                        name: 'planSchedul',
                        component: () => import('@/views/ppc/planSchedul/planSchedulInfo'),
                        meta: { title: '排班配置', icon: 'ppc_planTeam_config', requiresAuth: false }
                    }
                ]
            },
            {
                path: '/sys/picture',
                name: 'picture',
                component: () => import('@/views/sys/picture/index'),
                meta: { title: '静态页面', icon: 'dev_report', requiresAuth: false },
                children: [
                    {
                        path: '/sys/orderTrack',
                        name: 'orderTrack',
                        component: () => import('@/views/sys/picture/orderTrack/index'),
                        meta: { title: '采购订单状态跟踪', icon: 'dev_report', requiresAuth: false }
                    },
                    {
                        path: '/sys/purchaseOrder',
                        name: 'purchaseOrder',
                        component: () => import('@/views/sys/picture/purchaseOrder/index'),
                        meta: { title: '申购单管理', icon: 'dev_report', requiresAuth: false }
                    },
                    {
                        path: '/sys/costObject',
                        name: 'costObject',
                        component: () => import('@/views/sys/picture/costObject/index'),
                        meta: { title: '成本对象-科目信息', icon: 'dev_report', requiresAuth: false }
                    },
                    {
                        path: '/sys/transportationCost',
                        name: 'transportationCost',
                        component: () => import('@/views/sys/picture/transportationCost/index'),
                        meta: { title: '运输费用录入', icon: 'dev_report', requiresAuth: false }
                    },
                    {
                        path: '/sys/face',
                        name: 'face',
                        component: () => import('@/views/sys/picture/face/index'),
                        meta: { title: '运输看板', icon: 'dev_report', requiresAuth: false }
                    }
                ]
            },
            {
                path: '/sys/activiti',
                name: 'activiti',
                component: () => import('@/views/sys/activiti/index'),
                hidden: false,
                meta: { title: '工作流管理', icon: 'lims_lab_prolist',requiresAuth: false},
                children: [
                    {
                    path: '/sys/activiti/deployment',
                    name: 'activiti',
                    component: () => import('@/views/sys/activiti/deployment/index'),
                    hidden: false,
                    meta: {title: '部署管理',icon: 'lims_lab_prolist',requiresAuth: false}
                },
                // {
                //     path: '/sys/workflow-chart',
                //     name: 'workflowchart',
                //     component: () => import('@/views/sys/workflow-config/workflow-chart/index'),
                //     meta: { title: '流程设计', icon: 'dev_report', requiresAuth: false }
                // },
                    {
                        path: '/sys/activiti/roles-manage',
                        name: 'roles-manage',
                        component: () => import('@/views/sys/activiti/roles-manage/index'),
                        hidden: false,
                        meta: {title: '流程角色管理',icon: 'lims_lab_prolist',requiresAuth: false}
                    },
                    {
                        path: '/sys/activiti/history-pro',
                        name: 'history-pro',
                        component: () => import('@/views/sys/activiti/history-pro/index'),
                        hidden: false,
                        meta: {title: '历史任务',icon: 'lims_lab_prolist',requiresAuth: false}
                    }
                ]
            },
            {
                root: true,
                path:'/attendance',
                component:Layout,
                redirect: '/',
                meta:{title:'考勤管理',icon:'dashboard',requiresArg:false},
                children: [
                    {
                        path:'/attendance/work-schedule',
                        component:() =>import('@/views/sys/attendance/work-schedule'),
                        hidden: false,
                        name:'workSchedule',
                        meta:{title:'排班考勤',icon:'dashboard',requiresArg:false,noCache:true}
                    },
                   {
                        path:'/attendance/clockin-list',
                        component:() =>import('@/views/sys/attendance/clockin-list'),
                        hidden: false,
                        name:'clockinList',
                        meta:{title:'签到确认',icon:'dashboard',requiresArg:false,noCache:true}
                    }
                    
                ]
            }
        ]
    }
]

