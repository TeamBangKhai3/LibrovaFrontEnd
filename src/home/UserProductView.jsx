import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import CustomAppBar from '../components/CustomAppBar.jsx';
import { Box, Typography, Backdrop, CircularProgress, Paper } from '@mui/material';
import CustomBreadcrumbs from '../components/CustomBreadcrumbs.jsx';
import Grid from '@mui/material/Grid2';
import { Rating } from "@mui/lab";
import { Button } from "@/components/ui/button"
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
    const nothing = "No description available please contact the publisher for more information. Thank you! :)";

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
                const response = await axios.get(`${backendUrl}/reviews/getaveragerating/${id}`);
                setAverageRating(response.data);
            } catch (error) {
                console.error('Error fetching average rating:', error);
            }
        };

        const fetchReviews = async () => {
            try {
                const response = await axios.get(`${backendUrl}/reviews/getallreviews/${id}`);
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
        <div className="flex flex-col items-center h-screen overflow-x-hidden">
            <CustomAppBar
                userInfoEndpoint={`${backendUrl}/users/getuserinfo`}
                loginRoute="/user/login"
                homeRoute="/user/home"
                accountSettingRoute="/user/accountsetting"
                userType={1}
            />
            <div className="pl-32 mt-4 w-full flex flex-col items-start">
                <CustomBreadcrumbs links={breadcrumbLinks} current={title} className="ml-5" disabledLinks={['User']} />
            </div>
            <div className="scrollable-content w-4/5 flex flex-col items-center">
                {book && book.cover ? (
                    <div className="flex w-19/12 mt-5">
                        <div className="mt-5 w-1/3 p-1 flex flex-col items-center">
                            <img src={`data:image/png;base64,${book.cover}`} alt={book.title} className="h-96"/>
                        </div>
                        <div className="w-2/3 p-5 flex flex-col items-start">
                            <h1 className="text-2xl font-bold mb-2">{book.title}</h1>
                            <h2 className="text-lg mb-5">Author: {book.author}<br/>Genre: {book.genre}</h2>
                            <p className="mb-2">{book.description || nothing}</p>
                            <h3 className="text-xl mb-2">Ratings: <Rating value={averageRating} readOnly/>
                                <b>({averageRating})</b></h3>
                            <h3 className="text-xl mb-7">Price: <b>₱{book.price}</b><br/>ISBN: <b>{book.isbn}</b></h3>
                            <Button className="w-full mt-5 bg-gray-200 text-black"
                                    onClick={() => handleAddToCart(book.eBookID)}>Add to Cart</Button>
                            <Button className="w-full mt-5 bg-black text-white"
                                    onClick={() => handleBuyNow(book.eBookID)}>Buy Now</Button>
                        </div>
                    </div>
                ) : (
                    <h2 className="mt-5">Loading...</h2>
                )}
                <div className="w-full h-1/3">
                    <h1 className=" text-2xl font-bold mt-5 mb-12">Reviews</h1>
                    {reviews.map((review) => (
                        <div key={review.reviewID} className="mx-16 mb-5 w-full">
                            <div className="p-5 shadow-md">
                                <h3 className="font-bold">{review.user.name || 'Anonymous'}</h3>
                                <Rating value={review.rating} readOnly />
                                <p>{review.reviewText}</p>
                                <p className="text-gray-500">{new Date(review.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Backdrop className="text-white z-50" open={deleting}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
}