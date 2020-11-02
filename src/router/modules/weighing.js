import WeighingList from '@/views/wei/weighing-list/index'
import Layout from "../../views/layout/Layout"

export default [
    {
        path: '/weighingList',
        component: Layout,
        redirect: '/',
        meta: {title: '检斤管理', icon: 'weighing', requiresArg: false},
        children: [
            {
                path: '/wei/weiDevs',
                name: 'WeighingDevice',
                component: () => import('@/views/wei/wei-tree/WeiTree'),
                meta: {title: '检斤设备管理', icon: 'wei-device', requiresArg: false}
            },
            {
                path: '/wei/metering',
                name: 'metering',
                component: () => import('@/views/wei/index'),
                meta: {title: '检斤计量管理', icon: 'wei-metering', requiresArg: false},
                children: [{
                    path: '/wei/outMetering',
                    name: 'outMetering',
                    component: () => import('@/views/wei/index'),
                    meta: {title: '出厂计量管理', icon: 'wei-outMetering', requiresArg: false},
                    children: [
                        {
                            path: '/wei/outMetering/outMeter',
                            name: 'outMeter',
                            component: () => import('@/views/wei/wei-metering/outMetering/index'),
                            meta: {title: '出厂称重', icon: 'wei-outMeter', requiresArg: false},
                        },
                        {
                            path: '/wei/outMetering/off-lin',
                            name: 'outOff-lin',
                            component: () => import('@/views/wei/wei-metering/outMetering/outMeter-add'),
                            meta: {title: '出厂脱机录入', icon: 'wei-outMeterOffline', requiresArg: false},
                        },
                        {
                            path: '/wei/outMetering/correction',
                            name: 'outCorrection',
                            component: () => import('@/views/wei/wei-metering/outMetering/outMeter-mistake'),
                            meta: {title: '出厂称错管理', icon: 'wei-outMeterMis', requiresArg: false},
                        },
                        {
                            path: '/wei/outMetering/outQuery',
                            name: 'outQuery',
                            component: () => import('@/views/wei/index'),
                            meta: {title: '出厂查询', icon: 'wei-inMeterQuery', requiresArg: false},
                            children: [
                                {
                                    path: '/wei/inMetering/outQuery/outWeiDetails',
                                    name: 'outWeiDetails',
                                    component: () => import('@/views/wei/wei-metering/outMetering/details/outMeter-details'),
                                    meta: {title: '出厂检斤明细', icon: 'dashboard', requiresArg: false},
                                },
                                // {
                                //     path: '/wei/inMetering/outQuery/outGDetails',
                                //     name: 'outGDetails',
                                //     component: () => import('@/views/wei/wei-metering/outMetering/details/outMeter-goods-details'),
                                //     meta: {title: '出厂物资明细', icon: 'dashboard', requiresArg: false},
                                // }
                            ]
                        }
                    ]
                },
                    {
                        path: '/wei/inMetering',
                        name: 'inMetering',
                        component: () => import('@/views/wei/index'),
                        meta: {title: '入厂计量管理', icon: 'wei-inMetering', requiresArg: false},
                        children: [
                            {
                                path: '/wei/inMetering/inMeter',
                                name: 'inMeter',
                                component: () => import('@/views/wei/wei-metering/inMetering/index'),
                                meta: {title: '入厂称重', icon: 'wei-outMeter', requiresArg: false},
                            },
                            {
                                path: '/wei/inMetering/off-lin',
                                name: 'inOff-lin',
                                component: () => import('@/views/wei/wei-metering/inMetering/inMeter-add'),
                                meta: {title: '入厂脱机录入', icon: 'wei-outMeterOffline', requiresArg: false},
                            },
                            {
                                path: '/wei/inMetering/correction',
                                name: 'inCorrection',
                                component: () => import('@/views/wei/wei-metering/inMetering/inMeter-mistake'),
                                meta: {title: '入厂称错管理', icon: 'wei-outMeterMis', requiresArg: false},
                            },
                            {
                                path: '/wei/outMetering/inQuery',
                                name: 'inQuery',
                                component: () => import('@/views/wei/index'),
                                meta: {title: '进厂查询', icon: 'wei-inMeterQuery', requiresArg: false},
                                children: [
                                    {
                                        path: '/wei/inMetering/inQuery/inWeiDetails',
                                        name: 'inWeiDetails',
                                        component: () => import('@/views/wei/wei-metering/inMetering/details/inMeter-details'),
                                        meta: {title: '入厂检斤明细', icon: 'dashboard', requiresArg: false},
                                    },
                                    // {
                                    //     path: '/wei/inMetering/inQuery/inGDetails',
                                    //     name: 'inGDetails',
                                    //     component: () => import('@/views/wei/wei-metering/inMetering/details/inMeter-goods-details'),
                                    //     meta: {title: '入厂物资明细', icon: 'dashboard', requiresArg: false},
                                    // }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                path: '/wei/weighingList',
                name: 'WeighingList',
                component: WeighingList,
                meta: {title: '过磅单', icon: 'wei-weighingList', requiresArg: false},
            },

            {
                path: '/wei/truck',
                name: 'WeighingCars',
                component: () => import('@/views/wei/wei-car/index'),
                meta: {title: '车辆管理', icon: 'wei-cars', requiresArg: false},
            },
            {
                path: '/wei/report',
                name: 'weiReport',
                component: () => import('@/views/wei/index'),
                meta: {title: '检斤报表', icon: 'wei-report', requiresArg: false},
                children: [
                    {
                        path: '/wei/report/flReport/inMeter',
                        name: 'inMeterFlReport',
                        component: () => import('@/views/wei/wei-report/report-fl/inMeter'),
                        meta: {title: '入厂分类统计', icon: 'wei-inReport-fl', requiresArg: false},
                    },
                    {
                        path: '/wei/report/hzReport/inMeter',
                        name: 'inMeterHzReport',
                        component: () => import('@/views/wei/wei-report/report-hz/inMeter'),
                        meta: {title: '入厂汇总统计', icon: 'wei-inReport-hz', requiresArg: false},
                    },
                    {
                        path: '/wei/report/analysis/inMeter',
                        name: 'inMeterAnalysis',
                        component: () => import('@/views/wei/wei-report/report-fx/inAnalysis'),
                        meta: {title: '入厂图表分析', icon: 'wei-inReport-tb', requiresArg: false},
                    },
                    {
                        path: '/wei/report/flReport/outMeter',
                        name: 'outMeterFlReport',
                        component: () => import('@/views/wei/wei-report/report-fl/outMeter'),
                        meta: {title: '出厂分类统计', icon: 'wei-inReport-fl', requiresArg: false},
                    },
                    {
                        path: '/wei/report/hzReport/outMeter',
                        name: 'outMeterHzReport',
                        component: () => import('@/views/wei/wei-report/report-hz/outMeter'),
                        meta: {title: '出厂汇总统计', icon: 'wei-inReport-hz', requiresArg: false},
                    },
                    {
                        path: '/wei/report/analysis/outMeter',
                        name: 'outMeterAnalysis',
                        component: () => import('@/views/wei/wei-report/report-fx/outAnalysis'),
                        meta: {title: '出厂图表分析', icon: 'wei-inReport-tb', requiresArg: false},
                    },
                    // {
                    //     path:'/wei/report/analysis/in-outMeter',
                    //     name:'in-outMeterAnalysis',
                    //     component: ()=> import('@/views/wei/wei-report/report-fx/in-out-Analysis'),
                    //     meta:{title:'出入厂对比',icon:'wei-in',requiresArg:false},
                    // },
                ]
            },
        ]
    }
]
