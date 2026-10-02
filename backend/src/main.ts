import { resolve } from 'node:path';
import { URL } from 'node:url';

import ConsoleLogger from '@jscv-solutions/node-logger';
import express, {
  type Express,
  type NextFunction,
  type Request,
  type Response
} from 'express';
import { Logger } from 'winston';

import type { IConfiguration } from './typings/config';

import { getEnvironmentVariable, validateEnvironment } from './environment';

let config: IConfiguration | null = null;
let port: Readonly<number> = 0;

const app: Express = express();
const consoleLogger: Logger = ConsoleLogger.getLogger('main', 'verbose', true);

validateEnvironment();

port = getEnvironmentVariable<number>('PORT')!;

config = {
  redirectUrlQueryParameter: {
    allowedHosts: getEnvironmentVariable<string[]>('ALLOWED_REDIRECT_HOSTS')!,
    shouldEnforceHttps: getEnvironmentVariable<boolean>('SHOULD_ENFORCE_HTTPS')!
  }
};

app.disable('x-powered-by');

app.use((request: Request, _response: Response, next: NextFunction): void => {
  consoleLogger.info(
    `Request: ${request.method} ${request.path} from ${request.ip}`
  );

  next();
});
app.use((request: Request, response: Response, next: NextFunction): void => {
  if (request.path === '/favicon.ico') {
    next();
    return;
  }

  const queryParameters = request.query;
  const redirectUrl: Readonly<string | undefined> =
    queryParameters.redirectUrl as string;

  consoleLogger.verbose('Validating redirectUrl query parameter...');

  if (!redirectUrl) {
    consoleLogger.error('Missing redirectUrl query parameter');
    response.status(400).send('Missing redirectUrl query parameter');
    return;
  }

  const urlObject: URL = new URL(redirectUrl);
  const host: Readonly<string> = urlObject.host;
  const protocol: Readonly<string> = urlObject.protocol;

  if (
    config.redirectUrlQueryParameter.shouldEnforceHttps &&
    protocol !== 'https:'
  ) {
    consoleLogger.error('Protocol must be https');
    response.status(400).send('Protocol must be https');
    return;
  }

  if (
    !config.redirectUrlQueryParameter.allowedHosts.includes('*') &&
    !config.redirectUrlQueryParameter.allowedHosts.includes(host)
  ) {
    consoleLogger.error('Host is not allowed');
    response.status(400).send('Host is not allowed');
    return;
  }

  consoleLogger.info('Valid redirectUrl query parameter');

  next();
});
app.use('/', express.static(resolve('public')));

app.get('/redirect', (request: Request, response: Response) => {
  const redirectUrl: Readonly<string> = request.query.redirectUrl as string;
  consoleLogger.info(`Redirecting to ${redirectUrl}...`);
  response.redirect(redirectUrl);
});

app.listen(port, () => consoleLogger.info(`Listening on port ${port}!`));
