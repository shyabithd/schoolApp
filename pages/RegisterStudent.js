import React, { Component } from 'react';
import MainLayout from '../components/mainLayout'
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBIcon, MDBInput } from 'mdbreact';
import ModalPage from "./Modal";
import { database } from "./firebase";


class StudentRegistration extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: '',
      name: '',
      email: '',
      clz: '',
      errorMessage: '',
      isError: false,
      classes: props.classes,
    };
  }

writeUserData(Id, name, email, clz) {
  console.log(name+" "+email+" "+Id+" "+clz);
  database.ref('Students/' + Id).set({
   id: Id,
   name: name,
   email: email,
   class : clz,
 });
}

validateData = () => {

  if(this.state.id == '' || this.state.name == '' || this.state.email == '' || this.state.clz == '')
  {
    this.setState({isError: true, errorMessage: 'All fields are mandatory'});
    return false;
  }

  if(!this.state.classes.includes(this.state.clz))
  {
    this.setState({isError: true, errorMessage: 'Unknown class specified'});
    return false;
  }
  return true;
}

handleAdd = () =>
{
  if (this.validateData()) {
    this.writeUserData(this.state.id, this.state.name, this.state.email, this.state.clz);
    this.setState({isError: true, errorMessage: 'Successfully inserted student: '+ this.state.name});
  }
};

handleChange = (e) => {
    this.setState({[e.target.name]:e.target.value})
 }

 onClose = () => {
  this.setState({
   isError: false,
 });
}

render ()
{
  return (
  <MDBContainer>
    {
      this.state.isError ?
      <ModalPage toggle={true} header="Error" error={this.state.errorMessage} onClose={() => this.onClose()}/>
      :
      <div></div>
    }
    <MDBRow>
      <MDBCol md="12">
        <form>
          <p className="h5 text-center mb-4">Student Registry</p>
          <div className="grey-text">
            <MDBInput label="ID" icon="book" value={this.state.id} name="id" group type="text" validate error="wrong"
              success="right" onChange={ (e) => this.handleChange(e) } />
            <MDBInput label="Name" icon="user"  value={this.state.name} name="name" group type="text" validate error="wrong"
              success="right" onChange={ (e) => this.handleChange(e) } />
            <MDBInput label="Email" icon="envelope"  value={this.state.email} name="email" group type="email" validate error="wrong"
              success="right" onChange={ (e) => this.handleChange(e) } />
            <MDBInput label="Class" icon="tag"  value={this.state.clz} name="clz" group type="text" validate error="wrong" 
            success="right" onChange={ (e) => this.handleChange(e) } />
          </div>
          <div className="text-center">
            <MDBBtn onClick={this.handleAdd}>
              Add
              <MDBIcon far icon="add" className="ml-1" />
            </MDBBtn>
          </div>
        </form>
      </MDBCol>
    </MDBRow>
  </MDBContainer>
);
}
}

// function renderChild ()
// {
//   return (
//         <StudentRegistration/>
//     );
// }

// const StudentRegisterPage = () => {
//     const list = [];
//     list.push(renderChild());

//     return (
//       <MainLayout children={list} />    
//     );
//   }
    
export default StudentRegistration;