'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ImageIcon, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import CustomAppBar from "../components/CustomAppBar.jsx";
import CustomBreadcrumbs from "../components/CustomBreadcrumbs.jsx";

const MotionCard = motion(Card);

const AddNewBook = () => {
    const [formData, setFormData] = useState({
        title: '',
        description:'',
        author: '',
        genre: '',
        price: '',
        cover: '',
        isbn: ''
    });
    const [coverPreview, setCoverPreview] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);

    useEffect(() => {
        // Simulate initial page load
        const timer = setTimeout(() => {
            setPageLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const pubiinfoEndpoint = `${backendUrl}/publishers/getpublisherinfo`;
    const addEbookEndpoint = `${backendUrl}/ebook/addebook`;
    const breadcrumbLinks = [
        { label: 'Publisher', path: '/publisher/home' },
        { label: 'Home', path: '/publisher/home' },
    ];
    document.title = "Add Book | Librova";

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleGenreChange = (value) => {
        setFormData(prev => ({
            ...prev,
            genre: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error("Please upload an image file");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result;
            setCoverPreview(base64String);
            setFormData(prev => ({
                ...prev,
                cover: base64String.split(',')[1]
            }));
            toast.success("Cover image uploaded successfully");
        };
        reader.onerror = () => {
            toast.error("Failed to upload cover image");
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const sessionToken = localStorage.getItem('sessionToken');
        
        try {
            await axios.post(addEbookEndpoint, formData, {
                headers: {
                    'Authorization': `Bearer ${sessionToken}`
                }
            });
            toast.success("Book added successfully");
            setTimeout(() => window.location.replace('/publisher/home'), 1500);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add book");
        } finally {
            setIsLoading(false);
        }
    };

    if (pageLoading) {
        return (
            <div className="flex flex-col min-h-[100svh] overflow-hidden">
                <CustomAppBar
                    userInfoEndpoint={pubiinfoEndpoint}
                    loginRoute="/publisher/login"
                    homeRoute="/publisher/home"
                    accountSettingRoute="/publisher/accountsetting"
                />
                <div className="flex-1 overflow-y-auto bg-background">
                    <div className="w-full p-4">
                        <Skeleton className="h-8 w-64" />
                    </div>
                    <div className="container mx-auto px-4 py-6">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            <Card className="lg:col-span-4 h-fit">
                                <CardContent className="p-6 space-y-4">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="aspect-[3/4] w-full" />
                                    <Skeleton className="h-10 w-full" />
                                </CardContent>
                            </Card>
                            <Card className="lg:col-span-8">
                                <CardContent className="p-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} className="space-y-2">
                                                <Skeleton className="h-4 w-24" />
                                                <Skeleton className="h-10 w-full" />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-[100px] w-full" />
                                    </div>
                                    <Skeleton className="h-10 w-full" />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-[100svh] overflow-hidden">
            <CustomAppBar
                userInfoEndpoint={pubiinfoEndpoint}
                loginRoute="/publisher/login"
                homeRoute="/publisher/home"
                accountSettingRoute="/publisher/accountsetting"
                userType={2}
            />

            <div className="flex-1 overflow-y-auto bg-background">
                <div className="w-full p-4">
                    <CustomBreadcrumbs 
                        links={breadcrumbLinks} 
                        current="Add New Book" 
                        disabledLinks={['Publisher']} 
                    />
                </div>

                <div className="container mx-auto px-4 py-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Book Cover Preview */}
                        <MotionCard 
                            className="lg:col-span-4 h-fit"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <Label className="text-lg font-semibold">Book Cover</Label>
                                    <motion.div 
                                        className="aspect-[3/4] w-full overflow-hidden rounded-lg border border-border bg-card"
                                        initial={{ scale: 0.95 }}
                                        animate={{ scale: 1 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {coverPreview ? (
                                            <motion.img
                                                src={coverPreview}
                                                alt="Book Cover Preview"
                                                className="w-full h-full object-cover"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-muted flex flex-col items-center justify-center text-muted-foreground">
                                                <ImageIcon className="w-16 h-16 mb-2" />
                                                <p className="text-sm">Cover Preview</p>
                                            </div>
                                        )}
                                    </motion.div>
                                    <div className="pt-4">
                                        <Input
                                            id="cover"
                                            type="file"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            className="cursor-pointer"
                                            required={!formData.cover}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </MotionCard>

                        {/* Book Details Form */}
                        <MotionCard 
                            className="lg:col-span-8"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <CardContent className="p-6">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <motion.div 
                                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: 0.1 }}
                                    >
                                        <div className="space-y-2">
                                            <Label htmlFor="title">Book Title</Label>
                                            <Input
                                                id="title"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleChange}
                                                placeholder="Enter book title"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="author">Author</Label>
                                            <Input
                                                id="author"
                                                name="author"
                                                value={formData.author}
                                                onChange={handleChange}
                                                placeholder="Enter author name"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="genre">Genre</Label>
                                            <Select onValueChange={handleGenreChange} value={formData.genre} required>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select genre" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Action">Action</SelectItem>
                                                    <SelectItem value="Adventure">Adventure</SelectItem>
                                                    <SelectItem value="Comedy">Comedy</SelectItem>
                                                    <SelectItem value="Drama">Drama</SelectItem>
                                                    <SelectItem value="Fantasy">Fantasy</SelectItem>
                                                    <SelectItem value="Horror">Horror</SelectItem>
                                                    <SelectItem value="Mystery">Mystery</SelectItem>
                                                    <SelectItem value="Romance">Romance</SelectItem>
                                                    <SelectItem value="Sci-Fi">Sci-Fi</SelectItem>
                                                    <SelectItem value="Thriller">Thriller</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="price">Price</Label>
                                            <Input
                                                id="price"
                                                name="price"
                                                type="number"
                                                value={formData.price}
                                                onChange={handleChange}
                                                placeholder="Enter price"
                                                min="0"
                                                step="0.01"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="isbn">ISBN</Label>
                                            <Input
                                                id="isbn"
                                                name="isbn"
                                                value={formData.isbn}
                                                onChange={handleChange}
                                                placeholder="Enter ISBN"
                                                required
                                            />
                                        </div>
                                    </motion.div>

                                    <motion.div 
                                        className="space-y-2"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: 0.2 }}
                                    >
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            placeholder="Enter book description"
                                            required
                                            className="min-h-[100px]"
                                        />
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: 0.3 }}
                                    >
                                        <Button 
                                            type="submit" 
                                            className="w-full"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Adding Book...
                                                </>
                                            ) : (
                                                'Add Book'
                                            )}
                                        </Button>
                                    </motion.div>
                                </form>
                            </CardContent>
                        </MotionCard>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddNewBook;