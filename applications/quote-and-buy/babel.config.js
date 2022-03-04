const gwBabelConfigFn = require('gw-build-config-babel');

/*
  To customize babel for this specific application you can do the following
  module.exports = function(api) {
    const defaultConfig = gwBabelConfigFn(api);
    // ... edit config
    return defaultConfig;
  }
 */
module.exports = gwBabelConfigFn;
