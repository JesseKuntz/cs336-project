import React from 'react';
import ReactDropzone from 'react-dropzone';
import { Line } from 'rc-progress';

module.exports = React.createClass({
  getInitialState: function () {
    return { author: '', text: '', fileType: null, data: '', file: {}, completed: 0};
  },
  componentDidMount: function () {
    this.checkCookie();
  },

  setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  },
  getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  },
  checkCookie() {
    var user = this.getCookie("username");
    if (user != "") {
      this.setState({author: user});
      this.props.onNameChange(user);
    }
  },

  onDrop(file) {
    this.setState({completed: 0})
    const reader = new FileReader();

    reader.addEventListener("load", function () {
      this.setState({ data: reader.result })
    }.bind(this), false);

    reader.onprogress = function(e) {
      var percent = Math.floor(e.loaded);
      if (percent >= 100) {
        this.setState({ completed: 100 });
      } else {
        this.setState({ completed: percent });
      }
    }.bind(this);

    if (file[0]) {
      reader.readAsDataURL(file[0]);
    }
    let extension = file[0].name.split('.').pop();
    console.log(extension);
    this.setState({ fileType: extension, file: file[0] });
  },
  onCancel() {
    this.setState({
      file: {}
    });
  },

  handleAuthorChange: function (e) {
    this.setState({ author: e.target.value, name: e.target.value});
    this.props.onNameChange(e.target.value);
    this.setCookie("username", e.target.value, 365)
  },
  handleTextChange: function (e) {
    this.setState({ text: e.target.value });
  },
  handleSubmit: function (e) {
    e.preventDefault();
    var author = this.state.author.trim();
    var text = this.state.text.trim();
    var fileType = this.state.fileType;
    var data = this.state.data;
    if (!text || !author) {
      return;
    }
    this.props.onMessageSubmit({ author: author, text: text, fileType: fileType, data: data });
    this.setState({ text: '', completed: 0});
    this.setCookie("username", author, 365);
  },
  render: function () {
    return (
      <form className="chatForm" onSubmit={this.handleSubmit}>
        <input
          className={this.state.author == "" ? "authorInput invalid" : "authorInput"}
          display="none"
          type="text"
          placeholder="Your name"
          value={this.getCookie("username")}
          onChange={this.handleAuthorChange}
        />
        <input
          className="textInput"
          type="text"
          placeholder="Say something..."
          value={this.state.text}
          onChange={this.handleTextChange}
        />
        <input type="submit" value="Post" className="chatSubmit" />
        <Line className="progress-bar" percent={this.state.completed} />
        <section className="drop-area">
          <div className="dropzone-container">
            <ReactDropzone
              className="dropzone"
              onDrop={this.onDrop}
              onFileDialogCancel={this.onCancel}
            >
              <p>Try dropping some files here, or click to select files to upload.</p>
            </ReactDropzone>
          </div>
          <aside
            className="drop-info">
            <p>Dropped files</p>
            <ul>
              {
                <li>{this.state.file.name} - {this.state.file.size} bytes (type: {this.state.fileType})</li>
              }
            </ul>
          </aside>
        </section>
      </form>
    );
  }
});