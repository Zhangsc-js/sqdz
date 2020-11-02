import Layout from "../../views/layout/Layout"


export default [
    {
        root: true,
        path:'/saas-company',
        component:Layout,
        redirect: '/',
        meta:{title:'SaaS企业',icon:'dashboard',requiresArg:false},
        children: [
           {
                path:'/company/company-ctrl',
                component:() =>import('@/views/company/company-ctrl/index'),
                name:'SaaSIndex',
                meta:{title:'企业管理',icon:'dashboard',requiresArg:false,noCache:true}
            },
            {
                path:'/detail/:id',
                component:() =>import('@/views/company/company-ctrl/detail'),
                name:'SaaSDetail',
                hidden: true,
                meta:{title:'SaaS企业详情',icon:'dashboard',requiresArg:false,noCache:true}
            },
            {
                path:'/company/company-reg',
                component:() =>import('@/views/company/company-reg/index'),
                name:'SaaSRegistered',
                meta:{title:'企业注册',icon:'dashboard',requiresArg:false,noCache:true}
            },
            {
                path:'/company/departments',
                component:() =>import('@/views/company/departments/pages/index'),
                name:'SaaSDepartments',
                meta:{title:'部门管理',icon:'dashboard',requiresArg:false,noCache:true}
            }
        ]
    }

]
