const path = require('path')
const baseURL = process.env.VUE_APP_URL

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: '/',
  productionSourceMap: false,
  devServer: {
    https: false,
    proxy: {
      '/api/ppc': {
        target: baseURL + ':' + process.env.VUE_APP_PPC_PORT,
        ws: false,
        proxyTimeout: 10 * 60 * 1000,
        timeout: 10 * 60 * 1000,
        changeOrigin: true
      },
      '/api/dev': {
        target: baseURL + ':' + '52000',
        //process.env.VUE_APP_DEV_PORT
        ws: false,
        proxyTimeout: 10 * 60 * 1000,
        timeout: 10 * 60 * 1000,
        changeOrigin: true
      },
      '/api/ene': {
        target: baseURL + ':' + process.env.VUE_APP_ENE_PORT,
        ws: false,
        proxyTimeout: 10 * 60 * 1000,
        timeout: 10 * 60 * 1000,
        changeOrigin: true
      },
      '/api/wei': {
        target: baseURL + ':' + process.env.VUE_APP_WEI_PORT,
        ws: false,
        proxyTimeout: 10 * 60 * 1000,
        timeout: 10 * 60 * 1000,
        changeOrigin: true
      },
      '/api/mat': {
        target: baseURL + ':' + process.env.VUE_APP_MAT_PORT,
        ws: false,
        proxyTimeout: 10 * 60 * 1000,
        timeout: 10 * 60 * 1000,
        changeOrigin: true
      },
      // '/api/mat': {
      //   target: baseURL + ':' + process.env.VUE_APP_LIMS_PORT,
      //   ws: false,
      //   proxyTimeout: 10 * 60 * 1000,
      //   timeout: 10 * 60 * 1000,
      //   changeOrigin: true
      // },
      '/api/company': {
        target: baseURL + ':' + process.env.VUE_APP_COM_PORT,
        ws: false,
        changeOrigin: true
      },
      '/api/order': {
        target: baseURL + ':' + process.env.VUE_APP_ORDER_PORT,
        ws: false,
        proxyTimeout: 10 * 60 * 1000,
        timeout: 10 * 60 * 1000,
        changeOrigin: true
      },
      '/api/play': {
        target: baseURL + ':' + process.env.VUE_APP_PLAY_PORT,
        ws: false,
        proxyTimeout: 10 * 60 * 1000,
        timeout: 10 * 60 * 1000,
        changeOrigin: true
      },
      '/api/sys': {
        target: baseURL + ':' + process.env.VUE_APP_SYS_PORT,
        ws: false,
        proxyTimeout: 10 * 60 * 1000,
        timeout: 10 * 60 * 1000,
        changeOrigin: true
      },
      '/api/snow': {
        target: baseURL + ':' + process.env.VUE_APP_SNOW_PORT,
        ws: false,
        proxyTimeout: 10 * 60 * 1000,
        timeout: 10 * 60 * 1000,
        changeOrigin: true
      },
      '/api/file': {
        target: baseURL + ':' + process.env.VUE_APP_FILE_PORT,
        ws: false,
        proxyTimeout: 10 * 60 * 1000,
        timeout: 10 * 60 * 1000,
        changeOrigin: true
      },
      '/api/wms': {
        target: baseURL + ':' + process.env.VUE_APP_WMS_PORT,
        ws: false,
        proxyTimeout: 10 * 60 * 1000,
        timeout: 10 * 60 * 1000,
        changeOrigin: true
      },
      '/resources/img': {
        target: baseURL + ':' + process.env.VUE_APP_STATIC_PORT,
        ws: false,
        proxyTimeout: 10 * 60 * 1000,
        timeout: 10 * 60 * 1000,
        changeOrigin: true
      },
      '/autherror': {
        target: "",
        ws: false,
        proxyTimeout: 10 * 60 * 1000,
        timeout: 10 * 60 * 1000,
        changeOrigin: true
      },
        '/api/overview': {
            target: baseURL + ':' + process.env.VUE_APP_THREE_PORT,
            ws: false,
            proxyTimeout: 10 * 60 * 1000,
            timeout: 10 * 60 * 1000,
            changeOrigin: true
        },
        '/api/production': {
            target: baseURL + ':' + process.env.VUE_APP_ZNSC_PORT,
            ws: false,
            proxyTimeout: 10 * 60 * 1000,
            timeout: 10 * 60 * 1000,
            changeOrigin: true
        },
        "/api/device":{
          target: baseURL + ':' + '52000',
          //process.env.VUE_APP_DEVICE_PORT,
          ws: false,
          proxyTimeout: 10 * 60 * 1000,
          timeout: 10 * 60 * 1000,
          changeOrigin: true
        },
        "/api/logistics":{
          target: baseURL + ':' + process.env.VUE_APP_LOG_PORT,
          //process.env.VUE_APP_DEVICE_PORT,
          ws: false,
          proxyTimeout: 10 * 60 * 1000,
          timeout: 10 * 60 * 1000,
          changeOrigin: true
        },
        "/api/ee":{
          target: baseURL + ':' + process.env.VUE_APP_EE_PORT,
          //process.env.VUE_APP_DEVICE_PORT,
          ws: false,
          proxyTimeout: 10 * 60 * 1000,
          timeout: 10 * 60 * 1000,
          changeOrigin: true
        },
        "/api/quality":{
          target: baseURL + ':' + process.env.VUE_APP_QUALITY_PORT,
          //process.env.VUE_APP_DEVICE_PORT,
          ws: false,
          proxyTimeout: 10 * 60 * 1000,
          timeout: 10 * 60 * 1000,
          changeOrigin: true
        },
        "/api/wl":{
          target: baseURL + ':' + process.env.VUE_APP_WL_PORT,
          //process.env.VUE_APP_DEVICE_PORT,
          ws: false,
          proxyTimeout: 10 * 60 * 1000,
          timeout: 10 * 60 * 1000,
          changeOrigin: true
        },
        "/api/bdc":{
          target: baseURL + ':' + process.env.VUE_APP_BDC_PORT,
          //process.env.VUE_APP_DEVICE_PORT,
          ws: false,
          proxyTimeout: 10 * 60 * 1000,
          timeout: 10 * 60 * 1000,
          changeOrigin: true
        },
        '/api/primary':{
          target: baseURL + ':' + process.env.VUE_APP_PRIMARY_PORT,
          //process.env.VUE_APP_DEVICE_PORT,
          ws: false,
          proxyTimeout: 10 * 60 * 1000,
          timeout: 10 * 60 * 1000,
          changeOrigin: true
        },
        //VUE_APP_ZNSC_PORT
        "/api/sys/dev":{
          target: baseURL + ':' + process.env.VUE_APP_SYS_DEV_PORT,
          //process.env.VUE_APP_DEVICE_PORT,
          ws: false,
          proxyTimeout: 10 * 60 * 1000,
          timeout: 10 * 60 * 1000,
          changeOrigin: true
        },
        "/api/sys/devoverview":{
          target: baseURL + ':' + process.env.VUE_APP_SYS_DEV_PORT,
          //process.env.VUE_APP_DEVICE_PORT,
          ws: false,
          proxyTimeout: 10 * 60 * 1000,
          timeout: 10 * 60 * 1000,
          changeOrigin: true
        },
        "/api/opc":{
          target: baseURL + ':' + process.env.VUE_APP_OPC_PORT,
          //process.env.VUE_APP_DEVICE_PORT,
          ws: false,
          proxyTimeout: 10 * 60 * 1000,
          timeout: 10 * 60 * 1000,
          changeOrigin: true
        },
        "/api/production/plan":{
          target: baseURL + ':' + "8024",
          //process.env.VUE_APP_DEVICE_PORT,
          ws: false,
          proxyTimeout: 10 * 60 * 1000,
          timeout: 10 * 60 * 1000,
          changeOrigin: true
        },
        "/api/data/singleCar":{
          
          target: baseURL + ':' + process.env.VUE_APP_single_PORT,
          ws: false,
          proxyTimeout: 10 * 60 * 1000,
          timeout: 10 * 60 * 1000,
          changeOrigin: true
        },
       "/api/opc/YQ_image":{
          
        target: baseURL + ':' + '5038',
        ws: false,
        proxyTimeout: 10 * 60 * 1000,
        timeout: 10 * 60 * 1000,
        changeOrigin: true
      },
    }
  },
  chainWebpack: config => {
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
  },
  lintOnSave: false
}
