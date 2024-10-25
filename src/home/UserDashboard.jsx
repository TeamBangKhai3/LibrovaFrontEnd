import React, { useEffect, useState } from 'react';
import {Box, Container, Typography, AppBar, Button, Toolbar} from "@mui/material";
import CustomAppBar from '../components/CustomAppBar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function UserDashboard() {
    const navigate = useNavigate();

    return (
        <Box component={"section"} sx={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CustomAppBar
                userInfoEndpoint="http://localhost:25566/users/getuserinfo"
                loginRoute="/user/login"
                homeRoute="/user/home"
                accountSettingRoute="/user/accountsetting"
            />
            <Box component="section" sx={{ marginTop: '120px', width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
                <Box component="header" sx={{ marginLeft: '20px' }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        Books You Bought (But Haven't Read Yet)
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}