import React from 'react';
import MainLayout from '../components/mainLayout'
import { MDBContainer,MDBRow, MDBCol } from 'mdbreact';

function renderChild ()
{
  return (
    <MDBContainer>
      <MDBContainer fluid className="mt-5" style={{ width: "100%"}} >
        <MDBRow className="mb-10" style={{height: "600px"}}>
              <img src="/images/school.jpg" className="img-fluid" alt="" style={{float:"left", width: "100%", height: "600px"}}/>
          </MDBRow>
      </MDBContainer>
      <div class="text-left mt-5" style={{width: "100%"}}>
      <p >
      Parakai is a friendly, welcoming school where children are happy and enjoy learning.
      Our vision is to grow GREAT citizens, empowered to live successfully in their personal and global lives.
    </p>
<p>
Being a GREAT citizen means:

G – Giving and receiving the very best.

R  – Respecting ourselves, others and our surroundings.

E  – Excelling by setting high expectations and having a strong work ethic.

A – Attitude of being open-to-learning.

T  – Thinking critically and creatively in a changing world.

We highly value connections with our parents and community. Building strong family and community partnerships enables us to maximise the learning and social experiences of our students.

We are very fortunate to have the Kaipara area’s Resource Teachers for Learning and Behaviour (RTLB) and Resource Teacher: Literacy (RTLit) based by our school. We also have our own SWiS (Social Worker in School).

.

What makes us special?
Our warm, family-like environment where everyone counts!
Our high expectations for our students to reach their full potential.
Our committed, dedicated and caring staff who strive to make your child’s learning and social experiences fun and meaningful.
We are on a constant mission to make our learning environment responsive and exciting:

Fast, wireless access throughout the school.
e-Learning (using Google Apps for Education) and BYOD from Year 4 – 8 (Bring Your Own Device).
Senior classroom block is a modern learning environment (MLE) with 4 classrooms surrounding an open, flexible teaching space which includes a computer hub and art area.
As well as a suite of desktop computers, we have an enviable 1-1 device-to-student ratio in the senior school (Year 4-8) with iPads and Chromebooks.  There is also a pod of iPads in the junior school.
Interactive data projectors to connect and extend teaching and learning.
Cycle track and a fleet of Avanti bikes.
School Radio Station with student DJs.
Green Screen Room for movie making and other media activities.
We have lunchtime sport programmes and special interest groups such as Art Club, Writers’ Club, Cooking Club and French Club.

For students who have identified special needs in reading we have Rainbow Reading and Reading Recovery programmes.

.

The basis of our motto ‘Dream It. Believe It. Achieve It’ is aspirational:
 Dream it: This is about having goals and visions to progress oneself in life.
 Believe it: Believing your goals and visions are possible. Making a plan of action to achieve it.
 Achieve it: Committing to and taking positive action to achieve your goals and then reflecting on the journey.
We are also a Health Promoting School. Health Promoting Schools (HPS) is an approach where the whole school community works together to address the health and wellbeing of students, staff and their community. Schools include health and wellbeing in their planning and review processes, teaching strategies, curriculum and assessment activities.
      </p>
      </div>
    </MDBContainer>
  );
}

const AboutPage = () => {
    const list = [];
    list.push(renderChild());

    return (
      <MainLayout children={list} />    
    );
    };
    
    export default AboutPage;