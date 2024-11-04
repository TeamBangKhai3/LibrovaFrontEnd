import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Card, CardContent, CardMedia, ButtonBase } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const BookGrid = ({ sx }) => {
    const [books, setBooks] = useState([]);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const getallebooks = `${backendUrl}/ebook/getallebooks`;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get(getallebooks);
                setBooks([...response.data, { isAddNew: true }]); // Add a special item for the "Publish a new one" card
            } catch (error) {
                console.error('Error fetching books:', error);
            }
        };
        fetchBooks();
    }, []);

    const handleAddBook = () => {
        navigate('/publisher/addbook');
    };

    const handleBookClick = (id) => {
        navigate(`/publisher/home/ebookinfo/${id}`);
    };

    return (
        <Box className="book-grid-container" sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: '90%', overflowX: 'hidden', ...sx }}>
            {books.map((book, index) => (
                book.isAddNew ? (
                    <Box key="add-new" sx={{ margin: '10px' }}>
                        <ButtonBase onClick={handleAddBook} sx={{ width: '100%', height: '100%' }}>
                            <Card sx={{ width: 200, height: 450, border: '1px solid #ccc', boxShadow: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <CardMedia>
                                    <Add sx={{ fontSize: 100 }} />
                                </CardMedia>
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <Typography variant="h6" color="gray">
                                        Publish a new Book
                                    </Typography>
                                </CardContent>
                            </Card>
                        </ButtonBase>
                    </Box>
                ) : (
                    <Box key={book.eBookID} sx={{ margin: '10px' }}>
                        <ButtonBase onClick={() => handleBookClick(book.eBookID)} sx={{ width: '100%', height: '100%' }}>
                            <Card sx={{ width: 200, height: 450, border: '1px solid #ccc', boxShadow: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <CardMedia
                                    component="img"
                                    image={`data:image/png;base64,${book.cover}`}
                                    alt={book.title}
                                    sx={{ width: 'auto', height: 250, padding: '10px' }}
                                />
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <Typography variant="subtitle1" sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                                        {book.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                                        {book.author}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </ButtonBase>
                    </Box>
                )
            ))}
        </Box>
    );
};

export default BookGrid;