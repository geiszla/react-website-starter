import React from 'react';
import { create } from 'react-test-renderer';

import Home from '../../src/components/Home.jsx';

const handleLogout = jest.fn();
const homeRenderer = create(
  <Home fromLogin={false} username="username" handleLogout={handleLogout} />
);

describe('Home component', () => {
  beforeEach(() => {
    handleLogout.mockReset();
  });

  it('should match the snapshot when rendered', () => {
    expect(homeRenderer.toJSON()).toMatchSnapshot();

    const fromLoginRenderer = create(
      <Home fromLogin username="username" handleLogout={handleLogout} />
    );
    expect(fromLoginRenderer.toJSON()).toMatchSnapshot();

    const emptyUsernameRenderer = create(
      <Home fromLogin username="" handleLogout={handleLogout} />
    );
    expect(emptyUsernameRenderer.toJSON()).toMatchSnapshot();
  });

  it('should call handleLogout when logout button is pressed', () => {
    const logoutButton = homeRenderer.root.find(element => element.type === 'button'
      && element.children
      && element.children.some(child => child.children && child.children[0] === 'Logout'));

    logoutButton.props.onClick();
    expect(handleLogout).toHaveBeenCalledTimes(1);
  });
});
