import Layout from "../../views/layout/Layout"

export default [
    {
        path: '/expireFile',
        component: Layout,
        redirect: '/expireFile',
        meta: { title: '过期文件', icon: 'device', requiresAuth: false },
        children: [
            {
                path: '/expireFile',
                name: '过期文件',
                component: () => import('@/views/expireFile/index'),
                meta: { title: '过期文件', icon: '', requiresAuth: false },
            }
        ]
    }
]

