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
  Alert,
} from '@mui/material';
import { MdMailOutline, MdLockOutline, MdPersonOutline, MdArrowBackIos } from 'react-icons/md';
import axios from 'axios';
import { userApi } from '../../Api';
import { useAuth } from '../../Context/userContext';
import { useNavigate } from 'react-router-dom';

const Authentication = () => {
  const [show_login, set_show_login] = useState(true);
  const { fetchUser } = useAuth(); 
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState(''); 
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const validateSignup = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.name.trim() === '') {
      setError('Name is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let res;
    let endpoint = show_login ? userApi.login : userApi.signup;
    let submitData = { ...formData };

   
    if (show_login) {
      submitData = { email: formData.email, password: formData.password };
    } else {
 
      if (!validateSignup()) {
        setLoading(false);
        return;
      }

      delete submitData.confirmPassword;
    }

    try {
      res = await axios.post(endpoint, submitData, { withCredentials: true });
      if (res.data.success) {
        await fetchUser();
        navigate('/');
      } else {
        setError(res.data.message || 'An error occurred');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleForm = () => {
    set_show_login(!show_login);
    setFormData({ name: '', email: '', password: '', confirmPassword: '' }); // Reset form on toggle
    setError('');
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
              {show_login ? 'Welcome Back' : 'Create Account'}
            </Typography>
            <Box component="form" onSubmit={handleSubmit} className="space-y-4">
              <Collapse in={!show_login} timeout="auto" unmountOnExit>
                <TextField
                  fullWidth
                  margin="normal"
                  name="name"
                  label="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={!!error && error.includes('Name')}
                  helperText={error && error.includes('Name') ? error : ''}
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
                error={!!error && error.includes('Email')}
                helperText={error && error.includes('Email') ? error : ''}
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
                error={!!error && error.includes('Password')}
                helperText={error && error.includes('Password') ? error : ''}
                InputProps={{
                  startAdornment: (
                    <MdLockOutline className="mr-2 text-gray-500" size={20} />
                  ),
                }}
              />
              <Collapse in={!show_login} timeout="auto" unmountOnExit>
                <TextField
                  fullWidth
                  margin="normal"
                  name="confirmPassword"
                  type="password"
                  label="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  error={!!error && error.includes('match')}
                  helperText={error && error.includes('match') ? error : ''}
                  InputProps={{
                    startAdornment: (
                      <MdLockOutline className="mr-2 text-gray-500" size={20} />
                    ),
                  }}
                />
              </Collapse>
              {error && (
                <Alert severity="error" onClose={() => setError('')}>
                  {error}
                </Alert>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                className="py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200"
              >
                {loading ? 'Processing...' : (show_login ? 'Sign In' : 'Sign Up')}
              </Button>
              <Divider className="my-6 bg-gray-200" />
              <Box className="text-center">
                <Button
                  onClick={toggleForm}
                  variant="text"
                  disabled={loading}
                  className="text-purple-600 hover:text-purple-800 font-medium flex items-center justify-center gap-1 transition-colors duration-200"
                >
                  {show_login ? (
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