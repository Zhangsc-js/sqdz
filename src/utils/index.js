export function parseTime(time, cFormat) {
    if (arguments.length === 0) {
        return null
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
        date = time
    } else {
        if (('' + time).length === 10) time = parseInt(time) * 1000
        date = new Date(time)
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    }
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key]
        // Note: getDay() returns 0 on Sunday
        if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
        if (result.length > 0 && value < 10) {
            value = '0' + value
        }
        return value || 0
    })
    return time_str
}

export function formatTime(time, option) {
    time = +time * 1000
    const d = new Date(time)
    const now = Date.now()

    const diff = (now - d) / 1000

    if (diff < 30) {
        return '刚刚'
    } else if (diff < 3600) {
        // less 1 hour
        return Math.ceil(diff / 60) + '分钟前'
    } else if (diff < 3600 * 24) {
        return Math.ceil(diff / 3600) + '小时前'
    } else if (diff < 3600 * 24 * 2) {
        return '1天前'
    }
    if (option) {
        return parseTime(time, option)
    } else {
        return (
            d.getMonth() +
            1 +
            '月' +
            d.getDate() +
            '日' +
            d.getHours() +
            '时' +
            d.getMinutes() +
            '分'
        )
    }
}

export function debounce(func, wait, immediate) {
    let timeout, args, context, timestamp, result

    const later = function () {
        // 据上一次触发时间间隔
        const last = +new Date() - timestamp

        // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
        if (last < wait && last > 0) {
            timeout = setTimeout(later, wait - last)
        } else {
            timeout = null
            // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
            if (!immediate) {
                result = func.apply(context, args)
                if (!timeout) context = args = null
            }
        }
    }

    return function (...args) {
        context = this
        // 获取当前时间戳
        timestamp = +new Date()
        const callNow = immediate && !timeout
        // 如果延时不存在，重新设定延时
        if (!timeout) timeout = setTimeout(later, wait)
        if (callNow) {
            result = func.apply(context, args)
            context = args = null
        }

        return result
    }
}

/**
 * 将日期格式化为执行类型
 * @param { String | Date | Number } date
 * @param { String } reg
 * @returns { date } reg
 */
export function simpleDateFormat(date, reg) {
    if (date == null || date.length === 0) {
        return null
    }
    if (typeof date === 'string' || date instanceof String
        || typeof date === 'number' || date instanceof Number) {
        date = new Date(date)
    }
    if (!reg) reg = 'yyyy:MM:dd HH:mm:ss'
    const o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'H+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        'q+': Math.floor((date.getMonth() + 3) / 3),
        'S': date.getMilliseconds()
    }
    if (/(y+)/.test(reg)) {
        reg = reg.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (let k in o) {
        if (new RegExp('(' + k + ')').test(reg)) {
            reg = reg.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        }
    }
    return reg
}

/**
 * 返回日期Date类型，传入相对天数，空=当天，1=明天，-1=昨天,以此类推
 * @param days
 * @returns {Date}
 */
export function getDate(days) {
    var now = new Date();
    if (!days || days == 0) {
        return now;
    } else {
        now.setTime(now.getTime() + parseInt(days) * 1000 * 60 * 60 * 24)
        return now
    }
}

export function isEmpty(str) {
    return str === '' || str === null || str === undefined
}

export function isNotEmpty(str) {
    return !isEmpty(str)
}

export function isExternal(path) {
    return /^(https?:|mailto:|tel:)/.test(path)
}

export function isEmptyArray(arr) {
    if (arr && arr instanceof Array && arr.length > 0) {
        return false
    }
    return true
}


export function hasBtn(btnName) {
    let btnList = JSON.parse(sessionStorage.getItem('btnList'))
    // 如果btnName是数组
    if (btnName.constructor == Array) {
        // 计数器
        let count = 0
        btnName.forEach(item => {
            if (item && btnList && btnList.indexOf(item) > -1) {
                count = count + 1
            }
        })
        // 判断计数器长度
        if (count > 0) {
            return true
        } else {
            return false
        }
    } else {
        if (btnName && btnList && btnList.indexOf(btnName) > -1) {
            return true
        }
        return false
    }
}
