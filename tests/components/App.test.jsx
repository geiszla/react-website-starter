import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { SchemaLink } from 'apollo-link-schema';
import { printSchema } from 'graphql';
import { addMockFunctionsToSchema, makeExecutableSchema } from 'graphql-tools';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { MemoryRouter } from 'react-router';
import { create } from 'react-test-renderer';
import wait from 'waait';

import { MuiThemeProvider } from '@material-ui/core/styles';

import schema from '../../server/graphql';
import App from '../../src/components/App.jsx';
import theme from '../../src/material';

// TODO: Test Material-UI theme
// TODO: Test react-loadable loading

// Setup
function getAppWithMocks(path, apolloMocks) {
  const executableSchema = makeExecutableSchema({
    typeDefs: printSchema(schema),
    resolverValidationOptions: { requireResolversForResolveType: false }
  });

  if (apolloMocks) {
    addMockFunctionsToSchema({ schema: executableSchema, mocks: apolloMocks });
  }

  const mockClient = new ApolloClient({
    link: new SchemaLink({ schema: executableSchema }),
    cache: new InMemoryCache()
  });

  return (
    <ApolloProvider client={mockClient}>
      <MemoryRouter initialEntries={[path]}>
        <MuiThemeProvider theme={theme}>
          <App />
        </MuiThemeProvider>
      </MemoryRouter>
    </ApolloProvider>
  );
}

// Helper functions
async function waitToLoad(renderer) {
  await wait(0);

  const loadableComponent = renderer.root.find(element => element.type.name
    === 'LoadableComponent');
  await loadableComponent.instance.loadingPromise;
}

async function renderAndLoad(path, apolloMocks) {
  const renderer = create(getAppWithMocks(path, apolloMocks));

  // Wait for Apollo data to load
  await waitToLoad(renderer);
  return renderer;
}

function mockDOMElementValues(elementValues) {
  document.getElementById = (id) => {
    if (elementValues && Object.keys(elementValues).includes(id)) {
      if (elementValues[id] !== Object(elementValues[id])) {
        return { value: elementValues[id] };
      }

      return elementValues[id];
    }

    return { value: null };
  };
}

function getButtonFromTree(tree, label) {
  return tree.find(element => element.type === 'button'
    && element.children
    && element.children.some(child => child.children && child.children[0] === label));
}

// Tests
describe('App component', () => {
  it('should redirect to Login when not logged in', async () => {
    const appLogin = await renderAndLoad('/login');
    const loginInstance = appLogin.root.find(element => element.type.name === 'Login');
    expect(loginInstance).toBeTruthy();

    const appHome = await renderAndLoad('/');
    const homeInstance = appHome.root.findAll(element => element.type.name === 'Home');
    expect(homeInstance).toHaveLength(0);
  });

  it('should redirect to Home when logged in', async () => {
    const appLogin = await renderAndLoad('/login', {
      Query: () => ({ getUsername: () => 'username' })
    });

    const homeInstance = appLogin.root.find(element => element.type.name === 'Home');
    expect(homeInstance).toBeTruthy();
  });

  it('should remove appended JSS styles from the DOM when mounted', async () => {
    const removeChild = jest.fn();
    mockDOMElementValues({ 'jss-server-side': { parentNode: { removeChild } } });
    await renderAndLoad('/');
    expect(removeChild).toHaveBeenCalledTimes(1);
  });

  it('should handle user login request', async (done) => {
    // Reset username and password values
    mockDOMElementValues();

    // Render login page with login mutation
    const loginMutateMock = jest.fn();
    const appRenderer = await renderAndLoad('/login', {
      Query: () => ({ getUsername: () => undefined }),
      Mutation: () => ({
        loginUser: (username, password) => {
          expect(username).toBeTruthy();
          expect(password).toBeTruthy();
          loginMutateMock();

          done();
          return true;
        }
      })
    });

    const appNode = appRenderer.root.find(element => element.type.name === 'App');
    let loginButton = getButtonFromTree(appNode, 'Login');

    // Test username error
    loginButton.props.onClick();
    expect(appNode.instance.usernameError).toBe(true);
    expect(appNode.instance.passwordError).toBe(false);

    // Test username error reset
    mockDOMElementValues({ username: 'test', password: '' });
    loginButton.props.onClick();
    expect(appNode.instance.usernameError).toBe(false);
    expect(loginMutateMock).toHaveBeenCalledTimes(1);

    // Update app with login mutation that returns false
    appRenderer.update(getAppWithMocks('/login', {
      Query: () => ({ getUsername: () => undefined }),
      Mutation: () => ({ loginUser: () => false })
    }));
    await waitToLoad(appRenderer);

    // Simulate button press and wait for tree to update
    loginButton = getButtonFromTree(appRenderer.root, 'Login');
    loginButton.props.onClick();
    await wait(0);
    expect(appNode.instance.usernameError).toBe(false);
    expect(appNode.instance.passwordError).toBe(true);
  });

  it('should send logout request when logout button is pressed', async () => {
    const logoutMutateMock = jest.fn();
    const appRenderer = await renderAndLoad('/', {
      Query: () => ({ getUsername: () => 'username' }),
      Mutation: () => ({
        logoutUser: () => {
          logoutMutateMock();
          return true;
        }
      })
    });

    const logoutButton = getButtonFromTree(appRenderer.root, 'Logout');
    logoutButton.props.onClick();
    expect(logoutMutateMock).toHaveBeenCalledTimes(1);
  });
});
