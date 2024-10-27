import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Box, Typography, Card, CardContent, CardMedia, IconButton } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

const BookCarousel = ({ sx }) => {
    const [books, setBooks] = useState([]);
    const [visibleBooks, setVisibleBooks] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [booksPerRow, setBooksPerRow] = useState(3);
    const resizeTimeout = useRef(null);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const getallebooks = `${backendUrl}/ebook/getallebooks`;

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get(getallebooks);
                setBooks(response.data);
                setVisibleBooks(response.data.slice(0, booksPerRow - 1));
            } catch (error) {
                console.error('Error fetching books:', error);
            }
        };
        fetchBooks();
    }, [booksPerRow]);

    const handleResize = () => {
        if (resizeTimeout.current) {
            clearTimeout(resizeTimeout.current);
        }
        resizeTimeout.current = setTimeout(() => {
            const containerWidth = document.querySelector('.book-carousel-container').offsetWidth;
            const bookWidth = 200; // Width of each book card
            const newBooksPerRow = Math.floor(containerWidth / (bookWidth + 20)); // 20px is the gap between books
            setBooksPerRow(newBooksPerRow);
            setVisibleBooks(books.slice(currentIndex, currentIndex + newBooksPerRow - 1));
        }, 300); // Adjust the debounce delay as needed
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [books, currentIndex]);

    const handleNext = () => {
        const nextIndex = currentIndex + booksPerRow - 1;
        setCurrentIndex(nextIndex);
        setVisibleBooks(books.slice(nextIndex, nextIndex + booksPerRow - 1));
    };

    const handlePrevious = () => {
        const prevIndex = Math.max(currentIndex - (booksPerRow - 1), 0);
        setCurrentIndex(prevIndex);
        setVisibleBooks(books.slice(prevIndex, prevIndex + booksPerRow - 1));
    };

    return (
        <Box className="book-carousel-container" sx={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '95%', whiteSpace: 'nowrap', overflowX: 'hidden', ...sx }}>
            <Box sx={{ display: 'flex', flexWrap: 'nowrap', overflowX: 'hidden', width: '100%', justifyContent: 'center' }}>
                {visibleBooks.map((book) => (
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
            {currentIndex > 0 && (
                <IconButton
                    onClick={handlePrevious}
                    sx={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)' }}
                >
                    <ArrowBack />
                </IconButton>
            )}
            {currentIndex + booksPerRow - 1 < books.length && (
                <IconButton
                    onClick={handleNext}
                    sx={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}
                >
                    <ArrowForward />
                </IconButton>
            )}
        </Box>
    );
};

export default BookCarousel;