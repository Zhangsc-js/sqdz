import echarts from 'echarts'

const grid = {
    top: "15px",
    left: "45",
    right: "4%",
    bottom: "20",
    containLabel: false,
}

const tooltip = {
    trigger: "item",
    formatter: "{a} <br/>{b} : {c}",
}

const defaultColor = [
    ['#18a5ee', '#3351da'],
    ["#00ffa7", "#00d3e4"],
    ["#808000", "#FFFF00"],
    ['#EEE8AA', '#F0E68C'],
    ["#3CB371", "#2E8B57"],
    ['#ADD8E6', '#B0E0E6'],
    ["#87CEEB", "#00BFFF"],
    ['#D4F2E7', '#00CED1'],
    ['#F0F8FF', '#4682B4'],
    ["#7B68EE", "#6A5ACD"],
    ['#DDA0DD', '#EE82EE'],
    ["#BA55D3", "#9400D3"],
    ['#3CB371', '#2E8B57'],
    ["#ADFF2F", "#F5F5DC"],
    ['#18a5ee', '#3351da'],
    ["#FFF8DC", "#DAA520"],
]
// 表格的 柱状图
export function girdEchartOption(f = { id, x, y, name, unit, colors, rorate, legend, axisLabel, max }) {

    const { id, x = [], y = [], name = [], unit = '', colors = defaultColor, rorate = false, legend = false, axisLabel = {}, max = "" } = f;
    let chart = echarts.init(document.getElementById(id))
    let option = {
        tooltip,
        calculable: true,
        grid,

        color: ["#115380", "#008912"],
        legend: legend ? {
            right: 10,
            top: 0,
            data: name,
            itemWidth: 8, // 设置宽度
            itemHeight: 10, // 设置高度
            textStyle: {
                color: "#fff",
                fontSize: 10,
            },
        } : null,
        xAxis: [
            {
                type: "category",
                axisTick: {
                    show: false, //去刻度线
                },
                splitLine: {
                    show: false,
                },
                data: x,
                axisLine: {
                    lineStyle: {
                        color: "#fff", // 颜色
                    },
                },
                axisLabel: {
                    //interval: 0, //横轴信息全部显示
                    rotate: axisLabel.rotate || 0,
                    rotate: 0,
                    textStyle: {
                        fontSize: 12, // 让字体变大
                    },
                },
            },
        ],
        yAxis: [
            {
                splitNumber: 5, //y轴最大间隔
                axisTick: {
                    show: false, //去刻度线
                },
                type: "value",
                name: unit,
                nameTextStyle: {
                    color: "#fff"
                },
                splitLine: {
                    show: false,
                    lineStyle: {
                        // type: "dashed",
                        color: "#33466a",
                    },
                },
                axisLine: {
                    lineStyle: {
                        color: "#fff", // 颜色
                        // width: 0
                    },
                },
                max: max || 'dataMax',

                axisLabel: {
                    //调整x轴的lable
                    show: true,
                    color: '#fff',
                    fontSize: 12,
                    textStyle: {
                        fontSize: 12, // 让字体变大
                    },
                },
            },
        ],
        series: y.map((e, i) => {
            console.log(name[i]);
            return {
                name: name[i],
                type: 'bar',
                barWidth: 10,
                data: e,
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: colors[i][0],
                            },
                            {
                                offset: 1,
                                color: colors[i][1],
                            },
                        ]),
                        shadowColor: "#18a5ee",
                        shadowBlur: 10,
                    },
                },
            }
        })
    };
    chart.clear()
    chart.setOption(option);
}



// 折线图的设置

