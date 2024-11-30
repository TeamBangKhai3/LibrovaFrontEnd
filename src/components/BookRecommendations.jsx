import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Skeleton } from '@mui/material';
import { motion } from "framer-motion";

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

const BookRecommendations = () => {
    const [recommendations, setRecommendations] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const token = localStorage.getItem('sessionToken');
                if (!token) {
                    setError('Please login to see recommendations');
                    return;
                }

                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/ebook/recommendations`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setRecommendations(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Error fetching recommendations');
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    if (loading) {
        const categories = ['Featured Books', 'New Releases', 'Popular in Your Genre', 'Trending Now'];
        return (
            <Box sx={{ width: '100%', py: 4 }}>
                {categories.map((category) => (
                    <Box key={category} sx={{ mb: 4 }}>
                        <Skeleton variant="text" width={200} height={32} sx={{ mb: 2 }} />
                        <Box sx={{ position: 'relative' }}>
                            <Box sx={{ 
                                display: 'flex',
                                gap: 2,
                                py: 2,
                                px: 4,
                                justifyContent: 'center'
                            }}>
                                {[...Array(5)].map((_, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            width: '180px',
                                            borderRadius: 1,
                                            overflow: 'hidden',
                                            bgcolor: 'background.paper',
                                            boxShadow: 1
                                        }}
                                    >
                                        <Box sx={{ position: 'relative', pt: '150%' }}>
                                            <Skeleton 
                                                variant="rectangular" 
                                                sx={{ 
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    bottom: 0
                                                }} 
                                            />
                                        </Box>
                                        <Box sx={{ p: 2 }}>
                                            <Skeleton variant="text" width="80%" height={24} sx={{ mb: 1 }} />
                                            <Skeleton variant="text" width="60%" height={20} />
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </Box>
                ))}
            </Box>
        );
    }
    
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={container}
        >
            {Object.entries(recommendations).map(([category, books]) => (
                <Box key={category} sx={{ mb: 4 }}>
                    <motion.div variants={item}>
                        <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                            {category}
                        </Typography>
                    </motion.div>
                    <Box sx={{ position: 'relative' }}>
                        <Box
                            id={category}
                            sx={{
                                display: 'flex',
                                overflowX: 'auto',
                                gap: 2,
                                py: 2,
                                px: 4,
                                scrollBehavior: 'smooth',
                                '&::-webkit-scrollbar': { display: 'none' },
                                msOverflowStyle: 'none',
                                scrollbarWidth: 'none',
                                justifyContent: 'center'
                            }}
                        >
                            {books.map((book) => (
                                <motion.div
                                    key={book.eBookID}
                                    variants={item}
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Box
                                        onClick={() => navigate(`/user/home/ebookinfo/${book.eBookID}`)}
                                        sx={{
                                            width: '180px',
                                            overflow: 'hidden',
                                            cursor: 'pointer',
                                            borderRadius: 1,
                                            bgcolor: 'background.paper',
                                            boxShadow: 1,
                                            '&:hover': {
                                                boxShadow: 3
                                            }
                                        }}
                                    >
                                        <Box sx={{ position: 'relative', pt: '150%' }}>
                                            <Box sx={{ position: 'absolute', inset: 0 }}>
                                                <img
                                                    src={`data:image/jpeg;base64,${book.cover}`}
                                                    alt={book.title}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                        objectPosition: 'center'
                                                    }}
                                                />
                                            </Box>
                                        </Box>
                                        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                            <Typography
                                                sx={{
                                                    fontWeight: 600,
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    lineHeight: 1.2,
                                                    minHeight: '2.4em'
                                                }}
                                            >
                                                {book.title}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {book.author}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </motion.div>
                            ))}
                        </Box>
                    </Box>
                </Box>
            ))}
        </motion.div>
    );
};

export default BookRecommendations;
