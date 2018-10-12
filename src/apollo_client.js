import ApolloClient from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';

// SERVER_URL is replaced by the actual URL by Webpack when bundling
export default (ssrMode, headers, cache, serverUrl = SERVER_URL) => new ApolloClient({
  ssrMode,
  link: createHttpLink({
    uri: `${serverUrl}/api`,
    credentials: 'same-origin',
    headers
  }),
  cache
});
