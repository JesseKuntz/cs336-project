import React from 'react';
import { Link } from 'react-router';
import marked from 'marked';

module.exports = React.createClass({
  rawMarkup: function () {
    var rawMarkup = marked(this.props.children.toString(), { sanitize: true });
    return { __html: rawMarkup };
  },

  hashCode(str) { // java String#hashCode
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
       hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  },

  intToRGB(i){
    var c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();

    return "#" + "00000".substring(0, 6 - c.length) + c + "80";
  },

  render: function () {
    let classname = ''
    if (this.props.name === this.props.author) {
      classname = "message right"
    } else {
      classname = "message"
    }
    var styles = {
      background: this.intToRGB(this.hashCode(this.props.author))
    }
    let dataClass = ''
    if (this.props.dataType == '') {
      dataClass += 'hide'
    }

    return (
      <div className={classname} style={styles}>
        <em className="messageAuthor">
          {this.props.author}
        </em>
        <span dangerouslySetInnerHTML={this.rawMarkup()} />
        <a className={dataClass} href={'/api/messages/' + this.props.timestamp + '/data'} download>Download File</a>
      </div>
    );
  }
});