const lineColor = [
    ['#18a5ee', '#3351da'],
    ["#00ffa7", "#00d3e4"],
    ['#D4F2E7', '#00CED1'],
    ["#808000", "#FFFF00"],
    ['#EEE8AA', '#F0E68C'],
    ["#3CB371", "#2E8B57"],
    ['#ADD8E6', '#B0E0E6'],
    ["#87CEEB", "#00BFFF"],
    ['#F0F8FF', '#4682B4'],
    ["#7B68EE", "#6A5ACD"],
    ['#DDA0DD', '#EE82EE'],
    ["#BA55D3", "#9400D3"],
    ['#3CB371', '#2E8B57'],
    ["#ADFF2F", "#F5F5DC"],
    ['#18a5ee', '#3351da'],
    ["#FFF8DC", "#DAA520"],
];

export function girdLineEchartOptions(f = { id, x, nameX, y, name, unit, colors, rorate, legend, max, t }) {

    const { id, x = [], y = [], nameX, name = [], unit = '', colors = lineColor, rorate = false, legend = false, max = 0, t } = f;
    let chart = echarts.init(document.getElementById(id));
    let option = {
        tooltip: t ? t : tooltip,
        grid,
        calculable: true,
        // grid:{top:'20%',bottom:'20%'},
        legend: legend ? {
            right: 10,
            top: -5,
            data: name,
            itemWidth: 8, // 设置宽度
            itemHeight: 10, // 设置高度
            textStyle: {
                color: "#fff",
                fontSize: 10,
            },
        } : null,
        xAxis: {
            axisTick: {
                show: false, //去刻度线
            },
            nameX: nameX ? nameX : null,
            type: "category",
            splitLine: {
                show: false,
            },
            data: x,
            nameTextStyle: {
                fontSize: 14,
            },
            axisLine: {
                lineStyle: {
                    color: "#fff", // 颜色
                },
            },
            axisLabel: {
                //  interval: 0, //横轴信息全部显示
                fontSize: 12,
                textStyle: {
                    fontSize: 12, // 让字体变大
                },
            },
        },
        yAxis: {
            name: unit,
            max: max || 'dataMax',
            nameTextStyle: {
                color: "#fff"
            },
            // nameLocation :"center",
            splitNumber: 5, //y轴最大间隔
            axisTick: {
                show: false, //去刻度线
            },
            // type: "value",
            // nameLocation: "end",
            // nameTextStyle: {
            //   padding: [0, 0, 0, 850],
            //   fontSize: "16px",
            // },
            splitLine: {
                show: false,
            },
            axisLine: {
                lineStyle: {
                    color: "#fff", // 颜色
                },
            },
            axisLabel: {
                //调整x轴的lable
                textStyle: {
                    fontSize: 12, // 让字体变大
                },

                showMinLabel: true,
                showMaxLabel: true,
            },
        },
        series: y.map((e, i) => {
            return {
                name: name[i],
                type: "line",
                data: e,
                symbol: "circle",
                symbolSize: 8,
                itemStyle: {
                    normal: {
                        color: colors[i][0],
                        shadowColor: colors[i][1],
                        shadowBlur: 10,
                    },
                },
            };
        }),
    }
    chart.setOption(option);
}


// 普通圆环圆环的option

const yuanColor = ["#02d6fc", "#367bec"];

export function yuanEchartOption(f) {

    const { id, value, colors = yuanColor } = f;
    let chart = echarts.init(document.getElementById(id));
    let option = {
        title: {
            text: value + "%",
            x: "center",
            y: "center",
            textStyle: {
                fontWeight: "normal",
                color: "#fff",
                fontSize: "14",
            },
        },
        color: ["#282c40"],
        legend: {
            show: false,
            data: [],
        },
        series: [
            {
                name: "Line 1",
                type: "pie",
                clockWise: true,
                center: ["50%", "50%"],
                radius: ["70%", "80%"],
                itemStyle: {
                    normal: {
                        label: {
                            show: false,
                        },
                        labelLine: {
                            show: false,
                        },
                    },
                },
                hoverAnimation: false,
                data: [
                    {
                        value: value,
                        name: "",
                        itemStyle: {
                            normal: {
                                color: {
                                    // 完成的圆环的颜色
                                    colorStops: [
                                        {
                                            offset: 0,
                                            color: colors[0], // 0% 处的颜色
                                        },
                                        {
                                            offset: 1,
                                            color: colors[1], // 100% 处的颜色
                                        },
                                    ],
                                },
                                label: {
                                    show: false,
                                },
                                labelLine: {
                                    show: false,
                                },
                            },
                        },
                    },
                    {
                        name: "",
                        value: 100 - value,
                    },
                ],
            },
        ],
    }
    chart.setOption(option);
}



