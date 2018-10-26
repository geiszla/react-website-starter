import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Transition from 'react-transition-group/Transition';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  background: `
    position: fixed;
    width: 100%;
    height: 100%;

    background-image: url("images/in.jpg");
    background-position: 35%;
    background-repeat: no-repeat;
    background-size: cover;
    filter: blur(10px);

    transition: 'opacity 500ms ease-in-out'
  `,
  container: `
    height: 100%;
    transition: opacity 500ms ease-in-out;
  `,
  content: `
    position: relative;
    top: 35%;
    margin: 0 10%;
    transform: translateY(-25%);
    text-align: center;
  `,
  status: `
    color: white;
    font-size: 200%;
    text-align: center;
  `,
  button: `
    margin-top: 50px;
  `
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
                variant="contained"
                className={classes.button}
                onClick={handleLogout}
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
    background: PropTypes.string.isRequired,
    container: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    button: PropTypes.string.isRequired
  }).isRequired,
  handleLogout: PropTypes.func.isRequired
};

export default withStyles(styles)(Home);
