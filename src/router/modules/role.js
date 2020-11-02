import Layout from "../../views/layout/Layout"

export default [
    {
        root: true,
        path: '/saas-role',
        component: Layout,
        redirect: '/',
        meta: {title: '权限管理', icon: 'dashboard', requiresArg: false},
        children: [

        ]
    }
]
