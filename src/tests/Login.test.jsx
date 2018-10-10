import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { SchemaLink } from 'apollo-link-schema';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { printSchema } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { MemoryRouter } from 'react-router';
import renderer from 'react-test-renderer';

import schema from '../../server/graphql';
import App from '../components/App.jsx';

// Helper functions
function testRoute(path) {
  const tree = renderer.create(
    <ApolloProvider client={apolloClient}>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </ApolloProvider>
  ).toJSON();

  expect(tree).toMatchSnapshot();
}

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
it('renders the loading component when different routes are requested', () => {
  console.error = undefined;
  testRoute('/login');
  testRoute('/');
});
