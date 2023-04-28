const routeTool = require('route-tool').default

routeTool({
  routesWritePath: './src/route.js',
  systemName: 'tms',
  watch: !process.env.npm_config_unwatch,
  apiPrefix: [
    ['$otms_base', 'ctms-provider'],
    ['$otms_provider', 'ctms-provider'],
    ['$otms_optimize', 'ctms-optimize'],
    ['$otms_trace', 'ctms-trace'],
    ['$otms_system', 'ctms-system'],
    ['$otms_forecast', 'ctms-forecast']
  ]
})
