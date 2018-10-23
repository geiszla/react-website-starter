import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Transition from 'react-transition-group/Transition';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';

const CardContainer = styled.div`
  height: 100%;
  opacity: 0;
  transition: opacity 500ms ease-in-out;
`;

const StyledCard = styled(Card)`
  position: relative;
  top: 35%;
  margin: auto;
  transform: translateY(-30%);
  max-width: 382px;
`;

const transitionStyles = {
  entering: { opacity: 0 },
  entered: { opacity: 1 }
};

class Login extends Component {
  handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      this.props.handleLogin();
    }
  }

  render() {
    const {
      usernameError, passwordError, handleLogin
    } = this.props;

    return (
      <Transition appear in timeout={0}>
        {state => (
          <CardContainer style={{ ...transitionStyles[state] }}>
            <StyledCard>
              <CardContent>
                <Typography type="title">
                Choose a name and enter password
                </Typography>
                <TextField
                  id="username"
                  label="Name"
                  margin="dense"
                  autoFocus
                  error={usernameError}
                  onKeyPress={this.handleKeyPress}
                />
                <TextField
                  id="password"
                  label="Password"
                  type="password"
                  margin="dense"
                  autoComplete="current-password"
                  error={passwordError}
                  onKeyPress={this.handleKeyPress}
                />
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleLogin}
                >
                Login
                </Button>
              </CardActions>
            </StyledCard>
          </CardContainer>
        )}
      </Transition>
    );
  }
}

Login.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  usernameError: PropTypes.bool.isRequired,
  passwordError: PropTypes.bool.isRequired
};

export default Login;
