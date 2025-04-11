import React, { useState, useEffect } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Box,
  Divider,
  ListItemButton,
  Paper,
  Typography,
  Avatar,
  IconButton,
  AppBar,
  Toolbar
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import FaceIcon from '@mui/icons-material/Face';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import MenuIcon from '@mui/icons-material/Menu';
import EventBusyIcon from '@mui/icons-material/EventBusy';

const drawerWidth = 260;

function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { title: 'Enroll', path: '/enroll', icon: <HowToRegIcon /> },
    { title: 'CheckIn/Out', path: '/face-recognition', icon: <FaceIcon /> },
    { title: 'User Details', path: '/userdetails', icon: <AdminPanelSettingsIcon /> },
    { title: 'Leave', path: '/UnderProgress', icon: <EventBusyIcon /> },
  ];

  const drawer = (
    <Box
  sx={{
    width: drawerWidth,
    height: '100%',
    backgroundColor: theme.palette.background.paper,
  }}
>
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      py: 3,
      backgroundColor: 'whitesmoke',
      color: theme.palette.primary.contrastText,
    }}
  >
    <Avatar
      sx={{
        width: 60,
        height: 60,
        mb: 1,
        bgcolor: 'skyblue',
        fontSize: 20,
      }}
    >
      AT
    </Avatar>
    <Typography variant="subtitle1" sx={{ fontWeight: 'bold',color:'black' }}>
      Attendance Tracker
    </Typography>
    <Typography variant="caption" sx={{ fontWeight: 'bold',color:'black' }}>
      {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </Typography>
  </Box>
  <Divider />

      <List sx={{ pt: 2 , mt: 4}}>
        {menuItems.map((item) => (
          <ListItem
            key={item.title}
            disablePadding
            sx={{ display: 'block', mb: 0.5 }}
          >
            <ListItemButton
              component={Link}
              to={item.path}
              onClick={isMobile ? handleDrawerToggle : undefined}
              sx={{
                minHeight: 48,
                px: 2.5,
                py: 1.5,
                borderRadius: '8px',
                mx: 1,
                backgroundColor: location.pathname === item.path ?
                  `${theme.palette.primary.main}20` : 'transparent',
                '&:hover': {
                  backgroundColor: `${theme.palette.primary.main}30`,
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: location.pathname === item.path ?
                    theme.palette.primary.main : theme.palette.text.secondary,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.title}
                sx={{
                  opacity: 1,
                  color: location.pathname === item.path ?
                    theme.palette.primary.main : theme.palette.text.primary,
                  '& .MuiTypography-root': {
                    fontWeight: location.pathname === item.path ? 600 : 400,
                  }
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ p: 2 }}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 2,
            backgroundColor: theme.palette.mode === 'light' ? '#e3f2fd' : theme.palette.background.paper,
            border: '1px solid',
            borderColor: theme.palette.primary.main + '40',
            mt: 7,
          }}
        >
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
            Quick Tip
          </Typography>
          <Typography variant="caption">
            Click on CheckIn/Out to mark your attendance for today's session.
          </Typography>
        </Paper>
      </Box>
      <List sx={{ mt: 'auto' }}>
        <ListItem
          disablePadding
          sx={{ display: 'block', mb: 0.5 }}
        >
          {/* <ListItemButton
            sx={{
              minHeight: 48,
              px: 2.5,
              borderRadius: '8px',
              mx: 1,
              '&:hover': {
                backgroundColor: `${theme.palette.error.main}20`,
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: theme.palette.error.main }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              sx={{ color: theme.palette.error.main }}
            />
          </ListItemButton> */}
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      {/* Mobile app bar with menu toggle button */}
      {isMobile && (
        <AppBar
          position="fixed"
          sx={{
            width: '100%',
            display: { sm: 'none' },
            zIndex: theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Attendance Tracker
            </Typography>
          </Toolbar>
        </AppBar>
      )}
      
      {/* Sidebar component */}
      <Box 
        component="nav" 
        sx={{ 
          width: { sm: drawerWidth }, 
          flexShrink: { sm: 0 }
        }}
      >
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              borderRight: '1px solid',
              borderColor: theme.palette.mode === 'light' ? '#0000001a' : '#ffffff1a',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      
      {/* Content offset for mobile toolbar */}
      {isMobile && <Toolbar />}
    </>
  );
}

export default Sidebar;