import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Button,
    TextField,
    Typography,
    Stack,
    Avatar,
    Snackbar,
    Alert,
    MenuItem,
    Select,
    FormControl, InputLabel,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import CustomAppBar from "../components/CustomAppBar.jsx";
import CustomBreadcrumbs from "../components/CustomBreadcrumbs.jsx";
import Grid from "@mui/material/Grid2";
import { useParams, useNavigate } from 'react-router-dom';

export default function EditBook() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        author: '',
        genre: '',
        price: '',
        cover: '',
        isbn: ''
    });
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [uploadError, setUploadError] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    const [deleteError, setDeleteError] = useState(false);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const pubiinfoEndpoint = `${backendUrl}/publishers/getpublisherinfo`;
    const getEbookEndpoint = `${backendUrl}/ebook/getebook/${id}`;
    const updateEbookEndpoint = `${backendUrl}/ebook/updateebook`;
    const deleteEbookEndpoint = `${backendUrl}/ebook/deleteebook/${id}`;
    const breadcrumbLinks = [
        { label: 'Publisher', path: '/publisher/home' },
        { label: 'Home', path: '/publisher/home' },
    ];

    useEffect(() => {
        const fetchBookData = async () => {
            try {
                const response = await axios.get(getEbookEndpoint);
                setFormData(response.data);
            } catch (error) {
                console.error('Error fetching book data:', error);
            }
        };
        fetchBookData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData({
                ...formData,
                cover: reader.result.split(',')[1] // Get base64 string without the prefix
            });
            setUploadSuccess(true);
        };
        reader.onerror = () => {
            setUploadError(true);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const sessionToken = localStorage.getItem('sessionToken');
        try {
            const response = await axios.put(updateEbookEndpoint, { ...formData, eBookID: id }, {
                headers: {
                    'Authorization': `Bearer ${sessionToken}`
                }
            });
            console.log('Book updated successfully:', response.data);
            setSubmitSuccess(true);
        } catch (error) {
            console.error('Error updating book:', error);
            setSubmitError(true);
        }
    };

    const handleDelete = async () => {
        const sessionToken = localStorage.getItem('sessionToken');
        try {
            await axios.delete(deleteEbookEndpoint, {
                headers: {
                    'Authorization': `Bearer ${sessionToken}`
                }
            });
            setDeleteSuccess(true);
            navigate('/publisher/home');
        } catch (error) {
            console.error('Error deleting book:', error);
            setDeleteError(true);
        }
    };

    const handleDialogOpen = () => {
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    return (
        <Box component={"section"} sx={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CustomAppBar
                userInfoEndpoint={pubiinfoEndpoint}
                loginRoute="/publisher/login"
                homeRoute="/publisher/home"
                accountSettingRoute="/publisher/accountsetting"
            />

            <Box component="section" sx={{ marginTop: '15px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <CustomBreadcrumbs links={breadcrumbLinks} current="Edit Book" sx={{ marginLeft: '4%' }} disabledLinks={['Publisher']} />
            </Box>
            <Box component="section" sx={{marginTop:'5svh',width:'80svw',height:'70svh',bgcolor:'#D9D9D9', borderRadius:'20px'}}>
                <Grid container spacing={1}>
                    <Grid size={8}>
                        <Stack rowGap={0.3} spacing={2} sx={{ marginX: '10%', marginTop: '5%'}}>
                            <TextField
                                label="Book Title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                variant="outlined"
                                fullWidth
                            />
                            <TextField
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                variant="outlined"
                                fullWidth
                            />
                            <TextField
                                label="Author"
                                name="author"
                                value={formData.author}
                                onChange={handleChange}
                                variant="outlined"
                                fullWidth
                            />
                            <FormControl variant="outlined" fullWidth>
                                <InputLabel>Genre</InputLabel>
                                <Select
                                    label="Genre"
                                    name="genre"
                                    value={formData.genre}
                                    onChange={handleChange}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value="Fiction">Fiction</MenuItem>
                                    <MenuItem value="Non-Fiction">Non-Fiction</MenuItem>
                                    <MenuItem value="Science Fiction">Science Fiction</MenuItem>
                                    <MenuItem value="Fantasy">Fantasy</MenuItem>
                                    <MenuItem value="Mystery">Mystery</MenuItem>
                                    <MenuItem value="Biography">Biography</MenuItem>
                                    {/* Add more genres as needed */}
                                </Select>
                            </FormControl>
                            <TextField
                                label="Price"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                variant="outlined"
                                fullWidth
                            />
                            <TextField
                                label="ISBN"
                                name="isbn"
                                value={formData.isbn}
                                onChange={handleChange}
                                variant="outlined"
                                fullWidth
                            />
                            <Box component="section" sx={{display:'flex',justifyContent:'flex-end'}}>
                                <Button variant="contained" color="error" onClick={handleDialogOpen} sx={{marginLeft:'10px'}}>
                                    Delete Book
                                </Button>
                                <Button variant="contained" color="primary" onClick={handleSubmit} sx={{marginLeft:'10px'}}>
                                    Update Book
                                </Button>
                            </Box>
                        </Stack>
                    </Grid>
                    <Grid size={4} borderLeft="2px solid gray">
                        <Box component="section" sx={{ width: '45svh', height: '65svh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <Avatar
                                alt="Cover Photo"
                                src={formData.cover ? `data:image/png;base64,${formData.cover}` : "/static/images/avatar/placeholder.jpg"}
                                sx={{ width: 279, height: 371, mb: 2 }}
                                variant="square"
                            />
                            <Button variant="contained" color="primary" component="label" startIcon={<PhotoCamera />}>
                                Upload Cover Image
                                <input type="file" hidden onChange={handleFileChange} />
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            <Snackbar open={uploadSuccess} autoHideDuration={6000} onClose={() => setUploadSuccess(false)}>
                <Alert onClose={() => setUploadSuccess(false)} severity="success" sx={{ width: '100%' }}>
                    Successfully Uploaded
                </Alert>
            </Snackbar>
            <Snackbar open={uploadError} autoHideDuration={6000} onClose={() => setUploadError(false)}>
                <Alert onClose={() => setUploadError(false)} severity="error" sx={{ width: '100%' }}>
                    Error Uploading File
                </Alert>
            </Snackbar>
            <Snackbar open={submitSuccess} autoHideDuration={6000} onClose={() => setSubmitSuccess(false)}>
                <Alert onClose={() => setSubmitSuccess(false)} severity="success" sx={{ width: '100%' }}>
                    Book Updated Successfully
                </Alert>
            </Snackbar>
            <Snackbar open={submitError} autoHideDuration={6000} onClose={() => setSubmitError(false)}>
                <Alert onClose={() => setSubmitError(false)} severity="error" sx={{ width: '100%' }}>
                    Error Updating Book
                </Alert>
            </Snackbar>
            <Snackbar open={deleteSuccess} autoHideDuration={6000} onClose={() => setDeleteSuccess(false)}>
                <Alert onClose={() => setDeleteSuccess(false)} severity="success" sx={{ width: '100%' }}>
                    Book Deleted Successfully
                </Alert>
            </Snackbar>
            <Snackbar open={deleteError} autoHideDuration={6000} onClose={() => setDeleteError(false)}>
                <Alert onClose={() => setDeleteError(false)} severity="error" sx={{ width: '100%' }}>
                    Error Deleting Book
                </Alert>
            </Snackbar>
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
        </Box>
    );
}