import React, { useState, useEffect, useRef } from 'react';
import MainLayout from '../components/mainLayout'
import Carousel from 'react-material-ui-carousel'
import {Paper,Button} from '@material-ui/core'
import { connect } from 'react-redux';
import CardLayout from "./CardLayout";
import { store, database } from "./firebase";
import Link from 'next/link';

import { MDBView, MDBMask, MDBContainer, MDBRow, MDBCol } from "mdbreact";

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

const MainPage = (props) =>
{

  const [carLayoutArr, setCardLayouts] = useState();
  const [articles, setArticles] = useState();
  const isLoaded = useRef();

  useEffect(() => {
    if (isLoaded.current === undefined) {
      loadAssignment();
      loadArticles();
    }
  });

  const addCardLayoutColumn = (props) => {

    let datetime = props.date+props.time;
    return (
      <MDBCol key={props.id}><CardLayout subject={props.subject} title={props.title} class={props.class} description={props.description} id={props.id} datetime={datetime} /></MDBCol>
    )
  }

  const loadArticles = () => {
    database.ref('/Articles/').on('value', (snapshot) => {
      let rowArr = [];
      const data = snapshot.val();
      let i = 3;
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
            rowArr.push(articleData);
            console.log(articleData);
            setArticles(rowArr);
          });
        });
        
        i--;
      }
    });
  }

  const loadAssignment = () => {

    let cardLayouts = [];
    database.ref('/Assignments/').on('value', (snapshot) => {
      const data = snapshot.val();
      for (let cls in data) {
        for (let subject in data[cls]) {
          for (let assignment in data[cls][subject]) {
            // console.log(data[cls][subject][assignment]);
            cardLayouts.push(addCardLayoutColumn(data[cls][subject][assignment]));
          }
        }
      }
      isLoaded.current = true;
      setCardLayouts(cardLayouts);
    });
  }
 
    return (
      
      <MDBContainer >
            <MDBRow style={{height: "700px"}} className="pt-4">
              <div style= {{width: "100%"}}>
                <Carousel>
                  {
                    articles != undefined ? articles.map( (item, i) => <CarouselItem key={i} item={item} /> ) : <></>
                  }
                  </Carousel>
                  </div>
            </MDBRow>
            <MDBRow className="pt-5">
              {carLayoutArr}
              {/* <MDBCol className="order-first"><CardLayout/></MDBCol> */}
            </MDBRow>
            {/* <MDBRow className="pt-5">
              <MDBCol><CardLayout/></MDBCol>
              <MDBCol><CardLayout/></MDBCol>
              <MDBCol><CardLayout/></MDBCol>
              <MDBCol className="order-first"><CardLayout/></MDBCol>
            </MDBRow> */}
            </MDBContainer>
    )
}

function CarouselItem(props)
{
    return (
              <Paper style={{width: "-webkit-fill-available"}}>
                  <h2>{props.item.header}</h2>
                  <p>{props.item.description}</p>
                  <MDBView hover rounded>
                    <img
                      className="img-fluid"
                      src={props.item.image}
                      style={{float:"center", width: "100%", height: "550px"}}
                      alt=""
                    />
                    <Link href={{
                      pathname: "/view/article",
                      query: { id: props.item.key }
                    }} className="deep-orange-text">
                      <a><MDBMask overlay="white-slight" className="waves-light" /></a>
                    </Link>
                  </MDBView>
      
                  <Button className="CheckButton">
                      Check it out!
                  </Button>
              </Paper>
    )
}

function renderChild ()
{
  return (
        <MainPage/>
    );
}

const HomePage = () => {
    const list = [];
    list.push(renderChild());

    return (
      <MainLayout children={list} />    
    );
    };
    
export default connect(mapStateToProps)(HomePage);
