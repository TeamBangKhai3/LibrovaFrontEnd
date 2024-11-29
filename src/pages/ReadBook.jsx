import { useParams } from 'react-router-dom';
import EbookReader from '@/components/EbookReader';
import { useEffect, useState } from 'react';
import CustomAppBar from '../components/CustomAppBar.jsx';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { ChevronRight } from "lucide-react";
import axios from 'axios';
import CustomBreadcrumbs from '@/components/CustomBreadcrumbs.jsx';

const ReadBook = () => {
    const { id } = useParams();
    const [bookTitle, setBookTitle] = useState('');
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        console.log('ReadBook component mounted');
        console.log('Book ID from params:', id);

        // Fetch book details to get the title
        const fetchBookDetails = async () => {
            try {
                const token = localStorage.getItem('sessionToken');
                const response = await axios.get(`${backendUrl}/ebook/getebook/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setBookTitle(response.data.title);
            } catch (error) {
                console.error('Error fetching book details:', error);
                setBookTitle('Book');
            }
        };

        fetchBookDetails();
    }, [id, backendUrl]);

    
    const breadcrumbLinks = [
        { label: 'User', path: '/user/home' },
        { label: 'Books', path: '/user/home' },
    ];

    return (
        <div className="min-h-screen bg-background">
                        <CustomAppBar
                userInfoEndpoint={`${backendUrl}/users/getuserinfo`}
                loginRoute="/user/login"
                homeRoute="/user/home"
                accountSettingRoute="/user/accountsetting"
                userType={1}
                disabledLinks={['User']} 
            />
            <div className="container mx-auto px-4 py-4">
                <CustomBreadcrumbs  
                    links={breadcrumbLinks}
                    current={bookTitle}
                    sx={{ marginBottom: '1rem' }}
                />
                <EbookReader bookId={id} />
            </div>
        </div>
    );
};

export default ReadBook;
