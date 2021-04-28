import React, { useState, useEffect, useRef } from "react";
import { LocalAudioTrack } from "twilio-video";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faMicrophoneSlash, faVideo, faVideoSlash ,faPhoneSlash, faDesktop} from '@fortawesome/free-solid-svg-icons'; 
import CallEndIcon from '@material-ui/icons/CallEnd';

const Participant = ({ participant ,track,setTrack,handleVideo,handlemic,handleVideoToggle,handleAudioToggle,handleScreen,logout}) => {
  const [videoTracks, setVideoTracks] = useState([]);
  const [audioTracks, setAudioTracks] = useState([]);
  const [trackoff, settrack] = useState(track);


  const videoRef = useRef();
  const audioRef = useRef();

  const trackpubsToTracks = (trackMap) =>
    Array.from(trackMap.values())
      .map((publication) => publication.track)
      .filter((track) => track !== null);

  useEffect(() => {
   
    setVideoTracks(trackpubsToTracks(participant.videoTracks));
    setAudioTracks(trackpubsToTracks(participant.audioTracks));

    const trackSubscribed = (track) => {
      console.log(track.kind)
      if (track.kind === "video") {
        setVideoTracks((videoTracks) => [...videoTracks, track]);
      } else if (track.kind === "audio") {
        setAudioTracks((audioTracks) => [...audioTracks, track]);
      }
    };

    const trackUnsubscribed = (track) => {
      if (track.kind === "video") {
        setVideoTracks((videoTracks) => videoTracks.filter((v) => v !== track));
      } else if (track.kind === "audio") {
        setAudioTracks((audioTracks) => audioTracks.filter((a) => a !== track));
      }
    };

    participant.on("trackSubscribed", trackSubscribed);
    participant.on("trackUnsubscribed", trackUnsubscribed);

    return () => {  
      setVideoTracks([]);
      setAudioTracks([]);
      participant.removeAllListeners();
    };
  }, [participant]);

  useEffect(() => {
    if(trackoff==true){
      setTrack(true)
    }
    const videoTrack = videoTracks[0];
    if (videoTrack) {
      videoTrack.attach(videoRef.current);
    
      return () => {
        videoTrack.detach();
      };
    }
  }, [videoTracks]);

  useEffect(() => {
    const audioTrack = audioTracks[0];
    if (audioTrack) {
      audioTrack.attach(audioRef.current);
      
      return () => {
        audioTrack.detach();
      };
    }
  }, [audioTracks]);

  return (
    <div className="participant"  style={{position:'relative'}}>
      <h3>{participant.identity}</h3>
      <video   ref={videoRef} autoPlay={true}  />

      <div style={{position:'absolute', right:'48npom run buidl%', bottom:'7%'}}>
      <FontAwesomeIcon style={{marginRight:'10px',marginTop:'10px'}} color='white' onClick={handleVideo} icon={handleVideoToggle ? faVideoSlash : faVideo}  />
      <FontAwesomeIcon color='white' onClick={handlemic} style={{marginRight:'10px'}} icon={handleAudioToggle ? faMicrophoneSlash :faMicrophone}  />
      <FontAwesomeIcon style={{color:'white',cursor:'pointer',marginRight:'10px'}}  onClick={handleScreen} color='white'  icon={faDesktop}  />

      <FontAwesomeIcon style={{color:'red',cursor:'pointer'}}  onClick={logout} color='white'  icon={faPhoneSlash}  />


      </div>


      <audio ref={audioRef}  autoPlay={true}  />
    </div>
  );
};

export default Participant;
