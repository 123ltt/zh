const routeTool = require('route-tool').default

routeTool({
  routesWritePath: './src/route.js',
  systemName: 'purchase',
  watch: !process.env.npm_config_unwatch,
  apiPrefix: isSaas => isSaas ? [['$purchase', 'ips']] : [['$purchase', 'platform-ips']]
})
