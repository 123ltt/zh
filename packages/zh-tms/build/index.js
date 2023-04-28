const routeTool = require('route-tool').default

routeTool({
  routesWritePath: './src/route.js',
  systemName: 'tms',
  watch: !process.env.npm_config_unwatch,
  apiPrefix: [
    ['$tms_base', 'ctms-provider'],
    ['$tms_provider', 'ctms-provider'],
    ['$tms_optimize', 'ctms-optimize'],
    ['$tms_trace', 'ctms-trace'],
    ['$tms_system', 'ctms-system'],
    ['$tms_forecast', 'ctms-forecast']
  ]
})
