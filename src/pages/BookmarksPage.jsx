import React, { useState, useEffect } from 'react';
import CustomAppBar from '../components/CustomAppBar';
import CustomBreadcrumbs from '../components/CustomBreadcrumbs';
import BookGrid from '../components/BookGrid';
import { Bookmark } from "lucide-react";

const BookmarksPage = () => {
    const [bookmarks, setBookmarks] = useState([]);
    
    document.title = "Bookmarks | Librova";

    const breadcrumbLinks = [
        { label: 'User', path: '/user/home' },
        { label: 'Home', path: '/user/home' },
    ];

    useEffect(() => {
        // Load bookmarks from localStorage
        const storedBookmarks = localStorage.getItem('bookmarks');
        if (storedBookmarks) {
            setBookmarks(JSON.parse(storedBookmarks));
        }
    }, []);

    return (
        <div className="min-h-screen bg-background">
            <CustomAppBar
                userInfoEndpoint={`${import.meta.env.VITE_BACKEND_URL}/users/getuserinfo`}
                loginRoute="/user/login"
                homeRoute="/user/home"
                accountSettingRoute="/user/accountsetting"
                userType={1}
            />

            <div className="container mx-auto px-4 py-4">
                <CustomBreadcrumbs
                    links={breadcrumbLinks}
                    current="Bookmarks"
                />

                <div className="mt-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-semibold tracking-tight">
                                Your Bookmarks
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Your saved books for later
                            </p>
                        </div>
                        <Bookmark className="h-6 w-6" />
                    </div>

                    {bookmarks.length === 0 ? (
                        <div className="text-center py-12">
                            <Bookmark className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                            <h3 className="text-lg font-semibold mb-2">No bookmarks yet</h3>
                            <p className="text-sm text-muted-foreground">
                                Start adding books to your bookmarks to see them here
                            </p>
                        </div>
                    ) : (
                        <BookGrid 
                            booksData={bookmarks}
                            onBookClickPath="/user/home/ebookinfo"
                            className="mt-6"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookmarksPage;
