import React from 'react';
import { Box, Typography } from "@mui/material";
import CustomAppBar from '../components/CustomAppBar';
import CustomBreadcrumbs from '../components/CustomBreadcrumbs';
import BookCarousel from '../components/BookCarousel'; // Import the BookCarousel component
import { useNavigate } from 'react-router-dom';

export default function UserDashboard() {
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    document.title = "Homepage | Librova";

    const breadcrumbLinks = [
        { label: 'User', path: '/user/home' },
    ];

    return (
        <Box sx={{ 
            height: '100svh',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        }}>
            <CustomAppBar
                userInfoEndpoint={`${backendUrl}/users/getuserinfo`}
                loginRoute="/user/login"
                homeRoute="/user/home"
                accountSettingRoute="/user/accountsetting"
                userType={1}
            />
            
            <Box sx={{ 
                flex: 1,
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
                pt: 2
            }}>
                <CustomBreadcrumbs 
                    links={breadcrumbLinks} 
                    current="Home" 
                    sx={{ px: 3 }}
                    disabledLinks={['Publisher']} 
                />
                
                <Box sx={{ px: 3, py: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        Books to Read
                    </Typography>
                </Box>

                <Box sx={{ width: '100%' }}>
                    <BookCarousel />
                </Box>
            </Box>
        </Box>
    );
}