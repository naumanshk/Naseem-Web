import React from "react";
import {

  Button,
  Input,
  InputLabel,
  Badge,
  Typography
} from "@material-ui/core";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import* as firebase from 'firebase'
import {Link, Redirect } from 'react-router-dom'
import MailIcon from '@material-ui/icons/Mail';
import axios from "axios";
class WelcomeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      room: "",
      accociated:[],
      teachers:[],
      redirect:false
      ,chatWith:'',
      profileImg:''
    };
  }

  componentDidMount(){
    this.getAssociatedTeachers()
   
  }

getAssociatedTeachers(){
  firebase.database().ref("Assosiated_Classes").once("value").then(snapshot => {

    var teachers = []
    snapshot.forEach(school => {
      // console.log(teacher.val())

      school.forEach(teacher=>{
       
        teacher.forEach(section=>{
          if(section.val().id=='-M29fAWCJX9Ym_k3z-WY'){
            console.log(section.val())
            console.log(teacher.key)

            firebase.database().ref("Teachers").child(school.key).child(teacher.key).once("value").then(snapshot => {
              console.log(snapshot.val())
               teachers.push(snapshot.val())
               this.setState(prevState => ({
                teachers: [...prevState.teachers, snapshot.val()]
              }))
              // snapshot.forEach(data=>{
                
              // })
             
              
              // this.state.teachers.push(snapshot.val())
             

            })



          }
        })

        
      })
        // if (section.key == localStorage.getItem("classId")) {
        //     section.forEach(student => {
        //         if(student.key==localStorage.getItem("studentId")){
        //         students.push(student.val())
        //         this.setState({name:student.val().userName,fname:student.val().father_name,gender:student.val().gender,email:student.val().email,contact:student.val().father_pno})
        //         }
        //     })
        // }
    })

    // this.setState({teachers},()=>{
    //   this.state.teachers.forEach(teacher=>{
    //     console.log(teacher)
    //   })
    //   })
      

   
})
}   



  login = (teacherId,teacherName,profileImg) => {

    // console.log(teacherName+teacherId)
    // console.log("studentID"+localStorage.getItem('Student') + localStorage.getItem('studentId'))
    // console.log(localStorage.getItem('studentId')+ teacherId)
    { 


      firebase.database().ref("TextChatting").child(localStorage.getItem('studentId')).child(teacherId).child(localStorage.getItem('studentId')+teacherId).set({

         roomId: localStorage.getItem('studentId')+teacherId,
         date:new Date().toLocaleString(), 
         teacherName:teacherName,
         teacherId:teacherId,
         studentName:localStorage.getItem('Student'),
         studentId:localStorage.getItem('studentId'),
         author:localStorage.getItem('email'),
         profileImg:localStorage.getItem('Profile')



         

         

     }).then(this.setState({redirect:true,room:localStorage.getItem('studentId')+teacherId,chatWith:teacherName, profileImg:profileImg,email:localStorage.getItem('email')}))
 }



    // const { email, room } = this.state;
    // if (
    //   email &&
    //   room &&
    //   /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
    //     email
    //   )
    // ) {
    //   this.props.history.push("chat", { room, email });
    // }
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, room } = this.state;
    if (this.state.redirect) {
      return <Redirect to={{ pathname: '/student/chat', state:{room: this.state.room,email:localStorage.getItem('email'),chatWith:this.state.chatWith,profileImg:this.state.profileImg} }}  />
    }
    return (
      <div style={{textAlign:'center'}}>
     <h1 className='' > Chat with</h1>
     {this.state.teachers.map((item,i)=>{
       return(
        <div className='flex' style={{ flexDirection: 'row' }}>

        <div class='margin-auto margin-bottom-10' style={{ width: '80%' }}>


          <Card  >


            <div style={{ display: 'flex' ,justifyContent:'space-around'}} >
              <CardMedia
                style={{width:'50px', height:'50px',borderRadius:'50px'}}
                image={item.profileImg ? item.profileImg : "/naseemlogo.png"}
                title="Live from space album cover"
              />
              <CardContent >

                <Typography variant="subtitle1" color="textSecondary">
                {item.userName}
               </Typography>

              </CardContent>
            <div style={{paddingTop:'16px'}}> 


           

     
     
                {/* <Link to={{ pathname: '/student/chat', state: { room: item.roomId, email: localStorage.getItem('email') } }} > */}
                <Badge  style={{cursor:'pointer'}} onClick={e=>this.login(item.id,item.userName,item.profileImg)} variant='dot' color="error">
                <MailIcon />
              </Badge>
              {/* </Link> */}

         
        
            </div>


            </div >

          </Card>

          {/* <InputLabel htmlFor="input-with-icon-adornment">Name</InputLabel>
          <Input
            type="text"
            id="field"
            value={item.studentName}

            required


          /> */}

        </div>



        {/* <div class=' margin-auto margin-bottom-10 center'>

          <Link to={{ pathname: '/teacher/chat', state: { room: item.roomId, email: localStorage.getItem('email') } }} >
            <Button
              color="primary"
              variant="contained"
              style={styles.button}

            >
              Chat
        </Button>
          </Link>

        </div> */}


      </div>
       )
     })} 
      
     
      </div>
    );
  }
}

const styles = {
  header: {},
  grid: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  card: { padding: 40 },
  textField: { width: 300 },
  gridItem: { paddingTop: 12, paddingBottom: 12 },
  button: { width: 300 },
};

export default WelcomeScreen;
