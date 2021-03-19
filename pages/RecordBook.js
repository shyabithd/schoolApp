import React from 'react';
import MainLayout from '../components/mainLayout'
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';

function renderChild ()
{
  return (
    <MDBTable className="mt-3">
      <MDBTableHead color="default-color" textWhite>
        <tr>
          <th>Subject</th>
          <th>1st Term</th>
          <th>2nd Term</th>
          <th>3rd Term</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        <tr>
          <td>Maths</td>
          <td>100</td>
          <td>80</td>
          <td>70</td>
        </tr>
        <tr>
          <td>Science</td>
          <td>83</td>
          <td>54</td>
          <td>78</td>
        </tr>
        <tr>
          <td>English</td>
          <td>90</td>
          <td>91</td>
          <td>81</td>
        </tr>
        <tr>
          <td>Average</td>
          <td>91.5</td>
          <td>76</td>
          <td>80</td>
        </tr>
        <tr>
          <td>Rank</td>
          <td>01/03</td>
          <td>03/03</td>
          <td>02/03</td>
        </tr>
      </MDBTableBody>
    </MDBTable>
  );
}

const RecordBookPage = () => {
    const list = [];
    list.push(renderChild());

    return (
      <MainLayout children={list} />    
    );
    };
    
    export default RecordBookPage;