import React, {useEffect} from 'react';
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
import {fire} from '../config';
import {useHistory} from 'react-router-dom/'
import* as firebase from 'firebase'


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



  useEffect(() => {
    
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  const logout = (props) => {
    fire.auth().signOut();
    localStorage.removeItem("Student")
    localStorage.removeItem("studentId")
    localStorage.removeItem("classId")
    window.location.reload()
    
  }

  const drawer = (
    <div>

      <Link onClick={handleDrawerClose} to='/student'>
        <img className="navbar-logo" src={logo} alt="logo"></img>
      </Link>

      <Divider />
          <List>
          <Link  to='/student'>
          <div  >
            <ListItem onClick={handleDrawerClose} button key="dashboard">
                {/* { addImg && <img className="logoiconsm" src={addgreen} alt="logo"></img>}
                { !addImg && <img className="logoiconsm" src={add} alt="logo"></img>} */}
                {/* <img src={dashboard} className="nav-icon"></img> */}
                <h4>Dashboard</h4>
            </ListItem>
            </div>
          </Link>

          <Link  to='/student/profile'>
          <div  >
            <ListItem onClick={handleDrawerClose} button key="dashboard">
                {/* { addImg && <img className="logoiconsm" src={addgreen} alt="logo"></img>}
                { !addImg && <img className="logoiconsm" src={add} alt="logo"></img>} */}
                {/* <img src={dashboard} className="nav-icon"></img> */}
                <h4>Profile</h4>
            </ListItem>
            </div>
          </Link>
          <Link  to='/student/zoom'>
          <div  >
            <ListItem onClick={handleDrawerClose} button key="dashboard">
                {/* { addImg && <img className="logoiconsm" src={addgreen} alt="logo"></img>}
                { !addImg && <img className="logoiconsm" src={add} alt="logo"></img>} */}
                {/* <img src={dashboard} className="nav-icon"></img> */}
                <h4>Join Room</h4>
            </ListItem>
            </div>
          </Link>

          <Link  to='/student/chatScreen'>
          <div  >
            <ListItem onClick={handleDrawerClose} button key="dashboard">
                {/* { addImg && <img className="logoiconsm" src={addgreen} alt="logo"></img>}
                { !addImg && <img className="logoiconsm" src={add} alt="logo"></img>} */}
                {/* <img src={dashboard} className="nav-icon"></img> */}
                <h4>Chat</h4>
            </ListItem>
            </div>
          </Link>
          



          </List>

      
          
      <Link to='/studentlogin'>
      <div className="logoutdiv">
      <Divider /> 
      
              
        <h5 style={{margin: "10px 5px 10px 5px"}} > Logged In as:  {localStorage.getItem("Student")}</h5>
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
            <div className="menu-icon"><MenuIcon style={{marginLeft:'15px'}} /></div>
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

export {ResponsiveDrawer};