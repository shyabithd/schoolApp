import React, {useState} from 'react';
import MainLayout from '../../components/mainLayout'
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBIcon, MDBInput } from 'mdbreact';
import { database,store } from "../firebase";
import ModalPage from "../Modal";
import FileUpload from "../helpers/FileUpload";
import "react-datetime/css/react-datetime.css";
import Datetime from "react-datetime";
import configureStore from "../Configure";

function getID () {
  let Id = (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase();
  return Id;
}

const CreateAssignment = () =>
{

  const [title, setTitle] = useState();
  const [clz, setClass] = useState();
  const [subject, setSubject] = useState();
  const [description, setDescription] = useState();
  const [isError, setPopUp] = useState();
  const [file, setFile] = useState();
  const [date, setDate] = useState();
  const [time, setTime] = useState();

  const handleChange = (e) => {
    if (e.target.name === 'Subject') {
        setSubject(e.target.value);
    } else if (e.target.name === 'Title') {
        setTitle(e.target.value);
    } else if (e.target.name === 'Description') {
        setDescription(e.target.value);
    } else if (e.target.name === 'clz') {
      setClass(e.target.value);
    }
  }

  const handleAdd = () => {
    let Id = getID();
    let queryPath = 'Assignments/' + clz + '/' + subject + '/' + date + time;
    database.ref(queryPath).set({
      id: Id,
      title: title,
      class: clz,
      subject: subject,
      description: description,
      date: date,
      time: time,
      file: file.name,
    });
    var storageRef = store.ref();
    var imageRef = storageRef.child('assignments/' + clz + '/' + subject + '/' + date + time + '/' + file.name);
    imageRef.put(file).then((snapshot) => {
        console.log('Uploaded a blob or file!');
    });
    setPopUp(true);
  }

  const onClose = () => {
    setPopUp(false);
  }

  const onFileBrowsed = (file) => {
    setFile(file);
  }

  const onChange = (e) => {
    setDate(e.format('YYYYMMDD'));
    setTime(e.format('hmmSS'));
  }

  const classList = () => {
    let arr = [];
    const { reduxstore, persistor } = configureStore();
    // console.log(reduxstore.getState());
    reduxstore.getState().userData.obj.classes.forEach( (e, i) => (arr.push(<option value={e}>{e}</option>)) );
    return (
      arr
    )
  }

  return (
  <MDBContainer fluid className="mt-5" style={{ width: "700px"}} >
    {
      isError ?
      <ModalPage toggle={true} header="Success" error="Successfully saved assignment" onClose={() => onClose()}/>
      :
      <div></div>
    }
    <MDBRow>
      <MDBCol md="12">
        <form >
          <p className="h5 text-center mb-4">Add Assigments</p>
          <div className="grey-text" style={{textAlign: "-webkit-auto"}}>
            <MDBInput label="Subject" value={subject} name="Subject" icon="user" group type="text" validate error="wrong" success="right" 
              onChange={ (e) => handleChange(e) } />
            <MDBInput label="Title" value={title} name="Title" icon="envelope" group type="email" validate error="wrong" success="right" 
              onChange={ (e) => handleChange(e) } />
            <MDBInput label="Description" value={description} name="Description" icon="tag" group type="text" validate error="wrong" success="right" 
              onChange={ (e) => handleChange(e) } />
            <Datetime className="mb-5" onChange={e => onChange(e)}/>
            <div class="md-form form-group">
                <select class="browser-default custom-select form-group" name="clz" value={clz} onChange={(e) => handleChange(e)} >
                  {classList()}
                </select>
            </div>
            <FileUpload onFileBrowsed={onFileBrowsed} type="application/pdf" />
          </div>
          <div className="text-center">
            <MDBBtn onClick={handleAdd}>
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

const AddAssignmentPage = () => {
    const list = [];
    list.push(<CreateAssignment key="CreateAssignment"/>);

    return (
      <MainLayout children={list} />    
    );
    };
    
    export default AddAssignmentPage;