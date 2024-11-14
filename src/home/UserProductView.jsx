import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import CustomAppBar from '../components/CustomAppBar.jsx';
import {
    Box,
    Button,
    Typography,
    Backdrop,
    CircularProgress,
    Paper
} from '@mui/material';
import CustomBreadcrumbs from '../components/CustomBreadcrumbs.jsx';
import Grid from '@mui/material/Grid2';
import { Rating } from "@mui/lab";
import './UserProductView.css'; // Import the CSS file

export default function UserProductView() {
    document.title = "Product View | Librova";
    const { id } = useParams(); // Get the eBookID from the URL
    const [book, setBook] = useState({});
    const [title, setTitle] = useState(null);
    const [averageRating, setAverageRating] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [deleting, setDeleting] = useState(false);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    const breadcrumbLinks = [
        { label: 'User', path: '/user/home' },
        { label: 'Home', path: '/user/home' },
    ];

    const handleAddToCart = (id) => {
        // Add to cart logic here
        console.log(`Add to cart: ${id}`);
    };

    const handleBuyNow = (id) => {
        // Buy now logic here
        console.log(`Buy now: ${id}`);
    };

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await axios.get(`${backendUrl}/ebook/getebook/${id}`);
                console.table(response.data);
                setBook(response.data);
                setTitle(response.data.title);
            } catch (error) {
                console.error('Error fetching book:', error);
            }
        };

        const fetchAverageRating = async () => {
            try {
                const response = await axios.get(`http://192.168.193.106:25566/reviews/getaveragerating/${id}`);
                setAverageRating(response.data);
            } catch (error) {
                console.error('Error fetching average rating:', error);
            }
        };

        const fetchReviews = async () => {
            try {
                const response = await axios.get(`http://192.168.193.106:25566/reviews/getallreviews/${id}`);
                setReviews(response.data);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };

        fetchBook();
        fetchAverageRating();
        fetchReviews();
    }, [id, backendUrl]);

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
            <Box component="section" className="scrollable-content" sx={{ width: '85%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                                    Author: {book.author}<br/>
                                    Genre: {book.genre}
                                </Typography>
                                <Typography variant="body1" sx={{marginBottom: '1%'}}>
                                    {book.description}
                                    <br/><br/>
                                </Typography>
                                <Typography variant="h6" sx={{ marginBottom: '1%' }}>
                                    Ratings: <Rating value={averageRating} readOnly />
                                </Typography>
                                <Typography variant="h6" sx={{marginBottom: '7%'}}>
                                    Price: <b>₱{book.price}</b><br/>
                                    ISBN: <b>{book.isbn}</b>
                                </Typography>

                                <Button variant="contained" color="primary" sx={{ width: '100%', marginTop: '20px' }} onClick={() => handleAddToCart(book.eBookID)}>
                                    Add to Cart
                                </Button>
                                <Button variant="contained" color="secondary" sx={{ width: '100%', marginTop: '20px' }} onClick={() => handleBuyNow(book.eBookID)}>
                                    Buy Now
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                ) : (
                    <Typography variant="h6" sx={{ marginTop: '20px' }}>Loading...</Typography>
                )}
                <Box component={"section"} width={"100%"} height={"30vh"}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', marginTop: '20px', marginBottom: '50px' }}>
                        Reviews
                    </Typography>
                    {reviews.map((review) => (
                        <Box key={review.reviewID} sx={{ marginBottom: '20px', width: '100%' }}>
                            <Paper elevation={3} sx={{ padding: '20px' }}>
                                <Typography variant="body1"><b>{review.user.name || 'Anonymous'}</b></Typography>
                                <Rating value={review.rating} readOnly />
                                <Typography variant="body1">{review.reviewText}</Typography>
                                <Typography variant="body2" color="textSecondary">{new Date(review.date).toLocaleDateString()}</Typography>
                            </Paper>
                        </Box>
                    ))}
                </Box>

            </Box>

            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={deleting}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </Box>
    );
}