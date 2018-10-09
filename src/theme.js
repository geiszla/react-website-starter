import { indigo, white } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';

export default (function createTheme() {
  return createMuiTheme({
    palette: {
      primary: indigo,
      accent: white
    }
  });
}());
