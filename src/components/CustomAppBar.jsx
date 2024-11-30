import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Menu, 
    User, 
    LogOut, 
    Settings, 
    Search,
    BookOpen,
    BookMarked,
    Bookmark,
    Home,
    ShoppingCart,
    ShoppingBag,
    Package,
    MinusCircle,
    Grid
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import Logo from '@/assets/logotrans.png';
import { toast } from "sonner";

const CustomAppBar = ({ 
    userInfoEndpoint,
    loginRoute = '/login',
    homeRoute = '/home',
    accountSettingRoute = '/accountsetting',
    className = "",
    userType = 1,
    isLandingPage = false
}) => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [cartItems, setCartItems] = useState([]);
    const [loadingCart, setLoadingCart] = useState(false);
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const searchTimeoutRef = useRef(null);
    const searchContainerRef = useRef(null);

    const isUser = userType === 1;

    const navigationItems = isUser ? [
        { icon: Home, label: 'Home', path: isLandingPage ? '/user/login' : homeRoute },
        { icon: BookOpen, label: 'Books', path: isLandingPage ? '/user/login' : '/user/books' },
        { icon: Bookmark, label: 'Bookmarks', path: isLandingPage ? '/user/login' : '/user/bookmarks' },
        { icon: Grid, label: 'Categories', path: isLandingPage ? '/user/login' : '/categories' }
    ] : [
        { icon: Home, label: 'Home', path: homeRoute },
        { icon: BookOpen, label: 'My Books', path: '/mybooks' },
        { icon: Grid, label: 'Add Book', path: '/publisher/addebook' },
        { icon: Grid, label: 'Analytics', path: '/analytics' }
    ];

    useEffect(() => {
        const fetchUserInfo = async () => {
            const sessionToken = localStorage.getItem('sessionToken');
            if (!sessionToken) {
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(userInfoEndpoint, {
                    headers: {
                        'Authorization': `Bearer ${sessionToken}`
                    }
                });
                setUserInfo(response.data);
            } catch (error) {
                console.error('Error fetching user info:', error);
                localStorage.removeItem('sessionToken');
                navigate(loginRoute);
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, [userInfoEndpoint, loginRoute, navigate]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const searchBooks = async (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        try {
            setIsSearching(true);
            const sessionToken = localStorage.getItem('sessionToken');
            const response = await axios.get(`${backendUrl}/ebook/searchtopthreeebooks`, {
                params: { keyword: query },
                headers: { Authorization: `Bearer ${sessionToken}` }
            });
            setSearchResults(response.data || []);
        } catch (error) {
            console.error('Error searching books:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        setShowSuggestions(true);

        // Clear existing timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        // Set new timeout
        searchTimeoutRef.current = setTimeout(() => {
            searchBooks(query);
        }, 500);
    };

    const handleSuggestionClick = (bookId) => {
        navigate(`/user/home/ebookinfo/${bookId}`);
        setShowSuggestions(false);
    };

    useEffect(() => {
        // const fetchCartCount = async () => {
        //     const sessionToken = localStorage.getItem('sessionToken');
        //     if (!sessionToken || !isUser) return;

        //     try {
        //         const response = await axios.get(`${backendUrl}/order/getcartcount`, {
        //             headers: {
        //                 'Authorization': `Bearer ${sessionToken}`
        //             }
        //         });
        //         setCartCount(response.data.count || 0);
        //     } catch (error) {
        //         console.error('Error fetching cart count:', error);
        //     }
        // };

        // // Initial fetch
        // fetchCartCount();

        // Listen for cart refresh events
        const handleCartRefresh = () => {
            // fetchCartCount();
            fetchCartItems();
        };

        window.addEventListener('cartRefresh', handleCartRefresh);

        return () => {
            window.removeEventListener('cartRefresh', handleCartRefresh);
        };
    }, [backendUrl, isUser]);

    const fetchCartItems = async () => {
        const sessionToken = localStorage.getItem('sessionToken');
        if (!sessionToken || !isUser) return;

        setLoadingCart(true);
        try {
            const response = await axios.get(`${backendUrl}/order/vieworder`, {
                headers: {
                    'Authorization': `Bearer ${sessionToken}`
                }
            });
            
            if (response.data && response.data.orderItems) {
                setCartItems(response.data.orderItems);
                setCartCount(response.data.orderItems.length);
            }
        } catch (error) {
            console.error('Error fetching cart items:', error);
        } finally {
            setLoadingCart(false);
        }
    };

    useEffect(() => {
        if (isUser) {
            fetchCartItems();
        }
    }, [isUser]);

    const handleLogout = () => {
        localStorage.removeItem('sessionToken');
        navigate(loginRoute);
    };

    const handleNavigate = (route) => {
        navigate(route);
        setIsMobileMenuOpen(false);
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const handleDeleteFromCart = async (id) => {
        const sessionToken = localStorage.getItem('sessionToken');
        if (!sessionToken) return;

        try {
            const response = await axios.delete(`${backendUrl}/order/deletefromcart/${id}`, {
                headers: {
                    'Authorization': `Bearer ${sessionToken}`
                }
            });

            if (response.status === 200) {
                // Optimistically remove the item from the UI
                const updatedItems = cartItems.filter(item => item.orderItemID !== id);
                setCartItems(updatedItems);
                setCartCount(updatedItems.length);
                
                toast.success("Item removed from cart");
            }
        } catch (error) {
            console.error('Error removing item from cart:', error);
            toast.error("Failed to remove item from cart");
            // Refresh cart to ensure UI is in sync with server
            fetchCartItems();
        }
    };

    return (
        <motion.header 
            className={cn(
                "sticky top-0 z-50 w-full border-b bg-white",
                className
            )}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="container flex h-16 max-w-full items-center px-8">
                <div className="flex items-center space-x-6 pl-4">
                    <Button 
                        variant="ghost" 
                        className="hidden md:flex items-center space-x-2 p-0"
                        onClick={() => handleNavigate(isLandingPage ? "/" : homeRoute)}
                    >
                        <img 
                            src={Logo} 
                            alt="Librova Logo" 
                            className="h-10 w-auto object-contain"
                        />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                </div>

                {/* Navigation Items - Desktop */}
                <div className="hidden md:flex items-center space-x-2 ml-8">
                    {navigationItems.map((item) => (
                        <Button
                            key={item.path}
                            variant="ghost"
                            className="flex items-center space-x-2 px-4 hover:bg-transparent bg-transparent"
                            onClick={() => handleNavigate(item.path)}
                        >
                            <item.icon className="h-4 w-4" />
                            <span className="hover:underline">{item.label}</span>
                        </Button>
                    ))}
                </div>

                {/* Search Bar */}
                <div className="flex-1 px-8">
                    <div className={cn(
                        "relative max-w-md mx-auto transition-all duration-300",
                        searchFocused ? "scale-105" : "scale-100"
                    )}>
                        <div className="relative flex-1 max-w-md" ref={searchContainerRef}>
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search books..."
                                    className="pl-8 w-full"
                                    onFocus={() => {
                                        setSearchFocused(true);
                                        if (searchQuery.trim()) {
                                            setShowSuggestions(true);
                                        }
                                    }}
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && searchQuery.trim()) {
                                            navigate(`/user/search?keyword=${encodeURIComponent(searchQuery.trim())}`);
                                            setShowSuggestions(false);
                                        }
                                    }}
                                />
                            </div>
                            
                            {/* Search Suggestions Dropdown */}
                            <AnimatePresence>
                                {showSuggestions && (searchResults.length > 0 || isSearching) && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute z-50 w-full mt-2 bg-popover text-popover-foreground rounded-md border shadow-md"
                                    >
                                        <div className="p-2 space-y-2">
                                            {isSearching ? (
                                                <div className="space-y-2">
                                                    {[1, 2, 3].map((i) => (
                                                        <div key={i} className="flex items-center space-x-3 p-2">
                                                            <div className="w-10 h-14 bg-muted animate-pulse rounded" />
                                                            <div className="space-y-2 flex-1">
                                                                <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                                                                <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <>
                                                    {searchResults.map((book) => (
                                                        <div
                                                            key={book.eBookID}
                                                            className="flex items-center space-x-3 p-2 hover:bg-accent rounded-sm cursor-pointer"
                                                            onClick={() => handleSuggestionClick(book.eBookID)}
                                                        >
                                                            <div className="relative w-10 h-14 overflow-hidden rounded">
                                                                <img
                                                                    src={book.cover ? `data:image/jpeg;base64,${book.cover}` : ''}
                                                                    alt={book.title}
                                                                    className="absolute inset-0 w-full h-full object-cover"
                                                                />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium truncate">{book.title}</p>
                                                                <p className="text-xs text-muted-foreground truncate">{book.author}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <Separator className="my-2" />
                                                    <Button
                                                        variant="ghost"
                                                        className="w-full justify-start text-sm text-muted-foreground hover:text-foreground"
                                                        onClick={() => {
                                                            navigate(`/user/search?keyword=${encodeURIComponent(searchQuery.trim())}`);
                                                            setShowSuggestions(false);
                                                        }}
                                                    >
                                                        <Search className="mr-2 h-4 w-4" />
                                                        See all results
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-4 pr-4">
                    {/* Cart Button with Popover - Only shown for users */}
                    {isUser && !isLandingPage && (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="relative hover:bg-transparent bg-transparent"
                                >
                                    <ShoppingCart className="h-5 w-5" />
                                    <Badge 
                                        variant="secondary" 
                                        className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center"
                                    >
                                        {cartCount}
                                    </Badge>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent 
                                className="w-80" 
                                align="end"
                                sideOffset={8}
                            >
                                <div className="flex flex-col space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium leading-none">Shopping Cart</h4>
                                        <Button 
                                            variant="ghost" 
                                            size="sm"
                                            className="gap-2 text-muted-foreground hover:text-primary"
                                            onClick={() => handleNavigate('/user/checkout')}
                                        >
                                            <ShoppingBag className="h-4 w-4" />
                                            View Cart
                                        </Button>
                                    </div>
                                    <Separator />
                                    <ScrollArea className="h-[300px]">
                                        {loadingCart ? (
                                            <div className="space-y-4">
                                                {[1, 2, 3].map((i) => (
                                                    <div key={i} className="flex items-center space-x-4">
                                                        <Skeleton className="h-16 w-12" />
                                                        <div className="flex-1 space-y-2">
                                                            <Skeleton className="h-4 w-3/4" />
                                                            <Skeleton className="h-4 w-1/2" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : cartItems.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                                                <Package className="h-12 w-12 mb-2" />
                                                <p className="text-sm">Your cart is empty</p>
                                                <Button 
                                                    variant="link" 
                                                    className="mt-2"
                                                    onClick={() => handleNavigate('/books')}
                                                >
                                                    Browse Books
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <AnimatePresence initial={false}>
                                                    {cartItems.map((item) => (
                                                        <motion.div
                                                            key={item.orderItemID}
                                                            initial={{ opacity: 1, height: "auto" }}
                                                            exit={{
                                                                opacity: 0,
                                                                height: 0,
                                                                marginTop: 0,
                                                                marginBottom: 0,
                                                                overflow: "hidden"
                                                            }}
                                                            transition={{
                                                                opacity: { duration: 0.2 },
                                                                height: { duration: 0.2 }
                                                            }}
                                                            className="flex items-center space-x-4 group"
                                                        >
                                                            <div className="h-16 w-12 overflow-hidden rounded">
                                                                <img 
                                                                    src={`data:image/jpeg;base64,${item.eBook.cover}`}
                                                                    alt={item.eBook.title}
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            </div>
                                                            <div className="flex-1 space-y-1">
                                                                <p className="text-sm font-medium leading-none">{item.eBook.title}</p>
                                                                <p className="text-sm text-muted-foreground">{item.eBook.author}</p>
                                                                <p className="text-sm font-medium">${item.eBook.price.toFixed(2)}</p>
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                                onClick={() => handleDeleteFromCart(item.orderItemID)}
                                                            >
                                                                <MinusCircle className="h-4 w-4 text-muted-foreground hover:text-destructive transition-colors" />
                                                            </Button>
                                                        </motion.div>
                                                    ))}
                                                </AnimatePresence>
                                            </div>
                                        )}
                                    </ScrollArea>
                                    {cartItems.length > 0 && (
                                        <div className="flex items-center justify-between pt-4">
                                            <div className="text-sm">
                                                <p className="text-muted-foreground">Total Items</p>
                                                <p className="font-medium">{cartItems.length}</p>
                                            </div>
                                            <Button 
                                                onClick={() => handleNavigate('/user/checkout')}
                                            >
                                                Checkout
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </PopoverContent>
                        </Popover>
                    )}

                    {loading ? (
                        <div className="flex items-center space-x-4">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    ) : userInfo ? (
                        <div className="flex items-center space-x-4">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button 
                                        variant="ghost" 
                                        className="flex items-center space-x-4 h-auto px-2 hover:bg-accent hover:text-accent-foreground"
                                    >
                                        <span className="hidden md:inline text-sm">Hello, {userInfo.name.split(' ')[0]}</span>
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage 
                                                src={userInfo.avatar ? `data:image/jpeg;base64,${userInfo.avatar}` : null}
                                                alt={userInfo.name} 
                                            />
                                            <AvatarFallback>{getInitials(userInfo.name)}</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{userInfo.name}</p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {userInfo.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => handleNavigate(homeRoute)}>
                                        <Home className="mr-2 h-4 w-4" />
                                        <span>Home</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleNavigate(accountSettingRoute)}>
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>Settings</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                        className="text-red-500 focus:text-red-500" 
                                        onClick={handleLogout}
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ) : (
                        <Button 
                            variant="ghost"
                            className="gap-2"
                            onClick={() => handleNavigate(loginRoute)}
                        >
                            <User className="h-4 w-4" />
                            <span>Login</span>
                        </Button>
                    )}
                </div>
            </div>
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: -300 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -300 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50 md:hidden"
                    >
                        <div className="flex flex-col h-full p-4">
                            <div className="flex items-center justify-between mb-8">
                                <img src={Logo} alt="Librova Logo" className="h-8 w-auto" />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="hover:bg-transparent"
                                >
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </div>
                            <div className="flex flex-col space-y-2">
                                {navigationItems.map((item) => (
                                    <Button
                                        key={item.path}
                                        variant="ghost"
                                        className="flex items-center justify-start space-x-2 w-full hover:bg-transparent bg-transparent"
                                        onClick={() => handleNavigate(item.path)}
                                    >
                                        <item.icon className="h-4 w-4" />
                                        <span>{item.label}</span>
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
};

export default CustomAppBar;