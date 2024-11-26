import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductView from '../components/ProductView';

export default function PublisherProductView() {
    document.title = "Product View | Librova";
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    const breadcrumbLinks = [
        { label: 'Publisher', path: '/publisher/home' },
        { label: 'Home', path: '/publisher/home' },
    ];

    const handleEdit = (id) => {
        navigate(`/publisher/home/ebookinfo/editinfo/${id}`);
    };

    const handleDelete = async (id) => {
        const sessionToken = localStorage.getItem('sessionToken');
        await axios.delete(`${backendUrl}/ebook/deleteebook/${id}`, {
            headers: {
                'Authorization': `Bearer ${sessionToken}`
            }
        });
    };

    return (
        <ProductView
            userType={2}
            userInfoEndpoint={`${backendUrl}/publishers/getpublisherinfo`}
            loginRoute="/publisher/login"
            homeRoute="/publisher/home"
            accountSettingRoute="/publisher/accountsetting"
            breadcrumbLinks={breadcrumbLinks}
            onEdit={handleEdit}
            onDelete={handleDelete}
            requiresAuth={true}
        />
    );
}   