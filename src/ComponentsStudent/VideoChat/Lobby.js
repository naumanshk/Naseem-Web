import React from 'react';
import InputAdornment from '@material-ui/core/InputAdornment';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import { faJoint } from '@fortawesome/free-solid-svg-icons';
import { AirlineSeatLegroomExtraSharp } from '@material-ui/icons';
import VideoCallIcon from '@material-ui/icons/VideoCall';

const Lobby = ({
  username,
  handleUsernameChange,
  roomName,
  handleRoomNameChange,
  sub,
  handleSubjectNameChange,
  handleSubmit,
  join,
  allrooms
}) => {
  return (
    <div >
      {/* <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="field"
          value={username}
          onChange={handleUsernameChange}
          required
        />
      </div>

      <div>
        <label htmlFor="room">Room name:</label>
        <input
          type="text"
          id="room"
          value={roomName}
          onChange={handleRoomNameChange}
          required
        />
      </div> */}

      <div style={{ width: '70%', margin: 'auto', height: '450px' }} className="box-container ">
        <h2 className='center' style={{ paddingTop: '50px' }}>Create a room</h2>



        {allrooms.map((item)=>{
          return(
            <div className='flex'  style={{ flexDirection:'row' }}>

            <div class='margin-auto margin-bottom-10'>
    
    
              <InputLabel htmlFor="input-with-icon-adornment">Name</InputLabel>
              <Input
                type="text"
                id="field"
                value={localStorage.getItem('Student')}
              
                required
               
    
              />
    
            </div>
            <div class='margin-auto margin-bottom-10'>
    
    
              <InputLabel htmlFor="input-with-icon-adornment">Room Name</InputLabel>
              <Input
                type="text"
                id="room"
                value={item.roomName}
               
                required
              
              />
    
            </div>
    
            <div class='margin-auto margin-bottom-10'>
    
    
              <InputLabel htmlFor="input-with-icon-adornment">Subject Name</InputLabel>
              <Input
                type="text"
                id="subject"
                value={item.subject}
               
                required
             
              />
    
            </div>
    
            <div class=' margin-auto margin-bottom-10 center'>
    
              <VideoCallIcon style={{cursor:'pointer'}} onClick={e=>join(localStorage.getItem('Student'),item.roomName,item.subject,item.username)} className="student-grey" />
    
            </div>
    
    
            </div>
          )
          })
        }

      </div>




    </div>
  );
};

export default Lobby;
