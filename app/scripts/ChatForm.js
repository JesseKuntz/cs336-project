import React from 'react';
import ReactDropzone from 'react-dropzone';

module.exports = React.createClass({
    getInitialState: function() {
      return {author: '', text: '', fileType: null, data: '', file: {}};
    },

    onDrop(file) {
      const reader = new FileReader();

      reader.addEventListener("load", function () {
        this.setState({data: reader.result})
      }.bind(this), false);

      if (file[0]) {
        reader.readAsDataURL(file[0]);
      }
      this.setState({fileType: file[0].type, file: file[0]});
    },
    onCancel() {
      this.setState({
        file: {}
      });
    },

    handleAuthorChange: function(e) {
      this.setState({author: e.target.value});
    },
    handleTextChange: function(e) {
      this.setState({text: e.target.value});
    },
    handleSubmit: function(e) {
      e.preventDefault();
      var author = this.state.author.trim();
      var text = this.state.text.trim();
      var fileType = this.state.fileType;
      var data = this.state.data;
      if (!text || !author) {
        return;
      }
      this.props.onMessageSubmit({author: author, text: text, fileType: fileType, data: data});
      this.setState({author: '', text: ''});
    },
    render: function() {
      return (
        <form className="chatForm" onSubmit={this.handleSubmit}>
          <input
            type="text"
            placeholder="Your name"
            value={this.state.author}
            onChange={this.handleAuthorChange}
          />
          <input
            type="text"
            placeholder="Say something..."
            value={this.state.text}
            onChange={this.handleTextChange}
          />
          <input type="submit" value="Post" />
          <section>
            <div className="dropzone">
              <ReactDropzone
                onDrop={this.onDrop}
                onFileDialogCancel={this.onCancel}
              >
                <p>Try dropping some files here, or click to select files to upload.</p>
              </ReactDropzone>
            </div>
            <aside>
              <h2>Dropped files</h2>
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