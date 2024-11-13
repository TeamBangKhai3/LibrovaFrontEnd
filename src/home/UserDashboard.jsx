import React from 'react';
import { Box, Typography } from "@mui/material";
import CustomAppBar from '../components/CustomAppBar';
import CustomBreadcrumbs from '../components/CustomBreadcrumbs';
import BookCarousel from '../components/BookCarousel'; // Import the BookCarousel component
import { useNavigate } from 'react-router-dom';

export default function UserDashboard() {
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const breadcrumbLinks = [
        { label: 'User', path: '/user/home' },
    ];

    return (
        <Box component={"section"} sx={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', overflowX: 'hidden' }}>
            <CustomAppBar
                userInfoEndpoint={`${backendUrl}/users/getuserinfo`}
                loginRoute="/user/login"
                homeRoute="/user/home"
                accountSettingRoute="/user/accountsetting"
            />
            <Box component="section" sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Box component="section" sx={{ marginLeft: '8svw', marginTop: '16px' ,display:'flex'}}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        Books You Bought (But Haven't Read Yet)
                    </Typography>
                </Box>
                <Box component="section" sx={{ marginTop: '20px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', overflowX: 'hidden'}}>
                    <BookCarousel />
                </Box>
            </Box>
        </Box>
    );
}