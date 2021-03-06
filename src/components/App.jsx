import gql from 'graphql-tag';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { compose, graphql } from 'react-apollo';
import { hot } from 'react-hot-loader';
import {
  Redirect,
  Route,
  Switch,
  withRouter
} from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';

import { Home, Login } from './routes.jsx';

const styles = () => ({
  background: `
    background-position: 35%;
    background-repeat: no-repeat;
    background-size: cover;
    filter: blur(10px);
    height: 100%;
    position: fixed;
    transition: opacity 500ms ease-in-out;
    width: 100%;
  `
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
    const { data, classes } = this.props;

    if (data.loading) {
      return <div>Loading...</div>;
    }

    const username = data.getUsername;
    const { pathname } = this.props.location;

    if (!username && pathname !== '/login') {
      return <Redirect push to="/login" />;
    }

    if (username && pathname === '/login') {
      return <Redirect push to="/" />;
    }

    const { passwordError, usernameError } = this;
    const backgroundImage = pathname === '/login' || this.fromLogin ? 'url(images/out.jpg)'
      : 'url(images/in.jpg)';

    return (
      <Fragment>
        <div className={classes.background} style={{ backgroundImage }} />
        <Switch>
          <Route
            path="/login"
            render={defaultProps => (
              <Login
                handleLogin={this.handleLogin}
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
                handleLogout={this.handleLogout}
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
