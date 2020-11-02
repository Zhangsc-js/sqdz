// 限制输入特殊符号
import Vue from 'vue'

Vue.prototype.validForbid = function (value, number = 255) {
    value = value.replace(/[`~!@#$%^&*()_\-+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/g, '').replace(/\s/g, "");
    if (value.length >= number) {
        this.$message({
            type: "warning",
            message: `输入内容不能超过${number}个字符`
        });
    }
    return value;
}
