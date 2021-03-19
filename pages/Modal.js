import React, { Component } from "react";

require("firebase/auth");

import { MDBContainer, MDBBtn, MDBModal, MDBModalHeader, MDBModalBody, MDBModalFooter } from 'mdbreact';


class ModalPage extends Component {
  
    constructor(props) {
      console.log("Constructor called");
  
      super(props);
      this.state = {
        modal: props.toggle,
        header: props.header,
        error: props.error,
        onClose: props.onClose,
      }
    }
    
    toggle = () => {
      console.log("Constructor1 called");
      this.setState({
        modal: !this.state.modal
      });
      
      this.state.onClose();
    }
    
    render() {
      return (
      <MDBContainer>
        <MDBModal isOpen={this.state.modal} toggle={this.toggle}>
          <MDBModalHeader toggle={this.toggle}>{this.state.header}</MDBModalHeader>
          <MDBModalBody>
            {this.state.error}
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn onClick={this.toggle}>Close</MDBBtn>
          </MDBModalFooter>
        </MDBModal>
      </MDBContainer>
      );
    }
  }

  export default ModalPage;