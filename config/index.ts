import { prodConfig } from './config.production';
import { devConfig } from './config.development';
import { testConfig } from './config.testing';

const env = process.env.NODE_ENV;

let envConfig;

if (env === 'development') {
  envConfig = devConfig;
} else if (env === 'production') {
  envConfig = prodConfig;
} else if (env === 'testing') {
  envConfig = testConfig;
} else {
  envConfig = devConfig;
}

export const config = envConfig;
