import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Link, Redirect } from 'react-router-dom';
import logo from '../Images/naseemlogo.png'
import { fire } from '../config';
import { useHistory } from 'react-router-dom/'
import * as firebase from 'firebase'
import dashboard from '../Images/dashboard.png'
import announcement from '../Images/create-announcement.png'
import test from '../Images/create-test.png'
import classImg1 from '../Images/classImg1.png'
import teacher from '../Images/teacher.png'


const drawerWidth = 200;


const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('md')]: {
      width: drawerWidth,
      flexShrink: 0,
    
    },
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    zIndex: 1,
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));





function ResponsiveDrawer(props) {
  const { container, lang } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [subMenu, setsubMenu] = React.useState(false);
  const [subMenuRoom, setsubMenuRoom] = React.useState(false);
  const [subMenuStudents, setsubMenuStudents] = React.useState(false);


  const [dropdown, updateDropdown] = React.useState([]);
  const [classID, setClassID] = React.useState();
  const [schoolKey, setSchoolKey] = React.useState(false);


  useEffect(() => {
    getSchools();
    getClasses();
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  const logout = (props) => {
    fire.auth().signOut();
    localStorage.removeItem("Teacher")
    localStorage.removeItem("teacherId")
    window.location.reload()

  }

  const getSchools = () => {
    var organization;


  }
  const reload = (props) => {

    
    window.location.href = "/teacher/zoom";

  }

  const getClasses = () => {

    let classes = []

    firebase.database().ref("Assosiated_Classes").once("value").then(snapshot => {
      snapshot.forEach(school => {
        school.forEach(teacher => {
          if (teacher.key == localStorage.getItem('teacherId')) {
            setSchoolKey(true)

            teacher.forEach(Class => {
              classes.push(Class.val())
              console.log('classes' + Class.val().refId)

            })


          }
        })
      })

      updateDropdown(classes);

      // if(classes.length!=0){

      //     this.getClassDetails(classes[0].id)
      //     this.setState({classId: classes[0].id})

      //     localStorage.setItem("classId", classes[0].id)
      // }
    })
  }

  const drawer = (
    <div style={{paddingBottom:"100px"}}>

      <Link onClick={() => {
        handleDrawerClose
        setsubMenu(false)
        setsubMenuRoom(false)
      }} to='/teacher'>
        <img className="navbar-logo" src={logo} alt="logo"></img>
      </Link>

      <Divider />
      <List>
        <Link to='/teacher'>
          <div  >
            <ListItem onClick={() => {
              handleDrawerClose
              setsubMenu(false)
              setsubMenuRoom(false)

            }} button key="Add Items">
              {/* { addImg && <img className="logoiconsm" src={addgreen} alt="logo"></img>}
                { !addImg && <img className="logoiconsm" src={add} alt="logo"></img>} */}
              <img src={dashboard} className="nav-icon"></img>
              <h4>Dashboard</h4>
            </ListItem>
          </div>
        </Link>

        <Link to='/teacher/profile'>
          <div  >
            <ListItem onClick={() => {
              handleDrawerClose
              setsubMenu(false)
              setsubMenuRoom(false)

            }} button key="Add Items">
              {/* { addImg && <img className="logoiconsm" src={addgreen} alt="logo"></img>}
                { !addImg && <img className="logoiconsm" src={add} alt="logo"></img>} */}
              <img src={teacher} className="nav-icon"></img>
              <h4>Profile</h4>
            </ListItem>
          </div>
        </Link>

        <Link to='/teacher/students/verification'>
          <div  >
            <ListItem onClick={() => {
              handleDrawerClose
              setsubMenu(false)
              setsubMenuRoom(false)

            }} button key="Add Items">
              {/* { addImg && <img className="logoiconsm" src={addgreen} alt="logo"></img>}
                { !addImg && <img className="logoiconsm" src={add} alt="logo"></img>} */}
              <img src={teacher} className="nav-icon"></img>
              <h4>Students Verification</h4>
            </ListItem>
          </div>
        </Link>

   
        <Link  >
          <div  >
            <ListItem onClick={e => setsubMenuStudents(!subMenuStudents)} button key="Add Items">
              {/* { addImg && <img className="logoiconsm" src={addgreen} alt="logo"></img>}
                { !addImg && <img className="logoiconsm" src={add} alt="logo"></img>} */}
              <img src={test} className="nav-icon"></img>
              <h4>Students</h4>
            </ListItem>
            {subMenuStudents && <div class="dropdown-responsive" style={{ paddingLeft: '20px' }}>

              {dropdown.map((items) =>
                <Link to='/teacher/view/student'>
                  <div >
                    <ListItem onClick={() => {
                      handleDrawerClose
                      localStorage.setItem("classId", items.id)
                      localStorage.setItem("class", items.className)
                      setClassID(items.id)

                    }} button key="Add Items">
                      {/* { addImg && <img className="logoiconsm" src={addgreen} alt="logo"></img>}
                { !addImg && <img className="logoiconsm" src={add} alt="logo"></img>} */}
                      <img src={classImg1} className="nav-icon"></img>
                      <h4 class={localStorage.getItem("classId") == items.id ? "text-green" : "normal"} >{items.className}</h4>

                    </ListItem>
                  </div>
                </Link>


              )}



            </div>}
          </div>
        </Link>

        <Link to='/teacher/create-announcement'>
          <div  >
            <ListItem onClick={() => {
              handleDrawerClose
              setsubMenu(false)
              setsubMenuRoom(false)

            }} button key="Add Items">
              {/* { addImg && <img className="logoiconsm" src={addgreen} alt="logo"></img>}
                { !addImg && <img className="logoiconsm" src={add} alt="logo"></img>} */}
              <img src={announcement} className="nav-icon"></img>
              <h4>Create Announcement</h4>
            </ListItem>
          </div>
        </Link>

        <Link  >
          <div  >
            <ListItem onClick={e => setsubMenu(!subMenu)} button key="Add Items">
              {/* { addImg && <img className="logoiconsm" src={addgreen} alt="logo"></img>}
                { !addImg && <img className="logoiconsm" src={add} alt="logo"></img>} */}
              <img src={test} className="nav-icon"></img>
              <h4>Create Test</h4>
            </ListItem>
            {subMenu && <div class="dropdown-responsive" style={{ paddingLeft: '20px' }}>

              {dropdown.map((items) =>
                <Link to='/teacher/create-test'>
                  <div >
                    <ListItem onClick={() => {
                      handleDrawerClose
                      localStorage.setItem("classId", items.id)
                      localStorage.setItem("class", items.className)

                      setClassID(items.id)

                    }} button key="Add Items">
                      {/* { addImg && <img className="logoiconsm" src={addgreen} alt="logo"></img>}
                { !addImg && <img className="logoiconsm" src={add} alt="logo"></img>} */}
                      <img src={classImg1} className="nav-icon"></img>
                      <h4 class={localStorage.getItem("classId") == items.id ? "text-green" : "normal"} >{items.className}</h4>

                    </ListItem>
                  </div>
                </Link>
              )}



            </div>}
          </div>
        </Link>


        <Link  >
          <div  >
            <ListItem onClick={e => setsubMenuRoom(!subMenuRoom)} button key="Add Items">
              {/* { addImg && <img className="logoiconsm" src={addgreen} alt="logo"></img>}
                { !addImg && <img className="logoiconsm" src={add} alt="logo"></img>} */}
              <img src={test} className="nav-icon"></img>
              <h4>Create Room</h4>
            </ListItem>
            {subMenuRoom && <div class="dropdown-responsive" style={{ paddingLeft: '20px' }}>

              {dropdown.map((items) =>
                <Link to=''>
                  <div >
                    <ListItem onClick={() => {
                      handleDrawerClose
                      localStorage.setItem("classId", items.id)
                      localStorage.setItem("class", items.className)
                      reload()

                      setClassID(items.id)

                    }} button key="Add Items">
                      {/* { addImg && <img className="logoiconsm" src={addgreen} alt="logo"></img>}
                { !addImg && <img className="logoiconsm" src={add} alt="logo"></img>} */}
                      <img src={classImg1} className="nav-icon"></img>
                      <h4 class={localStorage.getItem("classId") == items.id ? "text-green" : "normal"} >{items.className}</h4>

                    </ListItem>
                  </div>
                </Link>


              )}



            </div>}
          </div>
        </Link>


        <Link to='/teacher/chatScreen' >
          <div >
            <ListItem onClick={() => {
              handleDrawerClose
              
              // setsubMenu(false)
              // setsubMenuRoom(false)

            }} button key="Add Items">
              {/* { addImg && <img className="logoiconsm" src={addgreen} alt="logo"></img>}
                { !addImg && <img className="logoiconsm" src={add} alt="logo"></img>} */}
              <img src={announcement} className="nav-icon"></img>
              <h4>Chat</h4>
            </ListItem>
          </div>
        </Link>


      </List>



      <Link to='/teacherlogin'>
        <div className="logoutdiv">
          <Divider />


          <h5 style={{ margin: "10px 5px 10px 5px" }} > Logged In as:  {localStorage.getItem("Teacher")}</h5>
          <button className="logoutbtn" onClick={logout} >Logout</button>
        </div>
      </Link>

    </div>
  );

  return (
    <div className={classes.root}>
      <CssBaseline />
      <div className="menu-button">
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          className={classes.menuButton}
        >
          <div className="menu-icon"><MenuIcon /></div>
        </IconButton>
      </div>
      <nav className={classes.drawer} aria-label="mailbox folders">
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true,
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
      </main>
    </div>
  );
}

ResponsiveDrawer.propTypes = {
  container: PropTypes.instanceOf(typeof Element === 'undefined' ? Object : Element),
};

export { ResponsiveDrawer };