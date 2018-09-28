import React from 'react';
import loadable from 'react-loadable';

const loading = () => <div>Loading...</div>;

export const Login = loadable({
  loader: () => import('./Login.jsx' /* webpackChunkName: "login" */),
  loading
});

export const Home = loadable({
  loader: () => import('./Home.jsx' /* webpackChunkName: "home" */),
  loading
});
