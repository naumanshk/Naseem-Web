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
import logo from '../ImagePrinci/logo-trans.png'
import { fire } from '../config';

import { useHistory } from 'react-router-dom/'
import * as firebase from 'firebase'
import schoolImg from '../ImagesEx/school_icon.png'
import dashboardImg from '../ImagePrinci/reading-book.png'
import teacher_ico from '../ImagePrinci/teacher-icon.png'
import exependiture_ico from '../ImagePrinci/expenses-icon.png'
import inventory_ico from '../ImagePrinci/Inventory.png'
import announce_ico from '../ImagePrinci/megaphone.png'

import profile_user from '../ImagePrinci/profile-user.png'




const drawerWidth = 200;


const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('lg')]: {
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
  const [schools, setSchools] = React.useState([]);
  const [selectedItem, setSelectedItem] = React.useState('')
  const [dashClass, setDashClass] = React.useState('')
  const [navigator, setNavigator] = React.useState('Dashboard')

  const history = useHistory()

  useEffect(() => {
    
  

    getSchools();
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  const logout = (props) => {

    fire.auth().signOut();
    localStorage.removeItem("user")
    localStorage.removeItem("userName")
    window.location.reload()

  }

  const getSchools = () => {
    var organization;
    firebase.database().ref("Organization").once("value").then(snapshot => {
      snapshot.forEach(Organization => {
        if (Organization.val().organizationName == localStorage.getItem("user")) {
          organization = Organization.key;

        }
      })

      var Schools = []
      firebase.database().ref("School").once("value").then(snapshot => {

        snapshot.forEach(Organization => {
          if (Organization.key == organization) {
            Organization.forEach(item => {

              Schools.push(item.val())
            })

          }


        })
        setSchools(Schools);

      })




    })

  }

  const drawer = (
    <div >

      <Link onClick={() => {
        handleDrawerClose
       setNavigator('Dashboard')
      } } to='/principal/'>
        <div >
          <img className="navbar-logo" src={logo} alt="logo"></img>
        </div>

      </Link>

      <Divider />
      <List style={{ paddingBottom: '100px' }}>

        {/* <div className={selectedItem == 'dashboard' ? 'navActive no-margin-padding' : ''} onClick={()=> {setSelectedItem('dashboard')}} > */}

        <Link to='/principal/'>
          <div class={navigator == "Dashboard" ? 'navActive-p' : ""} >
            <ListItem
              onClick={() => {
                handleDrawerClose()
                setNavigator('Dashboard')

              }}
              button key="Add Items">
              {/* { addImg && <img className="logoiconsm" src={addgreen} alt="logo"></img>}
                { !addImg && <img className="logoiconsm" src={add} alt="logo"></img>} */}
              <img className="navIcon" src={dashboardImg} alt="dash" ></img>
              <h4>Dashboard</h4>
            </ListItem>
          </div>

        </Link>


        <Link to='/principal/profile'>
          <div class={navigator == "Profile" ? 'navActive-p' : ""} >
            <ListItem
              onClick={() => {
                handleDrawerClose()
                setNavigator('Profile')

              }}
              button key="Add Items">
              {/* { addImg && <img className="logoiconsm" src={addgreen} alt="logo"></img>}
                { !addImg && <img className="logoiconsm" src={add} alt="logo"></img>} */}
              <img className="navIcon" src={profile_user} alt="dash" ></img>
              <h4>Profile</h4>
            </ListItem>
          </div>

        </Link>

        <Link style={{ backgroundColor: 'unset' }} to={{ pathname: `/principal/${localStorage.getItem('schoolId')}/verification/` }}>
          <div class={navigator == "Verification" ? 'navActive-p' : ""} >
            <ListItem onClick={() => {
              handleDrawerClose()
              setNavigator('Verification')
            }}
              button key="Add Items">
              {/* { addImg && <img className="logoiconsm" src={addgreen} alt="logo"></img>}
                { !addImg && <img className="logoiconsm" src={add} alt="logo"></img>} */}
              <img className="navIcon" src={exependiture_ico} alt="dash" ></img>
              <h4>Teacher's Verification</h4>
            </ListItem>
          </div>
        </Link>

        <Link style={{ backgroundColor: 'unset' }} to={{ pathname: `/principal/${localStorage.getItem('schoolId')}/expenditure/` }}>
          <div class={navigator == "Expenditure" ? 'navActive-p' : ""} >
            <ListItem onClick={() => {
              handleDrawerClose()
              setNavigator('Expenditure')
            }}
              button key="Add Items">
              {/* { addImg && <img className="logoiconsm" src={addgreen} alt="logo"></img>}
                { !addImg && <img className="logoiconsm" src={add} alt="logo"></img>} */}
              <img className="navIcon" src={exependiture_ico} alt="dash" ></img>
              <h4>Expenditure</h4>
            </ListItem>
          </div>
        </Link>

        <Link style={{ backgroundColor: 'unset' }} to={{ pathname: `/principal/${localStorage.getItem('schoolId')}/inventory/` }}>
          <div class={navigator == "Inventory" ? 'navActive-p' : ""} >
            <ListItem onClick={() => {
              handleDrawerClose()
              setNavigator('Inventory')

            }}
              button key="Add Items">
              {/* { addImg && <img className="logoiconsm" src={addgreen} alt="logo"></img>}
                { !addImg && <img className="logoiconsm" src={add} alt="logo"></img>} */}
              <img className="navIcon" src={inventory_ico} alt="dash" ></img>
              <h4>Inventory</h4>
            </ListItem>
          </div>
        </Link>

        <Link style={{ backgroundColor: 'unset' }} to={{ pathname: `/principal/${localStorage.getItem('schoolId')}/announcements/` }}>
          <div class={navigator == "Announcements" ? 'navActive-p' : ""} >
            <ListItem onClick={() => {
              handleDrawerClose()
              setNavigator('Announcements')
            }}
              button key="Add Items">
              {/* { addImg && <img className="logoiconsm" src={addgreen} alt="logo"></img>}
                { !addImg && <img className="logoiconsm" src={add} alt="logo"></img>} */}
              <img className="navIcon" src={announce_ico} alt="dash" ></img>
              <h4>Announcements</h4>
            </ListItem>
          </div>
        </Link>

        <Link
          style={{ backgroundColor: 'unset' }}
          to={{
            pathname: `/principal/${localStorage.getItem('schoolId')}/teachers/`,
            state: {
              schoolId: localStorage.getItem('schoolId'),


            }
          }}

        >
          <div class={navigator == "Teachers" ? 'navActive-p' : ""} >
            <ListItem onClick={() => {
              handleDrawerClose()
              setNavigator('Teachers')

            }}
              button key="Add Items">
              {/* { addImg && <img className="logoiconsm" src={addgreen} alt="logo"></img>}
                { !addImg && <img className="logoiconsm" src={add} alt="logo"></img>} */}
              <img className="navIcon" src={teacher_ico} alt="dash" ></img>
              <h4>Teachers</h4>
            </ListItem>
          </div>
        </Link>


        <Link style={{ backgroundColor: 'unset' }} to={{ pathname: `/principal/${localStorage.getItem('schoolId')}/chatScreen/` }}>
          <div class={navigator == "Chat" ? 'navActive-p' : ""} >
            <ListItem onClick={() => {
              handleDrawerClose()
              setNavigator('Chat')
            }}
              button key="Add Items">
              {/* { addImg && <img className="logoiconsm" src={addgreen} alt="logo"></img>}
                { !addImg && <img className="logoiconsm" src={add} alt="logo"></img>} */}
              <img className="navIcon" src={announce_ico} alt="dash" ></img>
              <h4>Chat</h4>
            </ListItem>
          </div>
        </Link>







      </List>



      <Link to='/principal'>
        <div className="logoutdiv"  >
          <Divider style={{ backgroundColor: "grey" }} />

          <h5 style={{ margin: "10px 5px 10px 5px" }} > Logged In as:  {localStorage.getItem("userName")}</h5>
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