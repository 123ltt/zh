const routeTool = require('route-tool').default

routeTool({
  routesWritePath: './src/route.js',
  systemName: 'tms',
  watch: !process.env.npm_config_unwatch,
  apiPrefix: [
    ['$ltms_base', 'ctms-provider'],
    ['$ltms_provider', 'ctms-provider'],
    ['$ltms_optimize', 'ctms-optimize'],
    ['$ltms_trace', 'ctms-trace'],
    ['$ltms_system', 'ctms-system'],
    ['$ltms_forecast', 'ctms-forecast']
  ]
})
