import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import fetch from 'node-fetch';

import apolloClient from '../apollo_client';

global.fetch = fetch;
global.SERVER_URL = 'abc';

describe('Apollo Client', () => {
  it('should export a valid Apollo Client object without SSR', () => {
    expect(apolloClient(false, undefined, new InMemoryCache())).toBeInstanceOf(ApolloClient);
  });

  it('should export a valid Apollo Client object with SSR', () => {
    expect(apolloClient(true, undefined, new InMemoryCache())).toBeInstanceOf(ApolloClient);
  });

  const headers = { accept: 'application/json' };
  it('should export a valid Apollo Client object with headers', () => {
    expect(apolloClient(true, headers, new InMemoryCache())).toBeInstanceOf(ApolloClient);
  });
});
