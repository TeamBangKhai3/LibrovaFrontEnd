import React, { useState, useEffect } from 'react';
import { AppBar, Box, Container, Toolbar, IconButton, Typography, Avatar, Menu, MenuItem, ButtonBase, Button, InputBase } from '@mui/material';
import { ShoppingCartOutlined, BookmarkBorderOutlined, LibraryBooksOutlined, Search as SearchIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logotrans from '../assets/logotrans.png';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: '#FFFFFF',
    border: '1px solid #D3D3D3',
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '55svw',
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

const CustomAppBar = ({ userInfoEndpoint, loginRoute, homeRoute, accountSettingRoute }) => {
    const settings = ['Account', 'Ebook Manager', 'Logout'];
    const navigate = useNavigate();
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get(userInfoEndpoint, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('sessionToken')}`
                    }
                });
                if (response.status === 200) {
                    setUsername(response.data.username);
                } else {
                    navigate(loginRoute);
                }
            } catch (error) {
                console.error('Error fetching user info:', error);
                navigate(loginRoute);
            }
        };

        fetchUserInfo();
    }, [navigate, userInfoEndpoint, loginRoute]);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('sessionToken');
        navigate(loginRoute);
    };

    const handleAccount = () => {
        navigate(accountSettingRoute);
    };

    return (
        <>
            <AppBar position="absolute" sx={{ height: '80px', bgcolor: 'white', boxShadow: 'none' }}>
                <Container maxWidth="x1" sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                    <Toolbar disableGutters sx={{ width: '100%' }}>
                        <Box component="img" src={logotrans} alt="Logo" sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, height: '60px', marginLeft: '20px', marginRight:'5svw' }} />
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
                            <ButtonBase sx={{ display: 'flex', alignItems: 'center', color: 'black', marginRight: '10px' }} onClick={handleOpenUserMenu}>
                                <Typography sx={{ marginRight: '10px' }}>
                                    Hello, {username}
                                </Typography>
                                <Avatar />
                            </ButtonBase>
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
                        <Button
                            color="inherit"
                            sx={{ color: 'black', fontWeight: 'bold' }}
                            onClick={() => navigate(homeRoute)}
                        >
                            Home
                        </Button>
                        <Button color="inherit" sx={{ color: 'black', fontWeight: 'bold' }}>Books</Button>
                        <Button color="inherit" sx={{ color: 'black', fontWeight: 'bold' }}>Genre</Button>
                        <Button color="inherit" sx={{ color: 'black', fontWeight: 'bold' }}>???</Button>
                    </Toolbar>
                </Container>
            </AppBar>
        </>
    );
};

export default CustomAppBar;