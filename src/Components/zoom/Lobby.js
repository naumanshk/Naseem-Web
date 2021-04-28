import React, { useState,useEffect } from 'react';
import InputAdornment from '@material-ui/core/InputAdornment';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Drawer from '@material-ui/core/Drawer';
import MenuIcon from '@material-ui/icons/Menu';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DeleteIcon from '@material-ui/icons/Delete';
import VideocamIcon from '@material-ui/icons/Videocam';
import Icon from '@material-ui/core/Icon';
import VideoCallIcon from '@material-ui/icons/VideoCall';
import * as firebase from 'firebase'
import {Link } from 'react-router-dom'

const Lobby = ({

}) => {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState();

  const [roomName, setRoomName] = useState();

  const [meetingId, setMeetingId] = useState();
  const [passcode, setPasscode] = useState();
  const [allrooms, setRooms] = useState([]);





  useEffect(() => {
    getRoom()
    }, []);
    

  const handleDialog = () => {
    setOpen(!open)

  };


  const DeleteRoom=(id)=>{

   { 
     console.log(id)
    firebase.database().ref("ZoomVideoRoom").child(localStorage.getItem('classId')).child(id).remove().then(window.location.reload())
  }
  }



  const createRoom=()=>{
       
    let childKey = firebase.database().ref("ZoomVideoRoom").push().getKey();


   
   { 
  

         firebase.database().ref("ZoomVideoRoom").child(localStorage.getItem('classId')).child(childKey).set({

            id: childKey,
            date:new Date().toLocaleString(), 
            roomName:roomName,
            username:username,
            passcode:passcode,
            meetingId:Number(meetingId),
            classId:localStorage.getItem('classId')

            

        })
    }
  }


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

  return (

    <div style={{  margin: 'auto', overflowY:'scroll' }} className="box-container-video width-70 width-100">
      <h2 className='center relative' style={{ paddingTop: '50px' }}>Rooms
      <VideoCallIcon onClick={e => {setOpen(true)
                        }} style={{ float: 'right', cursor: 'pointer', right: '45px',top: '15px' }} className="fa fa-plus-circle absolute green " />
      </h2>
     


      {allrooms.map((item,i)=>{
        return(
          <div className="rooms-item-t">
          <div className="justify-center flex no-margin-padding">

            <h3 style={{ marginRight: '10px' }} className="center regular" >{item.roomName}</h3>
          </div>
          {/* <h3 className="  center regular" >{new Date(item.date).toLocaleDateString()}</h3> */}
          <h3 className=" center regular" >{item.meetingId}</h3>
          <h3 className=" center regular" >{item.passcode}</h3>

          {/* <button  className="test-btn" type="submit">Join Room</button>
             */}
          <div style={{display:'flex', alignItems:'center'}}>
            <a href='https://us05web.zoom.us/meeting?_x_zm_rtaid=KExjJj-VTKyDWDcIrO0slQ.1616138403366.a150a664b34a34d409c373e7c6db5a9c&_x_zm_rhtaid=511#/previous'><VideocamIcon  style={{marginRight:'10px',color:'#4CBB17',cursor:'pointer' }} /></a>
            <DeleteIcon onClick={e=>DeleteRoom(item.id)} style={{color:'red',cursor:'pointer' }} />
          </div>


        </div>
        ) 

      })}


      {/* New room creation  */}
      <Dialog className="dialog" fullWidth="true" open={open} onClose={() => {
        handleDialog()

      }} aria-labelledby="form-dialog-title">

        <h2 className='center' style={{ paddingTop: '50px' }}>Create a room</h2>


        <DialogContent>
          <form onSubmit={createRoom}>




            <div class='width-60 margin-auto margin-bottom-10'>


              <InputLabel htmlFor="input-with-icon-adornment">Name</InputLabel>
              <Input
                type="text"
                id="field"
                value={username}
                onChange={e=>setUsername(e.target.value)}
                required
                style={{ width: '100%', marginBottom: '20px' }}

              />

            </div>
            <div class='width-60 margin-auto margin-bottom-10'>


              <InputLabel htmlFor="input-with-icon-adornment">Room Name</InputLabel>
              <Input
                type="text"
                id="room"
                value={roomName}
                onChange={e=>setRoomName(e.target.value)}
                required
                style={{ width: '100%', marginBottom: '20px' }}
              />

            </div>

            <div class='width-60 margin-auto margin-bottom-10'>


              <InputLabel htmlFor="input-with-icon-adornment">MeetingID</InputLabel>
              <Input
                type="text"
                id="subject"
                value={meetingId}
                onChange={e=>setMeetingId(e.target.value)}
                required
                style={{ width: '100%', }}
              />

            </div>

            <div class='width-60 margin-auto margin-bottom-10'>


            <InputLabel htmlFor="input-with-icon-adornment">Passcode</InputLabel>
            <Input
              type="text"
              id="subject"
              value={passcode}
              onChange={e=>setPasscode(e.target.value)}
              required
              style={{ width: '100%', }}
            />

            </div>
            <div style={{ marginTop: '20px' }} class='width-60 margin-auto margin-bottom-10 center'>

              <button className="test-btn" type="submit">Create Room</button>

            </div>







          </form>


        </DialogContent>

        <DialogActions className="dialog-btns">

        </DialogActions>
      </Dialog>




    </div>

  );
};

export default Lobby;
