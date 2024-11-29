import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast, Toaster } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import logotrans from '../assets/logotrans.png';
import loginbg from '../assets/loginbg.jpg';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const FormSchema = z.object({
    username: z.string().min(4, {
        message: "Username must be at least 4 characters.",
    }),
    password: z.string().min(4, {
        message: "Password must be at least 4 characters.",
    }),
});

const LoginForm = ({ pingEndpoint, authEndpoint, redirectRoute, title, registerRoute, forgotPasswordRoute, alternativeRoute, alternativeTitle }) => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingSession, setIsCheckingSession] = useState(true);
    
    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    useEffect(() => {
        const checkSessionToken = async () => {
            const token = localStorage.getItem('sessionToken');
            if (token) {
                try {
                    const response = await axios.get(pingEndpoint, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.status === 200) {
                        navigate(redirectRoute);
                    }
                } catch (error) {
                    console.error('Error checking session token:', error);
                }
            }
            setIsCheckingSession(false);
        };
        checkSessionToken();
    }, [navigate, pingEndpoint, redirectRoute]);

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            console.table(data)
            const response = await axios.post(authEndpoint, data);
            if (response.status === 200 && response.data) {
                localStorage.setItem('sessionToken', response.data);
                toast.success("Successfully Logged In", {
                    description: "You will be redirected shortly.",
                });
                setTimeout(() => {
                    navigate(redirectRoute);
                }, 2000);
            } else {
                toast.error("Invalid Credentials");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Invalid Credentials");
        } finally {
            setIsLoading(false);
        }
    };

    if (isCheckingSession) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background to-muted">
                <div className="w-full max-w-md space-y-4 p-4">
                    <Skeleton className="h-12 w-12 rounded-full mx-auto" />
                    <Skeleton className="h-8 w-3/4 mx-auto" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-1/2 mx-auto" />
                </div>
            </div>
        );
    }

    return (
        <AnimatePresence mode="wait">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 flex items-center justify-center p-4"
            >
                <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ 
                        backgroundImage: `url(${loginbg})`,
                        filter: 'blur(8px) brightness(50%)',
                        transform: 'scale(1.1)'
                    }}
                />
                
                <Card className="relative w-full max-w-sm bg-white/95 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden">
                    <ScrollArea className="h-[500px]">
                        <div className="p-6">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="flex flex-col items-center"
                            >
                                <img src={logotrans} alt="logo" className="w-16 h-16 sm:w-20 sm:h-20 mb-4" />
                                <h1 className="text-xl sm:text-2xl font-bold text-black mb-5">{title}</h1>
                                
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full space-y-4">
                                        <motion.div
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            <FormField
                                                control={form.control}
                                                name="username"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-1.5">
                                                        <FormLabel>Username</FormLabel>
                                                        <FormControl>
                                                            <Input 
                                                                placeholder="Enter your username" 
                                                                {...field} 
                                                                className="h-10"
                                                                disabled={isLoading}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </motion.div>

                                        <motion.div
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            <FormField
                                                control={form.control}
                                                name="password"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-1.5">
                                                        <FormLabel>Password</FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Input 
                                                                    type={showPassword ? "text" : "password"}
                                                                    placeholder="Enter your password" 
                                                                    {...field} 
                                                                    className="h-10 pr-10"
                                                                    disabled={isLoading}
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setShowPassword(!showPassword)}
                                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                                                >
                                                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                                </button>
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </motion.div>

                                        <motion.div
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.4 }}
                                            className="space-y-3"
                                        >
                                            <Link 
                                                to={forgotPasswordRoute} 
                                                className="block text-sm text-blue-600 hover:text-blue-700 transition-colors"
                                            >
                                                Forgot Password?
                                            </Link>

                                            <Button 
                                                type="submit" 
                                                className="w-full h-10"
                                                disabled={isLoading}
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Logging in...
                                                    </>
                                                ) : (
                                                    'Login'
                                                )}
                                            </Button>
                                        </motion.div>
                                    </form>
                                </Form>

                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="mt-5 text-center space-y-2"
                                >
                                    <p className="text-sm text-gray-600">
                                        Don't have an account?{' '}
                                        <Link to={registerRoute} className="text-blue-600 hover:text-blue-700 transition-colors">
                                            Sign up here
                                        </Link>
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {alternativeTitle}{' '}
                                        <Link to={alternativeRoute} className="text-blue-600 hover:text-blue-700 transition-colors">
                                            Log in here
                                        </Link>
                                    </p>
                                </motion.div>
                            </motion.div>
                        </div>
                    </ScrollArea>
                </Card>
            </motion.div>
            <Toaster position="top-center" />
        </AnimatePresence>
    );
};

export default LoginForm;