// 半圆的echart 比例
export function banyuanEchartOption(f) {
    const { id, value, name } = f
    let chart = echarts.init(document.getElementById(id));
    var currentAngle = 180 - (180 * value / 100);
    var currentSplitNumber = Math.round(value / 100 * 36);
    const option = {
        series: [
            {
                center: ["50%", "60%"], //仪表的位置
                name: "刻度", //仪表的名字
                type: "gauge", //统计图类型为仪表
                radius: "100%", //统计图的半径大小
                min: 0, //最小刻度
                max: 10, //最大刻度
                splitNumber: 1, //刻度数量
                startAngle: 180, //开始刻度的角度
                endAngle: 0, //结束刻度的角度
                axisLine: {
                    //设置默认刻度盘上的刻度不显示，重新定义刻度盘
                    show: false,
                    lineStyle: {
                        width: 1,
                        color: [[1, "rgba(255,255,255,0)"]],
                    },
                }, //仪表盘轴线
                axisLabel: {
                    //仪表盘上的数据
                    show: false,
                    color: "#4d5bd1", //仪表盘上的轴线颜色
                    distance: 1, //图形与刻度的间距
                }, //刻度标签。
                axisTick: {
                    show: true,
                    splitNumber: 36, //刻度的段落数
                    lineStyle: {
                        color: "#123862",
                        width: 2, //刻度的宽度
                        // shadowColor: '#67FFFC',
                        // shadowBlur: 2
                    },
                    length: 8, //刻度的长度
                }, //刻度样式
                pointer: {
                    //表盘上的指针
                    show: false,
                },
                itemStyle: {
                    color: "#18c8ff",
                },
                data: [
                    {
                        name: "",
                        value: 7.78,
                    },
                ],
                splitLine: {
                    //文字和刻度的偏移量
                    show: true,
                    length: 5, //便宜的长度
                    lineStyle: {
                        color: "#123862",
                        width: 1,
                        // shadowColor: '#67FFFC',
                        // shadowBlur: 4
                    },
                }, //分隔线样式
            },
            {
                type: "gauge", //刻度轴表盘
                radius: "100%", //刻度盘的大小
                center: ["50%", "60%"], //刻度盘的位置
                splitNumber: 1, //刻度数量
                startAngle: 180, //开始刻度的角度
                endAngle: currentAngle, //结束刻度的角度
                z: 10,
                pointer: {
                    //表盘上的指针
                    show: false,
                },
                axisLine: {
                    //设置默认刻度盘上的刻度不显示，重新定义刻度盘
                    show: false,
                    lineStyle: {
                        width: 2,
                        color: [[1, "rgba(255,255,255,0)"]],
                    },
                }, //仪表盘轴线
                //分隔线样式。
                splitLine: {
                    //表盘上的轴线
                    show: true,
                    length: 5, //便宜的长度
                    lineStyle: {
                        width: 1,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: "#0b70b0",
                            },
                            {
                                offset: 1,
                                color: "#65f794",
                            },
                        ]),
                        // shadowBlur: 2,
                        // shadowColor: '#E55125'
                    },
                },
                axisLabel: {
                    //表盘上的刻度数值文字
                    show: false,
                },
                axisTick: {
                    //表盘上的刻度线
                    show: true,
                    splitNumber: currentSplitNumber, //刻度的段落数
                    lineStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: "#0b70b0",
                            },
                            {
                                offset: 1,
                                color: "#65f794",
                            },
                        ]),
                        width: 1, //刻度的宽度
                        // shadowBlur: 2,
                        // shadowColor: '#E55125'
                    },
                    length: 8, //刻度的长度
                },
                title: {
                    //标题
                    show: true,
                    offsetCenter: [0, 30], // x, y，单位px
                    textStyle: {
                        color: "#fff",
                        fontSize: 14, //表盘上的标题文字大小
                        fontWeight: 400,
                    },
                },
                //仪表盘详情，用于显示数据。
                detail: {
                    show: true,
                    offsetCenter: [0, 0],
                    color: "#ccc",
                    formatter: function (params) {
                        return (value || 0) + "%";
                    },
                    textStyle: {
                        fontSize: 16,
                        color: "#67FFFC",
                        fontWeight: 400,
                        shadowBlur: 10,
                        shadowColor: "#fff",
                    },
                },
                data: [
                    //当前数值的数据
                    {
                        name: name,
                        value: value,
                    },
                ],
            },
        ],
    }
    chart.setOption(option);
}


