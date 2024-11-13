import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Avatar,
    Typography,
    Button,
    Stack,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Alert,
    Tabs,
    Tab
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import { PhotoCamera } from "@mui/icons-material";
import { keyframes } from '@emotion/react';
import CustomBreadcrumbs from "./CustomBreadcrumbs.jsx";

// Define keyframes for animations
const fadeIn = keyframes`
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
`;

const slideIn = keyframes`
    from {
        transform: translateY(100%);
    }
    to {
        transform: translateY(0);
    }
`;

const AccountSettingsForm = ({ userInfoEndpoint, userUpdateEndpoint, userDeleteEndpoint, authEndpoint, navigate, breadcrumbLinks, title }) => {
    const [userInfo, setUserInfo] = useState({});
    const [values, setValues] = useState({
        email: '',
        password: '',
        address: '',
        phoneNumber: '',
    });
    const [deleteStep, setDeleteStep] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [showUpdateAlert, setShowUpdateAlert] = useState(false);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [tabIndex, setTabIndex] = useState(0);
    const [passwordValues, setPasswordValues] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });
    const [passwordError, setPasswordError] = useState('');

    useEffect(() => {
        const fetchUserInfo = async () => {
            const sessionToken = localStorage.getItem('sessionToken');
            try {
                const response = await axios.get(userInfoEndpoint, {
                    headers: {
                        'Authorization': `Bearer ${sessionToken}`
                    }
                });
                const data = response.data;
                console.table(data);
                setUserInfo(data);
                setValues({
                    email: data.email,
                    name: data.name,
                    password: data.password,
                    address: data.address,
                    phoneNumber: data.phoneNumber,
                    avatar: data.avatar
                });
                console.table(values);
            } catch (error) {
                console.error('Error fetching user info:', error);
                navigate('/user/login'); // Redirect to login if fetching user info fails
            }
        };
        fetchUserInfo();
    }, [navigate, userInfoEndpoint]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value
        });
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordValues({
            ...passwordValues,
            [name]: value
        });
    };

    const handleSave = async () => {
        const sessionToken = localStorage.getItem('sessionToken');
        console.table(values); // Log the values being sent in the PUT request
        try {
            await axios.put(userUpdateEndpoint, values, {
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

    const handlePasswordSave = async () => {
        if (passwordValues.newPassword !== passwordValues.confirmNewPassword) {
            setPasswordError('New passwords do not match');
            return;
        }

        console.table(passwordValues); // Log the password values

        try {
            const authResponse = await axios.post(authEndpoint, {
                username: userInfo.username,
                password: passwordValues.currentPassword
            });

            console.table({
                username: userInfo.username,
                currentPassword: passwordValues.currentPassword,
                authResponseStatus: authResponse.status
            }); // Log the authentication request and response status

            if (authResponse.status === 200) {
                const sessionToken = localStorage.getItem('sessionToken');
                const updateData = { ...values, password: passwordValues.newPassword };
                console.table(updateData); // Log the data being sent in the PUT request

                await axios.put(userUpdateEndpoint, updateData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${sessionToken}`
                    }
                });
                setShowUpdateAlert(true); // Show success alert for update
                setTimeout(() => {
                    setShowUpdateAlert(false); // Hide alert after 3 seconds
                }, 3000);
            } else {
                setPasswordError('Current password is incorrect');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            setPasswordError('Current password is incorrect');
        }
    };

    const handleDeleteAccount = async () => {
        const sessionToken = localStorage.getItem('sessionToken');
        try {
            await axios.delete(userDeleteEndpoint, {
                headers: {
                    'Authorization': `Bearer ${sessionToken}`
                }
            });
            setShowDeleteAlert(true); // Show success alert for delete
            localStorage.removeItem('sessionToken'); // Remove session token after successful deletion
            setTimeout(() => {
                navigate('/user/login');
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

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    return (
        <Box component={"section"} sx={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box component="section" sx={{ marginTop: '15px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <CustomBreadcrumbs links={breadcrumbLinks} current="Account Settings" sx={{ marginLeft: '4%' }} disabledLinks={['User']} />
            </Box>
            <Box component="section" sx={{ marginTop: '15px', width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
                <Box component="header" sx={{ marginLeft: '80px' }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        {title}
                    </Typography>
                </Box>
            </Box>
            <Box component="section" sx={{marginTop:'5svh',width:'80svw',height:'65svh',bgcolor:'#D9D9D9', borderRadius:'20px'}}>
                <Grid container spacing={1}>
                    <Grid size={8}>
                        <Box component="section" sx={{ width: '50svw', height: '50svh', textAlign: 'left' }}>
                            <Tabs value={tabIndex} onChange={handleTabChange} aria-label="account settings tabs">
                                <Tab label="Basic Info" />
                                <Tab label="Password" />
                            </Tabs>
                            {tabIndex === 0 && (
                                <Stack rowGap={1} spacing={2} sx={{ marginLeft: '10%', marginTop: '5%' }}>
                                    <TextField
                                        label="Username"
                                        value={userInfo.username}
                                        InputProps={{
                                            readOnly: true,
                                            style: { pointerEvents: 'none' },
                                        }}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        variant="outlined"
                                        fullWidth
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                backgroundColor: '#f0f0f0',
                                                color: 'gray',
                                            },
                                            '& .MuiInputLabel-root': {
                                                color: 'gray',
                                            },
                                        }}
                                        required
                                    />
                                    <TextField
                                        label="Name"
                                        name="name"
                                        value={values.name}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                        fullWidth
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        required
                                    />
                                    <TextField
                                        label="Email"
                                        name="email"
                                        value={values.email}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                        fullWidth
                                        required
                                    />
                                    <TextField
                                        label="Address"
                                        name="address"
                                        value={values.address}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                        fullWidth
                                        required
                                    />
                                    <TextField
                                        label="Phone Number"
                                        name="phoneNumber"
                                        value={values.phoneNumber}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                        fullWidth
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        required
                                    />
                                </Stack>
                            )}
                            {tabIndex === 1 && (
                                <Stack rowGap={1} spacing={2} sx={{ marginLeft: '10%', marginTop: '5%' }}>
                                    <TextField
                                        label="Current Password"
                                        name="currentPassword"
                                        type="password"
                                        value={passwordValues.currentPassword}
                                        onChange={handlePasswordChange}
                                        variant="outlined"
                                        fullWidth
                                        required
                                    />
                                    <TextField
                                        label="New Password"
                                        name="newPassword"
                                        type="password"
                                        value={passwordValues.newPassword}
                                        onChange={handlePasswordChange}
                                        variant="outlined"
                                        fullWidth
                                        required
                                    />
                                    <TextField
                                        label="Confirm New Password"
                                        name="confirmNewPassword"
                                        type="password"
                                        value={passwordValues.confirmNewPassword}
                                        onChange={handlePasswordChange}
                                        variant="outlined"
                                        fullWidth
                                        required
                                    />
                                    {passwordError && (
                                        <Typography color="error">{passwordError}</Typography>
                                    )}
                                </Stack>
                            )}
                            <Box component="section" sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                                <Button variant="contained" color="error" onClick={handleDeleteClick} sx={{ marginRight: '10px' }}>
                                    Delete Account
                                </Button>
                                {tabIndex === 0 ? (
                                    <Button variant="contained" color="primary" onClick={handleSave} sx={{ marginLeft: '10px' }}>
                                        Save
                                    </Button>
                                ) : (
                                    <Button variant="contained" color="primary" onClick={handlePasswordSave} sx={{ marginLeft: '10px' }}>
                                        Change Password
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    </Grid>
                    <Grid size={4} borderLeft="2px solid gray">
                        <Box component="section" sx={{ width: '45svh', height: '65svh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <Avatar
                                alt="Profile Photo"
                                src={`data:image/png;base64,${values.avatar}`}
                                sx={{ width: 100, height: 100, mb: 2 }}
                            />
                            <Button variant="contained" color="primary" startIcon={<PhotoCamera />}>
                                Change Profile Photo
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            {showUpdateAlert && (
                <Box sx={{ position: 'fixed', bottom: 0, left: 0, m: 2, animation: `${slideIn} 0.5s ease-in-out` }}>
                    <Alert severity="success">Profile updated successfully.</Alert>
                </Box>
            )}
            {showDeleteAlert && (
                <Box sx={{ position: 'fixed', bottom: 0, left: 0, m: 2, animation: `${slideIn} 0.5s ease-in-out` }}>
                    <Alert severity="success">Account deleted successfully.</Alert>
                </Box>
            )}
            <Dialog
                open={openDialog}
                onClose={handleDialogClose}
                sx={{ animation: `${fadeIn} 0.5s ease-in-out` }}
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
};

export default AccountSettingsForm;