import React from "react";
import {
  AppBar,
  Backdrop,
  CircularProgress,
  Container,
  CssBaseline,
  Grid,
  IconButton,
  List,
  TextField,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { Send } from "@material-ui/icons";
import axios from "axios";
import ChatItem from "./ChatItem";
import * as firebase from 'firebase'


const Chat = require("twilio-chat");

class ChatScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: "",
      messages: [],
      loading: false,
      channel: null,
      new:false,
      count:0,
      chatWith:'',
      profileImg:''
    };

    this.scrollDiv = React.createRef();
  }

  getToken = async (email) => {
    const response = await axios.get(`https://lychee-crisp-13295.herokuapp.com/token/${email}`);
    const { data } = response;
    return data.token;
  };

  componentDidMount = async () => {
    const { location } = this.props;
    const { state } = location || {};
    const { email, room, teacherName } = state || {};
    let token = "";

    // if (!email || !room) {
    //   this.props.history.replace("/");
    // }




    this.setState({ loading: true ,chatWith:this.props.location.state.chatWith,profileImg:this.props.location.state.teacherProfile});

    try {
      token = await this.getToken(email);
    } catch {
      throw new Error("unable to get token, please reload this page");
    }

    const client = await Chat.Client.create(token);

    client.on("tokenAboutToExpire", async () => {
      const token = await this.getToken(email);
      client.updateToken(token);
    });

    client.on("tokenExpired", async () => {
      const token = await this.getToken(email);
      client.updateToken(token);
    });

    client.on("channelJoined", async (channel) => {
      // getting list of all messages since this is an existing channel
      const messages = await channel.getMessages();
      
      
      this.setState({ messages: messages.items || [] });
      this.scrollToBottom();
    });

    try {
      const channel = await client.getChannelByUniqueName(room);
      await this.joinChannel(channel);
      this.setState({ channel, loading: false });



    } catch {
      try {
        const channel = await client.createChannel({
          uniqueName: room,
          friendlyName: room,
        });
        await this.joinChannel(channel);
        this.setState({ channel, loading: false });
      } catch {
        throw new Error("unable to create channel, please reload this page");
      }
    }
  };

  joinChannel = async (channel) => {
    if (channel.channelState.status !== "joined") {
      await channel.join();
    }
    
    channel.on("messageAdded", this.handleMessageAdded);
  };

  handleMessageAdded = (message) => {
    
    if(message.author==localStorage.getItem('email')){

      console.log('new msg'+message.author)
    }
   
    const { messages } = this.state;
    this.setState(
      {
        messages: !!messages ? [...messages, message] : [message],count:this.state.count+1
      },
      ()=>{
        console.log(this.state.messages)
        console.log(this.state.count)
        this.scrollToBottom
      }
     
    );
  };

  scrollToBottom = () => {
    const scrollHeight = this.scrollDiv.current.scrollHeight;
    const height = this.scrollDiv.current.clientHeight;
    const maxScrollTop = scrollHeight - height;
    this.scrollDiv.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
  };

  sendMessage = () => {
    const { text, channel } = this.state;
    if (text && String(text).trim()) {
      this.setState({ loading: true });
      channel && channel.sendMessage(text);
      this.setState({ text: "", loading: false });
    }
  };
  

  render() {
    const { loading, text, messages, channel } = this.state;
    const { location } = this.props;
    const { state } = location || {};
    const { email, room, teacherName } = state || {};

  

    return (
      <Container component="main" maxWidth="md">
        <Backdrop open={loading} style={{ zIndex: 99999 }}>
          <CircularProgress style={{ color: "white" }} />
        </Backdrop>
        <AppBar style={{background:'#71539a'}} elevation={10}>
          <Toolbar style={{marginLeft:'200px'}}>
          <img  style={{width:'50px', height:'50px',marginRight:'10px'}}src={this.state.profileImg}></img>
            <Typography variant="h6">
          
              {` ${this.state.chatWith}`}
            </Typography>
          </Toolbar>
        </AppBar>
        <CssBaseline />
        <Grid container direction="column" style={styles.mainGrid}>
          <Grid item style={styles.gridItemChatList} ref={this.scrollDiv}>
            <List dense={true}>
              {messages &&
                messages.map((message) => (
                  <ChatItem
                    key={message.index}
                    message={message}
                    email={email}

                  />
                ))}
            </List>
          </Grid>
          <Grid item style={styles.gridItemMessage}>
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
            >
              <Grid item style={styles.textFieldContainer}>
                <TextField
                  required
                  style={styles.textField}
                  placeholder="Enter message"
                  variant="outlined"
                  multiline
                  rows={2}
                  value={text}
                  disabled={!channel}
                  onChange={(event) =>
                    this.setState({ text: event.target.value })
                  }
                />
              </Grid>
              <Grid item>
                <IconButton
                  style={styles.sendButton}
                  onClick={this.sendMessage}
                  disabled={!channel || !text}
                >
                  <Send style={styles.sendIcon} />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

const styles = {
  textField: { width: "100%", borderWidth: 0, borderColor: "transparent" },
  textFieldContainer: { flex: 1, marginRight: 12 },
  gridItem: { paddingTop: 12, paddingBottom: 12 },
  gridItemChatList: { overflow: "auto", height: "70vh" },
  gridItemMessage: { marginTop: 12, marginBottom: 12 },
  sendButton: { backgroundColor: "#3f51b5" },
  sendIcon: { color: "white" },
  mainGrid: { borderWidth: 1 },
};

export default ChatScreen;
