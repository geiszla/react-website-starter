import React from 'react';
import { create } from 'react-test-renderer';

import Login from '../../src/components/Login.jsx';

const handleLogin = jest.fn();
const loginRenderer = create(
  <Login handleLogin={handleLogin} usernameError={false} passwordError={false} />
);

describe('Home component', () => {
  beforeEach(() => {
    handleLogin.mockReset();
  });

  it('should match the snapshot when rendered', () => {
    expect(loginRenderer.toJSON()).toMatchSnapshot();

    const usernameErrorRenderer = create(
      <Login handleLogin={handleLogin} usernameError passwordError={false} />
    );
    expect(usernameErrorRenderer.toJSON()).toMatchSnapshot();

    const passwordErrorRenderer = create(
      <Login handleLogin={handleLogin} usernameError={false} passwordError />
    );
    expect(passwordErrorRenderer.toJSON()).toMatchSnapshot();

    const bothErrorRenderer = create(
      <Login handleLogin={handleLogin} usernameError passwordError />
    );
    expect(bothErrorRenderer.toJSON()).toMatchSnapshot();
  });

  it('should call handleLogout when logout button is pressed', () => {
    const loginCore = loginRenderer.root.find(element => element.type.name === 'Login');

    loginCore.instance.handleKeyPress({});
    expect(handleLogin).not.toHaveBeenCalled();

    loginCore.instance.handleKeyPress({ key: 'Enter' });
    expect(handleLogin).toHaveBeenCalledTimes(1);
  });

  it('should call handleLogin when login button is pressed', () => {
    const loginButton = loginRenderer.root.find(element => element.type === 'button'
      && element.children
      && element.children.some(child => child.children && child.children[0] === 'Login'));

    loginButton.props.onClick();
    expect(handleLogin).toHaveBeenCalledTimes(1);
  });
});
