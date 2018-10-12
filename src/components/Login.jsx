import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Transition from 'react-transition-group/Transition';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  cardContainer: {
    height: '100%',
    opacity: 0,
    transition: 'opacity 500ms ease-in-out'
  },
  card: {
    position: 'relative',
    top: '35%',
    margin: 'auto',
    transform: 'translateY(-30%)',
    maxWidth: 382
  },
  title: {
    fontSize: '20px',
    margin: '7px 0 15px 0'
  },
  button: {
    marginLeft: 'auto'
  }
});

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
      classes, usernameError, passwordError, handleLogin
    } = this.props;

    return (
      <Transition appear in timeout={0}>
        {state => (
          <div className={classes.cardContainer} style={{ ...transitionStyles[state] }}>
            <Card className={classes.card}>
              <CardContent>
                <Typography type="title" className={classes.title}>
                Choose a name and enter password
                </Typography>
                <TextField
                  id="username"
                  label="Name"
                  margin="dense"
                  autoFocus
                  error={usernameError}
                  onKeyPress={event => this.handleKeyPress(event)}
                />
                <TextField
                  id="password"
                  label="Password"
                  type="password"
                  margin="dense"
                  autoComplete="current-password"
                  error={passwordError}
                  onKeyPress={event => this.handleKeyPress(event)}
                />
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  onClick={() => handleLogin()}
                >
                Login
                </Button>
              </CardActions>
            </Card>
          </div>
        )}
      </Transition>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.shape({
    card: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    button: PropTypes.string.isRequired
  }).isRequired,
  handleLogin: PropTypes.func.isRequired,
  usernameError: PropTypes.bool.isRequired,
  passwordError: PropTypes.bool.isRequired
};

export default withStyles(styles)(Login);
