const routeTool = require('route-tool').default

routeTool({
  routesWritePath: './src/route.js',
  systemName: 'lps',
  watch: !process.env.npm_config_unwatch,
  apiPrefix: [['$lps', 'lps']]
})
