const getters = {
    sidebar: state => state.app.sidebar,
    device: state => state.app.device,
    token: state => state.user.token,
    avatar: state => state.user.avatar,
    companyName: state => state.user.companyName,
    userCode: state => state.user.userCode,
    userName: state => state.user.userName,
    workCode: state => state.user.workCode,
    roles: state => state.user.roles,
    dbUrl: state => state.user.dbUrl,
    visitedViews: state => state.tagsView.visitedViews,
    cachedViews: state => state.tagsView.cachedViews,
    menu: state => state.user.menu,
    addRouters: state => state.permission.addRouters,
    permissionRouters: state => state.permission.routers,
    permission: state => state.user.permission
}
export default getters
