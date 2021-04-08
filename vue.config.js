const path = require('path');

module.exports = {
	devServer: {
		disableHostCheck: true
	},
	parallel: false,
	configureWebpack: config => {
		config.resolve.alias['qs'] = path.resolve(__dirname, 'node_modules/qs');
	},
	chainWebpack: (config) => {
		config.resolve.symlinks(false)
	}
};
