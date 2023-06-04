import * as webpack from 'webpack';
import * as path from 'path';

export default (environment: string, args: {mode: string, analyze: string}): webpack.Configuration => {
  const env = args.mode;
  const isProduction = env === 'production';
  const mode = isProduction ? 'production' : 'development';
  const config: webpack.Configuration = {
    mode,
    entry: {
      'index': './src/index.ts'
    },
    target: 'browserslist',
    devtool: (env === 'development') ? 'source-map' : false,
    module: {
      rules: [
        {
          test: /\.(ts)?$/,
          exclude: /(node_modules)/,
          loader: 'babel-loader',
          options: {
            cacheCompression: false,
            cacheDirectory: true,
          },
        },
      ],
    },
    optimization: {
    // Only concatenate modules in production, when not analyzing bundles.
      concatenateModules: mode === 'production' && !process.env.WP_BUNDLE_ANALYZER,
    },
    resolve: {
      extensions: ['.ts'],
    },
    experiments: {
      outputModule: true,
    },
    output: {
      path: path.join(__dirname, './dist'),
      filename: 'index.min.js',
      libraryTarget:'module'
    },
    plugins: []
  };

  /**
    * Development Components
    */
  if (!isProduction && config.module?.rules && config.plugins) {
    // See: https://webpack.js.org/configuration/devtool/#devtool.
    config.devtool = 'source-map';
    config.module.rules.unshift({
      test: /\.js$/,
      exclude: [/node_modules/],
      use: ['source-map-loader'],
      enforce: 'pre',
    });
  }

  return config;
};
