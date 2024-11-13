import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Grid, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Backdrop, CircularProgress } from '@mui/material';
import CustomAppBar from '../components/CustomAppBar';
import CustomBreadcrumbs from '../components/CustomBreadcrumbs';
import Rating from '@mui/material/Rating';
import {useParams} from "react-router-dom";

const UserProductView = () => {
    const [book, setBook] = useState(null);
    const [title, setTitle] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const { id } = useParams();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await axios.get(`${backendUrl}/ebook/getebook/${id}`);
                setBook(response.data);
                setTitle(response.data.title);
            } catch (error) {
                console.error('Error fetching book:', error);
            }
        };
        fetchBook();
    }, [id, backendUrl]);

    const handleDialogOpen = () => {
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await axios.delete(`${backendUrl}/ebook/deleteebook/${id}`);
            setDeleting(false);
            setOpenDialog(false);
            // Add any additional logic after deletion, e.g., redirecting
        } catch (error) {
            console.error('Error deleting book:', error);
            setDeleting(false);
        }
    };

    return (
        <Box component={"section"} sx={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', overflowX: 'hidden' }}>
            <CustomAppBar
                userInfoEndpoint={`${backendUrl}/users/getuserinfo`}
                loginRoute="/user/login"
                homeRoute="/user/home"
                accountSettingRoute="/user/accountsetting"
            />
            <Box component="section" sx={{ marginTop: '15px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <CustomBreadcrumbs links={breadcrumbLinks} current={title} sx={{ marginLeft: '5%' }} disabledLinks={['User']} />
            </Box>
            <Box component="section" sx={{ width: '85%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {book && book.cover ? (
                    <Grid container spacing={1} sx={{ width: '90%', marginTop: '20px', flexWrap: 'nowrap' }}>
                        <Grid size={4} sx={{ width: '35%', p: '3%' }}>
                            <Box component="section" sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <img src={`data:image/png;base64,${book.cover}`} alt={book.title} style={{ width: 'auto', height: '450px'}} />
                            </Box>
                        </Grid>
                        <Grid size={8} sx={{ padding: '20px' }}>
                            <Box component="section" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: '1%' }}>
                                    {book.title}
                                </Typography>
                                <Typography variant="subtitle1" sx={{ marginBottom: '5%' }}>
                                    Author: {book.author}
                                </Typography>
                                <Typography variant="body1" sx={{marginBottom: '1%'}}>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent pulvinar ultricies
                                    iaculis. Vestibulum posuere congue quam, nec varius elit. Cras quam dui,
                                    pellentesque nec lectus et, ultrices euismod urna. Quisque mollis, enim at tempus
                                    ornare, quam urna bibendum enim, non ullamcorper velit ex non elit. Nulla ipsum
                                    eros, malesuada non imperdiet at, auctor ut quam. Mauris sit amet egestas eros, eget
                                    lobortis lectus. Proin ullamcorper a odio consequat eleifend.<br/><br/>
                                </Typography>
                                <Typography variant="h6" sx={{ marginBottom: '1%' }}>
                                    Ratings: <Rating value={3.5} readOnly />
                                </Typography>
                                <Typography variant="h6" sx={{ marginBottom: '7%' }}>
                                    Books Sold: <b>1234</b>
                                </Typography>
                                <Button variant="contained" color="primary" sx={{ width: '100%', marginTop: '20px' }} onClick={() => handleBookClick(book.eBookID)}>
                                    Manage Book
                                </Button>
                                <Button variant="contained" color="error" sx={{ width: '100%', marginTop: '20px' }} onClick={handleDialogOpen}>
                                    Delete Book
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                ) : (
                    <Typography variant="h6" sx={{ marginTop: '20px' }}>Loading...</Typography>
                )}
            </Box>
            <Dialog
                open={openDialog}
                onClose={handleDialogClose}
            >
                <DialogTitle>Delete Book</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this book? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>No</Button>
                    <Button onClick={handleDelete} autoFocus>Yes</Button>
                </DialogActions>
            </Dialog>
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={deleting}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </Box>
    );
};

export default UserProductView;