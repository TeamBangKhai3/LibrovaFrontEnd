import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CustomAppBar from '../components/CustomAppBar';
import CustomBreadcrumbs from '../components/CustomBreadcrumbs';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from 'lucide-react';

const PurchaseHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const fetchPurchaseHistory = async () => {
            const sessionToken = localStorage.getItem('sessionToken');
            if (!sessionToken) {
                navigate('/user/login');
                return;
            }

            try {
                const response = await axios.get(`${backendUrl}/order/viewpastorders`, {
                    headers: {
                        'Authorization': `Bearer ${sessionToken}`
                    }
                });
                setOrders(response.data || []);
            } catch (error) {
                console.error('Error fetching purchase history:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPurchaseHistory();
    }, [backendUrl, navigate]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        // Convert to Manila time (GMT+8)
        const manilaDate = new Date(date.getTime() + (8 * 60 * 60 * 1000));
        
        return manilaDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone: 'Asia/Manila'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP'
        }).format(amount);
    };

    const calculateOrderTotal = (orderItems) => {
        return orderItems.reduce((total, item) => total + item.eBook.price, 0);
    };

    return (
        <div className="min-h-screen bg-background">
            <CustomAppBar 
                userInfoEndpoint={`${backendUrl}/users/getuserinfo`}
                loginRoute="/user/login"
                homeRoute="/user/home"
                accountSettingRoute="/user/accountsetting"
                userType={1}
            />
            <main className="container mx-auto px-4 py-6 h-[calc(100vh-4rem)] flex flex-col">
                <div className="mb-6">
                    <CustomBreadcrumbs
                        links={[
                            { label: 'Home', path: '/user/home' },
                        ]}
                        current="Purchase History"
                        sx={{ mb: 2 }}
                    />
                    <div className="flex items-center gap-2 mt-4">
                        <ShoppingBag className="h-6 w-6" />
                        <h1 className="text-2xl font-bold">Purchase History</h1>
                    </div>
                </div>
                
                <div className="max-w-4xl mx-auto w-full flex-1 min-h-0">
                    <Card className="h-full">
                        {loading ? (
                            <div className="flex justify-center items-center h-full">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full">
                                <ShoppingBag className="h-12 w-12 mb-4 text-muted-foreground" />
                                <p className="text-lg text-muted-foreground">No purchase history found</p>
                                <Button 
                                    className="mt-4"
                                    onClick={() => navigate('/user/books')}
                                >
                                    Browse Books
                                </Button>
                            </div>
                        ) : (
                            <ScrollArea className="h-full p-6">
                                <div className="space-y-6 pr-4">
                                    {orders.map((order) => (
                                        <div 
                                            key={order.orderID} 
                                            className="border rounded-lg p-6 space-y-4 hover:bg-accent/5 transition-colors"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-semibold text-foreground">Order ID:</span>
                                                        <span className="text-sm text-muted-foreground">{order.orderID}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-semibold text-foreground">Date:</span>
                                                        <span className="text-sm text-muted-foreground">{formatDate(order.orderDate)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-semibold text-foreground">Status:</span>
                                                        <span className={`text-sm font-medium capitalize ${
                                                            order.status === 'succeeded' ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'
                                                        }`}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-bold text-foreground">
                                                        {formatCurrency(calculateOrderTotal(order.orderItems))}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="space-y-4 mt-4">
                                                {order.orderItems.map((item) => (
                                                    <div 
                                                        key={item.orderItemID}
                                                        className="flex items-center space-x-4 p-4 rounded-lg bg-accent/10 hover:bg-accent/20 transition-colors"
                                                    >
                                                        <div className="h-20 w-16 overflow-hidden rounded-md shadow-sm">
                                                            <img 
                                                                src={`data:image/jpeg;base64,${item.eBook.cover}`}
                                                                alt={item.eBook.title}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-semibold text-base text-foreground truncate">
                                                                {item.eBook.title}
                                                            </h3>
                                                            <p className="text-sm font-medium text-muted-foreground">
                                                                {item.eBook.author}
                                                            </p>
                                                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary mt-1">
                                                                {item.eBook.genre}
                                                            </span>
                                                        </div>
                                                        <div className="text-right space-y-2">
                                                            <p className="font-semibold text-foreground">
                                                                {formatCurrency(item.eBook.price)}
                                                            </p>
                                                            <Button
                                                                size="sm"
                                                                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                                                                onClick={() => navigate(`/user/read/${item.eBook.eBookID}`)}
                                                            >
                                                                Read Now
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        )}
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default PurchaseHistoryPage;