// 带区域的

const areaColors = [
    ['#115380', '#00b3cf', '#115380'],
    ['#115380', '#00b3cf', '#115380'],
    ['#115380', '#00b3cf', '#115380'],
    ['#115380', '#00b3cf', '#115380'],
    ['#115380', '#00b3cf', '#115380'],
    ['#115380', '#00b3cf', '#115380'],
    ['#115380', '#00b3cf', '#115380'],
    ['#115380', '#00b3cf', '#115380'],
    ['#115380', '#00b3cf', '#115380'],
    ['#115380', '#00b3cf', '#115380'],
    ['#115380', '#00b3cf', '#115380'],
    ['#115380', '#00b3cf', '#115380'],
    ['#115380', '#00b3cf', '#115380'],
    ['#115380', '#00b3cf', '#115380'],
    ['#115380', '#00b3cf', '#115380'],
    ['#115380', '#00b3cf', '#115380'],
    ['#115380', '#00b3cf', '#115380'],
    ['#115380', '#00b3cf', '#115380'],
    ['#115380', '#00b3cf', '#115380'],
    ['#115380', '#00b3cf', '#115380'],
]

export function areaLineEchart(f) {

    const { id, name = [], x = [], y = [], colors = areaColors, unit, rorate = false } = f;
    let chart = echarts.init(document.getElementById(id));
    const option = {
        tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c}",
        },
        legend: {
            right: 10,
            top: -5,
            itemWidth: 8, // 设置宽度
            itemHeight: 10, // 设置高度
            textStyle: {
                color: "#fff",
                fontSize: 10,
            },
        },
        calculable: true,
        grid,
        xAxis: [
            {
                type: "category",
                axisTick: {
                    show: false, //去刻度线
                },
                splitLine: {
                    show: false,
                },
                data: x,
                nameTextStyle: {
                    fontSize: 12,
                },
                axisLine: {
                    lineStyle: {
                        color: "#fff", // 颜色
                    },
                },
                axisLabel: {
                    interval: 0, //横轴信息全部显示
                    textStyle: {
                        fontSize: 12, // 让字体变大
                    },
                },
            },
        ],
        yAxis: [
            {
                splitNumber: 5, //y轴最大间隔
                axisTick: {
                    show: false, //去刻度线
                },
                type: "value",
                name: "",
                splitLine: {
                    show: false,
                },
                axisLine: {
                    lineStyle: {
                        color: "#fff", // 颜色
                    },
                },
                axisLabel: {
                    //调整x轴的lable
                    textStyle: {
                        fontSize: 12, // 让字体变大
                    },
                },
            },
        ],
        series: y.map((e, i) => (
            {
                name: name[i],
                // type: 'bar',
                type: "line",
                barWidth: 10,
                data: e,
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: colors[i][0],
                            },
                            {
                                offset: 1,
                                color: colors[i][1],
                            },
                        ]),
                        shadowColor: colors[i][2],
                        shadowBlur: 10,
                    },
                },

                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: colors[i][0],
                            },
                            {
                                offset: 1,
                                color: colors[i][1],
                            },
                        ]),
                        shadowColor: colors[i][2],
                        shadowBlur: 10,
                    },
                },
            }
        )),
    }
    chart.setOption(option);
}



