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
import { BookOpen, DollarSign, Hash, Pencil, Trash2, AlertCircle, RefreshCcw, Heart, Bookmark, BookmarkCheck, Loader2 } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Rating } from "@/components/ui/rating";
import { MarkdownPreview } from "@/components/ui/markdown-preview";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

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
    const [userReview, setUserReview] = useState(null);
    const [newReviewText, setNewReviewText] = useState("");
    const [newRating, setNewRating] = useState(0);
    const [isEditingReview, setIsEditingReview] = useState(false);
    const [currentUserInfo, setCurrentUserInfo] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isInCart, setIsInCart] = useState(false);
    const [orderItemId, setOrderItemId] = useState(null);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeletingReview, setIsDeletingReview] = useState(false);
    const [isLoadingUserInfo, setIsLoadingUserInfo] = useState(true);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();
    const nothing = "No description available please contact the publisher for more information. Thank you! :)";

    const fetchAllData = async (shouldResetStates = false) => {
        console.log('Starting fetchAllData, shouldResetStates:', shouldResetStates);
        if (shouldResetStates) {
            setUserReview(null);
            setNewReviewText("");
            setNewRating(0);
            setIsEditingReview(false);
            setReviews([]);
            setAverageRating(0);
        }

        setLoading(true);
        setError(null);
        try {
            const sessionToken = localStorage.getItem('sessionToken');
            const headers = {
                'Authorization': `Bearer ${sessionToken}`,
                'Content-Type': 'application/json'
            };

            // Always fetch book data, ratings, and reviews
            const [bookResponse, ratingResponse, reviewsResponse] = await Promise.all([
                axios.get(`${backendUrl}/ebook/getebook/${id}`, { headers }),
                axios.get(`${backendUrl}/reviews/getaveragerating/${id}`),
                axios.get(`${backendUrl}/reviews/getallreviews/${id}`)
            ]);

            if (!bookResponse.data) {
                throw new Error('Book not found');
            }

            setBook(bookResponse.data);
            setTitle(bookResponse.data.title);
            setAverageRating(ratingResponse.data ? Number(ratingResponse.data) : 0);
            setReviews(reviewsResponse.data);

            // Only fetch user-specific data for regular users
            if (userType === 1 && sessionToken) {
                // Fetch user info and cart data in parallel
                const [userInfoResponse, cartResponse] = await Promise.all([
                    axios.get(userInfoEndpoint, { headers }),
                    axios.get(`${backendUrl}/order/vieworder`, { headers })
                ]);

                setCurrentUserInfo(userInfoResponse.data);

                // Find user's review
                const userReviewForThisBook = reviewsResponse.data.find(review => 
                    review.user?.userID === userInfoResponse.data.userID
                );
                
                if (userReviewForThisBook) {
                    setUserReview(userReviewForThisBook);
                    setNewReviewText(userReviewForThisBook.reviewText);
                    setNewRating(userReviewForThisBook.rating);
                }

                // Process cart data
                const cartItems = cartResponse.data.orderItems || [];
                const bookInCart = cartItems.some(item => {
                    if (item.eBook.eBookID === parseInt(id)) {
                        setOrderItemId(item.orderItemID);
                        return true;
                    }
                    return false;
                });
                setIsInCart(bookInCart);
            }
        } catch (error) {
            console.error('Error in fetchAllData:', error);
            setError(
                error.response?.status === 404
                    ? 'Book not found. It may have been deleted or moved.'
                    : 'Failed to load book information. Please try again.'
            );
        } finally {
            setLoading(false);
            setIsLoadingUserInfo(false);
        }
    };

    // Single useEffect for data fetching
    useEffect(() => {
        fetchAllData(true);
    }, [id, backendUrl]);

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
        console.log(' Adding to cart, Book ID:', id);
        const sessionToken = localStorage.getItem('sessionToken');
        if (!sessionToken) {
            console.log(' No session token found, redirecting to login');
            navigate(loginRoute);
            return;
        }

        try {
            console.log(' Making addToCart API call...');
            const response = await axios.post(
                `${backendUrl}/order/addtocart/${id}`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${sessionToken}`
                    }
                }
            );

            console.log(' Add to cart response:', response);
            if (response.status === 200) {
                console.log(' Dispatching cartRefresh event');
                // Get the orderItemID from the response
                const orderItemID = response.data?.orderItemID;
                setOrderItemId(orderItemID);
                setIsInCart(true);
                window.dispatchEvent(new CustomEvent('cartRefresh'));
                toast.success("Added to cart successfully");
            }
        } catch (error) {
            console.error(' Error adding to cart:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            toast.error(error.response?.data?.message || "Failed to add to cart");
        }
    };

    const handleDeleteFromCart = async () => {
        console.log(' Deleting from cart, Book ID:', id, 'Order Item ID:', orderItemId);
        const sessionToken = localStorage.getItem('sessionToken');
        if (!sessionToken) {
            console.log(' No session token found, redirecting to login');
            navigate(loginRoute);
            return;
        }

        if (!orderItemId) {
            console.error(' No orderItemId found for deletion');
            toast.error("Cannot delete item: order item ID not found");
            return;
        }

        try {
            console.log(' Making deleteFromCart API call...');
            const response = await axios.delete(
                `${backendUrl}/order/deletefromcart/${orderItemId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${sessionToken}`
                    }
                }
            );

            console.log(' Delete from cart response:', response);
            if (response.status === 200) {
                console.log(' Dispatching cartRefresh event');
                setIsInCart(false);
                setOrderItemId(null);
                window.dispatchEvent(new CustomEvent('cartRefresh'));
                toast.success("Removed from cart successfully");
            }
        } catch (error) {
            console.error(' Error removing from cart:', error);
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
            navigate('/user/checkout');
        } catch (error) {
            console.error('Error processing buy now:', error);
            toast.error("Failed to process purchase");
        }
    };

    const handleBookmarkToggle = () => {
        const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
        
        if (isBookmarked) {
            // Remove from bookmarks
            const updatedBookmarks = bookmarks.filter(b => b.eBookID !== book.eBookID);
            localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
            setIsBookmarked(false);
            toast("Success", {
                description: "Removed from bookmarks",
                variant: "success",
            });
        } else {
            // Add to bookmarks
            if (!bookmarks.some(b => b.eBookID === book.eBookID)) {
                const updatedBookmarks = [...bookmarks, book];
                localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
                setIsBookmarked(true);
                toast("Success", {
                    description: "Added to bookmarks",
                    variant: "success",
                });
            }
        }
    };

    const handleReviewSubmit = async () => {
        try {
            setIsSubmitting(true);
            const sessionToken = localStorage.getItem('sessionToken');
            if (!sessionToken) {
                toast.error("Please login to post a review");
                navigate(loginRoute);
                return;
            }

            const reviewData = {
                reviewText: newReviewText,
                rating: newRating,
                eBookID: parseInt(id)
            };

            const response = await axios.post(
                `${backendUrl}/reviews/addreview`,
                reviewData,
                {
                    headers: { Authorization: `Bearer ${sessionToken}` }
                }
            );

            if (response.status === 200) {
                toast.success("Review posted successfully");
                
                // Update local state
                const newReview = {
                    ...response.data,
                    user: currentUserInfo
                };
                setReviews(prev => [...prev, newReview]);
                setUserReview(newReview);
                
                // Only fetch new rating
                const ratingResponse = await axios.get(`${backendUrl}/reviews/getaveragerating/${id}`);
                setAverageRating(ratingResponse.data ? Number(ratingResponse.data) : 0);
                
                setNewReviewText("");
                setNewRating(0);

                // Refresh the page
                window.location.reload();
            }
        } catch (error) {
            console.error('Error posting review:', error);
            toast.error("Failed to post review");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReviewUpdate = async () => {
        try {
            setIsUpdating(true);
            const sessionToken = localStorage.getItem('sessionToken');
            if (!sessionToken) {
                toast.error("Please login to update your review");
                navigate(loginRoute);
                return;
            }

            const reviewData = {
                reviewText: newReviewText,
                rating: newRating,
                eBookID: parseInt(id)
            };

            const response = await axios.put(
                `${backendUrl}/reviews/updatereview`,
                reviewData,
                {
                    headers: { Authorization: `Bearer ${sessionToken}` }
                }
            );

            if (response.status === 200) {
                toast.success("Review updated successfully");
                
                // Update local state
                const updatedReview = {
                    ...response.data,
                    user: currentUserInfo
                };
                setReviews(prev => prev.map(review => 
                    review.reviewID === updatedReview.reviewID ? updatedReview : review
                ));
                setUserReview(updatedReview);
                
                // Only fetch new rating
                const ratingResponse = await axios.get(`${backendUrl}/reviews/getaveragerating/${id}`);
                setAverageRating(ratingResponse.data ? Number(ratingResponse.data) : 0);
                
                setIsEditingReview(false);

                // Refresh the page
                window.location.reload();
            }
        } catch (error) {
            console.error('Error updating review:', error);
            toast.error("Failed to update review");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleReviewDelete = async () => {
        try {
            setIsDeletingReview(true);
            const sessionToken = localStorage.getItem('sessionToken');
            if (!sessionToken || !userReview) return;

            const response = await axios.delete(
                `${backendUrl}/reviews/deletereview/${userReview.reviewID}`,
                {
                    headers: { Authorization: `Bearer ${sessionToken}` }
                }
            );

            if (response.status === 200) {
                toast.success("Review deleted successfully");
                
                // Update local state
                setReviews(prev => prev.filter(review => review.reviewID !== userReview.reviewID));
                setUserReview(null);
                setNewReviewText("");
                setNewRating(0);
                setIsEditingReview(false);
                
                // Only fetch new rating
                const ratingResponse = await axios.get(`${backendUrl}/reviews/getaveragerating/${id}`);
                setAverageRating(ratingResponse.data ? Number(ratingResponse.data) : 0);
            }
        } catch (error) {
            console.error('Error deleting review:', error);
            toast.error("Failed to delete review");
        } finally {
            setIsDeletingReview(false);
        }
    };

    useEffect(() => {
        if (book) {
            // Check if book is bookmarked
            const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
            setIsBookmarked(bookmarks.some(b => b.eBookID === book.eBookID));
        }
    }, [book]);

    if (error) {
        return (
            <div className="min-h-screen bg-background">
                <CustomAppBar
                    userInfoEndpoint={userInfoEndpoint}
                    loginRoute={loginRoute}
                    homeRoute={homeRoute}
                    accountSettingRoute={accountSettingRoute}
                    userType={userType}
                />
                <main className="container mx-auto px-4 py-6">
                    <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                    <div className="flex justify-center gap-4">
                        <Button variant="outline" onClick={() => navigate(homeRoute)}>
                            Return to Home
                        </Button>
                        <Button onClick={fetchAllData}>
                            <RefreshCcw className="mr-2 h-4 w-4" />
                            Try Again
                        </Button>
                    </div>
                </main>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <CustomAppBar
                    userInfoEndpoint={userInfoEndpoint}
                    loginRoute={loginRoute}
                    homeRoute={homeRoute}
                    accountSettingRoute={accountSettingRoute}
                    userType={userType}
                />
                <main className="container mx-auto px-4 py-6">
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
                                    <div className="aspect-[3/4] relative rounded-lg overflow-hidden mb-6">
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
                                    {userType === 1 ? (
                                        book?.owned ? (
                                            <div className="space-y-4 mt-6">
                                                <Button
                                                    className="w-full"
                                                    onClick={() => navigate(`/user/read/${id}`)}
                                                >
                                                    Read eBook
                                                </Button>
                                                <Button
                                                    className="w-full"
                                                    variant="secondary"
                                                    onClick={handleBookmarkToggle}
                                                >
                                                    {isBookmarked ? (
                                                        <>
                                                            <BookmarkCheck className="mr-2 h-4 w-4" />
                                                            Remove from Bookmarks
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Bookmark className="mr-2 h-4 w-4" />
                                                            Add to Bookmarks
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="space-y-4 mt-6">
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
                                                <Button
                                                    className="w-full"
                                                    variant="secondary"
                                                    onClick={handleBookmarkToggle}
                                                >
                                                    {isBookmarked ? (
                                                        <>
                                                            <BookmarkCheck className="mr-2 h-4 w-4" />
                                                            Remove from Bookmarks
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Bookmark className="mr-2 h-4 w-4" />
                                                            Add to Bookmarks
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        )
                                    ) : null}
                                </CardContent>
                            </Card>
                            <div className="md:col-span-8 space-y-8">
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h1 className="text-3xl font-bold">{book.title}</h1>
                                                <div className="flex items-center gap-4">
                                                    <div className="text-2xl font-bold">₱{book?.price.toFixed(2)}</div>
                                                </div>
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
                                                    {isNaN(averageRating) ? '0' : averageRating.toFixed(1)} out of 5
                                                </span>
                                            </div>
                                        </div>

                                        {book.owned && userType === 1 && (
                                            <div className="mt-8">
                                                <h3 className="text-xl font-semibold mb-4">Your Review</h3>
                                                
                                                {isLoadingUserInfo ? (
                                                    <div className="space-y-4">
                                                        <div className="flex items-start gap-4">
                                                            <Skeleton className="h-10 w-10 rounded-full" />
                                                            <div className="space-y-2 flex-1">
                                                                <Skeleton className="h-4 w-24" />
                                                                <Skeleton className="h-4 w-full" />
                                                                <Skeleton className="h-4 w-3/4" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        {/* Review Editor */}
                                                        {isEditingReview ? (
                                                            <div className="mb-6 space-y-4">
                                                                <div className="flex items-start gap-4">
                                                                    <Avatar>
                                                                        <AvatarImage
                                                                            src={currentUserInfo?.avatar ? `data:image/png;base64,${currentUserInfo.avatar}` : ''}
                                                                            alt={currentUserInfo?.name || 'User'}
                                                                        />
                                                                        <AvatarFallback>
                                                                            {currentUserInfo?.name?.charAt(0).toUpperCase() || 'U'}
                                                                        </AvatarFallback>
                                                                    </Avatar>
                                                                    <div className="flex-1 space-y-4">
                                                                        <div className="flex items-center gap-2">
                                                                            <Rating value={newRating} onChange={setNewRating} />
                                                                            <span className="text-sm text-muted-foreground">
                                                                                {newRating} out of 5 stars
                                                                            </span>
                                                                        </div>
                                                                        <Textarea
                                                                            value={newReviewText}
                                                                            onChange={(e) => setNewReviewText(e.target.value)}
                                                                            placeholder="Write your review..."
                                                                            className="min-h-[100px]"
                                                                        />
                                                                        <div className="flex gap-2">
                                                                            <Button 
                                                                                onClick={userReview ? handleReviewUpdate : handleReviewSubmit}
                                                                                disabled={isSubmitting || isUpdating}
                                                                            >
                                                                                {(isSubmitting || isUpdating) ? (
                                                                                    <>
                                                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                                        {userReview ? 'Updating...' : 'Saving...'}
                                                                                    </>
                                                                                ) : (
                                                                                    userReview ? 'Update Review' : 'Save Review'
                                                                                )}
                                                                            </Button>
                                                                            <Button
                                                                                variant="outline"
                                                                                onClick={() => {
                                                                                    setIsEditingReview(false);
                                                                                    setNewReviewText(userReview?.reviewText || "");
                                                                                    setNewRating(userReview?.rating || 0);
                                                                                }}
                                                                            >
                                                                                Cancel
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : userReview ? (
                                                            <div className="mb-6">
                                                                <div className="flex items-start gap-4">
                                                                    <Avatar>
                                                                        <AvatarImage
                                                                            src={currentUserInfo?.avatar ? `data:image/png;base64,${currentUserInfo.avatar}` : ''}
                                                                            alt={currentUserInfo?.name || 'User'}
                                                                        />
                                                                        <AvatarFallback>
                                                                            {currentUserInfo?.name?.charAt(0).toUpperCase() || 'U'}
                                                                        </AvatarFallback>
                                                                    </Avatar>
                                                                    <div className="flex-1 space-y-4">
                                                                        <div className="flex items-center gap-2">
                                                                            <Rating value={userReview.rating} readonly />
                                                                            <span className="text-sm text-muted-foreground">
                                                                                {userReview.rating} out of 5 stars
                                                                            </span>
                                                                        </div>
                                                                        <p className="text-sm">{userReview.reviewText}</p>
                                                                        <div className="flex gap-2">
                                                                            <Button onClick={() => {
                                                                                setNewReviewText(userReview.reviewText);
                                                                                setNewRating(userReview.rating);
                                                                                setIsEditingReview(true);
                                                                            }}>
                                                                                Edit Review
                                                                            </Button>
                                                                            <AlertDialog>
                                                                                <AlertDialogTrigger asChild>
                                                                                    <Button
                                                                                        variant="outline"
                                                                                        disabled={isDeletingReview}
                                                                                    >
                                                                                        {isDeletingReview ? (
                                                                                            <>
                                                                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                                                Deleting...
                                                                                            </>
                                                                                        ) : (
                                                                                            <>
                                                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                                                Delete Review
                                                                                            </>
                                                                                        )}
                                                                                    </Button>
                                                                                </AlertDialogTrigger>
                                                                                <AlertDialogContent>
                                                                                    <AlertDialogHeader>
                                                                                        <AlertDialogTitle>Delete Review</AlertDialogTitle>
                                                                                        <AlertDialogDescription>
                                                                                            Are you sure you want to delete your review? This action cannot be undone.
                                                                                        </AlertDialogDescription>
                                                                                    </AlertDialogHeader>
                                                                                    <AlertDialogFooter>
                                                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                                        <AlertDialogAction
                                                                                            onClick={handleReviewDelete}
                                                                                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                                                                                        >
                                                                                            Delete Review
                                                                                        </AlertDialogAction>
                                                                                    </AlertDialogFooter>
                                                                                </AlertDialogContent>
                                                                            </AlertDialog>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <Button
                                                                className="mb-6"
                                                                onClick={() => setIsEditingReview(true)}
                                                            >
                                                                Write a Review
                                                            </Button>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        )}

                                        {/* Other Reviews */}
                                        <div className="space-y-6">
                                            {reviews.length > 0 ? (
                                                reviews.map((review) => (
                                                    <div key={review.reviewID} className="space-y-2">
                                                        <div className="flex items-center gap-4">
                                                            <Avatar>
                                                                <AvatarImage
                                                                    src={review.user?.avatar ? `data:image/png;base64,${review.user.avatar}` : ''}
                                                                    alt={review.user?.name || 'User'}
                                                                />
                                                                <AvatarFallback>
                                                                    {review.user?.name?.charAt(0).toUpperCase() || 'U'}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <div className="font-semibold">{review.user?.name || 'Anonymous'}</div>
                                                                <div className="text-sm text-muted-foreground">
                                                                    {format(new Date(review.date), 'PPP')}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Rating value={review.rating} readonly />
                                                            <span className="text-sm text-muted-foreground">
                                                                {review.rating} out of 5 stars
                                                            </span>
                                                        </div>
                                                        <p className="text-sm">{review.reviewText}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-muted-foreground">No reviews yet.</p>
                                            )}
                                        </div>
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
