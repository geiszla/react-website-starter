import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';
import Typography from '@material-ui/core/Typography';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  background: {
    width: '100%',
    height: '100%',

    backgroundImage: 'url("images/in.jpg")',
    backgroundPosition: '35%',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    position: 'fixed',
    filter: 'blur(10px)',

    transition: 'opacity 500ms ease-in-out'
  },
  container: {
    height: '100%',
    transition: 'opacity 500ms ease-in-out'
  },
  content: {
    position: 'relative',
    top: '30%',
    margin: '0 10%',
    textAlign: 'center'
  },
  status: {
    fontSize: '200%',
    color: 'white',
    textAlign: 'center'
  },
  button: {
    marginTop: '50px'
  }
});

const transitionStyles = {
  entering: { opacity: 0 },
  entered: { opacity: 1 }
};

@observer
class Home extends Component {
  render() {
    const {
      classes, fromLogin, username, handleLogout
    } = this.props;

    const initialOpacity = fromLogin ? 0 : 1;
    return (
      <Transition appear={fromLogin} in timeout={0}>
        {state => (
          <div
            className={classes.container}
            style={{ opacity: initialOpacity, ...transitionStyles[state] }}
          >
            <div className={classes.background} style={{ opacity: 1 }} />
            <div className={classes.content}>
              <Typography type="headline" className={classes.status}>
              Hello
                {' '}
                {username}
                {'!'}
              </Typography>
              <Button
                variant="raised"
                className={classes.button}
                onClick={() => handleLogout()}
              >
              Logout
              </Button>
            </div>
          </div>
        )}
      </Transition>
    );
  }
}

Home.propTypes = {
  fromLogin: PropTypes.bool.isRequired,
  username: PropTypes.string.isRequired,
  classes: PropTypes.shape({
    container: PropTypes.string.isRequired,
    background: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    button: PropTypes.string.isRequired
  }).isRequired,
  handleLogout: PropTypes.func.isRequired
};

export default withStyles(styles)(Home);
