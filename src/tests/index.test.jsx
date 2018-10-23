/* eslint global-require: 0 */

import * as Loadable from 'loadable-components';
import ReactDOM from 'react-dom';

const indexPath = '../index.jsx';

// Test setup
global.SERVER_URL = 'test';
Loadable.loadComponents = jest.fn();
process.env.NODE_ENV = 'production';

// TODO: Test app rendering
describe('Client entry', () => {
  let hydrateApp;

  it('should rehydrate React app on window load', async () => {
    ReactDOM.hydrate = jest.fn();
    global.window.addEventListener = jest.fn();

    const index = await import(indexPath);
    hydrateApp = index.default;
    expect(global.window.addEventListener).toHaveBeenCalled();

    await hydrateApp();
    expect(Loadable.loadComponents).toHaveBeenCalled();
    expect(ReactDOM.hydrate).toHaveBeenCalled();
  });

  it('should initialize hot module replacement', async () => {
    const mockHmr = {
      accept: jest.fn(async (_, callback) => {
        await expect(callback()).toBe(undefined);
      })
    };

    await hydrateApp(null, mockHmr);
    expect(mockHmr.accept).toHaveBeenCalled();
  });

  it('should mute [HMR] messages, but display others', async () => {
    // Test production environment
    console.log = jest.fn();

    console.log('[HMR] test');
    expect(console.logOriginal).toBe(undefined);

    // Test development environment
    jest.resetModules();
    process.env.NODE_ENV = 'development';
    await import(indexPath);

    console.logOriginal = jest.fn();
    const consoleLogSpy = jest.spyOn(console, 'logOriginal')
      .mockImplementation(() => jest.fn());

    console.log('[HMR] test');
    expect(consoleLogSpy).not.toHaveBeenCalled();

    console.log('[HMR]');
    expect(consoleLogSpy).not.toHaveBeenCalled();

    console.log('test message');
    expect(consoleLogSpy).toHaveBeenCalledWith('test message');

    console.log('');
    expect(consoleLogSpy).toHaveBeenCalledWith('');

    const testObject = { test: ['object'] };
    console.log(testObject);
    expect(consoleLogSpy).toHaveBeenCalledWith(testObject);
  });
});
