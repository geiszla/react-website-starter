import path from 'path';

import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import express from 'express';
import graphqlHTTP from 'express-graphql';
import { create } from 'jss';
import jssPreset from 'jss-preset-default';
import morgan from 'morgan';
import React from 'react';
import { ApolloProvider, renderToStringWithData } from 'react-apollo';
import { JssProvider, SheetsRegistry } from 'react-jss';
import Loadable from 'react-loadable';
import { getBundles } from 'react-loadable/webpack';
import { StaticRouter } from 'react-router-dom';
import favicon from 'serve-favicon';

import { MuiThemeProvider } from '@material-ui/core/styles';
import createGenerateClassName from '@material-ui/core/styles/createGenerateClassName';

import { InMemoryCache } from '../node_modules/apollo-cache-inmemory/lib/inMemoryCache';
import createApolloClient from '../src/apollo_client';
import App from '../src/components/App.jsx';
import muiTheme from '../src/theme';
import stats from '../www/scripts/react-loadable.json';
import graphQLSchema from './graphql';

// Redirect Webserver
const httpRedirectApp = express();
httpRedirectApp.get('*', (req, res) => {
  // Redirect to HTTPS
  res.redirect(`https://localhost${req.originalUrl}`);
});

// App Webserver
const app = express();
app.use(morgan(':method :url :status :response-time ms - :res[content-length]'));
app.use(compression());

const publicPath = path.resolve(__dirname, 'www');
app.use(favicon(path.resolve(publicPath, 'images', 'favicon.ico')));
app.use(express.static(publicPath, { index: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// ! Important: Change secret when creating new project!
app.use(cookieSession({
  name: process.env.NODE_ENV === 'production' ? 'session' : 'devSession',
  secret: '98414c22d7e2cf27b3317ca7e19df38e9eb221bd'
}));

// Webserver entry point
app.get('*', async (req, res) => {
  console.log(`\n------------------[ PAGE LOAD: ${req.url} ]------------------`);

  // Set up Apollo client
  const headers = Object.assign({}, req.headers, { accept: 'application/json' });
  const client = createApolloClient(true, headers, new InMemoryCache());

  // Set up MaterialUI theme provider
  const sheetsRegistry = new SheetsRegistry();
  const jss = create(jssPreset());
  jss.options.createGenerateClassName = createGenerateClassName;

  const modules = [];
  const context = {};

  const reactApp = (
    <Loadable.Capture report={moduleName => modules.push(moduleName)}>
      <ApolloProvider client={client}>
        <StaticRouter location={req.url} context={context}>
          <JssProvider registry={sheetsRegistry} jss={jss}>
            <MuiThemeProvider theme={muiTheme} sheetsManager={new Map()}>
              <App />
            </MuiThemeProvider>
          </JssProvider>
        </StaticRouter>
      </ApolloProvider>
    </Loadable.Capture>
  );

  // Render current page of React app to static HTML
  const staticHtml = await renderPage(reactApp, client, sheetsRegistry, modules);

  if (context.url) {
    // Handle React Router redirect
    console.log(`REDIRECT: ${context.url}`);
    res.writeHead(301, { Location: context.url });
    res.send();
  } else {
    res.send(staticHtml);
  }
});

async function renderPage(reactApp, client, sheetsRegistry, modules) {
  const content = await renderToStringWithData(reactApp);
  const css = sheetsRegistry.toString();

  // Collect dynamically loaded modules
  const uniqueModules = modules.filter((value, index, self) => self.indexOf(value) === index
    && !value.includes('hot-update'));
  const bundles = getBundles(stats, uniqueModules);

  // Insert app content and stying into HTML
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width">
        <meta name="Description" content="Put your description here.">
        <title>React Boilerplate</title>

        ${bundles.map(bundle => `<script src="${SCRIPTS_URL}/scripts/${bundle.file}" defer></script>`).join('\n')}
        <script src="${SCRIPTS_URL}/scripts/main.bundle.js" defer></script>

        <script>window.__APOLLO_STATE__ = ${JSON.stringify(client.extract())};</script>

        <link rel="stylesheet" type="text/css" href="styles.css">
      </head>
      <body>
        <div id="root">${content}</div>
        <style id="jss-server-side">${css}</style>
      </body>
    </html>
  `;
}

// GraphQL entry point
app.use(
  '/api',
  (req, _, next) => {
    console.log(`GraphQL API request: ${req.body.operationName}`);
    next();
  },
  graphqlHTTP(req => ({
    schema: graphQLSchema,
    rootValue: { session: req.session },
    graphiql: true
  }))
);

export { app, httpRedirectApp };
