import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { SchemaLink } from 'apollo-link-schema';
import { GraphQLObjectType, printSchema } from 'graphql';
import gql from 'graphql-tag';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import { print } from 'graphql/language/printer';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { MockedProvider } from 'react-apollo/test-utils';
import { MemoryRouter } from 'react-router';
import { create } from 'react-test-renderer';

import { MuiThemeProvider } from '@material-ui/core/styles';

import schema, { queryType } from '../../server/graphql';
import App from '../../src/components/App.jsx';
import theme from '../../src/material';
import wait from 'waait';

// TODO: Test Material-UI theme
// TODO: Test react-loadable loading

// Setup
function createMockClient(mocks) {
  const executableSchema = makeExecutableSchema({
    typeDefs: printSchema(schema),
    resolverValidationOptions: { requireResolversForResolveType: false }
  });

  // console.log(mocks);
  if (mocks) {
    addMockFunctionsToSchema({ schema: executableSchema, mocks });
  }

  return new ApolloClient({
    link: new SchemaLink({ schema: executableSchema }),
    cache: new InMemoryCache()
  });
}

// Helper functions
async function mountAppAsync(path, apolloMocks) {
  // const { getUsername } = queryType.getFields();
  // console.log(printSchema(schema));
  // const mocks = [
  //   {
  //     request: { query: gql`${printSchema(schema)}` },
  //     result: { data: { getUsername: 'username' } }
  //   }
  // ];

  const mockClient = createMockClient(apolloMocks);

  const renderer = create(
    <ApolloProvider client={mockClient}>
      <MemoryRouter initialEntries={[path]}>
        <MuiThemeProvider theme={theme}>
          <App />
        </MuiThemeProvider>
      </MemoryRouter>
    </ApolloProvider>
  );

  // Wait for Apollo data to load
  await wait(0);

  const loadableComponent = renderer.root.find(element => element.type.name
    === 'LoadableComponent');
  await loadableComponent.instance.loadingPromise;

  return renderer.root.find(element => element.type.name === 'App');
}

describe('App component', () => {
  it('should render the Login component when not logged in', async () => {
    const appRootLogin = await mountAppAsync('/login');
    const loginInstance = appRootLogin.find(element => element.type.name === 'Login');
    expect(loginInstance).toBeTruthy();

    const appRootHome = await mountAppAsync('/');
    const homeInstance = appRootHome.findAll(element => element.type.name === 'Home');
    expect(homeInstance).toHaveLength(0);
  });

  it('should call handleLogout when logout button is pressed', async () => {
    const appRootHome = await mountAppAsync('/', { String: () => 'username' });

    appRootHome.instance.handleLogout = jest.fn();
    const logoutButton = appRootHome.find(element => element.type === 'button'
      && element.children
      && element.children.some(child => child.children && child.children[0] === 'Logout'));

    logoutButton.props.onClick();
    console.log(logoutButton.props.onClick.toString());
    expect(appRootHome.instance.handleLogout).toHaveBeenCalledTimes(1);
  });
});
