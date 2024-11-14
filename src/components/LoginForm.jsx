import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, IconButton, InputAdornment } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import logotrans from '../assets/logotrans.png';
import loginbg from '../assets/loginbg.jpg';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const LoginForm = ({ pingEndpoint, authEndpoint, redirectRoute, title, registerRoute, forgotPasswordRoute,alternativeRoute, alternativeTitle }) => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkSessionToken = async () => {
            const token = localStorage.getItem('sessionToken');
            if (token) {
                try {
                    const response = await axios.get(pingEndpoint, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.status === 200) {
                        navigate(redirectRoute);
                    }
                } catch (error) {
                    console.error('Error checking session token:', error);
                }
            }
        };
        checkSessionToken();
    }, [navigate, pingEndpoint, redirectRoute]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(false);
        setErrorMessage('');

        try {
            const response = await axios.post(authEndpoint, formData);
            if (response.status === 200 && response.data) {
                localStorage.setItem('sessionToken', response.data);
                navigate(redirectRoute);
            } else {
                setError(true);
                setErrorMessage('Bad credentials');
            }
        } catch (error) {
            if (error.response && error.response.status === 403) {
                setError(true);
                setErrorMessage('Bad credentials');
            } else {
                setError(true);
                setErrorMessage('Error logging in');
            }
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Box
            component={"section"}
            sx={{
                position: 'relative',
                width: '100svw',
                height: '100svh',
                overflow: 'hidden',
            }}
        >
            <Box
                sx={{
                    backgroundImage: `url(${loginbg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'blur(3px) brightness(0.3)',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: -1,
                }}
            />
            <Box
                component={"div"}
                bgcolor="white"
                p={4}
                borderRadius={4}
                boxShadow={3}
                display="flex"
                flexDirection="column"
                alignItems="center"
                width="300px"
                sx={{ position: 'relative', zIndex: 1, margin: 'auto', top: '50%', transform: 'translateY(-50%)' }}
            >
                <Box component={"img"} src={logotrans} alt="logo" width={"100px"} height={"100px"} mb={2} />
                <Box component={"header"} mb={2}>
                    <Typography variant="h4" color="black" fontWeight={"bold"}>{title}</Typography>
                </Box>
                <Box component={"form"} onSubmit={handleSubmit} display="flex" flexDirection="column" width="100%">
                    <TextField
                        id="username"
                        label="Username"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        required
                        value={formData.username}
                        onChange={handleChange}
                        error={error}
                        InputProps={{ style: { backgroundColor: 'white' } }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: error ? 'red' : 'black',
                                },
                                '&:hover fieldset': {
                                    borderColor: error ? 'red' : 'black',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: error ? 'red' : 'black',
                                },
                                '&.Mui-focused .MuiOutlinedInput-input': {
                                    color: 'black',
                                },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: 'black',
                            },
                        }}
                    />
                    <TextField
                        id="password"
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        variant="outlined"
                        fullWidth
                        required
                        margin="normal"
                        value={formData.password}
                        onChange={handleChange}
                        error={error}
                        InputProps={{
                            style: { backgroundColor: 'white' },
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: error ? 'red' : 'black',
                                },
                                '&:hover fieldset': {
                                    borderColor: error ? 'red' : 'black',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: error ? 'red' : 'black',
                                },
                                '&.Mui-focused .MuiOutlinedInput-input': {
                                    color: 'black',
                                },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: 'black',
                            },
                        }}
                    />
                    {error && (
                        <Typography color="error" sx={{ alignSelf: 'center', mb: 2 }}>
                            {errorMessage}
                        </Typography>
                    )}
                    <Link to={forgotPasswordRoute} style={{ alignSelf: 'flex-start', marginBottom: '16px' }}>Forgot Password?</Link>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{
                            backgroundColor: 'black',
                            '&:hover': {
                                backgroundColor: 'black',
                            },
                        }}
                    >
                        Login
                    </Button>
                </Box>
                <Typography variant="body2" mt={2} color={"black"}>
                    Don&apos;t have an account? <Link to={registerRoute}>Sign up here</Link><br/>
                    {alternativeTitle} <Link to={alternativeRoute}>Log in here</Link>
                </Typography>
            </Box>
        </Box>
    );
};

export default LoginForm;