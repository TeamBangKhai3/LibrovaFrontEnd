 import '../App.css'
import { Box, TextField, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import logotrans from '../assets/logotrans.png';
import loginbg from '../assets/loginbg.jpg';


export default function Login() {
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
                    <Typography variant="h4" color="black" fontWeight={"bold"}>Login</Typography>
                </Box>
                <Box component={"form"} action="/login" method="post" display="flex" flexDirection="column" width="100%">
                    <TextField
                        id="username"
                        label="Username"
                        variant="outlined"
                        fullWidth
                        margin="normal"
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
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
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
                    <Link to="/forgot-password" style={{ alignSelf: 'flex-start', marginBottom: '16px' }}>Forgot Password?</Link>
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
                    Don't have an account? <Link to="/register">Sign up here</Link>
                </Typography>
            </Box>
        </Box>
    )
}