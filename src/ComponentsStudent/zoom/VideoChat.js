import React, { useState, useCallback,useEffect } from 'react';
import Lobby from './Lobby';
import Room from './Room';
import * as firebase from 'firebase'
import { withRouter } from 'react-router-dom'


const VideoChat = () => {
  const [username, setUsername] = useState('');
  const [roomName, setRoomName] = useState('');
  const [date, setDate] = useState(new Date().toLocaleString());
  const [sub, setSub] = useState('');
  const [teacher, setTeacher] = useState('');

  const [rooms, setRooms] = useState([]);


  const [token, setToken] = useState(null);

  const handleUsernameChange = useCallback(event => {
    setUsername(event.target.value);
  }, []);

  const handleRoomNameChange = useCallback(event => {
    setRoomName(event.target.value);
  }, []);

  const handleSubjectNameChange = useCallback(event => {
    setSub(event.target.value);
  }, []);


  useEffect(() => {
    getRoom()
    }, []);


    const join=async (na,ro,sub,teacher)=>{
     
     

      const data = await fetch('https://serene-wildwood-20088.herokuapp.com/video/token', {
        method: 'POST',
        body: JSON.stringify({
          identity: na,
          room: ro
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => res.json());
    if(data!=null){
      setToken(data.token);
      setRoomName(ro)
      setSub(sub)
      setTeacher(teacher)
    }
    }
    
  const handleSubmit = async ()=>{
  }
   
   
  




  const getRoom=()=>{
    console.log(sub)
  
 
    var allrooms = []
   { 
  
    firebase.database().ref("VideoRoom").once("value").then(snapshot => {

       console.log(snapshot.val())

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
  const handleLogout = useCallback(event => {
    setToken(null);
  }, []);

  let render;
  if (token) {
    render = (
      <Room roomName={roomName} subject={sub} teacher={teacher} token={token} handleLogout={handleLogout} />
    );
  } else {
    render = (
      <Lobby
        username={username}
        roomName={roomName}
        subject={sub}
      
        setRoomName={setRooms}
        setUsername={setUsername}
        setSub={setSub}
        handleUsernameChange={handleUsernameChange}
        handleRoomNameChange={handleRoomNameChange}
        handleSubjectNameChange={handleSubjectNameChange}
        handleSubmit={handleSubmit}
        allrooms={rooms}
        join={join}
      />
    );
  }
  return render;
};

export default VideoChat;
