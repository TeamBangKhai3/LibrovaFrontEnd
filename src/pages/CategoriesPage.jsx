import React, { useEffect, useState } from 'react';
import { Box } from "@mui/material";
import CustomAppBar from '../components/CustomAppBar';
import CustomBreadcrumbs from '../components/CustomBreadcrumbs';
import axios from 'axios';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoriesPage() {
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [categories, setCategories] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const breadcrumbLinks = [
        { label: 'User', path: '/user/home' },
        { label: 'Categories', path: '/user/categories' },
    ];

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${backendUrl}/ebook/random/categories`);
                setCategories(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching categories:', error);
                setError('Failed to load categories. Please try again later.');
                setLoading(false);
            }
        };

        fetchCategories();
    }, [backendUrl]);

    const BookCard = ({ book }) => (
        <Card className="w-[250px] flex-shrink-0">
            <CardContent className="p-0">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => navigate(`/user/home/ebookinfo/${book.eBookID}`)}
                    className="cursor-pointer"
                >
                    <img
                        src={`data:image/jpeg;base64,${book.cover}`}
                        alt={book.title}
                        className="w-full h-[350px] object-cover rounded-t-lg"
                    />
                    <div className="p-4">
                        <h3 className="font-semibold truncate">{book.title}</h3>
                        <p className="text-sm text-muted-foreground truncate">{book.author}</p>
                    </div>
                </motion.div>
            </CardContent>
        </Card>
    );

    const LoadingSkeleton = () => (
        <div className="space-y-8">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-4">
                    <Skeleton className="h-8 w-48" />
                    <ScrollArea className="w-full whitespace-nowrap">
                        <div className="flex justify-center w-full gap-4 pb-4">
                            {[...Array(5)].map((_, j) => (
                                <Card key={j} className="w-[250px] flex-shrink-0">
                                    <CardContent className="p-0">
                                        <Skeleton className="h-[350px] w-full rounded-t-lg" />
                                        <div className="p-4 space-y-2">
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-4 w-2/3" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </div>
            ))}
        </div>
    );

    if (error) {
        return (
            <Box sx={{ 
                height: '100svh',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
            }}>
                <CustomAppBar
                    userInfoEndpoint={`${backendUrl}/users/getuserinfo`}
                    loginRoute="/user/login"
                    homeRoute="/user/home"
                    accountSettingRoute="/user/accountsetting"
                    userType={1}
                />
                <Box sx={{ flex: 1, p: 3 }}>
                    <div className="flex items-center justify-center h-full">
                        <p className="text-destructive">{error}</p>
                    </div>
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ 
            height: '100svh',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        }}>
            <CustomAppBar
                userInfoEndpoint={`${backendUrl}/users/getuserinfo`}
                loginRoute="/user/login"
                homeRoute="/user/home"
                accountSettingRoute="/user/accountsetting"
                userType={1}
            />
            
            <Box sx={{ 
                flex: 1,
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
                pt: 2
            }}>
                <CustomBreadcrumbs 
                    links={breadcrumbLinks} 
                    current="Categories" 
                    sx={{ px: 3 }}
                    disabledLinks={['User']} 
                />
                
                <div className="container mx-auto px-4 space-y-8">
                    {loading ? (
                        <LoadingSkeleton />
                    ) : (
                        Object.entries(categories).map(([genre, books]) => (
                            <div key={genre} className="space-y-4">
                                <h2 className="text-2xl font-bold">{genre}</h2>
                                <ScrollArea className="w-full whitespace-nowrap">
                                    <div className="flex justify-center w-full gap-4 pb-4">
                                        {books.map((book) => (
                                            <BookCard key={book.eBookID} book={book} />
                                        ))}
                                    </div>
                                    <ScrollBar orientation="horizontal" />
                                </ScrollArea>
                            </div>
                        ))
                    )}
                </div>
            </Box>
        </Box>
    );
}
