import '../../Zoom.css'
import { ZoomMtg } from "@zoomus/websdk";
import { useEffect } from "react";

const crypto = require("crypto"); // crypto comes with Node.js

function generateSignature(apiKey, apiSecret, meetingNumber, role) {
  return new Promise((res, rej) => {
    // Prevent time sync issue between client signature generation and zoom
    const timestamp = new Date().getTime() - 30000;
    const msg = Buffer.from(apiKey + meetingNumber + timestamp + role).toString(
      "base64"
    );
    const hash = crypto
      .createHmac("sha256", apiSecret)
      .update(msg)
      .digest("base64");
    const signature = Buffer.from(
      `${apiKey}.${meetingNumber}.${timestamp}.${role}.${hash}`
    ).toString("base64");

    res(signature);
  });
}


// var apiKey = "u-PUM6FPQWC9ttwiDsQgbg";
// var apiSecret = "zDRxi5p6awo0hQLwXS8pvmArZUwYTni3icFx";
// var meetingNumber = 88931379106;
// var leaveUrl = "http://localhost:3000/getRoom"; // our redirect url
// var userName = "WebSDK";
// var userEmail = "test@gmail.com";
// var passWord = "Wc4GB7";

// var signature = "";



// generateSignature(apiKey, apiSecret, meetingNumber, 0).then((res) => {
//   signature = res;
// }); // need to generate based on meeting id - using - role by default 0 = javascript

const Zoom = (props) => {

  var apiKey = "u-PUM6FPQWC9ttwiDsQgbg";
var apiSecret = "zDRxi5p6awo0hQLwXS8pvmArZUwYTni3icFx";
var meetingNumber = Number(props.location.state.meetingId);
var leaveUrl = "/student"; // our redirect url
var userName = props.location.state.user;
var userEmail = "test@gmail.com";
var passWord = props.location.state.pwd;

var signature = "";
generateSignature(apiKey, apiSecret, meetingNumber, 0).then((res) => {
  signature = res;
}); 
  console.log(Number(props.location.state.meetingId))
  // loading zoom libraries before joining on component did mount
  useEffect(() => {

    showZoomDIv();
    ZoomMtg.setZoomJSLib("https://source.zoom.us/1.9.0/lib", "/av");
    ZoomMtg.preLoadWasm();
    ZoomMtg.prepareJssdk();
    initiateMeeting();
  }, []);

  const showZoomDIv = () => {
    document.getElementById("zmmtg-root").style.display = "block";

  };

  const initiateMeeting = () => {
    ZoomMtg.init({
      leaveUrl: leaveUrl,
      isSupportAV: true,
      success: (success) => {
        console.log(success);

        ZoomMtg.join({
          signature: signature,
          meetingNumber: meetingNumber,
          userName: userName,
          apiKey: apiKey,
          userEmail: userEmail,
          passWord: passWord,
          success: (success) => {
            console.log(success);
          },
          error: (error) => {
            console.log(error);
          },
        });
      },
      error: (error) => {
        console.log(error);
      },
    });
  };

  return <div className="App">Zoom</div>;
};

export default Zoom;
