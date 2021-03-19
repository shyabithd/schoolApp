import React, {Component} from 'react';
import MainLayout from '../../components/mainLayout'
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBIcon, MDBInput } from 'mdbreact';
import { store,database } from "../firebase";
import ModalPage from "../Modal";
import dynamic from 'next/dynamic';
import FileUpload from "../helpers/FileUpload";

const importJodit = () => import('jodit-react');

const JoditEditor = dynamic(importJodit, {
    ssr: false,
});

class Editor extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      content: '',
      onDataChanged: props.onDataChanged,
    }
    this.onBlur = this.onBlur.bind(this);
  };
  
  onBlur = (event) => { 
    const editorValue = event.target.innerHTML;
    console.log(editorValue);
    this.setState({content: editorValue});
    this.state.onDataChanged(this.state.content);
  };


  render() {
    let editor = '';
    let config = {
      readonly: false
    }
    return (
              <JoditEditor
                ref={editor}
                  value={this.state.content}
                  config={config}
                  tabIndex={1} // tabIndex of textarea
                  onBlur={this.onBlur} 
                  onChange={newContent => {}}
              />
          );
  }
}

function getArticleID () {
  return (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase();
}

class ArticleAdd extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      file: '',
      header: '',
      body: '',
      errorMessage: '',
      isError: false,
    }
    this.addArticle = this.addArticle.bind(this);
  }

  onClose = () => {
    this.setState({
     isError: false,
   });
  }

  
  handleChange = (e) => {
    this.setState({[e.target.name]:e.target.value})
  }

 onFileBrowsed = (file) => {
   this.setState({file: file});
 }

 addArticle = () => {
  console.log(this.state.file);
  if(this.state.file == '' || this.state.header == '' || this.state.body == '')
  {
    this.setState({isError: true, errorMessage: 'All fields are mandatory'});
  }
  else
  {
    let uuid = getArticleID();
    var storageRef = store.ref();
    var imageRef = storageRef.child('images/' + uuid + '/' + this.state.file.name);
    var today = new Date();
    var year = today.getFullYear();
    const month = today.toLocaleString('default', { month: 'long' });
    var obj = {
      key: uuid,
      year: year,
      month: month,
      date: year+'/'+month+'/'+today.getDate(),
      header: this.state.header,
      body: this.state.body,
    };
    imageRef.put(this.state.file).then((snapshot) => {
      console.log('Uploaded a blob or file!');
      database.ref('Articles/' + uuid).set(obj);
      database.ref('Images/' + uuid).set({key: uuid, name: this.state.file.name});
      this.setState({isError: true, errorMessage: 'Successfully save article'});
    });
    
  }
 }

 onDataChanged = (content) => {
  this.setState({body: content});
 }
 
  render() {
  return (
    <MDBContainer fluid className="mt-5" style={{ width: "700px"}} >
      {
        this.state.isError ?
        <ModalPage toggle={true} header="Error" error={this.state.errorMessage} onClose={() => this.onClose()}/>
        :
        <div></div>
      }
      <MDBRow>
        <MDBCol md="12">
          <form>
            <p className="h5 text-center mb-4">Add Article Page</p>
            <div className="grey-text" style={{textAlign: "-webkit-auto"}}>
              <MDBInput label="Article Header" value={this.state.header} name="header" icon="heading" group type="text" validate error="wrong"
                success="right" onChange={ (e) => this.handleChange(e) } />              
              <FileUpload onFileBrowsed={this.onFileBrowsed} type="image/*" />
              <Editor onDataChanged={this.onDataChanged}/>
            </div>
            <div className="text-center pt-5">
              <MDBBtn onClick={this.addArticle}>
                Add
                <MDBIcon far icon="paper-plane" className="ml-1" />
              </MDBBtn>
            </div>
          </form>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}
}

const AddArticlesPage = () => {
  const list = [];
  list.push(<ArticleAdd key="NewArticles"/>);

  return (
    <MainLayout children={list} />    
  );
};
    
export default AddArticlesPage;