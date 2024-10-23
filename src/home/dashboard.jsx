import React from 'react';
import { Box, Container, Toolbar, Typography, AppBar, IconButton, Menu, Avatar, Tooltip, MenuItem, InputBase, alpha, Button } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartOutlined from '@mui/icons-material/ShoppingCartOutlined';
import BookmarkBorderOutlined from '@mui/icons-material/BookmarkBorderOutlined';
import LibraryBooksOutlined from '@mui/icons-material/LibraryBooksOutlined';
import logotrans from '../assets/logotrans.png';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: '#FFFFFF', // Set background to white
    border: '1px solid #D3D3D3', // Add a border to make it outlined
    '&:hover': {
        backgroundColor: alpha('#FFFFFF', 0.9), // Slightly darker on hover
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '60svw', // Adjust the width here
    height: '45px', // Adjust the height here
    display: 'flex',
    alignItems: 'center', // Vertically center the content
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
        height: '100%', // Make input height match the container
    },
}));

export default function UserDashboard() {
    const settings = ['Account', 'Ebook Manager', 'Logout'];
    const navigate = useNavigate();
    const [anchorElUser, setAnchorElUser] = React.useState(null);

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

    const handleAccount = () => {
        navigate('/accountsetting');
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
                <Box component="header" sx={{ marginLeft: '20px' }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        Popular Books
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}