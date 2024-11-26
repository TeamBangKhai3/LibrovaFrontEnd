'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ImageIcon, Loader2, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const MotionCard = motion(Card);

const BookForm = ({ 
    mode = 'add', // 'add' or 'edit'
    initialData = null,
    bookId = null,
    onSuccess,
    onDelete
}) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        author: '',
        genre: '',
        price: '',
        cover: '',
        isbn: ''
    });
    const [coverPreview, setCoverPreview] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const addEbookEndpoint = `${backendUrl}/ebook/addebook`;
    const updateEbookEndpoint = `${backendUrl}/ebook/updateebook`;
    const deleteEbookEndpoint = `${backendUrl}/ebook/deleteebook/${bookId}`;

    useEffect(() => {
        if (mode === 'edit' && initialData) {
            setFormData(initialData);
            if (initialData.cover) {
                setCoverPreview(`data:image/jpeg;base64,${initialData.cover}`);
            }
        }
        const timer = setTimeout(() => {
            setPageLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, [mode, initialData]);

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
            if (mode === 'add') {
                await axios.post(addEbookEndpoint, formData, {
                    headers: {
                        'Authorization': `Bearer ${sessionToken}`
                    }
                });
                toast.success("Book added successfully");
            } else {
                await axios.put(updateEbookEndpoint, { ...formData, eBookID: bookId }, {
                    headers: {
                        'Authorization': `Bearer ${sessionToken}`
                    }
                });
                toast.success("Book updated successfully");
            }
            if (onSuccess) onSuccess();
        } catch (error) {
            toast.error(error.response?.data?.message || `Failed to ${mode} book`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        const sessionToken = localStorage.getItem('sessionToken');
        try {
            await axios.delete(deleteEbookEndpoint, {
                headers: {
                    'Authorization': `Bearer ${sessionToken}`
                }
            });
            toast.success("Book deleted successfully");
            if (onDelete) onDelete();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete book");
        }
    };

    if (pageLoading) {
        return (
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
        );
    }

    return (
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
                                        alt="Book cover preview"
                                        className="h-full w-full object-cover"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center">
                                        <ImageIcon className="h-12 w-12 text-muted-foreground" />
                                    </div>
                                )}
                            </motion.div>
                            <div className="flex justify-center">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="cover-upload"
                                />
                                <Label
                                    htmlFor="cover-upload"
                                    className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
                                >
                                    Upload Cover
                                </Label>
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
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
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="genre">Genre</Label>
                                    <Select
                                        value={formData.genre}
                                        onValueChange={handleGenreChange}
                                        required
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select genre" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Fiction">Fiction</SelectItem>
                                            <SelectItem value="Non-Fiction">Non-Fiction</SelectItem>
                                            <SelectItem value="Science Fiction">Science Fiction</SelectItem>
                                            <SelectItem value="Fantasy">Fantasy</SelectItem>
                                            <SelectItem value="Mystery">Mystery</SelectItem>
                                            <SelectItem value="Biography">Biography</SelectItem>
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
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="min-h-[100px]"
                                    required
                                />
                            </div>
                            <div className="flex justify-between items-center">
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-32"
                                >
                                    {isLoading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        mode === 'add' ? 'Add Book' : 'Save Changes'
                                    )}
                                </Button>
                                
                                {mode === 'edit' && (
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive" className="w-32">
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete the book
                                                    and remove all associated data.
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
                                )}
                            </div>
                        </form>
                    </CardContent>
                </MotionCard>
            </div>
        </div>
    );
};

export default BookForm;
