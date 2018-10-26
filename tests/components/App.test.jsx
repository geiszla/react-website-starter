import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { SchemaLink } from 'apollo-link-schema';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { printSchema } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { MemoryRouter } from 'react-router';

import { MuiThemeProvider } from '@material-ui/core/styles';

import schema from '../../server/graphql';
import App from '../../src/components/App.jsx';
import theme from '../../src/theme';

// TODO: Test Material-UI theme
// TODO: Test react-loadable loading

// Setup
const executableSchema = makeExecutableSchema({
  typeDefs: printSchema(schema),
  resolverValidationOptions: { requireResolversForResolveType: false }
});

const mockClient = new ApolloClient({
  link: new SchemaLink({ schema: executableSchema }),
  cache: new InMemoryCache()
});

configure({ adapter: new Adapter() });

const mockApp = path => (
  <ApolloProvider client={mockClient}>
    <MemoryRouter initialEntries={[path]}>
      <MuiThemeProvider theme={theme}>
        <App />
      </MuiThemeProvider>
    </MemoryRouter>
  </ApolloProvider>
);

// Helper functions
function mountApp(path) {
  return mount(mockApp(path));
}

// Mount App first to load loadable components
mountApp('/');

describe('App component', () => {
  it('should render the Login component when not logged in', () => {
    const loginTree = mountApp('/login');
    expect(loginTree.find('Login').length).toBeGreaterThan(0);

    const homeTree = mountApp('/');
    expect(homeTree.find('Login').length).toBeGreaterThan(0);
  });

  it('should log out when logout handler is called', () => {
    const wrapper = mountApp('/');
    wrapper.find('App').instance().handleLogout();
    expect(wrapper.find('Login').length).toBeGreaterThan(0);
  });
});
