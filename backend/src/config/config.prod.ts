import type { IConfiguration } from '../typings/config';

export const config: Readonly<IConfiguration> = {
  redirectUrlQueryParameter: {
    allowedHosts: ['babvrewritten.com'],
    shouldEnforceHttps: true
  }
};
