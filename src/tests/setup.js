/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

import { JSDOM } from 'jsdom';

const dom = new JSDOM();
global.document = dom.window.document;
global.window = dom.window;
