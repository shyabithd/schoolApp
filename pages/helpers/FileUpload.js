import React, {Component} from 'react';

class FileUpload extends Component {

    constructor(props) {
      super(props);
      this.state = {
        onFileBrowsed: props.onFileBrowsed,
        type: props.type
      }
    }
    
    handleUpload = (event) => {
      this.state.onFileBrowsed(event.target.files[0]);
    }
  
    render() {
      return (
        <div id="upload-box" className="mb-5">
          <input type="file" accept={this.state.type} onChange={this.handleUpload} />
        </div>
      );
    }
  }

export default FileUpload;
