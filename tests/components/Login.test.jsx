import { printSchema } from 'graphql';
import { addMockFunctionsToSchema, makeExecutableSchema } from 'graphql-tools';
import React from 'react';
import TestRenderer from 'react-test-renderer';

import schema from '../../server/graphql';
import Login from '../../src/components/Login.jsx';

const executableSchema = makeExecutableSchema({
  typeDefs: printSchema(schema),
  resolverValidationOptions: { requireResolversForResolveType: false }
});

addMockFunctionsToSchema({ schema: executableSchema });

const handleLogin = jest.fn();
const loginRenderer = TestRenderer.create(
  <Login handleLogin={handleLogin} usernameError={false} passwordError={false} />
);

describe('Home component', () => {
  it('should match the snapshot when rendered', () => {
    expect(loginRenderer.toJSON()).toMatchSnapshot();

    const usernameErrorRenderer = TestRenderer.create(
      <Login handleLogin={handleLogin} usernameError passwordError={false} />
    );
    expect(usernameErrorRenderer.toJSON()).toMatchSnapshot();

    const passwordErrorRenderer = TestRenderer.create(
      <Login handleLogin={handleLogin} usernameError={false} passwordError />
    );
    expect(passwordErrorRenderer.toJSON()).toMatchSnapshot();

    const bothErrorRenderer = TestRenderer.create(
      <Login handleLogin={handleLogin} usernameError passwordError />
    );
    expect(bothErrorRenderer.toJSON()).toMatchSnapshot();
  });

  it('should handle key presees in username and password fields', () => {
    const loginCore = loginRenderer.root.find(element => element.type.name === 'Login');

    loginCore.instance.handleKeyPress({});
    expect(handleLogin).not.toHaveBeenCalled();

    loginCore.instance.handleKeyPress({ key: 'Enter' });
    expect(handleLogin).toHaveBeenCalled();
  });

  it('should call handleLogin when login button is pressed', () => {
    const loginButton = loginRenderer.root.find(element => element.type === 'button'
      && element.children
      && element.children.some(child => child.children && child.children[0] === 'Login'));

    loginButton.props.onClick();
    expect(handleLogin).toHaveBeenCalled();
  });
});
