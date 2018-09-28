import ApolloClient from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';

export default (ssrMode, headers, cache) => new ApolloClient({
  ssrMode,
  link: createHttpLink({
    uri: `${SERVER_URL}/api`,
    credentials: 'same-origin',
    headers
  }),
  cache
});
