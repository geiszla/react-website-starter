import fs from 'fs';
import http from 'http';
import path from 'path';

import fetch from 'node-fetch';
import spdy from 'spdy';

import { setLogLevel } from '../node_modules/webpack/hot/log';
import { app, httpRedirectApp } from './express.jsx';

global.fetch = fetch;

// ! Important: Generate new key and set password when creating new project
const options = {
  key: fs.readFileSync(path.resolve(__dirname, 'server/ssl/key.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, 'server/ssl/cert.crt')),
  passphrase: 'boilerplate'
};
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

startServer();

// Start server
async function startServer() {
  let protocol;
  let port;

  if (process.env.NODE_ENV === 'production') {
    // Production environment
    http.createServer(httpRedirectApp).listen(process.env.UNSECURE_PORT || 8080);

    protocol = 'https';
    port = process.env.PORT || 443;
    spdy.createServer(options, app).listen(port);
  } else {
    // Development environment
    protocol = 'http';
    port = 8080;
    const server = http.createServer(app);
    server.listen(port);

    // Hot Module Replacement
    let currentApp = app;
    if (module.hot) {
      setLogLevel('warning');

      module.hot.accept(['./express.jsx'], () => {
        server.removeListener('request', currentApp);
        server.on('request', app);
        currentApp = app;

        console.log('\n-------------[ Server restarted by HMR ]'.padEnd(55, '-'));
      });
    }
  }

  console.log(`Server is started at ${protocol}://localhost:${port}`);
}
