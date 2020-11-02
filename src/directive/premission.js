import Vue from 'vue'

const permission = Vue.directive('has', {
    inserted: function (el, binding, vnode) {
        const value = binding.value
        if (!value || !Vue.prototype.$_hasPermission(value)) {
            el.parentNode && el.parentNode.removeChild(el)
        }
    }
})

Vue.prototype.$_hasPermission = function (value) {
    let isExiting = false
    // 把后台返回的按钮列表存在session中 ==>[aa,bb,cc]
    let btnPermission = JSON.parse(sessionStorage.getItem('btnList'))
    if (btnPermission === undefined || btnPermission === null) {
        return false
    }
    // 判断 binding.value 是否在数组btnPermission中
    for (let i = 0; i < btnPermission.length; i++) {
        if (value === btnPermission[i]) {
            isExiting = true
            break
        }
    }
    return isExiting
}

export { permission }
