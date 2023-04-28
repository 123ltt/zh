const routeTool = require('route-tool').default

routeTool({
  routesWritePath: './src/route.js',
  systemName: 'supplier',
  watch: !process.env.npm_config_unwatch,
  apiPrefix: (isSaas) => isSaas ? [['$pss', 'pss']] : [['$pss', 'platform-pss']]
})
