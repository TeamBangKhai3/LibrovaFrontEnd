import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import CustomAppBar from '../components/CustomAppBar';
import CustomBreadcrumbs from '../components/CustomBreadcrumbs';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogPortal,
    DialogOverlay,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";

const CheckoutPage = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [cartItems, setCartItems] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isCheckingStatus, setIsCheckingStatus] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [showLoadingDialog, setShowLoadingDialog] = useState(false);
    const [purchasedBookId, setPurchasedBookId] = useState(null);
    const intervalRef = useRef(null);
    const navigate = useNavigate();

    document.title = "Checkout | Librova";

    const breadcrumbLinks = [
        { label: 'User', path: '/user/home' },
        { label: 'Home', path: '/user/home' },
    ];

    useEffect(() => {
        fetchCartItems();
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, []);

    const handlePaymentSuccess = () => {
        console.log('Payment success handler called');
        
        // Clear interval
        if (intervalRef.current) {
            console.log('Clearing interval');
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        
        // Reset states
        setIsCheckingStatus(false);
        setIsProcessing(false);
        
        // Get the book ID if only one book was purchased
        if (cartItems.length === 1) {
            const bookId = cartItems[0].eBook.eBookID;
            console.log('Setting purchased book ID:', bookId);
            setPurchasedBookId(bookId);
        }
        
        // Show success dialog
        console.log('Opening success dialog');
        setShowSuccessDialog(true);
        
        // Trigger cart refresh event
        window.dispatchEvent(new CustomEvent('cartRefresh'));
    };

    const fetchCartItems = async () => {
        try {
            const sessionToken = localStorage.getItem('sessionToken');
            const response = await axios.get(`${backendUrl}/order/vieworder`, {
                headers: { Authorization: `Bearer ${sessionToken}` }
            });
            setCartItems(response.data.orderItems || []);
        } catch (error) {
            console.error('Error fetching cart items:', error);
            toast.error('Failed to load cart items');
        }
    };

    const handleReadBook = () => {
        console.log('Navigating to read book:', purchasedBookId);
        setShowSuccessDialog(false);
        navigate(`/user/read/${purchasedBookId}`);
    };

    const handleBrowseBooks = () => {
        console.log('Navigating to browse books');
        setShowSuccessDialog(false);
        navigate('/user/home');
    };

    const handleCheckout = async () => {
        try {
            // Clear any existing interval first
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }

            setIsProcessing(true);
            setShowLoadingDialog(true);
            const sessionToken = localStorage.getItem('sessionToken');
            console.log('Starting payment process...');
            
            const response = await axios.post(
                `${backendUrl}/order/processpayment`,
                {},
                {
                    headers: { Authorization: `Bearer ${sessionToken}` }
                }
            );

            console.log('Payment response:', response.data);

            if (!response.data) {
                throw new Error('No payment URL received from server');
            }

            // Open payment URL in new window
            const paymentUrl = typeof response.data === 'string' ? response.data.trim() : response.data.url.trim();
            console.log('Opening payment URL:', paymentUrl);
            
            const paymentWindow = window.open(paymentUrl, '_blank');
            
            if (!paymentWindow) {
                throw new Error('Payment window was blocked. Please allow popups for this site.');
            }

            // Start checking payment status
            setIsCheckingStatus(true);
            console.log('Starting payment status check...');
            
            const checkPaymentStatus = async () => {
                try {
                    console.log('Checking payment status...');
                    const statusResponse = await axios.get(
                        `${backendUrl}/order/checkpaymentstatus`,
                        {
                            headers: { Authorization: `Bearer ${sessionToken}` }
                        }
                    );

                    console.log('Status response:', statusResponse.data);

                    if (statusResponse.data === 'succeeded') {
                        console.log('Payment succeeded! Stopping status check.');
                        if (intervalRef.current) {
                            clearInterval(intervalRef.current);
                            intervalRef.current = null;
                        }
                        setShowLoadingDialog(false);
                        handlePaymentSuccess();
                    } else if (statusResponse.data === 'failed') {
                        console.log('Payment failed');
                        if (intervalRef.current) {
                            clearInterval(intervalRef.current);
                            intervalRef.current = null;
                        }
                        setShowLoadingDialog(false);
                        setIsCheckingStatus(false);
                        setIsProcessing(false);
                        toast.error('Payment failed. Please try again.');
                    }
                } catch (error) {
                    console.error('Error checking payment status:', error);
                    console.error('Error details:', {
                        message: error.message,
                        response: error.response?.data,
                        status: error.response?.status
                    });
                    if (error.response?.status === 404 || error.response?.status === 400) {
                        if (intervalRef.current) {
                            clearInterval(intervalRef.current);
                            intervalRef.current = null;
                        }
                        setShowLoadingDialog(false);
                        setIsCheckingStatus(false);
                        setIsProcessing(false);
                        toast.error('Error checking payment status. Please contact support if payment was completed.');
                    }
                }
            };
            
            intervalRef.current = setInterval(checkPaymentStatus, 2000);

        } catch (error) {
            console.error('Error in checkout process:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            setShowLoadingDialog(false);
            setIsProcessing(false);
            setIsCheckingStatus(false);
            toast.error(error.message || 'Failed to process payment. Please try again.');
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.eBook.price, 0).toFixed(2);
    };

    const handleLoadingDialogClose = (isOpen) => {
        if (!isOpen) {
            console.log('Loading dialog closed, stopping payment check');
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            setShowLoadingDialog(false);
            setIsCheckingStatus(false);
            setIsProcessing(false);
        }
    };

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
                    current="Checkout"
                    sx={{ marginBottom: '1rem' }}
                />
                
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-semibold tracking-tight">
                                Checkout
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Review your order and proceed to payment
                            </p>
                        </div>
                    </div>

                    {cartItems.length === 0 ? (
                        <div className="bg-card text-card-foreground rounded-lg shadow p-6">
                            <p className="text-muted-foreground text-center">Your cart is empty</p>
                        </div>
                    ) : (
                        <>
                            <div className="bg-card text-card-foreground rounded-lg shadow-sm p-6 mb-6">
                                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                                <div className="divide-y">
                                    {cartItems.map((item) => (
                                        <div key={item.orderItemID} className="py-4 flex items-start justify-between">
                                            <div className="space-y-1">
                                                <h4 className="font-medium">{item.eBook.title}</h4>
                                                <p className="text-sm text-muted-foreground">By {item.eBook.author}</p>
                                            </div>
                                            <p className="font-medium">${item.eBook.price.toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-4 mt-4 border-t flex items-center justify-between">
                                    <p className="text-lg font-semibold">Total</p>
                                    <p className="text-lg font-semibold">${calculateTotal()}</p>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={isProcessing || isCheckingStatus}
                                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3 px-4 rounded-lg font-medium transition-colors disabled:bg-muted disabled:cursor-not-allowed"
                            >
                                {isProcessing ? 'Processing...' : isCheckingStatus ? 'Checking Payment Status...' : 'Proceed to Payment'}
                            </button>
                        </>
                    )}
                </div>
            </div>

            <Dialog open={showLoadingDialog} onOpenChange={handleLoadingDialogClose}>
                <DialogPortal>
                    <DialogOverlay className="bg-black/80" />
                    <DialogContent>
                        <div className="flex flex-col items-center justify-center p-6 space-y-6">
                            <Loader2 className="h-12 w-12 animate-spin text-primary" />
                            <DialogTitle className="text-xl font-semibold text-center">
                                Waiting for Payment
                            </DialogTitle>
                            <DialogDescription className="text-center">
                                Please check the window that just popped up and continue your payment there.
                                <br />
                                <span className="text-sm text-muted-foreground mt-2">
                                    Click the X to cancel and try again.
                                </span>
                            </DialogDescription>
                        </div>
                    </DialogContent>
                </DialogPortal>
            </Dialog>

            <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                <DialogPortal>
                    <DialogOverlay className="bg-black/80" />
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Payment Successful!</DialogTitle>
                            <DialogDescription>
                                Thank you for your purchase. Your book{cartItems.length > 1 ? 's are' : ' is'} now available in your library.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="sm:justify-start">
                            <div className="w-full flex flex-col sm:flex-row gap-2">
                                <Button
                                    variant="secondary"
                                    onClick={handleBrowseBooks}
                                    className="flex-1"
                                >
                                    Continue Browsing
                                </Button>
                                {purchasedBookId && (
                                    <Button
                                        onClick={handleReadBook}
                                        className="flex-1"
                                    >
                                        Read Now
                                    </Button>
                                )}
                            </div>
                        </DialogFooter>
                    </DialogContent>
                </DialogPortal>
            </Dialog>
        </div>
    );
};

export default CheckoutPage;
