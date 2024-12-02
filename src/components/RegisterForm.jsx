import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import logotrans from '../assets/logotrans.png';
import loginbg from '../assets/loginbg.jpg';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const FormSchema = z.object({
    username: z.string().min(2, { message: "Username is required" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string().min(8, { message: "Confirm Password is required" }),
    email: z.string().email({ message: "Email is invalid" }),
    address: z.string().min(1, { message: "Address is required" }),
    phoneNumber: z.string().min(1, { message: "Phone Number is required" }),
    name: z.string().min(1, { message: "Name is required" }),
});

const OtpSchema = z.object({
    otp: z.string().min(6, { message: "OTP must be 6 digits" }).max(6, { message: "OTP must be 6 digits" }),
});

const RegisterForm = ({ registerEndpoint, redirectRoute, title, loginRoute }) => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showOtpDialog, setShowOtpDialog] = useState(false);
    const [registrationData, setRegistrationData] = useState(null);

    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username: '',
            password: '',
            confirmPassword: '',
            email: '',
            address: '',
            phoneNumber: '',
            name: '',
        },
    });

    const otpForm = useForm({
        resolver: zodResolver(OtpSchema),
        defaultValues: {
            otp: '',
        },
    });

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const onSubmit = async (data) => {
        if (data.password !== data.confirmPassword) {
            form.setError("confirmPassword", { type: "manual", message: "Passwords do not match" });
            return;
        }

        setIsLoading(true);
        try {
            // First check if username or email exists
            await axios.post(`${backendUrl}/authuser/checkuser`, data);
            
            // If no error thrown, proceed with registration
            setRegistrationData(data);
            const response = await axios.post(registerEndpoint, data);
            if (response.data === "check_otp") {
                setShowOtpDialog(true);
                toast.info("OTP sent to your phone number", {
                    description: "Please check your phone for the verification code.",
                });
            } else {
                handleSuccessfulRegistration(response.data);
            }
        } catch (error) {
            if (error.response?.status === 400) {
                toast.error("Username or email already exists");
            } else {
                toast.error("Registration failed. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const onOtpSubmit = async (otpData) => {
        setIsLoading(true);
        try {
            const response = await axios.post(
                `${backendUrl}/authuser/registerwithotp/${otpData.otp}`, 
                registrationData
            );
            handleSuccessfulRegistration(response.data);
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.response?.data || "Invalid OTP, please try again.";
            toast.error(typeof errorMessage === 'string' ? errorMessage : "Invalid OTP, please try again.");
            setIsLoading(false);
            return;
        }
        
        setIsLoading(false);
        setShowOtpDialog(false);
    };

    const handleSuccessfulRegistration = (token) => {
        localStorage.setItem('sessionToken', token);
        toast.success("Registration Successful!", {
            description: "You will be redirected shortly.",
        });
        setTimeout(() => navigate(redirectRoute), 2000);
    };

    return (
        <>
            <Toaster />
            <div className="relative w-screen h-screen overflow-hidden flex items-center justify-center bg-background">
                <div 
                    className="absolute inset-0 bg-cover bg-center filter blur-sm brightness-50"
                    style={{backgroundImage: `url(${loginbg})`}}
                />
                
                <Card className="relative w-11/12 max-w-xl bg-background">
                    <ScrollArea className="h-[85vh] w-full rounded-md">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="p-8"
                        >
                            <div className="flex flex-col items-center space-y-2 mb-6">
                                <motion.img 
                                    src={logotrans} 
                                    alt="logo" 
                                    className="w-24 h-24"
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                />
                                <h1 className="text-2xl font-bold">{title}</h1>
                            </div>

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <motion.div 
                                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Name" {...field} />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="username"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Username</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Username" {...field} />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input type="email" placeholder="Email" {...field} />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="phoneNumber"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Phone Number</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Phone Number" {...field} />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="address"
                                            render={({field}) => (
                                                <FormItem className="md:col-span-2">
                                                    <FormLabel>Address</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Address" {...field} />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Password</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Input 
                                                                type={showPassword ? "text" : "password"} 
                                                                placeholder="Password" 
                                                                {...field} 
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                                onClick={() => setShowPassword(!showPassword)}
                                                            >
                                                                {showPassword ? (
                                                                    <EyeOff className="h-4 w-4" />
                                                                ) : (
                                                                    <Eye className="h-4 w-4" />
                                                                )}
                                                            </Button>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="confirmPassword"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Confirm Password</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Input 
                                                                type={showConfirmPassword ? "text" : "password"} 
                                                                placeholder="Confirm Password" 
                                                                {...field} 
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                            >
                                                                {showConfirmPassword ? (
                                                                    <EyeOff className="h-4 w-4" />
                                                                ) : (
                                                                    <Eye className="h-4 w-4" />
                                                                )}
                                                            </Button>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </motion.div>

                                    <motion.div
                                        className="space-y-4"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <Button 
                                            type="submit" 
                                            className="w-full" 
                                            disabled={isLoading}
                                        >
                                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Register
                                        </Button>

                                        <div className="text-center text-sm">
                                            Already have an account?{" "}
                                            <Link to={loginRoute} className="font-medium underline underline-offset-4 hover:text-primary">
                                                Login here
                                            </Link>
                                        </div>
                                    </motion.div>
                                </form>
                            </Form>
                        </motion.div>
                    </ScrollArea>
                </Card>
            </div>

            <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Enter OTP</DialogTitle>
                        <DialogDescription>
                            Please enter the 6-digit code sent to your phone number
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...otpForm}>
                        <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-4">
                            <FormField
                                control={otpForm.control}
                                name="otp"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>OTP Code</FormLabel>
                                        <FormControl>
                                            <Input 
                                                placeholder="Enter 6-digit code" 
                                                {...field} 
                                                maxLength={6}
                                                className="text-center text-lg tracking-widest"
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <Button 
                                type="submit" 
                                className="w-full" 
                                disabled={isLoading}
                            >
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Verify OTP
                            </Button>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default RegisterForm;