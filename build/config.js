const config = {
  buildDetail: false,
  local: {
    BUILD_ENV: 'local',
    API_PATH: '/api',
    SUB_DIR: 'static',
    PUBLIC_PATH: '/',
    MOCK: false,
    PC_HOST: '//172.16.11.131:8866/m/',
    MOBILE_HOST: '//172.16.11.131:8866/m/',
    SAASROUTE: {
      imgHost: 'https://t-alistatic01.e.vhall.com/upload',
      watchPath: 'https://t-webinar.e.vhall.com/room/watch'
    },
    proxyTable: {
      '/api': {
        target: 'http://test-api-zhike.vhall.com',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'
        }
      }
    }
  },
  test: {
    BUILD_ENV: 'test',
    API_PATH: '/webinar/api',
    SUB_DIR: 'static',
    IMGHOST: '//test-zhike.oss-cn-beijing.aliyuncs.com',
    PUBLIC_PATH: '//static-zhike.vhall.com/fe_pc_demo_test/dist/',
    PC_HOST: '//static-zhike.vhall.com/fe_pc_demo_test/dist/',
    MOBILE_HOST: '//static-zhike.vhall.com/fe_h5_demo_test/dist/index.html#/',
    SAASROUTE: {
      imgHost: 'https://t-alistatic01.e.vhall.com/upload',
      watchPath: 'https://t-webinar.e.vhall.com/room/watch'
    }
  },
  prod: {
    BUILD_ENV: 'prod',
    API_PATH: '/webinar/api',
    SUB_DIR: 'static',
    IMGHOST: '//static.vhallyun.com',
    PUBLIC_PATH: '//static-zhike.vhall.com/fe_pc_demo_prod/dist/',
    PC_HOST: '//static-zhike.vhall.com/fe_pc_demo_prod/dist/',
    MOBILE_HOST: '//static-zhike.vhall.com/fe_h5_demo_prod/dist/index.html#/',
    SAASROUTE: {
      imgHost: 'https://cnstatic01.e.vhall.com/upload',
      watchPath: 'https://live.vhall.com/room/watch'
    }
  }
}
module.exports = config
