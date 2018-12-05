import React from 'react';
import ReactDropzone from 'react-dropzone';

module.exports = React.createClass({
    getInitialState: function() {
      return {author: '', text: '', fileType: null, data: '', file: {}};
    },

    onDrop(file) {
      console.log(file[0]);
      this.setState({
        file: file,
        data: file[0].name
      });
      let extension = file[0].name.split('.').pop();
      if (extension === "png" || extension === "jpg" || extension === "svg") extension = "img";
      this.setState({fileType: extension});
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
    handleFileChange: function(e) {
      // check for filetypes here
      let extension = e.target.value;
      if (extension === "png" || extension === "jpg" || extension === "svg") extension = "img";
      this.setState({fileType: extension});
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
                  <li key={this.state.file.name}>{this.state.file.name} - {this.state.file.size} bytes</li>
                }
              </ul>
            </aside>
          </section>

        </form>
      );
    }
  });