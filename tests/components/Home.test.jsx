import { printSchema } from 'graphql';
import { addMockFunctionsToSchema, makeExecutableSchema } from 'graphql-tools';
import React from 'react';
import TestRenderer from 'react-test-renderer';

import schema from '../../server/graphql';
import Home from '../../src/components/Home.jsx';

const executableSchema = makeExecutableSchema({
  typeDefs: printSchema(schema),
  resolverValidationOptions: { requireResolversForResolveType: false }
});

addMockFunctionsToSchema({ schema: executableSchema });

const handleLogout = jest.fn();
const homeRenderer = TestRenderer.create(
  <Home fromLogin={false} username="username" handleLogout={handleLogout} />
);

describe('Home component', () => {
  it('should match the snapshot when rendered', () => {
    expect(homeRenderer.toJSON()).toMatchSnapshot();

    const fromLoginRenderer = TestRenderer.create(
      <Home fromLogin username="username" handleLogout={handleLogout} />
    );
    expect(fromLoginRenderer.toJSON()).toMatchSnapshot();

    const emptyUsernameRenderer = TestRenderer.create(
      <Home fromLogin username="" handleLogout={handleLogout} />
    );
    expect(emptyUsernameRenderer.toJSON()).toMatchSnapshot();
  });

  it('should call handleLogout when logout button is pressed', () => {
    const logoutButton = homeRenderer.root.find(element => element.type === 'button'
      && element.children
      && element.children.some(child => child.children && child.children[0] === 'Logout'));

    logoutButton.props.onClick();
    expect(handleLogout).toHaveBeenCalled();
  });
});