const sanKeyColor = ['#FFA500', '#FFFF00', '#00BFFF', '#4169E1', '#9400D3', '#FFE4C4', '#C0C0C0', '#1E90FF'];



export function sanKeyOption(s) {

    const { id = '', f = [], fontSize = 12 } = s
    // 获取到只存在source 的name ， 获取到只存在 target 中的
    let data = f.map((x) => ({ ...x, value: x.flow, }));
    let name = data
        .map((x) => x.target)
        .concat(data.map((x) => x.source));
    name = [...new Set(name)];
    let chart = echarts.init(document.getElementById(id));

    let targetMap = new Map();
    data.forEach(x => {
        targetMap.set(x.target, x);
    })
    let onlySourceData = [];
    data.forEach(x => {
        if (targetMap.get(x.source) === undefined) {
            onlySourceData.push(x.source);
        }
    })
    onlySourceData = [...new Set(onlySourceData)];
    name = name.map(x => {
        let value = 0;
        if (onlySourceData.indexOf(x) != -1) {
            data.forEach(j => {
                if (j.source === x) {
                    value = j.flow + value;
                }
            })
        } else {
            data.forEach(j => {
                if (j.target === x) {
                    value = j.flow + value;
                }
            })
        }
        value = value.toFixed(2);
        return { name: x, value: value, color: sanKeyColor[Math.floor((Math.random() * sanKeyColor.length))] }
    });
    data = data.map(x => ({ ...x, lineStyle: { color: sanKeyColor[Math.floor((Math.random() * sanKeyColor.length))] } }));
    console.log(name, data);

    let option = {
        color: sanKeyColor,
        series: {
            type: "sankey",
            data: name,
            nodeAlign: 'left',
            focusNodeAdjacency: true,
            emphasis: {
                lineStyle: {
                    opacity: 1
                }
            },
            links: data,
            nodeGap: 16,
            lineStyle: {
                curveness: 0.5,
                opacity: 1,
            },
            label: {
                color: "#ffffff",
                fontSize: fontSize,
                formatter: '{b}: {c}'
            },
        },
        tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove'
        },
        grid,
    };
    chart.setOption(option);
}


export function pointOneChartFun(value, allValue, id) {
    let percent1 = 80;
    // (allValue/0.8*100).toFixed(1)
    let percent2 = (value / allValue * 80).toFixed(1);
    console.log(percent2)

    let echart = echarts.init(document.getElementById(id));

    let option = {
        tooltip: {
            formatter: "{a} <br/>{b} : {c}%",
        },
        series: [
            {
                center: ["50%", "60%"], //仪表的位置
                name: `刻度${value}`, //仪表的名字
                type: "gauge", //统计图类型为仪表
                radius: "80%", //统计图的半径大小
                min: 0, //最小刻度
                max: 100, //最大刻度
                splitNumber: 4, //刻度数量
                axisLine: {
                    // 坐标轴线
                    lineStyle: {
                        // 属性lineStyle控制线条样式
                        color: [
                            [0.8, "#1e90ff"],
                            [1, "red"],
                        ],
                        width: 3,
                        shadowColor: "#fff", //默认透明
                        shadowBlur: 10,
                    },
                },
                axisLabel: {
                    //仪表盘上的数据
                    show: true,
                    color: "#4d5bd1", //仪表盘上的轴线颜色
                    distance: 1, //图形与刻度的间距

                    interval: 25, //横轴信息全部显示
                    textStyle: {
                        fontSize: 7, // 让字体变大
                    },
                    fontWeight: "bolder",
                    color: "#00c1de",
                    shadowColor: "#fff", //默认透明
                    shadowBlur: 10,
                }, //刻度标签。
                axisTick: {
                    show: true,
                    splitNumber: 4, //刻度的段落数
                    lineStyle: {
                        color: "#123862",
                        width: 2, //刻度的宽度
                        // shadowColor: '#67FFFC',
                        // shadowBlur: 2
                    },
                    length: 2, //刻度的长度
                }, //刻度样式
                pointer: {
                    //表盘上的指针
                    show: true,
                    length: "100%",
                    width: 2,
                },

                detail: {
                    formatter: function (value) {
                        return value + "%";
                    },
                    color: "#fff",
                    fontSize: 10,
                },
                itemStyle: {
                    color: "#18c8ff",
                },
                data: [
                    {
                        name: "总值",
                        value: percent2,
                    },
                ],
                splitLine: {
                    //文字和刻度的偏移量
                    show: true,
                    length: 5, //便宜的长度
                    lineStyle: {
                        color: "#123862",
                        width: 1,
                        // shadowColor: '#67FFFC',
                        // shadowBlur: 4
                    },
                }, //分隔线样式
            },
        ],
    }
    echart.setOption(option);
}



