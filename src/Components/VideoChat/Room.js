import React, { useState, useEffect, useCallback } from 'react';
import Video, { LocalParticipant } from 'twilio-video';
import Participant from './Participant';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faMicrophoneSlash, faVideo, faVideoSlash } from '@fortawesome/free-solid-svg-icons';

const Room = ({ roomName, token, handleLogout, subject }) => {
  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [trackOff, setTrackOff] = useState(false);
  const [audioTrackOff, setAudioTrackOff] = useState(false);
  const [ScreenShareon, setScreenShareon] = useState(false);




  useEffect(() => {


    const participantConnected = participant => {
      setParticipants(prevParticipants => [...prevParticipants, participant]);
    };

    const participantDisconnected = participant => {
      setParticipants(prevParticipants =>
        prevParticipants.filter(p => p !== participant)
      );
    };


    Video.connect(token, {
      name: roomName
    }).then(room => {
      setRoom(room);
      room.on('participantConnected', participantConnected);
      room.on('participantDisconnected', participantDisconnected);
      room.participants.forEach(participantConnected);



    });

    return () => {
      setRoom(currentRoom => {
        if (currentRoom && currentRoom.localParticipant.state === 'connected') {
          currentRoom.localParticipant.tracks.forEach(function (trackPublication) {

            trackPublication.track.stop();
          });
          currentRoom.disconnect();
          return null;
        } else {
          return currentRoom;
        }
      });
    };
  }, [roomName, token]);

  const pauseVideo = useCallback(event => {
    setTrackOff(!trackOff)
    var localParticipant = room.localParticipant;
    localParticipant.videoTracks.forEach(function (videoTrack) {
      videoTrack.track.disable()

    });

    if (trackOff) {
      localParticipant.videoTracks.forEach(function (videoTrack) {
        videoTrack.track.enable()

      });
    }


  });
  const pauseAudio = useCallback(event => {
    setAudioTrackOff(!audioTrackOff)
    var localParticipant = room.localParticipant;
    localParticipant.audioTracks.forEach(function (audioTrack) {
      audioTrack.track.disable()
    });

    if (audioTrackOff) {
      localParticipant.audioTracks.forEach(function (audioTrack) {
        audioTrack.track.enable()

      });
    }
  });

  const shareScreen = useCallback(event => {
    setScreenShareon(!ScreenShareon)
    

      navigator.mediaDevices.getDisplayMedia().then(stream => {
        const newScreenTrack = stream.getVideoTracks();
        var screenTrack = new Video.LocalVideoTrack(stream.getVideoTracks()[0]);
        
        room.localParticipant.publishTrack(screenTrack);
        

        
      }).catch((err) => {
        console.log(err)
        alert('Could not share the screen.')
      });
    
  });

  const remoteParticipants = participants.map(participant => (
    <Participant key={participant.sid} participant={participant} />
  ));

  let icon;



  return (
    <div className="room">
      <h2 className='center'>Room: {roomName}</h2>
      <h2 className='center'>Subject: {subject}</h2>

      {/* <button onClick={handleLogout}>Log out</button> */}
      <div className="local-participant center">
        {room ? (
          <Participant
            key={room.localParticipant.sid}
            participant={room.localParticipant}
            handleVideo={pauseVideo}
            handleVideoToggle={trackOff}
            handleAudioToggle={audioTrackOff}
            logout={handleLogout}

            handlemic={pauseAudio}
            handleScreen={shareScreen}
          />
        ) : (
            ''
          )}
      </div>

      <div className="remote-participants center  ">
        <h3>Remote Participants</h3>
        {remoteParticipants}</div>

      {/* <div><FontAwesomeIcon  onClick={pause}  color='black'  icon={faVideo}  /></div> */}

    </div>
  );
};

export default Room;
