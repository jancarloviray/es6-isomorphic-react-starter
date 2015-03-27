'use strict';

import React from 'react';
import Router from 'react-router';

import routes from './routes';

const body = document.body;

Router.run(
  routes,
  Router.HistoryLocation,
  (Handler) => React.render(<Handler/>, body)
);
