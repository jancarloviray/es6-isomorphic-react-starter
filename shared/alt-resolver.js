'use strict';

import _ from 'lodash';
import services from './services';

export default (params, callback) => {
    const toResolve = [];
    // find which services we need to resolve before rendering
    params.routes.forEach((route) => {
        if(typeof services[route.name] === 'function'){
            toResolve.push(new Promise(services[route.name]));
        }
    });
    Promise
        .all(toResolve)
        .then((results) => {
            let nextState = {};
            // merge results into 'nextState'
            results.forEach((result) => nextState = _.assign(nextState, result));
            // all services are resolved, let's fire the callback
            return callback(JSON.stringify(nextState));
        });
}

/*
Alt-resolver is used to resolve data before React Rendering, it shares the same services with client and server. It's specific to the boilerplate.

Presume you have a route like this:

<Route name="users" handler={require('./components/users')} />
And you need to fetch users and populate an UserStore before rendering the component, declare an user function (that match the route name) in shared/service.js.

This function take two arguments from promise resolve, reject, you should resolve it with a formatted object for Iso / Alt like this:

users(resolve, reject) {
  return request
    .get('http://api.randomuser.me/?results=10')
    .end((err, response) => {
      return resolve({UserStore: {users: response.body.results}});
    });
}
On server side, users function will be resolved before the first rendering.
On client-side when switching to the route, it will be resolved before rendering too!
*/