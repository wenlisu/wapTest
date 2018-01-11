const webpack = require('atool-build/lib/webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var production = process.env.ENV === 'production';

var pkg = require('./package.json');
var theme = {};
if (pkg.theme && typeof (pkg.theme) === 'object') {
  theme = pkg.theme;
}

var conf = {
  filename: 'index.html',
  template: './src/entries/index.html',
  inject: true,
  minify: {
    removeComments: true,
    collapseWhitespace: false
  },
  hash: true,
}

module.exports = function (webpackConfig) {
  webpackConfig.babel.plugins.push('transform-runtime');
  webpackConfig.babel.plugins.push(['import', {
    libraryName: 'antd',
    style: true,
  }]);
  webpackConfig.entry = {
    index: './src/entries/index.tsx',
    flexible: './src/statics/js/flexible.js'
  };

  webpackConfig.output.publicPath = '/';

  webpackConfig.module.loaders.forEach(function (loader, index) {
    if (loader.test.toString().indexOf('html') > 0) {
      loader.loader = 'html';
    }
    if (loader.test.toString().indexOf('tsx') >= 0 || loader.test.toString().indexOf('js') >= 0) {
      loader.loaders = ['react-hot'].concat(loader.loaders);
    }
    if (!production) {
      // In dev, use style in js witch can hot reload after modify css.
      if (loader.loader && loader.loader.indexOf('extract-text-webpack-plugin') >= 0) {
        var restLoader = loader.loader.split('{"remove":true}!')[1];
        loader.loader = `style-loader!${restLoader}`;
      }
    }
  });
  webpackConfig.module.loaders.push({
    test: /\.(eot|otf|svg|ttf|woff|woff2|png|jpg|gif)\w*/,
    loader: 'file'
  });
  // webpackConfig.module.loaders.push({ test: /\.module\.scss$/,
  //   loader: 'style-loader!css?sourceMap&modules&localIdentName=[local]___[hash:base64:5]&-autoprefixer!postcss-loader!less-loader?{"sourceMap":true,"modifyVars":{"font-size-base":"15px","border-color-split":"black","text-color":"black"}}' },)
  webpackConfig.plugins.push(
    new HtmlWebpackPlugin(conf)
  );

  webpackConfig.plugins.some(function (plugin, i) {
    if (plugin instanceof webpack.optimize.CommonsChunkPlugin) {
      webpackConfig.plugins.splice(i, 1);

      return true;
    }
    if (!production && plugin instanceof ExtractTextPlugin) {
      webpackConfig.plugins.splice(i, 1);
      return true;
    }
  });
  return webpackConfig;
};
