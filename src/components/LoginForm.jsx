import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Alert } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import logotrans from '../assets/logotrans.png';
import loginbg from '../assets/loginbg.jpg';

const LoginForm = ({ pingEndpoint, authEndpoint, redirectRoute, title, registerRoute, forgotPasswordRoute }) => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
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

        try {
            const response = await axios.post(authEndpoint, formData);
            if (response.status === 200 && response.data) {
                localStorage.setItem('sessionToken', response.data);
                navigate(redirectRoute);
            } else {
                setError(true);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setError(true);
            } else {
                console.error('Error logging in:', error);
            }
        }
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
                        type="password"
                        variant="outlined"
                        fullWidth
                        required
                        margin="normal"
                        value={formData.password}
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
                    {error && (
                        <Typography color="error" sx={{ alignSelf: 'center', mb: 2 }}>
                            Username or password is incorrect
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
                    Don&apos;t have an account? <Link to={registerRoute}>Sign up here</Link>
                </Typography>
            </Box>
            {showAlert && (
                <Box sx={{ position: 'fixed', bottom: 0, left: 0, m: 2 }}>
                    <Alert severity="success">{alertMessage}</Alert>
                </Box>
            )}
        </Box>
    );
};

export default LoginForm;