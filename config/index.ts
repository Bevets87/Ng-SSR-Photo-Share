let envConfig;

if (process.env.NODE_ENV === 'development') {
  const { devConfig } = require('./config.development');
  envConfig = devConfig;
} else if (process.env.NODE_ENV === 'production') {
  const { prodConfig } = require('./config.production');
  envConfig = prodConfig;
} else if (process.env.NODE_ENV === 'testing') {
  const { testConfig } = require('./config.testing');
  envConfig = testConfig;
} else {
  const { devConfig } = require('./config.development');
  envConfig = devConfig;
}

export const config = envConfig;
