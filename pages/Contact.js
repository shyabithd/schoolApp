import React, {useState} from 'react';
import MainLayout from '../components/mainLayout'
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBIcon, MDBInput } from 'mdbreact';
import { database } from "./firebase";
import ModalPage from "./Modal";

function getID () {
  let Id = (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase();
  return Id;
}

const Contact = () =>
{

  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [subject, setSubject] = useState();
  const [msg, setMsg] = useState();
  const [isError, setPopUp] = useState();

  const handleChange = (e) => {
    if (e.target.name === 'Name') {
      setName(e.target.value);
    } else if (e.target.name === 'Email') {
      setEmail(e.target.value);
    } else if (e.target.name === 'Subject') {
      setSubject(e.target.value);
    } else if (e.target.name === 'Msg') {
      setMsg(e.target.value);
    }
  }

  const handleAdd = () => {
    let Id = getID();
    let queryPath = 'Queries/' + Id;
    database.ref(queryPath).set({
      id: Id,
      name: name,
      email: email,
      subject : subject,
      msg : msg,
    }), setPopUp(true),
    window.open('mailto:'+email+'?subject='+subject+'&body='+msg);
  }

  const onClose = () => {
    setPopUp(false);
  }

  return (
  <MDBContainer fluid className="mt-5" style={{ width: "700px"}} >
    {
      isError ?
      <ModalPage toggle={true} header="Success" error="Successfully saved contact Info" onClose={() => onClose()}/>
      :
      <div></div>
    }
    <MDBRow>
      <MDBCol md="12">
        <form>
          <p className="h5 text-center mb-4">Write to us</p>
          <div className="grey-text">
            <MDBInput label="Your name" value={name} name="Name" icon="user" group type="text" validate error="wrong" success="right" 
              onChange={ (e) => handleChange(e) } />
            <MDBInput label="Your email" value={email} name="Email" icon="envelope" group type="email" validate error="wrong" success="right" 
              onChange={ (e) => handleChange(e) } />
            <MDBInput label="Subject" value={subject} name="Subject" icon="tag" group type="text" validate error="wrong" success="right" 
              onChange={ (e) => handleChange(e) } />
            <MDBInput type="textarea" value={msg} name="Msg" rows="2" label="Your message" icon="pencil-alt" 
              onChange={ (e) => handleChange(e) } />
          </div>
          <div className="text-center">
            <MDBBtn onClick={handleAdd}>
              Send
              <MDBIcon far icon="paper-plane" className="ml-1" />
            </MDBBtn>
          </div>
        </form>
      </MDBCol>
    </MDBRow>
  </MDBContainer>
);
}

const ContactPage = () => {
    const list = [];
    list.push(<Contact key="Contact"/>);

    return (
      <MainLayout children={list} />    
    );
    };
    
    export default ContactPage;