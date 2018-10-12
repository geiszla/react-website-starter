/* eslint global-require: 0 */

import ReactDOM from 'react-dom';

// TODO: Test app rendering
describe('Client entry', () => {
  // it('should mute [HMR] messages', () => {
  //   require('../index.jsx');
  //   console.log('');
  //   global.console.log('[HMR] test');
  //   expect(global.console.log.mock.calls.length).toBe(0);
  // });

  it('should rehydrate React app on window load', async () => {
    ReactDOM.hydrate = jest.fn();
    global.window.addEventListener = jest.fn();

    const { hydrateApp } = require('../index.jsx');
    expect(global.window.addEventListener).toBeCalled();

    global.SERVER_URL = 'test';
    await hydrateApp();
    expect(ReactDOM.hydrate).toBeCalled();
  });

  it('should initialize hot module replacement', async () => {
    const mockHmr = {
      accept: jest.fn(async (_, callback) => {
        await expect(callback()).toBe(undefined);
      })
    };
    const { hydrateApp } = require('../index.jsx');

    await hydrateApp(mockHmr);

    expect(mockHmr.accept).toBeCalled();
  });
});
