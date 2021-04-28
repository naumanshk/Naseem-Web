import React, {Component} from 'react';
import '../App.css';
import '../config'; 
import* as firebase from 'firebase'
import storage from '../config'
import leader from '../Images/leader.png'
import createTypography from '@material-ui/core/styles/createTypography';

class announcement extends Component {
    constructor(props){
        super(props);
        this.state = {
            title: '',
            name: '',
            description: '',
            date: '',
            time: '',
            image: '',
            imgURL: '',
            done: false
        }
    }

    componentDidMount(){
        // const {classId} = this.props.location.state;
        this.setState({classId: localStorage.getItem("classId")})
        console.log(localStorage.getItem("classId"))

    }

    createAnnouncement(){
        var date = new Date();
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; 
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;

        if (this.state.title == '') {
            alert('Please add a title!')
            return;
        } else if (this.state.name == ''){
            alert('Please add name!')
            return;
        }else if (this.state.description == ''){
            alert('Please add description')
            return;
        }

        

        var key = firebase.database().ref("Announcements").push().key;
        console.log(key)

        var contentList =  [
            {
                fileName: this.state.image.name,
                fileSize: "",
                fileType: this.state.image.type,
                fileUri: this.state.imgURL
            }
        ]



        if (this.state.image != '' && this.state.imgURL != ''){
            firebase.database().ref("Announcements").child("TeacherAnnouncement").child(this.state.classId).child(key).set({
                announcDate: day + '-' + month + '-' + year,
                announcTime: strTime,
                announDescription: this.state.description,
                announTitle: this.state.title,
                classid: this.state.classId,
                contentList: contentList,
                id: key,
                teacherid: localStorage.getItem("teacherId"),
                teacherName: localStorage.getItem("Teacher")
    
            }).then(
                // this.props.history.push('/home')
                this.setState({done: true})
            )
        } else {
            firebase.database().ref("Announcements").child("TeacherAnnouncement").child(this.state.classId).child(key).set({
                announcDate: day + '-' + month + '-' + year,
                announcTime: strTime,
                announDescription: this.state.description,
                announTitle: this.state.title,
                classid: this.state.classId,
                id: key,
                teacherid: localStorage.getItem("teacherId"),
                teacherName: localStorage.getItem("Teacher")
    
            }).then(
                // this.props.history.push('/home')
                // console.log('done');
                this.setState({done: true})
            )
        }
        
    }

    fileUpload(){
        let {image} = this.state;
        const upload = storage.ref(image.name).put(image);
        upload.on('state_changed',
        (snapshot) => {

        }, 
        (error) => {
            console.log(error);
        }, 
        ()=>{
            storage.ref(image.name).getDownloadURL().then(url => {
                console.log(url);
                this.setState({imgURL: url});
                this.setState({uploaded: "Uploaded"})
            })
        });
    }

    render(){
        return (
            <div className="main-container">
                <div className="page-header center flex-around " >
                    <div className="flex ">
                    <img src={leader} className="header-icon"></img>
                    <h1 className="white center announcement-heading">Add Announcement For Students</h1>

                    </div>
                    

                </div>
                <div className="announcement-body center">
                    {!this.state.done && <div>
                        <div className="announcement-input">
                        <input className="input-grey"
                                value={this.state.name}  type="text" name="name" placeholder="Enter Name"
                                onChange={(e)=> {
                                    e.preventDefault();                                 
                                    var {name} = this.state;
                                    name = e.target.value;
                                    this.setState({name})
                                }}
                            />

                        </div>
                        
                        <div className="announcement-input">
                        <input className="input-grey"
                                value={this.state.title}  type="text" name="title" placeholder="Enter title"
                                onChange={(e)=> {
                                    e.preventDefault();                                 
                                    var {title} = this.state;
                                    title = e.target.value;
                                    this.setState({title})
                                }}
                            />

                        </div>
                            
                        <div className="announcement-input">
                        <textarea className="input-grey" style={{minHeight: '200px', minWidth: '100%', maxWidth: '100%'}}
                                value={this.state.description}  type="text" name="description" placeholder="Enter Description"
                                onChange={(e)=> {
                                    e.preventDefault();                                 
                                    var {description} = this.state;
                                    description = e.target.value;
                                    this.setState({description})
                                }}
                            />

                        </div> 

                        <div className="announcement-input center">
                            <input class="upload-img" style={{ height: '30px' }} type="file" onChange={(e)=> {
                                var {image} = this.state;
                                image = e.target.files[0]
                                this.setState({image})
                                console.log(image)
                            }}></input>
                            <p>{this.state.uploaded}</p>

                            <button className="content-btn" onClick={()=> {this.fileUpload()}}>upload</button>

                        </div>

                        <button className="announcement-btn center" onClick={()=>{this.createAnnouncement()}}>Create</button>       

                    </div>}
                    {this.state.done && <div>
                        <h3>Announcement Created!</h3>
                        <button className="announcement-btn center" onClick={()=>{this.props.history.push('/teacher')}} >Go Back</button>
                    </div>}

                </div>
            </div>
        )
    }
}

export default announcement;