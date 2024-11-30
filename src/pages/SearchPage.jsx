import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from "sonner";
import CustomAppBar from '../components/CustomAppBar';
import CustomBreadcrumbs from '../components/CustomBreadcrumbs';

const SearchPage = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get('keyword');

    document.title = `Search Results | Librova`;

    const breadcrumbLinks = [
        { label: 'User', path: '/user/home' },
        { label: 'Home', path: '/user/home' },
    ];

    useEffect(() => {
        if (keyword) {
            searchBooks();
        }
    }, [keyword]);

    const searchBooks = async () => {
        try {
            setLoading(true);
            const sessionToken = localStorage.getItem('sessionToken');
            const response = await axios.get(`${backendUrl}/ebook/searchebooks`, {
                params: { keyword },
                headers: { Authorization: `Bearer ${sessionToken}` }
            });
            setBooks(response.data || []);
        } catch (error) {
            console.error('Error searching books:', error);
            toast.error('Failed to search books');
        } finally {
            setLoading(false);
        }
    };

    const handleBookClick = (ebookId) => {
        navigate(`/user/home/ebookinfo/${ebookId}`);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <CustomAppBar
                userInfoEndpoint={`${backendUrl}/users/getuserinfo`}
                loginRoute="/user/login"
                homeRoute="/user/home"
                accountSettingRoute="/user/accountsetting"
                userType={1}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="container mx-auto px-4 py-4">
                    <CustomBreadcrumbs
                        links={breadcrumbLinks}
                        current="Search Results"
                        sx={{ marginBottom: '1rem' }}
                    />
                    
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <h2 className="text-2xl font-semibold tracking-tight">
                                    Search Results
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Results for "{keyword}"
                                </p>
                            </div>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {[...Array(8)].map((_, index) => (
                                    <div
                                        key={index}
                                        className="bg-card rounded-lg shadow-sm animate-pulse"
                                    >
                                        <div className="aspect-[3/4] bg-muted rounded-t-lg" />
                                        <div className="p-4 space-y-2">
                                            <div className="h-4 bg-muted rounded w-3/4" />
                                            <div className="h-3 bg-muted rounded w-1/2" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : books.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">No books found matching your search.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {books.map((book) => (
                                    <div
                                        key={book.eBookID}
                                        className="bg-card text-card-foreground rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                        onClick={() => handleBookClick(book.eBookID)}
                                    >
                                        <div className="aspect-[3/4] relative">
                                            <img
                                                src={book.cover ? `data:image/jpeg;base64,${book.cover}` : ''}
                                                alt={book.title}
                                                className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold leading-none tracking-tight">
                                                {book.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {book.author}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
