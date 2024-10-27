import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Container,
    Avatar,
    Typography,
    Button, Stack, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Alert
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import { PhotoCamera } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';
import CustomAppBar from '../components/CustomAppBar';
import CustomBreadcrumbs from "../components/CustomBreadcrumbs.jsx";

export default function UserAccountSetting() {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({});
    const [values, setValues] = useState({
        email: '',
        password: '',
        address: ''
    });
    const [deleteStep, setDeleteStep] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [showUpdateAlert, setShowUpdateAlert] = useState(false);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const pubiinfoEndpoint = `${backendUrl}/publishers/getpublisherinfo`;
    const pubiupdateEndpoint = `${backendUrl}/publishers/updatepublisherinfo`;
    const pubideleteEndpoint = `${backendUrl}/publishers/deletepublisher`;

    useEffect(() => {
        const fetchUserInfo = async () => {
            const sessionToken = localStorage.getItem('sessionToken');
            try {
                const response = await axios.get(pubiinfoEndpoint, {
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
            } catch (error) {
                console.error('Error fetching user info:', error);
                navigate('/publisher/login'); // Redirect to login if fetching user info fails
            }
        };
        fetchUserInfo();
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value
        });
    };

    const handleSave = async () => {
        const sessionToken = localStorage.getItem('sessionToken');
        try {
            await axios.put(pubiupdateEndpoint, values, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionToken}`
                }
            });
            setShowUpdateAlert(true); // Show success alert for update
            setTimeout(() => {
                setShowUpdateAlert(false); // Hide alert after 3 seconds
            }, 3000);
        } catch (error) {
            console.error('Error updating user info:', error);
            alert('Failed to update user info. Please try again.');
        }
    };

    const handleDeleteAccount = async () => {
        const sessionToken = localStorage.getItem('sessionToken');
        try {
            await axios.delete(pubideleteEndpoint, {
                headers: {
                    'Authorization': `Bearer ${sessionToken}`
                }
            });
            setShowDeleteAlert(true); // Show success alert for delete
            localStorage.removeItem('sessionToken'); // Remove session token after successful deletion
            setTimeout(() => {
                navigate('/publisher/login');
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

    const breadcrumbLinks = [
        { label: 'Publisher', path: '/publisher/home' },
        { label: 'Home', path: '/publisher/home' },
    ];




    return (
        <Box component={"section"} sx={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CustomAppBar
                userInfoEndpoint={pubiinfoEndpoint}
                loginRoute="/publisher/login"
                homeRoute="/publisher/home"
                accountSettingRoute="/publisher/accountsetting"
            />
            <Box component="section" sx={{ marginTop: '15px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <CustomBreadcrumbs links={breadcrumbLinks} current="Account Settings" sx={{ marginLeft: '4%' }} disabledLinks={['Publisher']} />
            </Box>
            <Box component="section" sx={{ marginTop: '15px', width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
                <Box component="header" sx={{ marginLeft: '80px' }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        Account Information(Publisher)
                    </Typography>
                </Box>
            </Box>
            <Box component="section" sx={{marginTop:'5svh',width:'80svw',height:'65svh',bgcolor:'#D9D9D9', borderRadius:'20px'}}>
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
            {showUpdateAlert && (
                <Box sx={{ position: 'fixed', bottom: 0, left: 0, m: 2 }}>
                    <Alert severity="success">Profile updated successfully.</Alert>
                </Box>
            )}
            {showDeleteAlert && (
                <Box sx={{ position: 'fixed', bottom: 0, left: 0, m: 2 }}>
                    <Alert severity="success">Account deleted successfully.</Alert>
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