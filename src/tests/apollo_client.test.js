import { InMemoryCache } from 'apollo-cache-inmemory';
import fetch from 'node-fetch';

import apolloClient from '../apollo_client';

global.fetch = fetch;
global.SERVER_URL = 'abc';

describe('Apollo Client', () => {
  it('should export a valid Apollo Client object without SSR', () => {
    expect(apolloClient(false, undefined, new InMemoryCache())).toMatchSnapshot();
  });

  it('should export a valid Apollo Client object with SSR', () => {
    expect(apolloClient(true, undefined, new InMemoryCache())).toMatchSnapshot();
  });
});
