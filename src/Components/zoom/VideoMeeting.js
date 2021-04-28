import React from 'react';
import teacherHeader from '../../Images/teacher-dashboards.png'
import VideoChat from './Lobby.js';

const meeting = () => {
  return (
    <div className="app">
      <div style={{marginRight:'0'}} className="dashboard">

        <div className="container">
          <div>

            <img src={teacherHeader} className="header-img border-rad-img"></img>

          </div>




        </div>

      </div>
      <h1 className='student-grey center'>Video Chat </h1>
      <main>
        <VideoChat />
      </main>

    </div >
  );
};

export default meeting;
