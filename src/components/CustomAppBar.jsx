import React, { useState, useEffect } from 'react';
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
    Library,
    BookMarked,
    Bookmark,
    Home,
    Grid,
    ShoppingCart,
    ShoppingBag,
    Package
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import Logo from '@/assets/logotrans.png';

const CustomAppBar = ({ 
    userInfoEndpoint,
    loginRoute = '/login',
    homeRoute = '/home',
    accountSettingRoute = '/accountsetting',
    className = "",
    userType = 1
}) => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const navigate = useNavigate();

    const isUser = userType === 1;

    const navigationItems = isUser ? [
        { icon: Home, label: 'Home', path: homeRoute },
        { icon: BookOpen, label: 'Books', path: '/books' },
        { icon: Library, label: 'Library', path: '/library' },
        { icon: Bookmark, label: 'Bookmarks', path: '/bookmarks' },
        { icon: Grid, label: 'Categories', path: '/categories' }
    ] : [
        { icon: Home, label: 'Home', path: homeRoute },
        { icon: BookOpen, label: 'My Books', path: '/mybooks' },
        { icon: Library, label: 'Add Book', path: '/publisher/addebook' },
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

    return (
        <motion.header 
            className={cn(
                "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
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
                        onClick={() => handleNavigate(homeRoute)}
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
                            className="flex items-center space-x-2 px-4"
                            onClick={() => handleNavigate(item.path)}
                        >
                            <item.icon className="h-4 w-4" />
                            <span>{item.label}</span>
                        </Button>
                    ))}
                </div>

                {/* Search Bar */}
                <div className="flex-1 px-8">
                    <div className={cn(
                        "relative max-w-md mx-auto transition-all duration-300",
                        searchFocused ? "scale-105" : "scale-100"
                    )}>
                        <Search className={cn(
                            "absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform transition-colors",
                            searchFocused ? "text-primary" : "text-muted-foreground"
                        )} />
                        <Input
                            type="search"
                            placeholder="Search books..."
                            className="w-full pl-8 bg-muted/50"
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setSearchFocused(false)}
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-4 pr-4">
                    {/* Cart Button with Popover - Only shown for users */}
                    {isUser && (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="relative"
                                >
                                    <ShoppingCart className="h-5 w-5" />
                                    <Badge 
                                        variant="secondary" 
                                        className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center"
                                    >
                                        0
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
                                            onClick={() => handleNavigate('/cart')}
                                        >
                                            <ShoppingBag className="h-4 w-4" />
                                            View Cart
                                        </Button>
                                    </div>
                                    <Separator />
                                    <ScrollArea className="h-[300px]">
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
                                    </ScrollArea>
                                    {/* Uncomment and modify when implementing cart functionality
                                    <div className="flex items-center justify-between pt-4">
                                        <div className="text-sm">
                                            <p className="text-muted-foreground">Subtotal</p>
                                            <p className="font-medium">$0.00</p>
                                        </div>
                                        <Button 
                                            size="sm" 
                                            onClick={() => handleNavigate('/checkout')}
                                        >
                                            Checkout
                                        </Button>
                                    </div>
                                    */}
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
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button 
                                    variant="ghost" 
                                    className="relative h-8 w-8 rounded-full"
                                >
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
        </motion.header>
    );
};

export default CustomAppBar;