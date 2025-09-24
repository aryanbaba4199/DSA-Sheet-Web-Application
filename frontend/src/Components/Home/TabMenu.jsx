
import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/userContext';
import {
  MdDashboard,
  MdPerson,
  MdMenuBook,
  MdTrendingUp,
  MdLogout,
} from 'react-icons/md';
import axios from 'axios';
import { userApi } from '../../Api';

const TabMenu = () => {
  const navigate = useNavigate();
  const {setUser } = useAuth(); 

  const handleLogout = async () => {
    try {
      await axios.post(userApi.logout, {}, { withCredentials: true });
      setUser(null);
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
      setUser(null);
      navigate('/login');
    }
  };

  const menuItems = [
    { icon: MdPerson, label: 'Profile', path: '/profile' },
    { icon: MdMenuBook, label: 'Topics', path: '/topics' },
    { icon: MdTrendingUp, label: 'Progress', path: '/progress' },
  ];

  return (
    <AppBar position="static" color="primary" elevation={0}>
      <Toolbar>

        <Tooltip title="Dashboard">
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate('/')}
            sx={{ mr: 2 }}
          >
            <MdDashboard size={24} />
          </IconButton>
        </Tooltip>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontWeight: 'bold' }}
        >
          Dashboard
        </Typography>


        <Box sx={{ display: 'flex', gap: 1 }}>
          {menuItems.map((item) => (
            <Tooltip key={item.label} title={item.label}>
              <IconButton
                color="inherit"
                onClick={() => navigate(item.path)}
                sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' } }}
              >
                <item.icon size={20} />
              </IconButton>
            </Tooltip>
          ))}

          <Tooltip title="Logout">
            <IconButton
              color="inherit"
              onClick={handleLogout}
              sx={{ '&:hover': { bgcolor: 'rgba(255, 0, 0, 0.1)' } }}
            >
              <MdLogout size={20} />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TabMenu;