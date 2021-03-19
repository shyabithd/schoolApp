import React, {Component} from "react";
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBInput, MDBBox } from 'mdbreact';
import Layout, { siteTitle } from '../components/layout'
import Head from 'next/head'
import { database } from "./firebase";
import ModalPage from "./Modal"

class RegisterForm extends Component {

  constructor(props) {
    super(props);
      this.state = {
        name: '',
        email: '',
        password: '',
        passwordAgain: '',
        roleId: '1',
        errorMessage: '',
        isError: false
      }
  }

  onClose = () => {
    this.setState({
     isError: false,
   });
  }

  handleClick = (e) => {
    if (this.state.email === '') {
      this.setState({isError: true, errorMessage: 'Email must be specified'});
    }
    else if (this.state.password != this.state.passwordAgain) {
      this.setState({isError: true, errorMessage: 'Password mismatched'});
    }
    else
    {
      this.writeUserData(this.state.name, this.state.email, this.state.password, this.state.roleId);
    }
  };

  handleChange = (e) => {
    this.setState({[e.target.name]:e.target.value})
 }

 writeUserData(name, email, password, roleId) {
   console.log(name+" "+email+" "+password+" "+roleId);
   let Id = (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase();
   database.ref('Users/' + Id).set({
    id: Id,
    name: name,
    email: email,
    password : password,
    roleId: roleId
  });
}

 render() {
return (
  <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <MDBContainer>
        {
          this.state.isError ?
          <ModalPage toggle={true} header="Error" error={this.state.errorMessage} onClose={() => this.onClose()}/>
          :
          <div></div>
        }
      <MDBRow>
        <MDBCol md="11">
          <form>
            <p className="h5 text-center mb-4">Sign up</p>
            <div className="grey-text">
            <MDBInput label="Your Name" value={this.state.name} name="name" icon="user" group type="name" validate error="wrong"
                success="right" data-error="Error" onChange={this.handleChange} required />
              <MDBInput label="Your email" value={this.state.email} name="email" icon="envelope" group type="email" validate error="wrong"
                success="right" data-error="Error" onChange={this.handleChange} required />
              <MDBInput label="Your password" value={this.state.password} name="password" icon="lock" group type="password" validate onChange={this.handleChange} required/>
              <MDBInput label="Your password Again" value={this.state.passwordAgain} name="passwordAgain" icon="lock" group type="password" validate onChange={this.handleChange} required/>
              <div class="md-form form-group">
                <select class="browser-default custom-select form-group" name="roleId" value={this.state.roleId} onChange={this.handleChange} >
                  <option defaultValue="Admin" value="1">Admin</option>
                  <option value="Student">Student</option>
                  <option value="Teacher">Teacher</option>
                </select>
                  </div>
            </div>
            <div className="text-center">
            <MDBBtn onClick={()=> this.handleClick() }>Register</MDBBtn>
            </div>
          </form>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
    </Layout>

);
}
}

export default RegisterForm;