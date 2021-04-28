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
import logo from '../ImagesEx/naseemlogo.png'
import { fire } from '../config';
import './AppEx.css'
import { useHistory } from 'react-router-dom/'
import * as firebase from 'firebase'
import schoolImg from '../ImagesEx/school_icon.png'
import dashboardImg from '../ImagesEx/dashboard.png'


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
  const [subMenuPricnipal, setsubMenuPricnipal] = React.useState(false)



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
    <div>

      <Link onClick={handleDrawerClose} to='/executive/'>
        <img className="navbar-logo" src={logo} alt="logo"></img>
      </Link>

      <Divider />
      <List style={{ paddingBottom: '110px', overflowY: 'auto' }}>
        <Link to='/executive/'>
          <div className={selectedItem == 'dashboard' ? 'navActive no-margin-padding' : ''} onClick={() => { setSelectedItem('dashboard') }} >
            <ListItem onClick={() => {
              handleDrawerClose()

            }}
              button key="Add Items">
              {/* { addImg && <img className="logoiconsm" src={addgreen} alt="logo"></img>}
                { !addImg && <img className="logoiconsm" src={add} alt="logo"></img>} */}
              <img className="navIcon" src={dashboardImg} alt="dash" ></img>
              <h4>Dashboard</h4>
            </ListItem>
          </div>
        </Link>

        <Link  to={{
              pathname: `/executive/${localStorage.getItem('organizationId')}/profile`}}>
          <div className={selectedItem == 'profile' ? 'navActive no-margin-padding' : ''} onClick={() => { setSelectedItem('profile') }} >
            <ListItem onClick={() => {
              handleDrawerClose()

            }}
              button key="Add Items">
              {/* { addImg && <img className="logoiconsm" src={addgreen} alt="logo"></img>}
                { !addImg && <img className="logoiconsm" src={add} alt="logo"></img>} */}
              <img className="navIcon" src={dashboardImg} alt="dash" ></img>
              <h4>Profile</h4>
            </ListItem>
          </div>
        </Link>


        <Link  to={{
              pathname: `/executive/${localStorage.getItem('organizationId')}/verification`}}>
          <div className={selectedItem == 'verification' ? 'navActive no-margin-padding' : ''} onClick={() => { setSelectedItem('verification') }} >
            <ListItem onClick={() => {
              handleDrawerClose()

            }}
              button key="Add Items">
              {/* { addImg && <img className="logoiconsm" src={addgreen} alt="logo"></img>}
                { !addImg && <img className="logoiconsm" src={add} alt="logo"></img>} */}
              <img className="navIcon" src={schoolImg} alt="dash" ></img>
              <h4>Principal Verification</h4>
            </ListItem>
          </div>
        </Link>



        {schools.map(school => {
          return (
            <Link to={{
              pathname: `/executive/${school.id}`,
              state: {
                school: school.schoolName,
                schoolId: school.id
              }
            }}>
              <div className={selectedItem == school.id ? 'navActive' : ''} onClick={() => { setSelectedItem(school.id) }}>

                <ListItem onClick={() => {
                  handleDrawerClose();

                }

                } button key="Add Items">
                  <img className="navIcon" src={schoolImg} alt="dash" ></img>
                  <h4>{school.schoolName}</h4>
                </ListItem>

              </div>
            </Link>
          )
        })

        }


      </List>



      <Link to='/executive'>
        <div className="logoutdiv" style={{ background: 'white' }}>
          <Divider />

          <h5 style={{ margin: "10px 5px 10px 5px" }} > Logged In as:  {localStorage.getItem("user")}</h5>
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