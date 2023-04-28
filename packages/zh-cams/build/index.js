const routeTool = require('route-tool').default

routeTool({
  routesWritePath: './src/route.js',
  systemName: 'permiss',
  watch: !process.env.npm_config_unwatch,
  apiPrefix: [
    ['$auth', 'cams-auth'],
    ['$ams', 'cams']
  ]
})
