import Layout from "../../views/layout/Layout"

export default [
    {
        path: '/operateLog',
        component: Layout,
        redirect: '/operateLog',
        meta: { title: '操作记录', icon: 'device', requiresAuth: false },
        children: [
            {
                path: '/operateLog',
                name: '操作记录',
                component: () => import('@/views/operateLogs/index'),
                meta: { title: '操作记录', icon: '', requiresAuth: false },
            }
        ]
    }
]

