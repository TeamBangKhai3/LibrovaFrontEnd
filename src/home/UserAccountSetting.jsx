import React from 'react';
import { useNavigate } from 'react-router-dom';
import AccountSettingsForm from '../components/AccountSettingsForm';
import CustomAppBar from '../components/CustomAppBar';
import {Box} from "@mui/material";

export default function UserAccountSetting() {
    document.title = "Account Settings | Librova";
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const userinfoEndpoint = `${backendUrl}/users/getuserinfo`;
    const userupdateEndpoint = `${backendUrl}/users/updateuserinfo`;
    const userdeleteEndpoint = `${backendUrl}/users/deleteuser`;
    const authEndpoint = `${backendUrl}/authuser/login`;

    const breadcrumbLinks = [
        { label: 'User', path: '/user/home' },
        { label: 'Home', path: '/user/home' },
    ];

    return (
        <Box component={"section"} sx={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CustomAppBar
                userInfoEndpoint={userinfoEndpoint}
                loginRoute="/user/login"
                homeRoute="/user/home"
                accountSettingRoute="/user/accountsetting"
            />
            <AccountSettingsForm
                userInfoEndpoint={userinfoEndpoint}
                userUpdateEndpoint={userupdateEndpoint}
                userDeleteEndpoint={userdeleteEndpoint}
                authEndpoint={authEndpoint}
                navigate={navigate}
                breadcrumbLinks={breadcrumbLinks}
                title="Account Information (User)"

            />
        </Box>
    );
}