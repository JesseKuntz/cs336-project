import React from 'react';
import {Link} from 'react-router';
import marked from 'marked';

module.exports = React.createClass({
    rawMarkup: function() {
      var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
      return { __html: rawMarkup };
    },

    render: function() {
      let classname = ''
      console.log(this.props.author)
      console.log("Jesse" === this.props.author)
      if ("Jesse" === this.props.author) {
        classname = "message right"
      } else {
        classname = "message"
      }
      return (
        <div className={classname}>
          <em className="messageAuthor">
            {this.props.author}
          </em>
          <span dangerouslySetInnerHTML={this.rawMarkup()} />
          <a href={this.props.data} download>Download File</a>
        </div>
      );
    }
  });