import React from 'react';
import { Box, Typography, Button } from "@mui/material";
import CustomAppBar from '../components/CustomAppBar';
import CustomBreadcrumbs from '../components/CustomBreadcrumbs';
import BookGrid from "../components/BookGrid.jsx";
import { useNavigate } from 'react-router-dom';

export default function PublisherDashboard() {
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const breadcrumbLinks = [
        { label: 'Publisher', path: '/publisher/home' },
    ];
    document.title = "Dashboard | Librova";

    const handleAddBook = () => {
        navigate('/publishers/addbook');
    };

    return (
        <Box component={"section"} sx={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', overflowX: 'hidden', width: '100vw' }}>
            <CustomAppBar
                userInfoEndpoint={`${backendUrl}/publishers/getpublisherinfo`}
                loginRoute="/publisher/login"
                homeRoute="/publisher/home"
                accountSettingRoute="/publisher/accountsetting"
            />
            <Box component="section" sx={{ marginTop: '15px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <CustomBreadcrumbs links={breadcrumbLinks} current="Home" sx={{ marginLeft: '5%' }} disabledLinks={['Publisher']} />
            </Box>
            <Box component="section" sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Box component="section" sx={{ marginLeft: '8svw', marginTop: '16px', display: 'flex' }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        Books You Published
                    </Typography>
                </Box>
                <Box component="section" sx={{ marginTop: '20px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', overflowX: 'hidden' }}>
                    <BookGrid />
                </Box>
            </Box>
        </Box>
    );
}