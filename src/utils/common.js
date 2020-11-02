import XLSX from 'xlsx'
import { isEmptyArray } from '@/utils/index'

export default {
    timestampToTime: (timestamp) => {
        let date = new Date(timestamp * 1000)
        let Y = date.getFullYear() + '-'
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
        let D = date.getDate() + ' '
        D = D < 10 ? '0' + D : D
        let h = date.getHours() + ':'
        let m = date.getMinutes() + ':'
        let s = date.getSeconds()
        m = m.split(':')[0] < 10 ? '0' + m : m
        s = s < 10 ? '0' + s : s
        return Y + M + D + h + m + s
    },
    transformTozTreeFormat: function (sNodes) {
        var i, l;
        var r = [];
        var tmpMap = {};
        for (i = 0, l = sNodes.length; i < l; i++) {
            tmpMap[sNodes[i].id] = sNodes[i];
        }
        for (i = 0, l = sNodes.length; i < l; i++) {
            var p = tmpMap[sNodes[i].pid];
            if (p && sNodes[i].id != sNodes[i].pid) {
                var children = this.nodeChildren(p);
                if (!children) {
                    children = this.nodeChildren(p, []);
                }
                children.push(sNodes[i]);
            } else {
                r.push(sNodes[i]);
            }
        }
        return r;
    },
    devTransformTozTreeFormat: function (sNodes) {
        var i, l;
        var r = [];
        var tmpMap = {};
        for (i = 0, l = sNodes.length; i < l; i++) {
            tmpMap[sNodes[i].proccode] = sNodes[i];
        }
        for (i = 0, l = sNodes.length; i < l; i++) {
            var p = tmpMap[sNodes[i].pproccode];
            if (p && sNodes[i].proccode != sNodes[i].pproccode) {
                var children = this.nodeChildren(p);
                if (!children) {
                    children = this.nodeChildren(p, []);
                }
                children.push(sNodes[i]);
            } else {
                r.push(sNodes[i]);
            }
        }
        return r;
    },
    nodeChildren: function (node, newChildren) {
        if (typeof newChildren !== 'undefined') {
            node.children = newChildren;
        }
        return node.children;
    }
}

/**
 * 前端导出Excel
 * @param { String: 导出文件名 } fileName
 * @param {
 *  Object: {
 *  kye:String 导出字段名
 *  value:String 字段中文名
 *  }
 * } fields
 * @param { Array: 导出原始数据 } data
 */
export function exportExcel(fileName, fields, data) {
    if (isEmptyArray(data)) {
        throw new Error("请检查数据,导出数据不能为空");
    }
    const cloumns = Object.keys(fields);
    let exportData = [];
    // 过滤非必要字段
    for (let i of data) {
        i = Object.keys(i).filter(e => cloumns.includes(e))
            .reduce((obj, key) => {
                obj[key] = i[key]
                return obj
            }, {});
        exportData.push(i);
    }
    let sheet = XLSX.utils.json_to_sheet(exportData, { header: cloumns });
    // 设置表头
    const range = XLSX.utils.decode_range(sheet['!ref']);
    for (let c = range.s.c; c <= range.e.c; c++) {
        const header = XLSX.utils.encode_col(c) + '1';
        sheet[header].v = fields[sheet[header].v];
    }
    // 宽度自适应
    autoWidth(sheet, exportData, cloumns);
    startDownload(sheet2blob(sheet), `${fileName}.xlsx`);
}

/**
 * 单元格自适应宽度
 * @param { WorkSheet: 工作簿 } ws
 * @param { Array: 过滤后数据 } data
 * @param { Array: field的字段key } cloumns
 */
