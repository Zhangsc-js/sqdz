import Layout from "../../views/layout/Layout"

export default [
    {
        root: true,
        path: '/saas-employees',
        component: Layout,
        redirect: '/',
        meta: {title: '员工权限管理', icon: 'dashboard', requiresArg: false},
            children: [
            {
                path:'/employees/pages',
                component:() =>import('@/views/employees/pages/index'),
                name:'employees-index',
                meta:{title:'员工管理',icon:'dashboard',requiresArg:false,noCache:true}
            },
            {
                path: '/details/:id',
                component:() =>import('@/views/employees/pages/details'),
                hidden: true, // 是否显示在左侧菜单
                name: 'employees-details',
                meta: { title: '员工详情',icon:'dashboard',requiresArg:false,noCache:true}
            },
            {
                path: '/settings/index',
                component:() =>import('@/views/setting/pages/index'),
                hidden: false, // 是否显示在左侧菜单
                name: 'settings-index',
                meta: { title: '角色管理',icon:'dashboard',requiresArg:false,noCache:true}
            },
            {
                path: '/permission/index',
                component:() =>import('@/views/permissions/pages/index'),
                hidden: false, // 是否显示在左侧菜单
                name: 'permission-index',
                meta: { title: '权限设置',icon:'dashboard',requiresArg:false,noCache:true}
            }
        ]
    }
    ]
