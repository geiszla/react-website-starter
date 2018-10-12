import ApolloClient from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';

// SERVER_URL is replaced by the actual URL by Webpack when bundling
export default (ssrMode, headers, cache) => new ApolloClient({
  ssrMode,
  link: createHttpLink({
    uri: `${SERVER_URL}/api`,
    credentials: 'same-origin',
    headers
  }),
  cache
});
