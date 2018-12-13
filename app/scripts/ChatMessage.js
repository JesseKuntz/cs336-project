import React from 'react';
import marked from 'marked';

module.exports = React.createClass({
  rawMarkup: function () {
    var rawMarkup = marked(this.props.children.toString(), { sanitize: true });
    return { __html: rawMarkup };
  },

  // Converts a string to a hash code
  hashCode(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
       hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  },

  // Converts a hash code to RGB
  intToRGB(i){
    var c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();

    return "#" + "00000".substring(0, 6 - c.length) + c + "80";
  },

  render: function () {
    // Moves the messages to the left and right depending on current author name
    let classname = ''
    if (this.props.name === this.props.author) {
      classname = "message right"
    } else {
      classname = "message"
    }

    // Hashes the author's name into a background color for the message
    var styles = {
      background: this.intToRGB(this.hashCode(this.props.author))
    }

    // Hides the download link if no data for that message
    let dataClass = ''
    if (this.props.dataType == '') {
      dataClass += 'hide'
    }

    return (
      <div className={classname} style={styles}>
        <em className="messageAuthor">
          {this.props.author}
        </em>
        <p dangerouslySetInnerHTML={this.rawMarkup()} />
        <a className={dataClass} href={'/api/messages/' + this.props.timestamp + '/data'} download>Download File</a>
      </div>
    );
  }
});