import React from 'react';
import $ from 'jquery';

import ChatLog from './ChatLog.js';
import ChatForm from './ChatForm.js';
import { API_URL, POLL_INTERVAL } from './global.js';

module.exports = React.createClass({
  getInitialState: function () {
    return { data: [], _isMounted: false, name: ''};
  },
  loadMessagesFromServer: function () {
    if (this.state._isMounted) {
      $.ajax({
        url: API_URL,
        dataType: 'json',
        cache: false,
        success: function (data) {
          this.setState({ data: data });
        }.bind(this),
        error: function (xhr, status, err) {
          console.error(API_URL, status, err.toString());
        }.bind(this)
      });
    }
  },
  handleMessageSubmit: function (message) {
    var messages = this.state.data;
    message.timestamp = Date.now();
    var newMessages = messages.concat([message]);
    this.setState({ data: newMessages });
    $.ajax({
      url: API_URL,
      dataType: 'json',
      type: 'POST',
      data: message,
      success: function (data) {
        this.setState({ data: data });
      }.bind(this),
      error: function (xhr, status, err) {
        this.setState({ data: messages });
        console.error(API_URL, status, err.toString());
      }.bind(this)
    });
  },
  // Updates global state for name
  handleNameChange: function (text) {
    this.setState({ name: text });
  },
  componentDidMount: function () {
    this.state._isMounted = true;
    this.loadMessagesFromServer();
    setInterval(this.loadMessagesFromServer, POLL_INTERVAL);
  },
  componentWillUnmount: function () {
    this.state._isMounted = false;
  },
  render: function () {
    return (
      <div className="messageBox">
        <ChatLog data={this.state.data} name={this.state.name} />
        <ChatForm onMessageSubmit={this.handleMessageSubmit} onNameChange={this.handleNameChange} />
      </div>
    );
  }
});