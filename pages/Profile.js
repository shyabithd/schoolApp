import React from 'react';
import MainLayout from '../components/mainLayout'
import {  MDBContainer, MDBRow,  MDBCard, MDBCardBody,  MDBIcon, MDBCol, MDBCardImage, MDBCardText, MDBCardTitle } from "mdbreact";

function renderChild ()
{
  return (
      <MDBRow fluild className="mt-1" style={{ width: "auto"}}>
        <MDBCol/>
        <MDBCol md="12" lg="4">
          <MDBCard personal className="my-5">
            <MDBCardImage
              top
              src="https://mdbootstrap.com/img/Photos/Avatars/img%20(29).jpg"
              alt="MDBCard image cap"
            />
            <MDBCardBody>
              <MDBCardTitle>
                <a href="#!" className="title-one">
                  Clara
                </a>
              </MDBCardTitle>
              <p className="card-meta">Joined in 2013</p>
              <MDBCardText>Clara is an Excelent student.</MDBCardText>
              <hr />
                <a href="/RecordBook" className="card-meta">
                <span>
                  <MDBIcon icon="book" />
                  &nbsp;&nbsp; Record Book
                </span>
              </a>
              <MDBRow className="mt-2"/>
              <a href="/Attendance" className="card-meta">
                <span>
                  <MDBIcon icon="book" />
                  &nbsp;&nbsp; Attendance
                </span>
              </a>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
        <MDBCol/>
      </MDBRow>
  );
}

const ProfilePage = () => {
    const list = [];
    list.push(renderChild());

    return (
      <MainLayout children={list} />    
    );
    };
    
    export default ProfilePage;