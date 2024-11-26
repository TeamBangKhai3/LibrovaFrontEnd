import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductView from '../components/ProductView';

export default function UserProductView() {
    document.title = "Product View | Librova";
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    const breadcrumbLinks = [
        { label: 'User', path: '/user/home' },
        { label: 'Home', path: '/user/home' },
    ];

    const handleAddToCart = (id) => {
        // Add to cart logic here
        console.log(`Add to cart: ${id}`);
    };

    const handleBuyNow = (id) => {
        // Buy now logic here
        console.log(`Buy now: ${id}`);
    };

    return (
        <ProductView
            userType={1}
            userInfoEndpoint={`${backendUrl}/users/getuserinfo`}
            loginRoute="/user/login"
            homeRoute="/user/home"
            accountSettingRoute="/user/accountsetting"
            breadcrumbLinks={breadcrumbLinks}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            requiresAuth={true}
        />
    );
}