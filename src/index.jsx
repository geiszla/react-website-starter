/* eslint no-underscore-dangle: 0 */

import '@babel/polyfill';
import 'whatwg-fetch';

import { InMemoryCache } from 'apollo-cache-inmemory';
import Loadable from 'loadable-components';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { BrowserRouter } from 'react-router-dom';

import { MuiThemeProvider } from '@material-ui/core/styles';

import createApolloClient from './apollo_client';
import App from './components/App.jsx';
import theme from './theme';

debugger;
// Disable Hot Module Replacement messages
if (process.env.NODE_ENV !== 'production') {
  console.logOriginal = console.log;
  console.log = (...args) => {
    if (args.length === 0 || typeof args[0] !== 'string' || !args[0].includes('[HMR]')) {
      console.logOriginal(...args);
    }
  };
}

export default async function hydrateApp(hotModuleReplacement = module.hot) {
  await Loadable.loadComponents();

  const inMemoryCache = new InMemoryCache().restore(window.__APOLLO_STATE__ || {});
  const client = createApolloClient(false, undefined, inMemoryCache);

  const app = (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <MuiThemeProvider theme={theme}>
          <App />
        </MuiThemeProvider>
      </BrowserRouter>
    </ApolloProvider>
  );

  ReactDOM.hydrate(
    <AppContainer>
      {app}
    </AppContainer>,
    document.getElementById('root')
  );

  if (hotModuleReplacement) {
    hotModuleReplacement.accept('./components/App.jsx', () => {
      ReactDOM.hydrate(
        <AppContainer>
          {app}
        </AppContainer>,
        document.getElementById('root')
      );
    });
  }
}

window.addEventListener('load', hydrateApp);
