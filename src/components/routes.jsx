import loadable from '@loadable/component';

export const Login = loadable(() => import('./Login.jsx' /* webpackChunkName: "login" */));
export const Home = loadable(() => import('./Home.jsx' /* webpackChunkName: "home" */));
