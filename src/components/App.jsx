/* eslint react/no-unused-state: 0 */

import { Home, Login } from './routes.jsx';
import React, { Component, Fragment } from 'react';
import {
  Redirect,
  Route,
  Switch,
  withRouter
} from 'react-router-dom';
import { compose, graphql } from 'react-apollo';

import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { hot } from 'react-hot-loader';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  background: {
    backgroundPosition: '35%',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    position: 'fixed',
    height: '100%',
    width: '100%',
    filter: 'blur(10px)',
    transition: 'opacity 500ms ease-in-out'
  }
});

@observer
class App extends Component {
  @observable usernameError = false;

  @observable passwordError = false;

  fromLogin = false;

  componentDidMount = () => {
    const jssStyles = document.getElementById('jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  handleLogin = async () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username) {
      this.passwordError = false;
      this.usernameError = true;
      return;
    }

    this.usernameError = false;

    const { data } = await this.props.loginMutate({
      variables: { username, password }
    });

    if (data.loginUser === true) {
      this.passwordError = false;
      this.fromLogin = true;
    } else {
      this.passwordError = true;
    }
  }

  handleLogout = () => {
    this.props.logoutMutate();
  }

  render() {
    const { usernameError, passwordError } = this;
    const { pathname } = this.props.location;
    const username = this.props.data.getUsername;

    const isLoggedIn = username !== null;

    if (!isLoggedIn && pathname !== '/login') {
      return <Redirect to="/login" push />;
    }

    if (isLoggedIn === true && pathname === '/login') {
      return <Redirect to="/" push />;
    }

    return (
      <Fragment>
        <div
          className={this.props.classes.background}
          style={{ backgroundImage: pathname === '/login' || this.fromLogin ? 'url(images/out.jpg)' : 'url(images/in.jpg)' }}
        />
        <Switch>
          <Route
            path="/login"
            render={defaultProps => (
              <Login
                handleLogin={() => this.handleLogin()}
                usernameError={usernameError}
                passwordError={passwordError}
                {...defaultProps}
              />
            )}
          />
          <Route
            path="/"
            render={defaultProps => (
              <Home
                handleLogout={() => this.handleLogout()}
                username={username}
                fromLogin={this.fromLogin}
                {...defaultProps}
              />
            )}
          />
        </Switch>
      </Fragment>
    );
  }
}

const getUsernameQuery = gql`
  query getUsernameQuery {
    getUsername
  }
`;

const LoginUserMutation = gql`
  mutation LoginUserMutation($username: String!, $password: String!) {
    loginUser(username: $username, password: $password)
  }
`;

const LogoutUserMutation = gql`
  mutation LogoutUserMutation {
    logoutUser
  }
`;

const loginMutationOptions = {
  refetchQueries: ['getUsernameQuery', 'FetchStatusQuery']
};

App.propTypes = {
  classes: PropTypes.shape({
    background: PropTypes.string.isRequired
  }).isRequired,
  data: PropTypes.shape({
    getUsername: PropTypes.string
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired,
  loginMutate: PropTypes.func.isRequired,
  logoutMutate: PropTypes.func.isRequired
};

export default compose(
  hot(module),
  graphql(getUsernameQuery),
  graphql(LoginUserMutation, {
    name: 'loginMutate',
    options: loginMutationOptions
  }),
  graphql(LogoutUserMutation, {
    name: 'logoutMutate',
    options: loginMutationOptions
  }),
  withRouter,
  withStyles(styles)
)(App);
