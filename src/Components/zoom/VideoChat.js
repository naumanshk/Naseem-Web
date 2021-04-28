import React, { useState, useCallback,useEffect } from 'react';
import Lobby from './Lobby';
import Room from './Room';
import * as firebase from 'firebase'



const VideoChat = () => {
  const [username, setUsername] = useState('');
  const [roomName, setRoomName] = useState('');
  const [date, setDate] = useState(new Date().toLocaleString());
  const [sub, setSub] = useState('');
  const [rooms, setRooms] = useState([]);


  const [token, setToken] = useState(null);

  useEffect(() => {
    getRoom()
    }, []);

  const handleUsernameChange = useCallback(event => {
    setUsername(event.target.value);
  }, []);

  const handleRoomNameChange = useCallback(event => {
    setRoomName(event.target.value);
  }, []);

  const handleSubjectNameChange = useCallback(event => {
    setSub(event.target.value);
  }, []);



  const join=async (na,ro,sub)=>{

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
    
  }
  }


  const handleSubmit = useCallback(
    async event => {
      event.preventDefault();
      const data = await fetch('https://serene-wildwood-20088.herokuapp.com/video/token', {
        method: 'POST',
        body: JSON.stringify({
          identity: username,
          room: roomName
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => res.json());
      setToken(data.token);
      createRoom();
    },
    [roomName, username,sub]
  );


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

  const createRoom=()=>{
    console.log(sub)
    let childKey = firebase.database().ref("VideoRoom").push().getKey();


   
   { 
  

         firebase.database().ref("VideoRoom").child(localStorage.getItem("classId")).child(childKey).set({

            date: date,
            id: childKey,
            active: false,
          
            roomName:roomName,
            username:username,
            subject:sub,
            token:token,
            classId:localStorage.getItem("classId")

           
            

        })
    }
  }

  const handleLogout = useCallback(event => {
    setToken(null);
  }, []);

  let render;
  if (token) {
    render = (
      <Room roomName={roomName} subject={sub} token={token} handleLogout={handleLogout} />
    );
  } else {
    render = (
      <Lobby
        username={username}
        roomName={roomName}
        subject={sub}
    
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
