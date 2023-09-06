export interface IConfiguration {
  redirectUrlQueryParameter: IRedirectUrlQueryParameterConfiguration;
}

interface IRedirectUrlQueryParameterConfiguration {
  allowedHosts: string[];
  shouldEnforceHttps: boolean;
}
