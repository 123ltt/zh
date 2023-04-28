const routeTool = require('route-tool').default

routeTool({
  routesWritePath: './src/route.js',
  systemName: 'ims',
  watch: !process.env.npm_config_unwatch,
  apiPrefix: isSaas => isSaas ? [['$ims', 'ims']] : [['$ims', 'platform-ims']]
})
