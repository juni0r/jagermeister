// See http://brunch.io for documentation.
exports.files = {
  javascripts: {
    joinTo: {
      'app.js': /^app/,
      'vendor.js': /^node_modules/
    }
  },
  stylesheets: { joinTo: 'app.css' }
};

exports.plugins = {
  babel: { presets: ['latest', 'stage-0'] },
  sass: { mode: 'native' }
};

exports.npm = {
  enabled: false,
  globals: {}
};
