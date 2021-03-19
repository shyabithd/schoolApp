import React, {Component, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router'
import { MDBContainer, MDBTable, MDBTableHead, MDBTableBody } from 'mdbreact';
import { connect } from 'react-redux';
import calstore from './CalendarStore'
import { database } from "../firebase";

class AttendanceSquare extends Component
{
  constructor(props) {
    super(props);
    this.state = {
        edible: this.props.edible,
        keyId: this.props.keyId,
        value: '',
        class: this.props.class,
        year: this.props.year,
        month: this.props.month,
        defaultVal: this.props.defaultVal,
    };
  }

  isValidCharacter(evt, key, obj) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    var keyVal = obj.props.keyId.split('_');
    let id = keyVal[0];
    let date = keyVal[1];
    let year = this.state.year;
    let month = this.state.month;
    let clz = this.state.class;

    var myVar = document.getElementById(obj.props.keyId);
    if (charCode === 120 || charCode === 88 || charCode === 16) {
      myVar.innerText = 'X';
      database.ref('Attendance/' + clz + '/' + year + '/' + month + '/' + id + '/' + date).set({value: 'X'});
      return true;
    } else if (charCode === 79 || charCode === 111) {
      database.ref('Attendance/' + clz + '/' + year + '/' + month + '/' + id + '/' + date).set({value: 'O'});
      myVar.innerText = 'O';
      return true;
    } else if (charCode === 32) {
      myVar.innerText = '';
      return true;
    } else {
      myVar.innerText = '';
    }
    return false;
  }

  render () {
    let dates = [];
    if (this.state.edible)
    {
      dates.push(<td id={this.state.keyId} key={this.state.keyId} contentEditable='true' minLength="1" maxLength="1" 
              onKeyUp={(event) => this.isValidCharacter(event, this.state.keyId, this)}>{this.props.defaultVal}</td>);
    }
    else
    {
      dates.push(<td ></td>);
    }
    return (
      <>{dates}</>
    );
  }
}

function mapStateToProps(state) {
    return {
      year: state.year,
      month: state.month
    };
}

function EmptyColumns(props)
{
  let weeksArr = DateMapper(props.year, props.month);
  let dates = [];
  Array.from(weeksArr, ([key, value]) => {
    
    let val = props.name+'_'+key+'_'+props.row;
    let defaultVal = '';
    if (props.attendance != undefined) {
      if (props.attendance[props.name] != undefined) {
        if (props.attendance[props.name][key] != undefined) {
          defaultVal = props.attendance[props.name][key].value;
        }
      }
      dates.push(<AttendanceSquare edible={props.edible} keyId={val} key={val} class={props.class} year={props.year} month={props.month} defaultVal={defaultVal} />);
    }
  }
  );

  return (
    <>{dates}</>
  );
}

function DateMapper (year, mo)
{
  let monthStart = new Date(year, mo, 1);
  // console.log("start month " + monthStart);
  let monthStartDayIdx = monthStart.getDay();

  let dateMap = new Map();
  var calStartDay = new Date(monthStart);

  let month = calStartDay.getMonth();
  while (month === calStartDay.getMonth())
  {
    dateMap.set(calStartDay.getDate(), calStartDay.getDay());
     calStartDay.setDate(calStartDay.getDate() + 1);
  }
  
  return dateMap;
}

function weekMapper(num)
{
  var dayOftheWeek = '';
  switch (num)
  {
    case 0:
      dayOftheWeek = 'Sun';
      break;
    case 1:
      dayOftheWeek = 'Mon';
      break;
    case 2:
      dayOftheWeek = 'Tue';
      break;
    case 3:
      dayOftheWeek = 'Wed';
      break;
    case 4:
      dayOftheWeek = 'Thu';
      break;
    case 5:
      dayOftheWeek = 'Fri';
      break;
    case 6:
      dayOftheWeek = 'Sat';
      break;
  }
  return dayOftheWeek;
}

function headerColumns(year, month)
{
  let weeksArr = DateMapper(year, month);
  let dates = [];

  Array.from(weeksArr, ([key, value]) => {
      var date = key + '\n' + weekMapper(value);
      dates.push(<th id={key} key={key}>{date}</th>);
    }
  );
  return dates;
}

const AttendanceSheet = (props) => {
    const router = useRouter();
    const clz = router.query.class;
    const isLoadedAttendances = useRef();
    const [students, setStudents] = useState();
    const [attendance, setAttendances] = useState();

    useEffect(() => {
      if (isLoadedAttendances.current != clz) {
        loadStudents();
        loadAttendances();
      }
    });
  
    const loadAttendances = () => {

      database.ref('/Attendance/'+ clz + '/' + props.year + '/' + props.month).on('value', (snapshot) => {
        const data = snapshot.val();
        setAttendances(data);
        isLoadedAttendances.current = clz;
      });
    }

    const loadStudents = () => {
      database.ref('/StudentsInClass/'+ clz).on('value', (snapshot) => {
        const data = snapshot.val();
        setStudents(data);
      });
    }
  
    let month = calstore.getState().month - 1;
    let year = calstore.getState().year;

    const createRows = () => {

      let arr = [];
      let i = 0;
      for (let key in students) {
        arr.push(
          <tr key={key}>
            <td>{students[key]}</td>
            <EmptyColumns edible={true} name={key} row={i} class={clz} year={props.year} month={props.month} attendance={attendance}/>
          </tr>
        );
        i++;
      }

      return (
        arr
      )
    }

    return (
        
        <MDBContainer className="slide-content" style={{overflow: "scroll"}}>
         {
          (month >= 0 && month < 12 && year > 2000) ? 
          <MDBTable className="mt-3" style={{overflow: "scroll"}}>
            <MDBTableHead color="default-color" textWhite>
              <tr>
                <th>Name</th>
                {headerColumns(year, month)}
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              {createRows()}
            </MDBTableBody>
          </MDBTable> : <h1>Invalid year/month</h1>
        }
        </MDBContainer>
    );
  }

  export default connect(mapStateToProps)(AttendanceSheet);