//  两个圆圈的echart
export function twoPieEchartOption(f) {
    const { id, inData = [], outData = [], name = ['', ''], width = [['0%', '40%'], ['60%', '80%']], showLabel = true, legend = false, position = 'outside' } = f;

    let echart = echarts.init(document.getElementById(id));

    let legendData = inData.map(x => x.name);
    legendData = legendData.concat(outData.map(x => x.name));

    const option = {
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} <br/> ({d}%)'
        },
        legend: legend ? {
            orient: 'vertical',
            left: 'left',
            data: legendData,
            textStyle: {
                color: '#ffffff',
                fontSize: 16,
            }
        } : null,
        color: ['#FFA500', '#FFFF00', '#00BFFF', '#4169E1', '#9400D3', '#FFE4C4', '#C0C0C0', '#1E90FF', '#DDA0DD'],
        series: [
            {
                name: name[0],
                hoverAnimation: false,
                position: position,
                type: 'pie',

                selectedMode: 'single',
                radius: width[0],
                label: {
                    show: showLabel,
                    position: 'inner',
                    fontSize: 12,
                },
                labelLine: {
                    show: false
                },
                data: inData,
            },
            {
                name: name[1],
                hoverAnimation: false,
                position: position,
                type: 'pie',
                radius: width[1],
                label: {

                    show: showLabel,
                    position: position,
                    fontSize: 16,
                    show: showLabel,
                    formatter: '{b|{b}}{c}  {per|{d}%}',

                    borderRadius: 4,
                    rich: {
                        a: {
                            color: '#999',
                            lineHeight: 22,
                            align: 'center'
                        },
                        hr: {
                            borderColor: '#aaa',
                            width: '100%',
                            borderWidth: 0.5,
                            height: 0
                        },
                        b: {
                            fontSize: 16,
                            lineHeight: 33
                        },
                        d: {
                            fontSize: 16,
                            lineHeight: 33
                        },
                    }
                },
                labelLine: {
                    show: true,
                    normal: {
                        length: 20,
                    }
                },
                data: outData,
            }
        ]
    };

    echart.setOption(option);

}



