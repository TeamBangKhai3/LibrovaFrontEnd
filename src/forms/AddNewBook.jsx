import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import BookForm from "@/components/BookForm";
import CustomAppBar from "../components/CustomAppBar.jsx";
import CustomBreadcrumbs from "../components/CustomBreadcrumbs.jsx";

const breadcrumbLinks = [
    { label: 'Publisher', path: '/publisher/home' },
    { label: 'Home', path: '/publisher/home' },
];

export default function AddNewBook() {
    document.title = "Add New Book | Librova";
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (formData) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("sessionToken");
            if (!token) {
                toast.error("Please login to add a book");
                navigate("/publisher/login");
                return;
            }

            const response = await axios({
                method: "post",
                url: `${backendUrl}/ebook/addbook`,
                data: formData,
                headers: {
                    Authorization: `Bearer ${token}`,
                    // brian wtf???? json baya
                    // "Content-Type": "multipart/form-data",
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 200) {
                toast.success("Book added successfully!");
                navigate("/publisher/home");
            }
        } catch (error) {
            console.error("Error adding book:", error);
            if (error.response?.status === 403) {
                toast.error("Session expired. Please login again.");
                localStorage.removeItem("sessionToken");
                navigate("/publisher/login");
            } else {
                setError(
                    error.response?.data?.message ||
                    "Failed to add book. Please try again."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-[100svh] overflow-hidden">
            <CustomAppBar
                userInfoEndpoint={`${backendUrl}/publishers/getpublisherinfo`}
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
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <h2 className="text-2xl font-semibold tracking-tight">
                                    Add New Book
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Fill in the details below to add a new book
                                </p>
                            </div>
                        </div>
                        <BookForm
                            mode="add"
                            onSubmit={handleSubmit}
                            loading={loading}
                            error={error}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}