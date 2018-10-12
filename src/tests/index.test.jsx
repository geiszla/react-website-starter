/* eslint global-require: 0 */

import ReactDOM from 'react-dom';

const indexPath = '../index.jsx';

// TODO: Test app rendering
describe('Client entry', () => {
  global.SERVER_URL = 'test';
  let hydrateApp;

  it('should rehydrate React app on window load', async () => {
    ReactDOM.hydrate = jest.fn();
    global.window.addEventListener = jest.fn();

    ({ hydrateApp } = await import(indexPath));
    expect(global.window.addEventListener).toHaveBeenCalled();

    await hydrateApp();
    expect(ReactDOM.hydrate).toHaveBeenCalled();
  });

  it('should initialize hot module replacement', async () => {
    const mockHmr = {
      accept: jest.fn(async (_, callback) => {
        await expect(callback()).toBe(undefined);
      })
    };

    await hydrateApp(mockHmr);
    expect(mockHmr.accept).toHaveBeenCalled();
  });

  it('should mute [HMR] messages, but display others', async () => {
    const consoleLogSpy = jest.spyOn(console, '_logOriginal')
      .mockImplementation(() => jest.fn());

    console.log('[HMR] test');
    expect(consoleLogSpy).not.toHaveBeenCalled();

    console.log('[HMR]');
    expect(consoleLogSpy).not.toHaveBeenCalled();

    console.log('second test');
    expect(consoleLogSpy).toHaveBeenCalledWith('second test');

    console.log(' ');
    expect(consoleLogSpy).toHaveBeenCalledWith(' ');

    console.log('');
    expect(consoleLogSpy).toHaveBeenCalledWith('');
  });
});
