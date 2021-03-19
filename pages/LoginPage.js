import Head from 'next/head'
import Link from 'next/link'
import Layout, { siteTitle } from '../components/layout'
import styles from '../components/layout.module.css'
import React, { Component } from "react";
import Router from 'next/router'
import { auth } from "./firebase";
import ModalPage from "./Modal"
import { connect } from 'react-redux';
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn, } from 'mdbreact';
import mapStateToProps from './reducer/mapStateToProp';
import { database } from "./firebase";

require("firebase/auth");

class LoginPage extends Component {

  constructor(props) {
    super(props);
      this.state = {
        userName: '',
        password: '',
        isError: false,
        errorMessage: ''
      }
  }

  updateState = (obj) => {
    database.ref('/Classes/').on('value', (snapshot) => {
      let classes = [];
      const data = snapshot.val();
      for (let key in data) {
        classes.push(key);
      }
      
      database.ref('/Subjects/').on('value', (snapshot) => {
        let subjects = [];
        const data = snapshot.val();
        for (let key in data) {
          subjects.push(key);
        }
        this.props.dispatch({ type: 'UPDATE_STATE', user: obj, classes: classes, subjects: subjects});
        Router.push('/Home');
      });
    });
  }

  login(userName, password) {

    console.log("Login clicked");
    auth.signInWithEmailAndPassword(userName, password)
    .then((userData) => {
      console.log(userData.user);
      if (userData.user.emailVerified === true)
      {
        database.ref('RegisteredUsers/').on('value', (snapshot) => {

          let data = snapshot.val();
          let role = 0;
          for (let key in data) {
              if (data[key].email === userName) {
                role = data[key].roleId;
                break;
              }
          }
          let obj = { email: userData.user.email, 
            lastLoginAt: userData.user.lastLoginAt, 
            // expirationTime: userData.user.stsTokenManager.expirationTime, 
            // accessToken: userData.user.stsTokenManager.accessToken, 
            // refreshToken: userData.user.stsTokenManager.refreshToken,
            emailVerified: userData.user.emailVerified,
            role: role};
          this.updateState(obj);
        });
      }
      else
      {
        console.log("error reported");
        this.setState({
        isError: true,
        errorMessage: "Email verification is required."
      });
      }
    })
    .catch((error) => {
      console.log("error reported");
      this.setState({
        isError: true,
        errorMessage: error.message
      });
    });
  }

  handleClick = (e) => {
      this.login(this.state.userName, this.state.password);
  };

  handleChange = (e) => {
    this.setState({[e.target.name]:e.target.value})
 }

 onClose = () => {
   console.log("Close called");
   this.setState({
    isError: false,
  });
 }

  render() {

  var user = auth.currentUser;
  console.log("userID: "+ user);
  // if (user)
  // {
  //   this.props.dispatch({ type: 'CREATE_USER', user: user });
  //   Router.push({ pathname: '/Home' });
  //   return <p>Redirecting...</p>
  // }
  // else
  // {
    return (
      <Layout home>
          <Head>
            <title>{siteTitle}</title>
          </Head>
            <MDBContainer style= {{height: "100"}}>
              {
                this.state.isError ?
                <ModalPage toggle={true} header="Error" error={this.state.errorMessage} onClose={() => this.onClose()}/>
                :
                <div></div>
              }
              <MDBRow className="justify-content-center align-self-center">
                <MDBCol md="6">
                  <form>
                    <p className="h5 text-center mb-4">Sign in</p>
                    <div className="grey-text">
                      <MDBInput value={this.state.userName} name="userName"  label="Type your email" icon="envelope" group type="email" validate error="wrong"
                        onChange={this.handleChange} success="right" />
                      <MDBInput value={this.state.password} name="password" label="Type your password" icon="lock" group type="password" validate onChange={this.handleChange} />
                    </div>
                    <div className="text-center">
                      <MDBBtn onClick={()=> this.handleClick() }>Login</MDBBtn>
                    </div>
                  </form>
                </MDBCol>
              </MDBRow>
              <div className={styles.backToHome}>
              <Link href="/RegisterForm">
              <p>Not Yet Registered? Click <a>here</a>.</p> 
              </Link>
            </div>
          </MDBContainer>
        </Layout>
    );
  // }
};
}

export default connect(mapStateToProps)(LoginPage);