import React from 'react';
import { useNavigate } from 'react-router-dom';
import AccountSettingsForm from '../components/AccountSettingsForm';
import CustomAppBar from '../components/CustomAppBar';
import { Box } from "@mui/material";

export default function PublisherAccountSetting() {
    document.title = "Account Settings | Librova";
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const userinfoEndpoint = `${backendUrl}/publishers/getpublisherinfo`;
    const userupdateEndpoint = `${backendUrl}/publishers/updatepublisherinfo`;
    const userdeleteEndpoint = `${backendUrl}/publishers/deletepublisher`;
    const authEndpoint = `${backendUrl}/authpublisher/login`;

    const breadcrumbLinks = [
        { label: 'Publisher', path: '/publisher/home' },
        { label: 'Home', path: '/publisher/home' },
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
                userInfoEndpoint={userinfoEndpoint}
                loginRoute="/publisher/login"
                homeRoute="/publisher/home"
                accountSettingRoute="/publisher/accountsetting"
                userType={2}
            />
            <Box sx={{ 
                flex: 1,
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
                padding: 3
            }}>
                <AccountSettingsForm
                    userInfoEndpoint={userinfoEndpoint}
                    userUpdateEndpoint={userupdateEndpoint}
                    userDeleteEndpoint={userdeleteEndpoint}
                    authEndpoint={authEndpoint}
                    navigate={navigate}
                    breadcrumbLinks={breadcrumbLinks}
                    title="Account Information (Publisher)"
                />
            </Box>
        </Box>
    );
}