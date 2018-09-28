import { app, httpRedirectApp } from './express.jsx';

import Loadable from 'react-loadable';
import fetch from 'node-fetch';
import fs from 'fs';
import http from 'http';
import path from 'path';
import spdy from 'spdy';

global.fetch = fetch;

// ! Important: Generate new key and set password when creating new project
const options = {
  key: fs.readFileSync(path.resolve(__dirname, 'server/ssl/key.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, 'server/ssl/cert.crt'))
};
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

startServer();

// Start server
async function startServer() {
  await Loadable.preloadAll();

  let port;
  if (process.env.NODE_ENV === 'production') {
    // Production environment
    http.createServer(httpRedirectApp).listen(process.env.UNSECURE_PORT || 8080);

    port = process.env.PORT || 443;
    spdy.createServer(options, app).listen(port);
  } else {
    // Development environment
    port = 8080;
    const server = http.createServer(app);
    server.listen(port);

    // Hot Module Replacement
    let currentApp = app;
    if (module.hot) {
      // Disable Hot Module Replacement messages
      const consoleLog = console.log;
      console.log = (...args) => {
        if (args.length > 0 && args[0].includes && args[0].includes('[HMR]')) {
          return;
        }

        consoleLog.apply(console, args);
      };

      module.hot.accept(['./express.jsx'], () => {
        server.removeListener('request', currentApp);
        server.on('request', app);
        currentApp = app;
      });
    }
  }

  console.log(`Server is started on port ${port}`);
}
