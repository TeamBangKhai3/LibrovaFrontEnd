'use client'

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CustomAppBar from "../components/CustomAppBar.jsx";
import CustomBreadcrumbs from "../components/CustomBreadcrumbs.jsx";
import BookForm from "../components/BookForm.jsx";

const EditBook = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [bookData, setBookData] = useState(null);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const pubiinfoEndpoint = `${backendUrl}/publishers/getpublisherinfo`;
    const getEbookEndpoint = `${backendUrl}/ebook/getebook/${id}`;
    const breadcrumbLinks = [
        { label: 'Publisher', path: '/publisher/home' },
        { label: 'Home', path: '/publisher/home' },
    ];
    document.title = "Edit Book | Librova";

    useEffect(() => {
        const fetchBookData = async () => {
            try {
                const sessionToken = localStorage.getItem('sessionToken');
                const response = await axios.get(getEbookEndpoint, {
                    headers: {
                        'Authorization': `Bearer ${sessionToken}`
                    }
                });
                setBookData(response.data);
            } catch (error) {
                console.error('Error fetching book data:', error);
            }
        };
        fetchBookData();
    }, [getEbookEndpoint]);

    const handleSuccess = () => {
        setTimeout(() => navigate('/publisher/home'), 1500);
    };

    const handleDelete = () => {
        navigate('/publisher/home');
    };

    return (
        <div className="flex flex-col min-h-[100svh] overflow-hidden">
            <CustomAppBar
                userInfoEndpoint={pubiinfoEndpoint}
                loginRoute="/publisher/login"
                homeRoute="/publisher/home"
                accountSettingRoute="/publisher/accountsetting"
                userType={2}
            />

            <div className="flex-1 overflow-y-auto bg-background">
                <div className="w-full p-4">
                    <CustomBreadcrumbs 
                        links={breadcrumbLinks} 
                        current="Edit Book" 
                        disabledLinks={['Publisher']} 
                    />
                </div>

                <BookForm 
                    mode={'edit'}
                    initialData={bookData}
                    bookId={id}
                    onSuccess={handleSuccess}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    );
};

export default EditBook;