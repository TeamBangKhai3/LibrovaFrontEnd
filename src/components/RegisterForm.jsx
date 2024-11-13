import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, TextField, Button, Typography, Checkbox, FormControlLabel, Alert, IconButton, InputAdornment } from "@mui/material";
import logotrans from '../assets/logotrans.png';
import loginbg from '../assets/loginbg.jpg';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const RegisterForm = ({ registerEndpoint, redirectRoute, title, loginRoute }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        address: '',
    });

    const [errors, setErrors] = useState({});
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.username) newErrors.username = 'Username is required';
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        if (!formData.password) newErrors.password = 'Password is required';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        if (!formData.address) newErrors.address = 'Address is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await axios.post(registerEndpoint, {
                username: formData.username,
                password: formData.password,
                email: formData.email,
                address: formData.address,
            });
            console.log('Registration successful:', response.data);
            localStorage.setItem('sessionToken', response.data); // Store the session token
            setAlertMessage('Registered Successfully!');
            setShowAlert(true);
            setTimeout(() => {
                navigate(redirectRoute); // Navigate to the home page or desired page
            }, 3000); // Show alert for 3 seconds before navigating
        } catch (error) {
            console.error('Registration error:', error);
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleClickShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
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
                width="90%"
                maxWidth="400px"
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
                        margin="dense"
                        required
                        value={formData.username}
                        onChange={handleChange}
                        error={!!errors.username}
                        helperText={errors.username}
                        InputProps={{ style: { backgroundColor: 'white' } }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'black',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'black',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'black',
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
                        id="email"
                        label="Email Address"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                        InputProps={{ style: { backgroundColor: 'white' } }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'black',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'black',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'black',
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
                        margin="dense"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        error={!!errors.password}
                        helperText={errors.password}
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
                                    borderColor: 'black',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'black',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'black',
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
                        id="confirmPassword"
                        label="Confirm Password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                        InputProps={{
                            style: { backgroundColor: 'white' },
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle confirm password visibility"
                                        onClick={handleClickShowConfirmPassword}
                                        edge="end"
                                    >
                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'black',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'black',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'black',
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
                        id="address"
                        label="Address"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        required
                        value={formData.address}
                        onChange={handleChange}
                        error={!!errors.address}
                        helperText={errors.address}
                        InputProps={{ style: { backgroundColor: 'white' } }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'black',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'black',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'black',
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
                    <FormControlLabel
                        control={<Checkbox required />}
                        label="Agree to Terms and Conditions"
                        sx={{ alignSelf: 'flex-start', marginTop: 2 }}
                    />
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
                        Register
                    </Button>
                </Box>
                <Typography variant="body2" mt={2} color={"black"}>
                    Already have an account? <Button onClick={() => navigate(loginRoute)}>Login here</Button>
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

export default RegisterForm;