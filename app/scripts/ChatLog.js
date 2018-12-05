import React from 'react';

import ChatMessage from './ChatMessage.js';

module.exports = React.createClass({
    render: function() {
      var messageNodes = this.props.data.map(function(message) {
        return (
          <ChatMessage timestamp={message.timestamp} author={message.author} key={message.timestamp}>
            {message.text}
          </ChatMessage>
        );
      });
      return (
        <div className="chatLog">
          {messageNodes}
        </div>
      );
    }
  });