function autoWidth(ws, data, cloumns) {
    // 遍历data找到最长的列的宽度
    let result = {}
    for (let c of cloumns) {
        Object.assign(result, { [c]: 10 })
    }
    for (let row of data) {
        for (let c of cloumns) {
            if (row[c] == null) {
                continue
            } else if (row[c].toString().charCodeAt(0) > 255) {
                if (row[c].toString().length * 2 > result[c]) {
                    Object.assign(result, { [c]: row[c].toString().length * 2 })
                }
            } else {
                if (row[c].toString().length > result[c]) {
                    Object.assign(result, { [c]: row[c].toString().length })
                }
            }
        }
    }
    // 设置excel单元格宽度
    let colWidth = []
    for (let r of cloumns) {
        colWidth.push({
            'wch': result[r]
        })
    }
    ws['!cols'] = colWidth;
}

/**
 * 将一个sheet转成最终的excel文件的blob对象，然后利用URL.createObjectURL下载
 * @param { WorkSheet: 工作簿 } sheet
 * @param { String: 工作簿名称 } sheetName
 */
function sheet2blob(sheet, sheetName) {
    sheetName = sheetName || 'sheet1';
    let workbook = {
        SheetNames: [sheetName],
        Sheets: {}
    };
    workbook.Sheets[sheetName] = sheet; // 生成excel的配置项
    let wopts = {
        bookType: 'xlsx', // 要生成的文件类型
        bookSST: false,
        type: 'binary'
    };
    let wbout = XLSX.write(workbook, wopts);
    let blob = new Blob([s2ab(wbout)], {
        type: "application/octet-stream"
    });
    // 字符串转ArrayBuffer
    function s2ab(s) {
        let buf = new ArrayBuffer(s.length);
        let view = new Uint8Array(buf);
        for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }
    return blob;
}

function startDownload(url, saveName) {
    if (typeof url == 'object' && url instanceof Blob) {
        // 创建blob地址
        url = URL.createObjectURL(url);
    }
    let aLink = document.createElement('a');
    aLink.href = url;
    aLink.download = saveName || '';
    let event;
    if (window.MouseEvent) {
        event = new MouseEvent('click');
    } else {
        event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    }
    aLink.dispatchEvent(event);
}

/**
 * 数组合并+去重
 * @param arr1
 * @param arr2
 * @returns {*}
 */
export function concatAndUniqueArr(arr1, arr2) {
    for (let i = 0; i < arr2.length; i++) {
        if (arr1.indexOf(arr2[i]) == -1) {
            arr1.push(arr2[i])
        }
    }
    return arr1;
}

/**
 * 数据字典的option转EditTable中的option类型
 * @param data
 * @returns {*}
 */
export function dict2Edit(data) {
    for (let i = 0; i < data.length; i++) {
        data[i].value = data[i].code
    }
    return data
}

/**
 * 判定是否数字
 * @param s
 * @returns {boolean}
 */
export function isNumber(s) {
    try {
        return parseFloat(s) == s;
    } catch (e) {
        return false;
    }
}

/**
 * 重置查询条件
 * @param queryForm
 */
export function resetQueryForm(_this, queryForm = 'queryForm', init = 'getData') {
    _this.$refs[queryForm].resetFields()
    init && _this[init]()
}

/**
 * 默认展开第一个
 * @param queryForm
 */
export function setDefaultExpanded(_this) {
    if (!_this.treeData[0] || !_this.treeData[0].children || _this.treeData[0].children.length == 0) {
        return;
    }
    _this.defaultExpanded = [_this.treeData[0].children[0].id];
    let node = _this.treeData[0].children[0];
    for (let i = 0; i < 5; i++) {
        if (node.children) {
            if (node.children.length > 0) {
                _this.defaultExpanded.push(node.children[0].id);
                node = node.children[0];
            }
        } else {
            break;
        }
    }
}

export function getObjectData(data){
    Object.keys((obj)=>{
        console.log(obj)
        debugger
    })
}


export function getUnitString(value) {
    const data = {
        0: '',
        1: '*10',
        2: '*10²',
        3: '*10³',
        4: '*10⁴',
        5: '*10^5',
        6: '*10^6',
        7: '*10^7',
        8: '*10^8',
        9: '*10^9',
    }
    return data[value];
}
