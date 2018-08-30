let config = require('@ucd-lib/cork-app-build').watch({
  root : __dirname,
  entry : 'public/elements/app-3d-view.js',
  preview : 'public',
  clientModules : 'public/node_modules'
});

module.exports = config;