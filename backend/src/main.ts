import { resolve } from 'node:path';
import { URL } from 'node:url';

import express, {
  type Express,
  type NextFunction,
  type Request,
  type Response
} from 'express';

import type { IConfiguration } from './typings/config';

import { getEnvironmentVariable, validateEnvironment } from './environment';

let config: IConfiguration | null = null;
let port: Readonly<number> = 0;

const app: Express = express();

validateEnvironment();

port = getEnvironmentVariable<number>('PORT')!;

config = {
  redirectUrlQueryParameter: {
    allowedHosts: getEnvironmentVariable<string[]>('ALLOWED_REDIRECT_HOSTS')!,
    shouldEnforceHttps: getEnvironmentVariable<boolean>('SHOULD_ENFORCE_HTTPS')!
  }
};

app.use((request: Request, _response: Response, next: NextFunction): void => {
  console.log(`Request: ${request.method} ${request.path} from ${request.ip}`);
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

  console.log(queryParameters);

  console.group('Validating redirectUrl query parameter...');

  if (!redirectUrl) {
    console.error('Missing redirectUrl query parameter');
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
    console.error('Protocol must be https');
    console.groupEnd();
    response.status(400).send('Protocol must be https');
    return;
  }

  if (
    !config.redirectUrlQueryParameter.allowedHosts.includes('*') &&
    !config.redirectUrlQueryParameter.allowedHosts.includes(host)
  ) {
    console.error('Host is not allowed');
    console.groupEnd();
    response.status(400).send('Host is not allowed');
    return;
  }

  console.log('Valid redirectUrl query parameter');
  console.groupEnd();

  next();
});
app.use('/', express.static(resolve('public')));

app.get('/redirect', (request: Request, response: Response) => {
  const redirectUrl: Readonly<string> = request.query.redirectUrl as string;
  console.log(`Redirecting to ${redirectUrl}...`);
  response.redirect(redirectUrl);
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
