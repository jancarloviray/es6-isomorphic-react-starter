'use strict';

import request from 'superagent';
import UserStore from 'stores/user';

const fetchUsers = (resolve, reject) => {
    const users = UserStore.getState().users;
    // check if has already data before requesting
    if(users && users.length > 0){
        return resolve({ UserStore: {users}});
    } else {
        return request
            .get('http://api.randomuser.me/?results=20')
            .end((err, response) => {
                if(err){
                    return reject(err);
                } else {
                    resolve({UserStore: {users: response.body.results}});
                }
            });
    }
};

export default {
    users: fetchUsers
};