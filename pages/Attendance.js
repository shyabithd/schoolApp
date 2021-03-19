import React , { Component } from 'react';
import MainLayout from '../components/mainLayout'
import { MDBContainer, MDBRow } from 'mdbreact';
import YearMonthPicker from './helpers/YearMonthPicker'
import AttendanceSheet from './helpers/AttendanceSheet'
import store from './helpers/CalendarStore'
import { Provider } from 'react-redux';

function renderChild ()
{
  return (
    <Provider store={store} key={AttendancePage}>
      <MDBContainer>
        <MDBRow>
          <YearMonthPicker/>
        </MDBRow>
        <MDBRow >
        <AttendanceSheet/>
        </MDBRow>
      </MDBContainer>
    </Provider>
  );
}

class AttendancePage extends Component {

render () {
    const list = [];
    list.push(renderChild());

    return (
      <MainLayout children={list} />    
    );
    };
}  

export default AttendancePage;
