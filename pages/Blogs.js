import React from 'react';
import {  MDBRow, MDBCol, MDBMask, MDBIcon, MDBView,MDBContainer } from "mdbreact";
import MainLayout from '../components/mainLayout'
import { Component } from 'react';
import Link from 'next/link';
import { store,database } from "./firebase";

class LoadBlogPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      rowArr: [],
    }
  }

  componentDidMount = () => {
    this.loadArticles();
  }
  
  loadArticles = () => {
    database.ref('/Articles/').on('value', (snapshot) => {
      let rowArr = [];
      let imageArr = [];
      const data = snapshot.val();
      let i = 5;
      for (let key in data) {
        if (i == 0) {
          break;
        }
        let uuid = data[key]['key'];
        database.ref('/Images/'+uuid).on('value', (snapshot) => {
          let imageData = snapshot.val();
          store.ref().child('images/' + uuid + '/' + imageData.name).getDownloadURL().then((url) => {
            let articleData = data[key];
            articleData['image'] = url;
            console.log(articleData);
            rowArr.push(articleData);
            this.setState({rowArr: rowArr});
          });
        });
        
        i--;
      }
    });
  }
  createMarkup() {
    return {__html: this.state.rowArr[0].body};
  }

  createFirstBlog = () => { 
  return (
      <div className="mb-4">
        <MDBView hover rounded className="z-depth-1-half mb-4">
          <img
            className="img-fluid"
            src={this.state.rowArr[0].image}
            alt=""
          />
          <Link href={{
                      pathname: "/view/article",
                      query: { id: this.state.rowArr[0].key }
                    }}>
            <a><MDBMask overlay="white-slight" className="waves-light" /></a>
          </Link>
        </MDBView>
        <div className="d-flex justify-content-between">
          <Link href={{
                      pathname: "/view/article",
                      query: { id: this.state.rowArr[0].key }
                    }} className="deep-orange-text">
            <a><h6 className="font-weight-bold">
              <MDBIcon icon="utensils" className="pr-2" />
              News
            </h6></a>
          </Link>
          <p className="font-weight-bold dark-grey-text">
            <MDBIcon far icon="clock" className="pr-2" />
            {this.state.rowArr[0].date}
          </p>
        </div>
        <h3 className="font-weight-bold dark-grey-text mb-3 p-0">
          <Link href={{
                      pathname: "/view/article",
                      query: { id: this.state.rowArr[0].key }
                    }}>
                      {this.state.rowArr[0].header}
          </Link>
        </h3>
        <div className="d-flex justify-content-between" dangerouslySetInnerHTML={this.createMarkup()}>
        </div>
      </div>
  );
} 

createArticle = (obj) => {

  console.log(obj);
  return (
    <div key ={obj.key} style={{
      borderBottom: "1px solid #e0e0e0",
      marginBottom: "1.5rem"
    }} >
      <MDBRow >
        <MDBCol md="3">
          <MDBView hover rounded className="z-depth-1-half mb-4">
            <img
              className="img-fluid"
              src={obj.image}
              alt=""
            />
            <Link href={{
                      pathname: "/view/article",
                      query: { id: this.state.rowArr[0].key }
                    }}>
              <a><MDBMask overlay="white-slight" className="waves-light" /></a>
            </Link>
          </MDBView>
        </MDBCol>
        <MDBCol md="9">
          <p className="font-weight-bold dark-grey-text">
          {obj.date}
          </p>
          <div className="d-flex justify-content-between">
            <MDBCol size="11" className="text-truncate pl-0 mb-3">
              <Link href={{
                      pathname: "/view/article",
                      query: { id: this.state.rowArr[0].key }
                    }} className="dark-grey-text">
                      <a>
                {obj.header}
                </a>
              </Link>
            </MDBCol>
            <Link href={{
                      pathname: "/view/article",
                      query: { id: this.state.rowArr[0].key }
                    }} ><a>
                      <MDBIcon icon="angle-double-right" />
              </a>
            </Link>
          </div>
        </MDBCol>
      </MDBRow>
    </div>
  )
}

createSecondaryArticles = () => {

  let arr = [];
  for (let obj in this.state.rowArr) {
    if (obj != 0) {
      arr.push(this.createArticle(this.state.rowArr[obj]));
    }
  }
  return (
      arr
    );
}

createBlogView = () => {

  return (
    
    <MDBRow>
      <MDBCol md="12" lg="6" key="Article01">
        {this.createFirstBlog()}
      </MDBCol>
      <MDBCol md="12" lg="6" key="Article02">
        {this.createSecondaryArticles()}  
      </MDBCol>
    </MDBRow>
  );
}

render()
{
    return (
      <MDBContainer
          className="my-1 px-1 mx-auto"
          style={{ fontWeight: 300 }}
        >
            <h2 className="h1-responsive font-weight-bold my-5 text-center">
              School Blogs
            </h2>
            <p className="dark-grey-text mx-auto mb-5 w-75 text-center">
              This is the school blog page. All news related to the school will be published here.
              Please refer this page for school news:
            </p>
              {
                this.state.rowArr.length == 0 ? 
                  <></> 
                    :
                  this.createBlogView()
              }
        </MDBContainer>
    );
}
}

const BlogPage = () => {

    return (
      <MainLayout children={<LoadBlogPage />} />    
    );
    };
    
    export default BlogPage;