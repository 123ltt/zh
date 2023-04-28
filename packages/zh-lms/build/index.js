const routeTool = require('route-tool').default

routeTool({
  routesWritePath: './src/route.js',
  systemName: 'lms',
  chunkDepth: 3,
  watch: !process.env.npm_config_unwatch,
  apiPrefix: [
    ['$lmsLazada', 'lms-lazada'],
    ['$lmsAmazon', 'lms-amazon'],
    ['$lmsData', 'lms-data'],
    ['$lmsEbay', 'lms-ebay'],
    ['$lmsWish', 'lms-wish'],
    ['$lmsAliExpress', 'lms-smt'],
    ['$lmsShopee', 'lms-shopee'],
    ['$lmsWalmart', 'lms-walmart']
  ]
})
