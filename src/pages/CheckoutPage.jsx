import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from "sonner";
import { Loader2, X, ShoppingCart, BookOpen, Home, Trash2 } from "lucide-react";
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
import { Card } from "../components/ui/card";
import { ScrollArea } from "../components/ui/scroll-area";
import { Separator } from "../components/ui/separator";

const CheckoutPage = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [cartItems, setCartItems] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isCheckingStatus, setIsCheckingStatus] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [showLoadingDialog, setShowLoadingDialog] = useState(false);
    const [purchasedBookId, setPurchasedBookId] = useState(null);
    const [totalAmount, setTotalAmount] = useState(0);
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

    useEffect(() => {
        // Calculate total amount whenever cart items change
        const total = cartItems.reduce((sum, item) => sum + item.eBook.price, 0);
        setTotalAmount(total);
    }, [cartItems]);

    const handlePaymentSuccess = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        
        setIsCheckingStatus(false);
        setIsProcessing(false);
        
        if (cartItems.length === 1) {
            setPurchasedBookId(cartItems[0].eBook.eBookID);
        }
        
        setShowSuccessDialog(true);
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

    const handleRemoveItem = async (orderItemId) => {
        try {
            const sessionToken = localStorage.getItem('sessionToken');
            await axios.delete(`${backendUrl}/order/deletefromcart/${orderItemId}`, {
                headers: { Authorization: `Bearer ${sessionToken}` }
            });
            
            // Update cart items locally
            fetchCartItems();
            
            // Dispatch event to update cart in CustomAppBar
            window.dispatchEvent(new CustomEvent('cartRefresh'));
            
            toast("Success", {
                description: "Item removed from cart",
                variant: "success",
            });
        } catch (error) {
            console.error('Error removing item:', error);
            toast("Error", {
                description: "Failed to remove item from cart",
                variant: "destructive",
            });
        }
    };

    const handleReadBook = () => {
        setShowSuccessDialog(false);
        navigate(`/user/read/${purchasedBookId}`);
    };

    const handleBrowseBooks = () => {
        setShowSuccessDialog(false);
        navigate('/user/home');
    };

    const handleCheckout = async () => {
        try {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }

            setIsProcessing(true);
            setShowLoadingDialog(true);
            const sessionToken = localStorage.getItem('sessionToken');
            
            const response = await axios.post(
                `${backendUrl}/order/processpayment`,
                {},
                {
                    headers: { Authorization: `Bearer ${sessionToken}` }
                }
            );

            if (!response.data) {
                throw new Error('No payment URL received from server');
            }

            const paymentUrl = typeof response.data === 'string' ? response.data.trim() : response.data.url.trim();
            const paymentWindow = window.open(paymentUrl, '_blank');
            
            if (!paymentWindow) {
                throw new Error('Payment window was blocked. Please allow popups for this site.');
            }

            setIsCheckingStatus(true);
            
            const checkPaymentStatus = async () => {
                try {
                    const statusResponse = await axios.get(
                        `${backendUrl}/order/checkpaymentstatus`,
                        {
                            headers: { Authorization: `Bearer ${sessionToken}` }
                        }
                    );

                    if (statusResponse.data === 'succeeded') {
                        if (intervalRef.current) {
                            clearInterval(intervalRef.current);
                            intervalRef.current = null;
                        }
                        setShowLoadingDialog(false);
                        handlePaymentSuccess();
                    } else if (statusResponse.data === 'failed') {
                        if (intervalRef.current) {
                            clearInterval(intervalRef.current);
                            intervalRef.current = null;
                        }
                        setShowLoadingDialog(false);
                        setIsCheckingStatus(false);
                        setIsProcessing(false);
                        toast("Error", {
                            description: "Payment failed. Please try again.",
                            variant: "destructive",
                        });
                    }
                } catch (error) {
                    console.error('Error checking payment status:', error);
                    if (error.response?.status === 404 || error.response?.status === 400) {
                        if (intervalRef.current) {
                            clearInterval(intervalRef.current);
                            intervalRef.current = null;
                        }
                        setShowLoadingDialog(false);
                        setIsCheckingStatus(false);
                        setIsProcessing(false);
                        toast("Error", {
                            description: "Error checking payment status. Please contact support if payment was completed.",
                            variant: "destructive",
                        });
                    }
                }
            };
            
            intervalRef.current = setInterval(checkPaymentStatus, 10000);

        } catch (error) {
            console.error('Error in checkout process:', error);
            setIsProcessing(false);
            setShowLoadingDialog(false);
            toast("Error", {
                description: error.message || "Failed to process checkout",
                variant: "destructive",
            });
        }
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
            
            <div className="flex-1 container mx-auto px-4 py-6">
                <CustomBreadcrumbs
                    links={breadcrumbLinks}
                    current="Checkout"
                />
                
                <div className="mt-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-semibold tracking-tight">Checkout</h2>
                            <p className="text-sm text-muted-foreground">
                                Review your items before proceeding with payment
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Cart Items */}
                        <div className="md:col-span-2">
                            <Card>
                                <ScrollArea className="h-[600px] w-full rounded-md">
                                    {cartItems.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center p-8 text-center">
                                            <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
                                            <h3 className="text-lg font-semibold">Your cart is empty</h3>
                                            <p className="text-sm text-muted-foreground mt-2">
                                                Add some books to get started!
                                            </p>
                                            <Button
                                                className="mt-4"
                                                onClick={() => navigate('/user/home')}
                                            >
                                                Browse Books
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="p-6 space-y-6">
                                            {cartItems.map((item, index) => (
                                                <div key={item.orderItemID}>
                                                    <div className="flex gap-6">
                                                        {/* Book Cover */}
                                                        <div className="w-32 h-48 relative rounded-md overflow-hidden flex-shrink-0">
                                                            <img
                                                                src={`data:image/jpeg;base64,${item.eBook.cover}`}
                                                                alt={item.eBook.title}
                                                                className="absolute inset-0 w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        
                                                        {/* Book Details */}
                                                        <div className="flex-1 space-y-2">
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <h3 className="font-semibold">{item.eBook.title}</h3>
                                                                    <p className="text-sm text-muted-foreground">
                                                                        by {item.eBook.author}
                                                                    </p>
                                                                </div>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => handleRemoveItem(item.orderItemID)}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                            <p className="text-sm">{item.eBook.description}</p>
                                                            <p className="font-semibold">
                                                                ₱{item.eBook.price.toFixed(2)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {index < cartItems.length - 1 && (
                                                        <Separator className="my-6" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </ScrollArea>
                            </Card>
                        </div>

                        {/* Order Summary */}
                        <div className="md:col-span-1">
                            <Card>
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between">
                                            <span>Subtotal</span>
                                            <span>₱{totalAmount.toFixed(2)}</span>
                                        </div>
                                        <Separator />
                                        <div className="flex justify-between font-semibold">
                                            <span>Total</span>
                                            <span>₱{totalAmount.toFixed(2)}</span>
                                        </div>
                                        <Button
                                            className="w-full"
                                            onClick={handleCheckout}
                                            disabled={isProcessing || cartItems.length === 0}
                                        >
                                            {isProcessing ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                'Proceed to Payment'
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* Loading Dialog */}
            <Dialog open={showLoadingDialog} onOpenChange={setShowLoadingDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Processing Payment</DialogTitle>
                        <DialogDescription>
                            Please complete the payment in the popup window.
                            This dialog will update automatically once payment is completed.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center justify-center py-6">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    </div>
                </DialogContent>
            </Dialog>

            {/* Success Dialog */}
            <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Purchase Successful!</DialogTitle>
                        <DialogDescription>
                            Thank you for your purchase. Your books are now available in your library.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end space-x-2">
                        {purchasedBookId ? (
                            <Button onClick={handleReadBook}>
                                <BookOpen className="mr-2 h-4 w-4" />
                                Read Now
                            </Button>
                        ) : (
                            <Button onClick={handleBrowseBooks}>
                                <Home className="mr-2 h-4 w-4" />
                                Browse More
                            </Button>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CheckoutPage;
