'use strict';

import request from 'superagent';

import React from 'react';
import ListenerMixin from 'alt/mixins/ListenerMixin';
import UserStore from 'stores/user';
import UserActions from 'actions/user';

export default React.createClass({
    mixins: [ListenerMixin],
    getInitialState() {
        return UserStore.getState();
    },
    componentDidMount(){
        this.listenTo(UserStore, () => this.setState(this.getInitialState()));
    },
    addUser() {
        // TODO: move this (not supposed to be here)
        request
            .get('http://api.randomuser.me/')
            .end((err, res) => {
                if(!err){
                    return UserActions.add(res.body.results[0]);
                }
            });
    },
    removeUser(index){
        return UserActions.remove(index);
    },
    renderUsers() {
        return this.state.users.map((user, index) => {
            return (
                <li key={index} className="userList-listItem">
                    <img src={user.user.picture.large} className="img-responsive"/>
                    <div className="userList-listItem-userInfo" onClick={this.removeUser.bind(this, index)}>
                        <div className="userList-listItem-userName">
                            <strong>{user.user.name.first} {user.user.name.last}</strong>
                        </div>
                        <div className="userList-listItem-userContactDetails">
                            <p className="userList-listItem-userEmail">{user.user.email}</p>
                        </div>
                    </div>
                </li>
            );
        });
    },
    render(){
        return (
            <div class="userList">
                <h1 className="userList-title">Users</h1>
                <button className="userList-addUser btn btn-success btn-sm" onClick={this.addUser}>Add User</button>
                <ul className="userList-list" style={{listStyleType:'none',margin:'0',padding:'0'}}>
                    {this.renderUsers()}
                </ul>
            </div>
        );
    }
});
