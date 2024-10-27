import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Card, CardContent, CardMedia } from '@mui/material';

const BookGrid = ({ sx }) => {
    const [books, setBooks] = useState([]);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const getallebooks = `${backendUrl}/ebook/getallebooks`;

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get(getallebooks);
                setBooks(response.data);
            } catch (error) {
                console.error('Error fetching books:', error);
            }
        };
        fetchBooks();
    }, []);

    return (
        <Box className="book-grid-container" sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'left', width: '85%', overflowX: 'hidden', ...sx }}>
            {books.map((book) => (
                <Box key={book.eBookID} sx={{ margin: '10px' }}>
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
                </Box>
            ))}
        </Box>
    );
};

export default BookGrid;