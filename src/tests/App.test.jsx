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
import renderer from 'react-test-renderer';

import schema from '../../server/graphql';
import App from '../components/App.jsx';
import { watchFile } from 'fs';
import wait from 'waait';

// Setup
const executableSchema = makeExecutableSchema({
  typeDefs: printSchema(schema),
  resolverValidationOptions: {
    requireResolversForResolveType: false
  }
});

const apolloClient = new ApolloClient({
  link: new SchemaLink({ schema: executableSchema }),
  cache: new InMemoryCache()
});

configure({ adapter: new Adapter() });

const mockApp = path => (
  <ApolloProvider client={apolloClient}>
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>
  </ApolloProvider>
);

// Helper functions
function createSnapshot(path) {
  return mount(mockApp(path));
}

createSnapshot('/');

// Tests
test('React Router redirection', () => {
  const loginTree = createSnapshot('/login');
  expect(loginTree.find('Login').length).toBeGreaterThan(0);

  const homeTree = createSnapshot('/');
  expect(homeTree.find('Login').length).toBeGreaterThan(0);
});

test('Logout mutation is called when the logout button is pressed', async () => {
  const wrapper = mount(mockApp('/'));
  wrapper.find('App').instance().handleLogout();
  // console.log(wrapper.debug());
});
