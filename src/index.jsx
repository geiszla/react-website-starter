/* eslint no-underscore-dangle: 0 */

import '@babel/polyfill';
import 'whatwg-fetch';

import { InMemoryCache } from 'apollo-cache-inmemory';
import { create } from 'jss';
import jssPreset from 'jss-preset-default';
import * as Loadable from 'loadable-components';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { JssProvider } from 'react-jss';
import { BrowserRouter } from 'react-router-dom';

import { MuiThemeProvider, createGenerateClassName } from '@material-ui/core/styles';

import createApolloClient from './apollo_client';
import App from './components/App.jsx';
import theme from './material';

// Disable Hot Module Replacement messages
if (process.env.NODE_ENV !== 'production') {
  console.logOriginal = console.log;
  console.log = (...args) => {
    if (args.length === 0 || typeof args[0] !== 'string' || !args[0].includes('[HMR]')) {
      console.logOriginal(...args);
    }
  };
}

export default async function hydrateApp(_, hotModuleReplacement = module.hot) {
  await Loadable.loadComponents();

  const inMemoryCache = new InMemoryCache().restore(window.__APOLLO_STATE__ || {});
  const client = createApolloClient(false, undefined, inMemoryCache);
  const jss = create(jssPreset());

  const app = (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <JssProvider jss={jss} generateClassName={createGenerateClassName()}>
          <MuiThemeProvider theme={theme}>
            <App />
          </MuiThemeProvider>
        </JssProvider>
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
