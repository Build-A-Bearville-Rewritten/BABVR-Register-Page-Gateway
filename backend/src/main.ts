import { resolve } from 'node:path';
import { URL } from 'node:url';

import express, { Express, NextFunction, Request, Response } from 'express';

import { IConfiguration } from './typings/config';

let config: IConfiguration;

const app: Express = express();
const environment: string = process.env.NODE_ENV || 'development';
const port: number = parseInt(process.env.PORT || '3000');

if (environment !== 'development')
  import('./config/config.prod')
    .then(module => (config = module.config))
    .catch(console.error);

app.use((request: Request, response: Response, next: NextFunction): void => {
  console.log(`Request: ${request.method} ${request.path} from ${request.ip}`);
  next();
});
app.use((request: Request, response: Response, next: NextFunction): void => {
  if (request.path === '/favicon.ico') {
    next();
    return;
  }

  const queryParameters = request.query;
  const redirectUrl: string | undefined = queryParameters.redirectUrl as string;

  console.log(queryParameters);

  console.group('Validating redirectUrl query parameter...');

  if (!redirectUrl) {
    console.error('Missing redirectUrl query parameter');
    response.status(400).send('Missing redirectUrl query parameter');
    return;
  }

  try {
    const urlObject: URL = new URL(redirectUrl);
    const host: string = urlObject.host;
    const protocol: string = urlObject.protocol;

    if (
      config.redirectUrlQueryParameter.shouldEnforceHttps &&
      protocol !== 'https:'
    ) {
      console.error('Protocol must be https');
      throw new Error('Protocol must be https');
    }

    if (
      !config.redirectUrlQueryParameter.allowedHosts.includes('*') &&
      !config.redirectUrlQueryParameter.allowedHosts.includes(host)
    ) {
      console.error('Host is not allowed');
      throw new Error('Host is not allowed');
    }
  } catch (error) {
    console.groupEnd();
    response.status(400).send('Invalid redirectUrl query parameter');
    return;
  }

  console.log('Valid redirectUrl query parameter');
  console.groupEnd();

  next();
});
app.use('/', express.static(resolve('public')));

app.get('/redirect', (request: Request, response: Response) => {
  const redirectUrl: string = request.query.redirectUrl as string;
  console.log(`Redirecting to ${redirectUrl}...`);
  response.redirect(redirectUrl);
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
