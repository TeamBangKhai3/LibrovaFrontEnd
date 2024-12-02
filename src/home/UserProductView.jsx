import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductView from '../components/ProductView';
import { toast, Toaster } from "sonner";
import axios from 'axios';

export default function UserProductView() {
    document.title = "Product View | Librova";
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    const breadcrumbLinks = [
        { label: 'User', path: '/user/home' },
        { label: 'Books', path: '/user/books' },
    ];

    const handleAddToCart = async (id) => {
        try {
            const token = localStorage.getItem('sessionToken');
            
            if (!token) {
                toast.error("Please login to add items to cart");
                navigate('/user/login');
                return;
            }

            const response = await axios({
                method: 'post',
                url: `${backendUrl}/order/addtocart/${id}`,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                toast.success("Product added to cart successfully!");
                window.dispatchEvent(new CustomEvent('refreshCart'));
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            if (error.response?.status === 403) {
                toast.error("Session expired. Please login again.");
                localStorage.removeItem('sessionToken');
                navigate('/user/login');
            } else {
                toast.error("Failed to add product to cart. Please try again.");
            }
        }
    };

    const handleBuyNow = async (id) => {
        try {
            const token = localStorage.getItem('sessionToken');
            
            if (!token) {
                toast.error("Please login to purchase");
                navigate('/user/login');
                return;
            }

            const response = await axios({
                method: 'post',
                url: `${backendUrl}/order/addtocart/${id}`,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                navigate('/user/checkout');
            }
        } catch (error) {
            console.error('Error processing purchase:', error);
            toast.error("Failed to process purchase. Please try again.");
        }
    };

    return (
        <>
            <Toaster richColors />
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
        </>
    );
}