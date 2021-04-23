const dev = process.env.NODE_ENV !== 'production'
const withSass = require('@zeit/next-sass')
const withCSS = require('@zeit/next-css')
const withPlugins = require("next-compose-plugins")
const withTM = require('next-plugin-transpile-modules');

const withCustomWebpack = (nextConfig) => {
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
  
      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options)
      }

      return config
    }
  })
}
 

settings = withPlugins([
  [
    withCustomWebpack
  ],
  [
    withCSS,
    {
      cssModules: false,
    },
  ],
  [
    withSass,
    {
      cssModules: true,
      cssLoaderOptions: {
        //localIdentName: (dev)?"[name]__[local]___[hash:base64:128]":undefined,
        importLoaders: 1,
        localIdentName: (dev) ? "[local]____[hash:base64:32]" : undefined,
      },
    },
  ],
  [
    withTM,
    {
      transpileModules: [
        'react-date-picker'
      ],
    },
  ],
])

settings["portDev"] = 3000;
settings["portProduction"] = 3000;

module.exports = settings