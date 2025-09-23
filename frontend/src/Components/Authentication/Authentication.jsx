import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Card,
  CardContent,
  Divider,
  Collapse,
} from '@mui/material';
import { MdMailOutline, MdLockOutline, MdPersonOutline, MdArrowBackIos } from 'react-icons/md';

const Authentication = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submit Data:', formData);
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4">
      <Container maxWidth="sm">
        <Card className="shadow-xl border-0" elevation={0}>
          <CardContent className="p-8">
            <Typography
              variant="h4"
              className="text-center mb-6 font-bold text-gray-800"
            >
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </Typography>
            <Box component="form" onSubmit={handleSubmit} className="space-y-4">
              <Collapse in={!isLogin} timeout="auto" unmountOnExit>
                <TextField
                  fullWidth
                  margin="normal"
                  name="name"
                  label="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: (
                      <MdPersonOutline className="mr-2 text-gray-500" size={20} />
                    ),
                  }}
                />
              </Collapse>
              <TextField
                fullWidth
                margin="normal"
                name="email"
                type="email"
                label="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: (
                    <MdMailOutline className="mr-2 text-gray-500" size={20} />
                  ),
                }}
              />
              <TextField
                fullWidth
                margin="normal"
                name="password"
                type="password"
                label="Password"
                value={formData.password}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: (
                    <MdLockOutline className="mr-2 text-gray-500" size={20} />
                  ),
                }}
              />
              <Collapse in={!isLogin} timeout="auto" unmountOnExit>
                <TextField
                  fullWidth
                  margin="normal"
                  name="confirmPassword"
                  type="password"
                  label="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: (
                      <MdLockOutline className="mr-2 text-gray-500" size={20} />
                    ),
                  }}
                />
              </Collapse>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                className="py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200"
              >
                {isLogin ? 'Sign In' : 'Sign Up'}
              </Button>
              <Divider className="my-6 bg-gray-200" />
              <Box className="text-center">
                <Button
                  onClick={toggleForm}
                  variant="text"
                  className="text-purple-600 hover:text-purple-800 font-medium flex items-center justify-center gap-1 transition-colors duration-200"
                >
                  {isLogin ? (
                    <>
                      Create new account
                      <MdPersonOutline size={16} />
                    </>
                  ) : (
                    <>
                      <MdArrowBackIos size={16} />
                      Back to login
                    </>
                  )}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default Authentication;