//  单个圆圈的echart
export function onePieEchartOption(f) {
    const { id, inData = [], name = '', width = '100%', showLabel = true, legend = false, position = 'outside', isRed } = f;
    let echart = echarts.init(document.getElementById(id));

    let legendData = inData.map(x => x.name);

    const option = {
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} <br/> ({d}%)'
        },
        legend: legend ? {
            orient: 'vertical',
            left: 'left',
            data: legendData,
            textStyle: {
                color: '#ffffff',
                fontSize: 16,
            }
        } : null,
        color: ['#FFA500', '#FFFF00', '#00BFFF', '#4169E1', '#9400D3', '#FFE4C4', '#C0C0C0', '#1E90FF', '#DDA0DD'],
        series: [
            {
                left: '20%',
                name: name,
                selectedOffset: 0,
                hoverAnimation: false,
                avoidLabelOverlap: true,
                type: 'pie',
                selectedMode: 'single',
                radius: [0, width],
                label: {
                    color: '#fff',
                    position: position,
                    fontSize: 16,
                    show: showLabel,
                    formatter: '{b|{b}} {c}  {per|{d}%}',

                    borderRadius: 4,
                    rich: {
                        a: {
                            lineHeight: 22,
                            align: 'center'
                        },

                        hr: {
                            borderColor: '#aaa',
                            width: '100%',
                            borderWidth: 0.5,
                            height: 0
                        },
                        b: {
                            color: '#fff',
                            fontSize: 16,
                            lineHeight: 33
                        },
                        d: {
                            fontSize: 16,
                            lineHeight: 33
                        },
                    }
                },
                labelLine: {
                    show: true,
                    normal: {
                        length: 30,
                    }
                },
                data: inData,
                itemStyle: isRed ? {
                    normal: {
                        color: function (params) {
                            //自定义颜色
                            var colorList = [
                                'lime', 'red',
                            ];
                            return colorList[params.dataIndex]
                        }
                    }
                } : null
            },

        ]
    };

    echart.setOption(option);

}


export function stackEchartOption(f) {

    const { id, x = [], y = [], name = [], unit = '', colors = defaultColor, rorate = false, legend = false, axisLabel = {}, max = "" } = f;
    let chart = echarts.init(document.getElementById(id))
    let option = {
        tooltip,
        calculable: true,
        grid,
        color: ["#115380", "#008912"],
        legend: legend ? {
            right: 5,
            top: 0,
            bottom: 10,
            data: name,
            itemWidth: 8, // 设置宽度
            itemHeight: 10, // 设置高度
            textStyle: {
                color: "#fff",
                fontSize: 10,
            },
            formatter: function (name) {
                return '';
            },
            tooltip: {
                show: true,
                formatter: function (name) {
                    console.log('name', name)
                    return name.name
                },
            }
        } : null,
        xAxis: [
            {
                type: "category",
                axisTick: {
                    show: false, //去刻度线
                },
                splitLine: {
                    show: false,
                },
                data: x,
                axisLine: {
                    lineStyle: {
                        color: "#fff", // 颜色
                    },
                },
                axisLabel: {
                    //interval: 0, //横轴信息全部显示
                    rotate: axisLabel.rotate || 0,
                    rotate: 0,
                    textStyle: {
                        fontSize: 12, // 让字体变大
                    },
                },
            },
        ],
        yAxis: [
            {
                splitNumber: 5, //y轴最大间隔
                axisTick: {
                    show: false, //去刻度线
                },
                type: "value",
                name: unit,
                nameTextStyle: {
                    color: "#fff"
                },
                splitLine: {
                    show: false,
                    lineStyle: {
                        // type: "dashed",
                        color: "#33466a",
                    },
                },
                axisLine: {
                    lineStyle: {
                        color: "#fff", // 颜色
                        // width: 0
                    },
                },
                max: max || 'dataMax',

                axisLabel: {
                    //调整x轴的lable
                    show: true,
                    color: '#fff',
                    fontSize: 12,
                    textStyle: {
                        fontSize: 12, // 让字体变大
                    },
                },
            },
        ],
        series: y.map((e, i) => {
            console.log(name[i]);
            return {
                name: name[i],
                type: 'bar',
                stack: 'all',
                barWidth: 10,
                data: e,
                itemStyle: {
                    normal: {
                        color: colors[i][0],
                        shadowColor: "#18a5ee",
                        shadowBlur: 10,
                    },
                },
            }
        })
    };
    chart.clear()
    chart.setOption(option);
}
