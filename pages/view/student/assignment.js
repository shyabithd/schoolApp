import React, { useState, useEffect, useRef } from 'react';
import {  MDBIcon, MDBContainer, MDBBtn } from "mdbreact";
import MainLayout from '../../../components/mainLayout'
import { useRouter } from 'next/router';
import { store,database } from "../../firebase";
import FileUpload from "../../helpers/FileUpload";
import ModalPage from "../../Modal";
import configureStore from "../../Configure";

const LoadAssignmentPage = (props) => {
    
    const router = useRouter();
    let id = router.query.id;
    let clz = router.query.class;
    let subject = router.query.subject;
    let datetime = router.query.datetime;

    const isLoaded = useRef();
    const [assignment, setAssignment] = useState();
    const [answers, setFile] = useState();
    const [isError, setPopUp] = useState();

    useEffect(() => {
        if (isLoaded.current === undefined) {
            loadAssignment();
        }
    });

    const onFileBrowsed = (file) => {
        setFile(file);
    }

    const onClose = () => {
        setPopUp(false);
    }
    
    const loadAssignment = () => {

        database.ref('/Assignments/' + clz + '/' + subject + '/' + datetime ).on('value', (snapshot) => {
            const data = snapshot.val();
            if (data != null) {
                store.ref().child('assignments/' + clz + '/' + subject + '/' + datetime + '/' + data.file).getDownloadURL().then((url) => {
                    let assigment = data;
                    assigment['fileUrl'] = url;
                    console.log(assigment);
                    isLoaded.current = true;
                    setAssignment(assigment);
                });
            }
        });
    }

    const handleAdd = () => {
        const { reduxstore, persistor } = configureStore();

        let queryPath = 'AssignmentAnswers/' +  clz + '/' + subject + '/' + datetime + '/' + id;
        database.ref(queryPath).set({
        user: reduxstore.getState().userData.obj.user.email,
        datetime: datetime,
        title: assignment.title,
        subject: assignment.subject,
        description: assignment.description,
        file: answers.name,
        });
        var storageRef = store.ref();
        var imageRef = storageRef.child('assignmentanswers/' +  clz + '/' + subject + '/' + datetime + '/' + id + '/' + answers.name);
        imageRef.put(answers).then((snapshot) => {
            console.log('Uploaded a blob or file!');
        });
        setPopUp(true);
    }

    return (
        <MDBContainer>
        {
            isLoaded.current === undefined ? <></> :
            <MDBContainer>
                { assignment === undefined ? <h1>Assignment Not found</h1> : 
                <MDBContainer className="my-1 px-1 mx-auto">
                    {
                        isError ?
                        <ModalPage toggle={true} header="Success" error="Successfully saved assignment" onClose={() => onClose()}/>
                        :
                        <div></div>
                    }
                    <h2 className="h1-responsive font-weight-bold mt-5 text-center">
                    {assignment.subject}
                    </h2>
                    <h3 className="h3-responsive font-weight-bold mt-4 text-center">
                    {assignment.title}
                    </h3>
                    <div className="d-flex justify-content-between mt-5">
                        <p>
                            {assignment.description}
                        </p>
                    </div>
                    <div className="d-flex justify-content-between">
                        <a href={assignment.fileUrl} >
                            <h6 className="font-weight-bold">
                                <MDBIcon icon="book" className="pr-2" />
                                {assignment.file}
                            </h6>
                        </a>
                    </div> 
                    <div className="my-3" style={{textAlignLast: "left"}}>
                        <FileUpload onFileBrowsed={onFileBrowsed} type="application/pdf" />
                    </div>
                    <div className="text-center">
                        <MDBBtn onClick={handleAdd}>Submit
                            <MDBIcon far icon="paper-plane" className="ml-1" />
                        </MDBBtn>
                    </div>
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