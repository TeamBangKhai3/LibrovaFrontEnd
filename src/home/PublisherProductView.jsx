import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import CustomAppBar from '../components/CustomAppBar.jsx';
import { Box, Typography, Backdrop, CircularProgress, Paper } from '@mui/material';
import CustomBreadcrumbs from '../components/CustomBreadcrumbs.jsx';
import Grid from '@mui/material/Grid2';
import { Rating } from "@mui/lab";
import { Button } from "@/components/ui/button"
import './PublisherProductView.css'; // Import the CSS file

export default function PublisherProductView() {
    document.title = "Product View | Librova";
    const { id } = useParams(); // Get the eBookID from the URL
    const [book, setBook] = useState({});
    const [title, setTitle] = useState(null);
    const [averageRating, setAverageRating] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();
    const nothing = "No description available please contact the publisher for more information. Thank you! :)";

    const breadcrumbLinks = [
        { label: 'Publisher', path: '/publisher/home' },
        { label: 'Home', path: '/publisher/home' },
    ];

    const handleBookClick = (id) => {
        navigate(`/publisher/home/ebookinfo/editinfo/${id}`);
    };

    const handleDelete = async () => {
        const sessionToken = localStorage.getItem('sessionToken');
        setDeleting(true);
        try {
            await axios.delete(`${backendUrl}/ebook/deleteebook/${id}`, {
                headers: {
                    'Authorization': `Bearer ${sessionToken}`
                }
            });
            setDeleting(false);
            navigate('/publisher/home');
        } catch (error) {
            console.error('Error deleting book:', error);
            setDeleting(false);
        }
    };

    const handleDialogOpen = () => {
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
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
                userInfoEndpoint={`${backendUrl}/publishers/getpublisherinfo`}
                loginRoute="/publisher/login"
                homeRoute="/publisher/home"
                accountSettingRoute="/publisher/accountsetting"
            />
            <div className="pl-32 mt-4 w-full flex flex-col items-start">
                <CustomBreadcrumbs links={breadcrumbLinks} current={title} className="ml-5" disabledLinks={['Publisher']} />
            </div>
            <div className="scrollable-content w-4/5 flex flex-col items-center">
                {book && book.cover ? (
                    <div className="flex w-19/12 mt-5">
                        <div className="w-1/3 p-1 flex flex-col items-center">
                            <img src={`data:image/png;base64,${book.cover}`} alt={book.title} className="h-96" />
                        </div>
                        <div className="mt-5 w-2/3 p-5 flex flex-col items-start">
                            <h1 className="text-2xl font-bold mb-2">{book.title}</h1>
                            <h2 className="text-lg mb-5">Author: {book.author}<br/>Genre: {book.genre}</h2>
                            <p className="mb-2">{book.description || nothing}</p>
                            <h3 className="text-xl mb-2">Ratings: <Rating value={averageRating} readOnly /> <b>({averageRating})</b></h3>
                            <h3 className="text-xl mb-7">Price: <b>₱{book.price}</b><br/>ISBN: <b>{book.isbn}</b></h3>
                            <Button className="w-full mt-5 bg-gray-200 text-black" onClick={() => handleBookClick(book.eBookID)}>Manage Book</Button>
                            <Button className="w-full mt-5 bg-red-500 text-white" onClick={handleDialogOpen}>Delete Book</Button>
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
            {openDialog && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-5 rounded">
                        <h2 className="text-xl mb-4">Delete Book</h2>
                        <p className="mb-4">Are you sure you want to delete this book? This action cannot be undone.</p>
                        <div className="flex justify-end">
                            <Button className="mr-2" onClick={handleDialogClose}>No</Button>
                            <Button className="bg-red-500 text-white" onClick={handleDelete}>Yes</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}