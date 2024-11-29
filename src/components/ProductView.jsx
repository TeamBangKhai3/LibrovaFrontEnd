import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import CustomAppBar from './CustomAppBar.jsx';
import CustomBreadcrumbs from './CustomBreadcrumbs.jsx';
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { BookOpen, DollarSign, Hash, Pencil, Trash2, AlertCircle, RefreshCcw, Heart } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Rating } from "@/components/ui/rating";
import { MarkdownPreview } from "@/components/ui/markdown-preview";
import { toast } from "sonner";

export default function ProductView({
    userType, // 1 for user, 2 for publisher
    userInfoEndpoint,
    loginRoute,
    homeRoute,
    accountSettingRoute,
    breadcrumbLinks,
    onEdit,
    onDelete,
    onAddToCart,
    onBuyNow,
    requiresAuth = false
}) {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [title, setTitle] = useState(null);
    const [averageRating, setAverageRating] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [deleting, setDeleting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isInCart, setIsInCart] = useState(false);
    const [orderItemId, setOrderItemId] = useState(null);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();
    const nothing = "No description available please contact the publisher for more information. Thank you! :)";

    const fetchData = async () => {
        console.log('🔍 Starting fetchData for book ID:', id);
        setLoading(true);
        setError(null);
        try {
            const sessionToken = localStorage.getItem('sessionToken');
            console.log('📝 Session Token exists:', !!sessionToken);
            console.log('👤 User Type:', userType);

            const headers = {
                'Authorization': `Bearer ${sessionToken}`,
                'Content-Type': 'application/json'
            };

            console.log('🔒 Request Headers:', headers);
            console.log('🌐 Making API calls...');

            // Always fetch book data, ratings, and reviews
            const apiCalls = [
                axios.get(`${backendUrl}/ebook/getebook/${id}`, { headers }),
                axios.get(`${backendUrl}/reviews/getaveragerating/${id}`),
                axios.get(`${backendUrl}/reviews/getallreviews/${id}`)
            ];

            // Only fetch cart data for regular users (userType === 1)
            if (userType === 1) {
                console.log('🛒 Adding cart API call for regular user');
                apiCalls.push(
                    axios.get(`${backendUrl}/order/vieworder`, { headers })
                );
            }

            const responses = await Promise.all(apiCalls);
            console.log('✅ API Responses:', responses.map(r => ({ status: r.status, url: r.config.url })));

            const [bookResponse, ratingResponse, reviewsResponse, ...rest] = responses;

            if (!bookResponse.data) {
                throw new Error('Book not found');
            }

            console.log('📚 Book Data:', bookResponse.data);
            console.log('⭐ Rating:', ratingResponse.data);
            console.log('💬 Reviews:', reviewsResponse.data);

            setBook(bookResponse.data);
            setTitle(bookResponse.data.title);
            setAverageRating(ratingResponse.data ? Number(ratingResponse.data) : 0);
            setReviews(reviewsResponse.data);

            // Process cart data only for regular users
            if (userType === 1 && rest.length > 0) {
                const cartResponse = rest[0];
                console.log('🛒 Cart Response:', cartResponse.data);
                
                // Check if book is in cart and store orderItemID if found
                const cartItems = cartResponse.data.orderItems || [];
                console.log('🛍️ Cart Items:', cartItems);
                console.log('🔍 Current Book ID:', id);
                console.log('📦 Cart Item IDs:', cartItems.map(item => item.eBook.eBookID));
                
                let orderItemToDelete = null;
                const bookInCart = cartItems.some(item => {
                    const cartBookId = item.eBook.eBookID;
                    const currentBookId = parseInt(id);
                    console.log('🔄 Comparing:', { cartBookId, currentBookId, matches: cartBookId === currentBookId });
                    if (cartBookId === currentBookId) {
                        orderItemToDelete = item.orderItemID;
                        return true;
                    }
                    return false;
                });

                console.log('📌 Is Book in Cart?', bookInCart);
                console.log('🏷️ Order Item ID to delete:', orderItemToDelete);
                setIsInCart(bookInCart);
                setOrderItemId(orderItemToDelete);
            } else {
                // Reset cart-related state for publishers
                setIsInCart(false);
                setOrderItemId(null);
            }
        } catch (error) {
            console.error('❌ Error in fetchData:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            setError(
                error.response?.status === 404
                    ? 'Book not found. It may have been deleted or moved.'
                    : 'Failed to load book information. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!onDelete) return;
        setDeleting(true);
        try {
            await onDelete(id);
            setDeleting(false);
            navigate(homeRoute);
        } catch (error) {
            console.error('Error deleting book:', error);
            setError('Failed to delete book. Please try again.');
            setDeleting(false);
        }
    };

    const handleAddToCart = async () => {
        console.log('🛒 Adding to cart, Book ID:', id);
        const sessionToken = localStorage.getItem('sessionToken');
        if (!sessionToken) {
            console.log('❌ No session token found, redirecting to login');
            navigate(loginRoute);
            return;
        }

        try {
            console.log('🌐 Making addToCart API call...');
            const response = await axios.post(
                `${backendUrl}/order/addtocart/${id}`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${sessionToken}`
                    }
                }
            );

            console.log('✅ Add to cart response:', response);
            if (response.status === 200) {
                console.log('📢 Dispatching cartRefresh event');
                // Get the orderItemID from the response
                const orderItemID = response.data?.orderItemID;
                setOrderItemId(orderItemID);
                setIsInCart(true);
                window.dispatchEvent(new CustomEvent('cartRefresh'));
                toast.success("Added to cart successfully");
            }
        } catch (error) {
            console.error('❌ Error adding to cart:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            toast.error(error.response?.data?.message || "Failed to add to cart");
        }
    };

    const handleDeleteFromCart = async () => {
        console.log('🗑️ Deleting from cart, Book ID:', id, 'Order Item ID:', orderItemId);
        const sessionToken = localStorage.getItem('sessionToken');
        if (!sessionToken) {
            console.log('❌ No session token found, redirecting to login');
            navigate(loginRoute);
            return;
        }

        if (!orderItemId) {
            console.error('❌ No orderItemId found for deletion');
            toast.error("Cannot delete item: order item ID not found");
            return;
        }

        try {
            console.log('🌐 Making deleteFromCart API call...');
            const response = await axios.delete(
                `${backendUrl}/order/deletefromcart/${orderItemId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${sessionToken}`
                    }
                }
            );

            console.log('✅ Delete from cart response:', response);
            if (response.status === 200) {
                console.log('📢 Dispatching cartRefresh event');
                setIsInCart(false);
                setOrderItemId(null);
                window.dispatchEvent(new CustomEvent('cartRefresh'));
                toast.success("Removed from cart successfully");
            }
        } catch (error) {
            console.error('❌ Error removing from cart:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            toast.error(error.response?.data?.message || "Failed to remove from cart");
        }
    };

    const handleBuyNow = async () => {
        const sessionToken = localStorage.getItem('sessionToken');
        if (!sessionToken) {
            navigate(loginRoute);
            return;
        }

        try {
            // First add to cart
            await handleAddToCart();
            // Then navigate to checkout
            navigate('/cart');
        } catch (error) {
            console.error('Error processing buy now:', error);
            toast.error("Failed to process purchase");
        }
    };

    useEffect(() => {
        fetchData();
    }, [id, backendUrl]);

    if (error) {
        return (
            <div className="h-[100svh] w-full flex flex-col overflow-hidden">
                <CustomAppBar
                    userInfoEndpoint={userInfoEndpoint}
                    loginRoute={loginRoute}
                    homeRoute={homeRoute}
                    accountSettingRoute={accountSettingRoute}
                    userType={userType}
                />
                <main className="flex-1 w-full flex flex-col overflow-y-auto p-8">
                    <div className="container mx-auto max-w-2xl">
                        <Alert variant="destructive" className="mb-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                        <div className="flex justify-center gap-4">
                            <Button variant="outline" onClick={() => navigate(homeRoute)}>
                                Return to Home
                            </Button>
                            <Button onClick={fetchData}>
                                <RefreshCcw className="mr-2 h-4 w-4" />
                                Try Again
                            </Button>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="h-[100svh] w-full flex flex-col overflow-hidden">
                <CustomAppBar
                    userInfoEndpoint={userInfoEndpoint}
                    loginRoute={loginRoute}
                    homeRoute={homeRoute}
                    accountSettingRoute={accountSettingRoute}
                    userType={userType}
                />
                <main className="flex-1 w-full flex flex-col overflow-y-auto p-8">
                    <div className="container mx-auto">
                        <div className="flex gap-8">
                            <div className="w-1/3">
                                <Skeleton className="h-[400px] w-full" />
                            </div>
                            <div className="w-2/3 space-y-4">
                                <Skeleton className="h-8 w-2/3" />
                                <Skeleton className="h-4 w-1/3" />
                                <Skeleton className="h-24 w-full" />
                                <div className="flex gap-2">
                                    <Skeleton className="h-10 w-24" />
                                    <Skeleton className="h-10 w-24" />
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="h-[100svh] w-full flex flex-col overflow-hidden">
            <CustomAppBar
                userInfoEndpoint={userInfoEndpoint}
                loginRoute={loginRoute}
                homeRoute={homeRoute}
                accountSettingRoute={accountSettingRoute}
                userType={userType}
            />
            <main className="flex-1 w-full flex flex-col overflow-y-auto">
                <div className="container mx-auto px-4 py-6">
                    <CustomBreadcrumbs
                        links={breadcrumbLinks}
                        current={title}
                        disabledLinks={[userType === 1 ? 'User' : 'Publisher']}
                    />
                    <AnimatePresence mode="wait">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-6"
                        >
                            <Card className="md:col-span-4">
                                <CardContent className="p-6">
                                    <div className="aspect-[3/4] relative rounded-lg overflow-hidden">
                                        <img
                                            src={`data:image/png;base64,${book.cover}`}
                                            alt={book.title}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                    {userType === 2 && (
                                        <div className="grid grid-cols-2 gap-4 mt-6">
                                            <Button
                                                variant="outline"
                                                onClick={() => onEdit && onEdit(id)}
                                            >
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Edit
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="destructive"
                                                        disabled={deleting}
                                                    >
                                                        {deleting ? (
                                                            <>
                                                                <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                                                                Deleting...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete
                                                            </>
                                                        )}
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete the
                                                            book and remove all associated data.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={handleDelete}
                                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                        >
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    )}
                                    {userType === 1 && (
                                        <div className="space-y-4 mt-6">
                                            {book?.owned ? (
                                                <Button
                                                    className="w-full"
                                                    onClick={() => navigate(`/user/read/${id}`)}
                                                >
                                                    Read Ebook
                                                </Button>
                                            ) : (
                                                <>
                                                    {isInCart ? (
                                                        <Button
                                                            className="w-full"
                                                            variant="destructive"
                                                            onClick={handleDeleteFromCart}
                                                        >
                                                            Delete from Cart
                                                        </Button>
                                                    ) : (
                                                        <>
                                                            <Button
                                                                className="w-full"
                                                                variant="outline"
                                                                onClick={handleAddToCart}
                                                            >
                                                                Add to Cart
                                                            </Button>
                                                            <Button
                                                                className="w-full"
                                                                onClick={handleBuyNow}
                                                            >
                                                                Buy Now
                                                            </Button>
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                            <div className="md:col-span-8 space-y-8">
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h1 className="text-3xl font-bold">{book.title}</h1>
                                                <Badge variant="outline" className="text-lg px-3">
                                                    <DollarSign className="mr-1 h-4 w-4" />
                                                    {book.price}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-4 text-muted-foreground">
                                                <div className="flex items-center">
                                                    <BookOpen className="mr-2 h-4 w-4" />
                                                    {book.author}
                                                </div>
                                                <div className="flex items-center">
                                                    <Hash className="mr-2 h-4 w-4" />
                                                    {book.isbn}
                                                </div>
                                            </div>
                                            <MarkdownPreview 
                                                content={book.description || nothing}
                                                className="text-muted-foreground"
                                            />
                                            <Badge>{book.genre}</Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-2xl font-bold">Customer Reviews</h2>
                                            <div className="flex items-center gap-2">
                                                <Rating
                                                    value={isNaN(averageRating) ? 0 : averageRating}
                                                    readonly
                                                />
                                                <span className="text-lg font-semibold">
                                                    {typeof averageRating === 'number' ? averageRating : '0'} out of 5
                                                </span>
                                            </div>
                                        </div>
                                        <ScrollArea className="h-[400px] pr-4">
                                            <div className="space-y-4">
                                                {reviews.map((review) => (
                                                    <Card key={review.reviewID}>
                                                        <CardContent className="p-4">
                                                            <div className="space-y-2">
                                                                <h3 className="font-semibold text-lg">
                                                                    {review.user.name || 'Anonymous User'}
                                                                </h3>
                                                                <div className="flex items-center gap-2">
                                                                    <Rating
                                                                        value={isNaN(review.rating) ? 0 : review.rating}
                                                                        readonly
                                                                    />
                                                                    <span className="text-sm text-muted-foreground">
                                                                        {review.rating} out of 5
                                                                    </span>
                                                                </div>
                                                                <p className="text-muted-foreground">
                                                                    {review.reviewText}
                                                                </p>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        </ScrollArea>
                                    </CardContent>
                                </Card>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
