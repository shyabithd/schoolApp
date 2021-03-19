import React from 'react';
import { MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavbarToggler, MDBCollapse, 
  MDBNavItem, MDBContainer, MDBFormInline, MDBBtn, MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem } from 'mdbreact';
import styles from './layout.module.css'
import Link from 'next/link'
import ModalPage from "../pages/Modal"
import { auth } from "../pages/firebase";
import mapStateToProps from '../pages/reducer/mapStateToProp'
import configureStore from "../pages/Configure";
import { connect } from 'react-redux'
import Router from 'next/router'
import MultiMenus from '../pages/helpers/MultiMenu';

class MainLayout extends React.Component {

constructor(props) {
  super(props);
  this.onRefresh = this.onRefresh.bind(this);

  this.state = {
    collapse: false,
    isError: false,
    errorMessage: '',
    children: props.children,
  };
  
  this.onClick = this.onClick.bind(this);
  this.handleClick = this.handleClick.bind(this);
}

onClose = () => {
  console.log("Close called");
  this.setState({
   isError: false,
 });
}

onRefresh() {
  console.log("refresh required"); 
}

onClick() {
  this.setState({
    collapse: !this.state.collapse,
  });
}

logoff() {
  auth.signOut().then(() => {
    this.props.dispatch({ type: 'UPDATE_STATE', user: '', classes: '', subjects: ''});
    Router.push('/');
  }).catch((error) => {
    console.log(error); 
    this.setState({
      isError: true,
      errorMessage: 'User logout failed'
    });
    
  });
}

handleClick() {
  this.logoff();
};

renderClass = (obj) => {

  return (
    <MDBDropdownItem key={obj}>
      <Link href={{
          pathname: "/Attendance",
          query: {class: obj} 
        }}>
        <a>{obj}</a>
      </Link>
    </MDBDropdownItem>
  )
}

renderClasses = (obj) => {

  let arr = [];
  let number = 1;
  for (let data in obj) {
    for (let i in obj[data]) {
      // console.log(obj[data][i]);
      arr.push(this.renderClass(obj[data][i]));
    }
    arr.push(<MDBDropdownItem divider key={"dropdownitem" + number}/>);
    number++;
  }
 return (
  <MDBDropdownMenu color="default-color">
    {arr}
  </MDBDropdownMenu>
 )
}

render() {
  
  const { reduxstore, persistor } = configureStore();
  // console.log(reduxstore.getState());

  var obj = {};
  reduxstore.getState().userData.obj.classes.forEach((e, i) => (i = parseInt(e, 10), obj[i] ? obj[i].push(e) : (obj[i] = [e])));
  
  const assignmentMenu = [];
  reduxstore.getState().userData.obj.classes.forEach( (e, i) => (
    // console.log(reduxstore.getState().userData.obj.subjects),
    assignmentMenu.push({label: e, submenu: reduxstore.getState().userData.obj.subjects.map( (subject) => { return { label: subject } } )})
  ));

  if (reduxstore.getState().userData.obj.user === '')
  {
    Router.push('/');
    return <p>Redirecting...</p>
  }
  else
  {
    const container = { height: 1300 }
    return (
      <div>
        <>
          <MDBNavbar color='default-color' dark expand='md'>
            <MDBNavbarBrand>
              <img
                  src="/images/SCM.png"
                  className={`${styles.navImage}`}
                  alt="{name}"
                />
            </MDBNavbarBrand>
            <MDBNavbarToggler onClick={this.toggleCollapse} />
            <MDBCollapse id='navbarCollapse3' isOpen={this.state.isOpen} navbar>
              <MDBNavbarNav left>
                <MDBNavItem>
                  <Link href='/Home'>
                    <a className='nav-link'>Home</a>
                  </Link>
                </MDBNavItem>
                <MDBNavItem>
                  <MDBDropdown>
                    <MDBDropdownToggle nav caret color="default-color">Attendance</MDBDropdownToggle>
                    {this.renderClasses(obj)}
                  </MDBDropdown>
                </MDBNavItem>
                <MDBNavItem>
                  <MDBDropdown>
                    <MDBDropdownToggle nav caret color="default-color">Assignments</MDBDropdownToggle>
                    <MDBDropdownMenu color="default-color">
                      <MultiMenus menus={assignmentMenu} />
                    </MDBDropdownMenu>
                      
                  </MDBDropdown>
                
                </MDBNavItem>
                <MDBNavItem>
                  <Link href='/Blogs'>
                    <a className='nav-link'>News</a>
                  </Link>
                </MDBNavItem>
                <MDBNavItem>
                  <Link href='/About'>
                    <a className='nav-link'>About School</a>
                  </Link>
                </MDBNavItem>
                <MDBNavItem>
                  <Link href='/Contact'>
                    <a className='nav-link'>Contact Us</a>
                  </Link>
                </MDBNavItem>
              </MDBNavbarNav>
              <MDBNavbarNav right>
                <MDBNavItem>
                  <MDBFormInline waves>
                    <div className='md-form my-0'>
                      <input
                        className='form-control mr-sm-2'
                        type='text'
                        placeholder='Search'
                        aria-label='Search'
                      />
                    </div>
                  </MDBFormInline>
                </MDBNavItem>
                <MDBNavItem>
                  <MDBBtn outline color="white" onClick={()=> this.handleClick() }>Logoff</MDBBtn>
                </MDBNavItem>
              </MDBNavbarNav>
            </MDBCollapse>
          </MDBNavbar>
        </>
          <MDBContainer fluid style={container} className="text-center mt-1">
            {
              this.state.isError ?
              <ModalPage toggle={true} header="Error" error={this.state.errorMessage} onClose={() => this.onClose()}/>
              :
              <div></div>
            }
            <main style= {{width: "auto", height: "auto"}}> 
            {this.state.children}
            </main>
          </MDBContainer>
        </div>
    )
          }
}
}

export default connect(mapStateToProps)(MainLayout);