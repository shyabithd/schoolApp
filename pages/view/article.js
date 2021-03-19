import React, { useState, useEffect, useRef } from 'react';
import {  MDBRow, MDBContainer } from "mdbreact";
import MainLayout from '../../components/mainLayout'
import { useRouter } from 'next/router'
import { store,database } from "../firebase";

const LoadArticlesPage = (props) => {
    
    const router = useRouter();
    const [article, setArticle] = useState();
    const prevArticle = useRef();

    const createMarkup = () => {
        return {__html: article ? article.body : <> </>};
    }
    
    useEffect((article) => {
        if (prevArticle.current === undefined) {
            loadArticles();
        }
    });

    const loadArticles = (article) => {

        let uuid = router.query.id;
        database.ref('/Articles/' + uuid).on('value', (snapshot) => {
        const data = snapshot.val();
        prevArticle.current = data;
        database.ref('/Images/'+uuid).on('value', (snapshot) => {
            let imageData = snapshot.val();
            console.log(imageData);
            if (imageData != null) {
                store.ref().child('images/' + uuid + '/' + imageData.name).getDownloadURL().then((url) => {
                    let articleData = data;
                    articleData['image'] = url;
                    console.log(articleData);
                    setArticle(articleData);
                });
            }
        });
        });
    }

    return (
        <MDBContainer>
            { article === undefined ? <h1>Article Not found</h1> : 
            <MDBContainer className="my-1 px-1 mx-auto">
                <h2 className="h1-responsive font-weight-bold my-5 text-center">
                {article ? article.header : <> </>}
                </h2>
                <MDBRow className="mb-10" style={{height: "600px"}}>
                {article ?  <img src={article.image} className="img-fluid" alt="" style={{float:"left", width: "100%", height: "600px"}}/> : <> </>}
                </MDBRow>
                <div className="d-flex justify-content-between mt-5" dangerouslySetInnerHTML= {createMarkup()}></div>         
            </MDBContainer>
            }
        </MDBContainer>
    );
};

const BlogPage = () => {
    return (
      <MainLayout children={<LoadArticlesPage />} />    
    );
};
    
export default BlogPage;