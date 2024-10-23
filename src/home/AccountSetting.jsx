import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Container,
    Toolbar,
    Typography,
    AppBar,
    IconButton,
    Menu,
    Avatar,
    Tooltip,
    MenuItem,
    InputBase,
    alpha,
    Button, Paper, Stack, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Alert
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartOutlined from '@mui/icons-material/ShoppingCartOutlined';
import BookmarkBorderOutlined from '@mui/icons-material/BookmarkBorderOutlined';
import LibraryBooksOutlined from '@mui/icons-material/LibraryBooksOutlined';
import logotrans from '../assets/logotrans.png';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid2';
import { PhotoCamera } from "@mui/icons-material";

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: '#FFFFFF',
    border: '1px solid #D3D3D3',
    '&:hover': {
        backgroundColor: alpha('#FFFFFF', 0.9),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '60svw',
    height: '45px',
    display: 'flex',
    alignItems: 'center',
    color: 'black',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'black',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        height: '100%',
    },
}));

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    ...theme.applyStyles('dark', {
        backgroundColor: '#1A2027',
    }),
}));

export default function AccountSetting() {
    const settings = ['Account', 'Ebook Manager', 'Logout'];
    const navigate = useNavigate();
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [userInfo, setUserInfo] = useState({});
    const [values, setValues] = useState({
        email: '',
        password: '',
        address: ''
    });
    const [deleteStep, setDeleteStep] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        const fetchUserInfo = async () => {
            const sessionToken = localStorage.getItem('sessionToken');
            const response = await axios.get('http://localhost:25566/users/getuserinfo', {
                headers: {
                    'Authorization': `Bearer ${sessionToken}`
                }
            });
            const data = response.data;
            setUserInfo(data);
            setValues({
                email: data.email,
                password: data.password,
                address: data.address
            });
        };
        fetchUserInfo();
    }, []);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('sessionToken');
        navigate('/login');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value
        });
    };

    const handleSave = async () => {
        const sessionToken = localStorage.getItem('sessionToken');
        await axios.put('http://localhost:25566/users/updateuserinfo', values, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionToken}`
            }
        });
    };

    const handleDeleteAccount = async () => {
        const sessionToken = localStorage.getItem('sessionToken');
        try {
            await axios.delete('http://localhost:25566/users/deleteuser', {
                headers: {
                    'Authorization': `Bearer ${sessionToken}`
                }
            });
            setShowAlert(true);
            localStorage.removeItem('sessionToken'); // Remove session token after successful deletion
            setTimeout(() => {
                navigate('/login');
            }, 3000); // Redirect after 3 seconds
        } catch (error) {
            console.error('Error deleting account:', error);
            alert('Failed to delete account. Please try again.');
        }
    };

    const handleDeleteClick = () => {
        setOpenDialog(true);
        setDeleteStep(1);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        setDeleteStep(0);
    };

    const handleDialogConfirm = () => {
        if (deleteStep < 3) {
            setDeleteStep(deleteStep + 1);
        } else {
            handleDeleteAccount();
            setOpenDialog(false);
        }
    };

    const getDialogContent = () => {
        switch (deleteStep) {
            case 1:
                return "Are you sure to delete your account?";
            case 2:
                return "Remember this action is irreversible and will destroy your data. Are you sure?";
            case 3:
                return "Are you really sure to do this action?";
            default:
                return "";
        }
    };

    return (
        <Box component={"section"} sx={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <AppBar position="absolute" sx={{ height: '80px', bgcolor: 'white', boxShadow: 'none' }}>
                <Container maxWidth="x1" sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                    <Toolbar disableGutters sx={{ width: '100%' }}>
                        <Box component="img" src={logotrans} alt="Logo" sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, height: '60px', marginLeft: '20px', marginRight:'8svw' }} />
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, alignItems: 'center', Width: '68svw', marginRight: '5svw' }}>
                            <Search>
                                <SearchIconWrapper>
                                    <SearchIcon />
                                </SearchIconWrapper>
                                <StyledInputBase
                                    placeholder="Search…"
                                    inputProps={{ 'aria-label': 'search' }}
                                />
                            </Search>
                        </Box>
                        <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
                            <IconButton sx={{ color: 'black', fontSize: '33px' }}>
                                <ShoppingCartOutlined sx={{ fontSize: 'inherit' }} />
                            </IconButton>
                            <IconButton sx={{ color: 'black', fontSize: '33px' }}>
                                <BookmarkBorderOutlined sx={{ fontSize: 'inherit' }} />
                            </IconButton>
                            <IconButton sx={{ color: 'black', fontSize: '33px', marginRight: '10px' }}>
                                <LibraryBooksOutlined sx={{ fontSize: 'inherit' }} />
                            </IconButton>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                {settings.map((setting) => (
                                    <MenuItem
                                        key={setting}
                                        onClick={() => {
                                            handleCloseUserMenu();
                                            if (setting === 'Logout') handleLogout();
                                            if (setting === 'Account') handleAccount();
                                        }}
                                    >
                                        <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            <AppBar position="relative" sx={{ height: '50px', bgcolor: '#E0E0E0', top: '80px', width: '100svw', boxShadow: 1 }}>
                <Container maxWidth="xl" sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                    <Toolbar disableGutters sx={{ width: '100%', justifyContent: 'space-around' }}>
                        <Button color="inherit" sx={{ color: 'black', fontWeight: 'bold' }}>Books</Button>
                        <Button color="inherit" sx={{ color: 'black', fontWeight: 'bold' }}>Genre</Button>
                        <Button color="inherit" sx={{ color: 'black', fontWeight: 'bold' }}>Category</Button>
                        <Button color="inherit" sx={{ color: 'black', fontWeight: 'bold' }}>???</Button>
                    </Toolbar>
                </Container>
            </AppBar>
            <Box component="section" sx={{ marginTop: '120px', width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
                <Box component="header" sx={{ marginLeft: '80px' }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        Account Information
                    </Typography>
                </Box>
            </Box>
            <Box component="section" sx={{marginTop:'5svh',width:'80svw',height:'65svh',bgcolor:'#D9D9D9'}}>
                <Grid container spacing={1}>
                    <Grid size={8}>
                        <Box component="section" sx={{ width: '50svw', height: '50svh', textAlign: 'left' }}>
                            <Stack rowGap={1} spacing={2} sx={{ marginLeft: '10%', marginTop: '5%' }}>
                                <TextField
                                    label="Username"
                                    value={userInfo.username}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    variant="outlined"
                                    fullWidth
                                />
                                <TextField
                                    label="Email"
                                    name="email"
                                    value={values.email}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    fullWidth
                                />
                                <TextField
                                    label="Password"
                                    name="password"
                                    type="password"
                                    value={values.password}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    fullWidth
                                />
                                <TextField
                                    label="Address"
                                    name="address"
                                    value={values.address}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    fullWidth
                                />
                                <Box component="section" sx={{display:'flex',justifyContent:'flex-end'}}>
                                    <Button variant="contained" color="error" onClick={handleDeleteClick} sx={{marginRight:'10px'}}>
                                        Delete Account
                                    </Button>
                                    <Button variant="contained" color="primary" onClick={handleSave} sx={{marginLeft:'10px'}}>
                                        Save
                                    </Button>
                                </Box>
                            </Stack>
                        </Box>
                    </Grid>
                    <Grid size={4} borderLeft="2px solid gray">
                        <Box component="section" sx={{ width: '45svh', height: '65svh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <Avatar alt="Profile Photo" src="/static/images/avatar/placeholder.jpg" sx={{ width: 100, height: 100, mb: 2 }} />
                            <Button variant="contained" color="primary" startIcon={<PhotoCamera />}>
                                Change Profile Photo
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            {showAlert && (
                <Box sx={{ position: 'fixed', bottom: 0, left: 0, m: 2 }}>
                    <Alert severity="success">The account has been deleted successfully.</Alert>
                </Box>
            )}
            <Dialog
                open={openDialog}
                onClose={handleDialogClose}
            >
                <DialogTitle>Delete Account</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {getDialogContent()}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>No</Button>
                    <Button onClick={handleDialogConfirm} autoFocus>Yes</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}