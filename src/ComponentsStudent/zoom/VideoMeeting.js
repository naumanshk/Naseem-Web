import React from 'react';

import VideoChat from './Lobby.js';
import Header from '../../ImagesStudent/student-dashboard.png'


const meeting = () => {
  return (
    <div className="app">
      <div style={{ marginRight: '0px' }} className="dashboard-principal">

        <div className="container">
          <div class='relative ' style={{ marginRight: '10px' }}>

            <img src={Header} className="dashboard-header-student"></img>



          </div>
          </div>
          </div>
        <h1 className='student-grey center'>Video Chat </h1>

          <main>
            <VideoChat />
          </main>

        </div>
  );
};

export default meeting;
