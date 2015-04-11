'use strict';

import Iso from 'iso';
import React from 'react';
import Router from 'react-router';

import alt from 'utils/alt';
import routes from '../app/routes';
import altResolver from '../shared/alt-resolver';

export default (req, res) => {
  // bootstrap data into Alt stores
  const data = res.locals.data || {};
  alt.bootstrap(JSON.stringify(data));

  const router = Router.create({
    routes: routes,
    location: req.url,
    onAbort(redirect) {
      // TODO: Try to render the good page with re-creating a Router,
      // and with modifying req with `redirect.to`
      res.writeHead(303, {'Location': redirect.to});
      return res.send();
    },
    onError(err) {
      console.log('Routing Error');
      console.log(err);
    }
  });

  router.run((Handler, state) => {
    altResolver(
      { routes: state.routes },
      (nextState) => {
        alt.bootstrap(nextState);
        let content = React.renderToString(<Handler />);
        // add data from stores and flush them to have next request clean
        content = Iso.render(content, alt.flush());
        // render app
        return res.render('main', {content});
      }
    );
  });
};
