import { forwardRef } from 'react';
import MaterialTable from 'material-table'
import React , { Component } from 'react';
import { database } from "./firebase";
import MainLayout from '../components/mainLayout'
import ModalPage from "./Modal"
import StudentRegistration from "./RegisterStudent"
import { MDBContainer, MDBBtn, MDBIcon, MDBModal, MDBModalHeader, MDBModalBody, MDBModalFooter } from 'mdbreact';

import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
  };

  class AddUserPage extends Component {
  
    constructor(props) {
      console.log("Constructor called");
  
      super(props);
      this.state = {
        modal: props.toggle,
        onClose: props.onClose,
        classes: props.classes,
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
          <MDBModalHeader toggle={this.toggle}>Add User</MDBModalHeader>
          <MDBModalBody>
              <StudentRegistration classes={this.state.classes}/>
          </MDBModalBody>
          <MDBModalFooter>
          </MDBModalFooter>
        </MDBModal>
      </MDBContainer>
      );
    }
  }

class StudentRegistry extends Component {

    constructor(props) {
      super(props);
      this.state = {
          columns: [{title: 'ID', field: 'id', align: 'left'},
                    {title: 'Name', field: 'name', align: 'left'},
                    {title: 'Email', field: 'email', align: 'left'},
                    {title: 'Class', field: 'class', align: 'left'}],
          rowData: [],
          classes: [],
          isError: false,
          isPopupRequired: false,
          errorMessage: ''
      }
    }

    componentDidMount() {
      this.getClassesList();
      this.getStudentRegistry();
    }

    onClose = () => {
      this.setState({
       isError: false,
     });
    }
    
    getClassesList = () => {
      database.ref('/Classes/').on('value', (snapshot) => {
        let rowArr = [];
        const data = snapshot.val();
        var rowNum = 0;
        for (let key in data) {
          rowNum++;
          rowArr.push(key);
        }
  
        this.setState({classes: rowArr});
      });
    }

    getStudentRegistry = () => {

      database.ref('/Students/').on('value', (snapshot) => {
        let rowArr = [];
        const data = snapshot.val();
        var rowNum = 0;
        for (let key in data) {
          var obj = {};
          console.log(data);
          obj['id'] = key;
          obj['name'] = data[key].name;
          obj['email'] = data[key].email;
          obj['class'] = data[key].class;
    
          rowNum++;
          rowArr.push(obj);
        }
  
        this.setState({rowData: rowArr});
      });
    }

    addUser = () => {
      this.setState({isPopupRequired: true});
    }

    onCloseAdd = () => {
      this.setState({isPopupRequired: false});
    }
    
    render() {
        return (
          <MDBContainer className="slide-content pt-5">
            {
              this.state.isError ?
              <ModalPage toggle={true} header="Error" error={this.state.errorMessage} onClose={() => this.onClose()}/>
              :
              <div></div>
            }
            {
              this.state.isPopupRequired ?
              <AddUserPage toggle={true} onClose={() => this.onCloseAdd()} classes={this.state.classes}/>
              :
              <div></div>
            }
          <MaterialTable 
            icons={tableIcons}
            title="Student Registry"
            columns={this.state.columns}
            data={this.state.rowData}
            cellEditable={{
              onCellEditApproved: (newValue, oldValue, rowData, columnDef) => {
                return new Promise((resolve, reject) => {
                  let arr = this.state.rowData;
                  console.log(this.state.classes.includes(newValue)+  " " + columnDef.field);
                  if (columnDef.field == 'class') {
                    console.log('1');
                    if (!this.state.classes.includes(newValue)) {
                      console.log('2');
                      this.setState({errorMessage: 'Invalid class: ' + newValue, isError: true});
                      reject = true;
                      setTimeout(resolve, 100);
                      return;
                    }
                  }
                  arr[rowData.tableData.id][columnDef.field] = newValue;
                  this.setState({rowData: arr});
                  setTimeout(resolve, 100);
                });
              }
            }}
          />
          <div className="text- pt-5 align-left" style={{float: "right"}}>
            <MDBBtn onClick={()=> this.addUser() }>
              Add
              <MDBIcon far icon="paper-plane" className="ml-1" />
            </MDBBtn>
          </div>
          </MDBContainer>
        )
      };
}

const StudentRegistryPage = () => {
  return (
    <MainLayout children={<StudentRegistry />} />    
  );

}

export default StudentRegistryPage;
