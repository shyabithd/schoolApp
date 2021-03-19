import React, { useState, useEffect, useRef } from 'react';
import { MDBIcon, MDBContainer, MDBTable, MDBTableHead, MDBTableBody, MDBRow, MDBInput, MDBBtn } from "mdbreact";
import Link from 'next/link';
import MainLayout from '../../../components/mainLayout'
import { useRouter } from 'next/router';
import { store,database } from "../../firebase";

const AssignmentTable = (props) => {

    const isLoaded = useRef();
    const [rows, setRows] = useState();
    const [mark, setMark] = useState();

    useEffect(() => {
        if (isLoaded.current === undefined) {
            loadAssignmentAnswers();
        }
    });

    const handleChange = (e) => {
        if (e.target.name === 'Mark') {
            setMark(e.target.value);
        }
    }

    const handleAdd = (e) => {
        if (e.target.name === 'Mark') {
            setMark(e.target.value);
        }
    }

    const loadAssignmentAnswers = () => {

      database.ref('AssignmentAnswers/' +  props.class + '/' + props.subject + '/' + props.datetime).on('value', (snapshot) => {
        let rowArr = [];
        const data = snapshot.val();
        let i = 0;
        for (let key in data) {
            store.ref().child('assignmentanswers/' + props.class + '/' + props.subject + '/' + props.datetime + '/' + key + '/' + data[key]['file']).getDownloadURL().then((url) => {
                var obj = {};
                obj['name'] = data[key]['user'];
                obj['title'] = data[key]['title'];
                obj['answers'] = <div className="d-flex justify-content-between">
                                    <a href={url} >
                                        <p className="font-weight-bold">
                                            <MDBIcon icon="book" className="pr-2" />
                                            {data[key]['file']}
                                        </p>
                                    </a>
                                </div>
                console.log(url);
                obj['mark'] = <div>
                                    <MDBInput label="Mark" value={mark} name="Mark" group type="text" validate error="wrong" success="right" 
                                            onChange={ (e) => handleChange(e) } />,
                                    <MDBBtn type="button" color="white" name={i} onClick={(evt) => handleAdd(evt)} rounded className="mr-md-3 z-depth-1a">
                                        <MDBIcon fab icon="bitcoin" className="blue-text" />
                                    </MDBBtn>
                                </div>
                i++;
                console.log(data);
                rowArr.push(obj);
                isLoaded.current = true;
                setRows(rowArr);
            });
        }
      });
    }
  
    let columns= [
      {
        label: 'Name',
        field: 'name',
        sort: 'asc'
      },
      {
        label: 'Title',
        field: 'tile',
        sort: 'asc'
      },
      {
        label: 'Answers',
        field: 'answers',
        sort: 'asc'
      },
      {
        label: 'Mark',
        field: 'mark',
        sort: 'asc'
      }
    ];
  
    return(
    <MDBContainer>
        <MDBTable btn>
            <MDBTableHead columns={columns} />
            <MDBTableBody rows={rows} />
        </MDBTable>
    </MDBContainer>
    );
}

const LoadAssignmentPage = (props) => {
    
    const router = useRouter();
    let clzz = router.query.class;
    let subject = router.query.subject;
    let datetime = router.query.datetime;

    const isLoaded = useRef();
    const [assignment, setAssignment] = useState();

    useEffect(() => {
        if (isLoaded.current != router.query) {
            loadAssignment();
        }
    });

    const loadAssignment = () => {

        let query = '/Assignments/';
        if (clzz != undefined) {
            query += clzz + '/';
        }
        if (subject != undefined) {
            query += subject + '/';
        } 
        if (datetime != undefined) {
            query += datetime + '/';
        }

        console.log(query);
        if (query != '/Assignments/') {
            database.ref(query).on('value', (snapshot) => {
                const data = snapshot.val();
                if (data != null) {
                    let assigment = data;
                    console.log(assigment);
                    setAssignment(assigment);
                    isLoaded.current = router.query;
                }
            });
        }
    }

    const renderLink = (obj) => {

        let query = {};
        if (clzz != undefined && subject === undefined && datetime === undefined) {
            query['class'] = clzz;
            query['subject'] = obj;
        } else if (clzz != undefined && subject != undefined && datetime === undefined) {
            query['class'] = clzz;
            query['subject'] = subject;
            query['datetime'] = obj;
        } else if (clzz === undefined && subject === undefined && datetime === undefined) {
            query['class'] = obj;
        }
        console.log(query);
        return (
            <div className="d-flex justify-content-between my-3 mt-5">
                <Link href= {{pathname: '/view/teacher/assignment', query: query }} >
                    <a>
                        <h6 className="font-weight-bold">
                            <MDBIcon icon="book" className="pr-2" />
                            {obj}
                        </h6>
                    </a>
                </Link>
            </div>
        )
    }

    const renderLinks = () => {
        
        let arr = [];
        if (clzz != undefined && subject != undefined && datetime != undefined) {
            arr.push(< AssignmentTable class={clzz} subject={subject} datetime={datetime} />);
        } else {
            for (let key in assignment) {
                arr.push(renderLink(key));
            }
        }
        return (
            arr
        )
    }

    return (
        <MDBContainer>
        {
            <MDBContainer>
                {
                    <MDBContainer className="my-1 px-1 mx-auto">
                        {
                            renderLinks()
                        }
                    </MDBContainer>
                }
            </MDBContainer>
        }
        </MDBContainer>
    );
};

const AssignmentPage = () => {
    return (
      <MainLayout children={<LoadAssignmentPage />} />    
    );
};
    
export default AssignmentPage;