/* eslint no-underscore-dangle: 0 */

import '@babel/polyfill';
import 'whatwg-fetch';

import { InMemoryCache } from 'apollo-cache-inmemory';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { hydrate } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { preloadReady } from 'react-loadable';
import { BrowserRouter } from 'react-router-dom';

import { MuiThemeProvider } from '@material-ui/core/styles';

import apolloClient from './apollo_client';
import App from './components/App.jsx';
import theme from './theme';

// Disable Hot Module Replacement messages
const consoleLog = console.log;
console.log = (...args) => {
  if (args.length === 0 || !args[0].includes('[HMR]')) {
    consoleLog.apply(console, args);
  }
};

window.addEventListener('load', async () => {
  const inMemoryCache = new InMemoryCache().restore(window.__APOLLO_STATE__ || {});
  const client = apolloClient(false, undefined, inMemoryCache);

  await preloadReady();

  const app = (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <MuiThemeProvider theme={theme}>
          <App />
        </MuiThemeProvider>
      </BrowserRouter>
    </ApolloProvider>
  );

  hydrate(
    <AppContainer>
      {app}
    </AppContainer>,
    document.getElementById('root')
  );

  if (module.hot) {
    module.hot.accept('./components/App.jsx', () => {
      hydrate(
        <AppContainer>
          {app}
        </AppContainer>,
        document.getElementById('root')
      );
    });
  }
});
