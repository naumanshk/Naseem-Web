
import React, { useState,useEffect } from 'react';

import InputAdornment from '@material-ui/core/InputAdornment';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import { faJoint } from '@fortawesome/free-solid-svg-icons';
import { AirlineSeatLegroomExtraSharp } from '@material-ui/icons';
import VideoCallIcon from '@material-ui/icons/VideoCall';
import * as firebase from 'firebase'
import {Link } from 'react-router-dom'

const Lobby = ({

}) => {

  const [allrooms, setRooms] = useState([]);
  const [studentName, setStudent]=useState(localStorage.getItem('Student'))

  useEffect(() => {
    getRoom()
    }, []);
    


  const getRoom=()=>{

 
    var allrooms = []
   { 
  
    firebase.database().ref("ZoomVideoRoom").once("value").then(snapshot => {


         snapshot.forEach(classId=>{

          if(classId.key==localStorage.getItem("classId")){
            
            classId.forEach(cl=>{
              allrooms.push(cl.val())

            })

          }

         })
           
       
         setRooms(allrooms)
    })
    }
  }
  const reload = (props) => {
    
    window.location.assign('/join')
 

  }

  return (
    <div >


      <div style={{ width: '70%', margin: 'auto', height: '450px' }} className="box-container ">
        <h2 className='center' style={{ paddingTop: '50px' }}>Join a room</h2>



        {allrooms.map((item)=>{
          return(
            <div className='flex'  style={{ flexDirection:'row' }}>

            <div class='margin-auto margin-bottom-10'>
    
    
              <InputLabel htmlFor="input-with-icon-adornment">Name</InputLabel>
              <Input
                type="text"
                id="field"
                value={item.username}
              
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
    
    
              <InputLabel htmlFor="input-with-icon-adornment">Meeting ID</InputLabel>
              <Input
                type="text"
                id="subject"
                value={item.meetingId}
               
                required
             
              />
    
            </div>
    
            <div class=' margin-auto margin-bottom-10 center'>
    
            <a href={`https://video-chat-77f10.web.app/join?meetingId=${item.meetingId}&pwd=${item.passcode}&username=${localStorage.getItem('Student')}`}> <VideoCallIcon style={{cursor:'pointer'}} onClick={reload}  className="student-grey" /></a>
    
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
