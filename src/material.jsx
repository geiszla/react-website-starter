/* eslint react/forbid-prop-types: 0 */

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { indigo, white } from '@material-ui/core/colors';
import { createMuiTheme, withStyles } from '@material-ui/core/styles';

export const theme = (function createTheme() {
  return createMuiTheme({
    palette: {
      primary: indigo,
      accent: white
    },
    typography: {
      useNextVariants: true
    }
  });
}());

export function styled(Component) {
  return (style, options) => {
    function StyledComponent(props) {
      const { classes, className, ...other } = props;
      return <Component className={classNames(classes.root, className)} {...other} />;
    }

    StyledComponent.propTypes = {
      classes: PropTypes.object.isRequired,
      className: PropTypes.string.isRequired
    };

    const styles = typeof style === 'function' ? currentTheme => ({ root: style(currentTheme) })
      : { root: style };

    return withStyles(styles, options)(StyledComponent);
  };
}
