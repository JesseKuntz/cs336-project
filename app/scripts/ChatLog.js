import React from 'react';

import ChatMessage from './ChatMessage.js';

module.exports = React.createClass({
    render: function() {
      var authorName = this.props.name
      var messageNodes = this.props.data.map(function(message) {
        return (
          <ChatMessage timestamp={message.timestamp} author={message.author} key={message.timestamp} name={authorName} dataType={message.file_type}>
            {message.text}
          </ChatMessage>
        );
      });
      return (
        <div className="chatLog">
          <div className="top-spacer"></div>
          {messageNodes}
          <div className="bottom-spacer"></div>
        </div>
      );
    }
  });