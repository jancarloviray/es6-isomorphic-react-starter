'use strict';

import Iso from 'iso';
import React from 'react';
import Router from 'react-router';

// paths relative to 'app'
import altResolver from '../shared/alt-resolver';
import alt from 'utils/alt';
import routes from './routes';

Iso.bootstrap((initialState, _, container) => {
	// bootstrap data to client Alt
	alt.bootstrap(initialState);
	// react-router
	Router.run(
		routes,
		Router.HistoryLocation,
        (Handler, state) => {
                altResolver({routes: state.routes, state: initialState },
                (nextState) => {
                    alt.bootstrap(nextState);
                    React.render(<Handler />, container);
                }
            );
        }
	);
});