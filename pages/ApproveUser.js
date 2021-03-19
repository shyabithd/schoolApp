import React, { Component } from 'react';
import MainLayout from '../components/mainLayout'
import { MDBBtn, MDBRow, MDBTable, MDBTableBody, MDBTableHead, MDBContainer } from 'mdbreact';
import { database, auth } from "./firebase";
import ModalPage from "./Modal"

class Approval extends Component {
  
  constructor(props) {
    super(props);
    this.handleLoad = this.handleLoad.bind(this);
    this.handleApprove = this.handleApprove.bind(this);
    this.handleDiscard = this.handleDiscard.bind(this);
      this.state = {
        isDataLoaded: false,
        isPopUp: false,
        header: '',
        errorMessage: '',
        rowData: [],
        userInfo: []
      }
  }

  componentDidMount() {
    window.addEventListener('load', this.handleLoad);
  }

  componentWillUnmount() { 
    window.removeEventListener('load', this.handleLoad)  
  }

  handleLoad() {
    this.getPendingUsers();
  }

  handleApprove = (e) => {
    let email = this.state.rowData[e.target.name].email;
    let id = this.state.rowData[e.target.name].id;
    let password = this.state.userInfo[e.target.name][id];
    let name = this.state.rowData[e.target.name].name;
    let roleId = this.state.rowData[e.target.name].role;
    console.log(this.state.userInfo);

    console.log(email+" "+password);
    auth.createUserWithEmailAndPassword(email, password).then((userData) => {
      console.log(userData.user);
      userData.user.sendEmailVerification().then( () => {
        console.log("Send Email" + id);
        database.ref('/Users/' + id).remove();
        database.ref('RegisteredUsers/' + name).set({
          email: email,
          id: id,
          name: name,
          roleId: roleId
        });
        this.setState({
          isPopUp: true,
          header: "Check inbox",
          errorMessage: 'Please check inbox to confirm user creation'
        });
      }).catch((error) => {
        console.log("Error: " + error.message);
        this.setState({
          isPopUp: true,
          header: "Error",
          errorMessage: error.message
        });
      });
  })
  .catch((error) => {
    var errorMessage = error.message;
    console.log("Error1: " + error.message);
    this.setState({
      isPopUp: true,
      header: "Error",
      errorMessage: errorMessage
    });
  });
  }

  handleDiscard = (e) => {
    let id = this.state.rowData[e.target.name].id;
    database.ref('/Users/' + id).remove();
  }

  onClose = () => {
    this.setState({
     isPopUp: false,
   });
  }

  getPendingUsers() 
  {
    database.ref('/Users/').on('value', (snapshot) => {
      let rowArr = [];
      let useInfo = [];
      const data = snapshot.val();
      var rowNum = 0;
      for (let key in data) {
        var obj = {};
        var info = {};
        obj['id'] = key;
        obj['name'] = data[key].name;
        obj['email'] = data[key].email;
        obj['role'] = data[key].roleId;
        info[key] = data[key].password;
        obj['handle'] = <MDBContainer className="d-flex justify-content-center">
          <MDBRow>
            <MDBBtn color="green" name={rowNum} outline size="sm" onClick={(evt) => this.handleApprove(evt)} >Approve</MDBBtn> 
            <MDBBtn color="red" name={rowNum} outline size="sm" onClick={(evt) => this.handleDiscard(evt)} >Discard</MDBBtn>
          </MDBRow>
          </MDBContainer>
  
        rowNum++;
        console.log(info);

        rowArr.push(obj);
        useInfo.push(info);
      }

      this.setState({rowData: rowArr, userInfo: useInfo});
      console.log(rowArr);
    });
  }

  renderChild()
  {

  let columns= [
    {
      label: 'ID',
      field: 'id',
      sort: 'asc'
    },
    {
      label: 'Name',
      field: 'name',
      sort: 'asc'
    },
    {
      label: 'Email',
      field: 'email',
      sort: 'asc'
    },
    {
      label: 'Role ID',
      field: 'role',
      sort: 'asc'
    },
    {
      label: 'Action',
      field: 'action',
      sort: 'asc'
    }
  ];

  return(
    <MDBContainer>
      {
        this.state.isPopUp ?
        <ModalPage toggle={true} header={this.state.header} error={this.state.errorMessage} onClose={() => this.onClose()}/> : <></>
      }
    <MDBTable btn>
      <MDBTableHead columns={columns} />
      <MDBTableBody rows={this.state.rowData} />
    </MDBTable>
    </MDBContainer>
  );
}
  render() {
    return (
      this.renderChild()
    );
  }
}

class ApproveUserPage extends Component {

  render() {
    
    return (
      <MainLayout children={<Approval />} />
    );
    };
  }
    
    export default ApproveUserPage;