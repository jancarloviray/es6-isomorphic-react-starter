'use strict';

import React from 'react';
import {RouteHandler, Link} from 'react-router';

import Header from 'components/header';

export default React.createClass({
  render() {
    return (
      <div>
      <Header />
      <div className="container">
        <RouteHandler />
      </div>
      </div>
      );
  }
});
