import React from 'react';
import { MDBBtn, MDBCard, MDBCardHeader, MDBCardBody, MDBCardTitle, MDBCardText } from 'mdbreact';
import Router from 'next/router';

const CardLayout = (props) => 
{
  const onClick = () => {
    console.log(props.class);
    Router.push({pathname: '/view/student/assignment', query: {class: props.class, subject: props.subject, datetime: props.datetime, id: props.id} });
  }

  return (
    <MDBCard style={{ width: "22rem", marginTop: "1rem" }} className="d-inline-flex p-2">
    <MDBCardHeader color="default-color lighten-1">{props.subject}</MDBCardHeader>
    <MDBCardBody>
      <MDBCardTitle>{props.title}</MDBCardTitle>
      <MDBCardText>
      {props.description}
      </MDBCardText>
      <MDBBtn color="default-color" onClick={() => onClick()}>Go to Assignment</MDBBtn>
    </MDBCardBody>
    </MDBCard>
  );
}

export default CardLayout;
