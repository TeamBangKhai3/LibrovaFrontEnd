import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast, Toaster } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/providers/theme-provider";
import ReactConfetti from 'react-confetti';

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
import logoinv from '../assets/logoinv.png';
import loginbg from '../assets/loginbg.jpg';
import darkloginbg from '../assets/darkloginbg.jpg';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

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
    const [showForgotDialog, setShowForgotDialog] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const { theme } = useTheme();
    
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
                        backgroundImage: `url(${theme === 'dark' ? darkloginbg : loginbg})`,
                        filter: 'blur(8px) brightness(50%)',
                        transform: 'scale(1.1)'
                    }}
                />
                
                <Card className="relative w-11/12 max-w-xl bg-background/95 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden">
                    <ScrollArea className="h-[550px]">
                        <div className="p-6">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="flex flex-col items-center"
                            >
                                <img 
                                    src={theme === 'dark' ? logoinv : logotrans} 
                                    alt="logo" 
                                    className="w-16 h-16 sm:w-20 sm:h-20 mb-4" 
                                />
                                <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-5">{title}</h1>
                                 
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
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => setShowPassword(!showPassword)}
                                                                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                                                                >
                                                                    {showPassword ? (
                                                                        <EyeOff className="h-4 w-4" />
                                                                    ) : (
                                                                        <Eye className="h-4 w-4" />
                                                                    )}
                                                                </Button>
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
                                            <div className="flex justify-between text-sm">
                                                <Link 
                                                    to={registerRoute} 
                                                    className="text-primary hover:text-primary/80"
                                                >
                                                    Register
                                                </Link>
                                                <Link 
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setShowForgotDialog(true);
                                                    }}
                                                    className="text-primary hover:text-primary/80"
                                                >
                                                    Forgot Password?
                                                </Link>
                                            </div>

                                            <div className="my-6" aria-hidden="true" />

                                            <div className="flex items-center gap-4">
                                                <div className="h-[2px] flex-1 bg-input"></div>
                                                <p className="text-sm text-muted-foreground font-medium">or</p>
                                                <div className="h-[2px] flex-1 bg-input"></div>
                                            </div>

                                            <div className="my-6" aria-hidden="true" />

                                            <Link 
                                                to={alternativeRoute}
                                                className="w-full text-center text-sm text-muted-foreground hover:text-foreground"
                                            >
                                                {alternativeTitle}
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
                                </motion.div>
                            </motion.div>
                        </div>
                    </ScrollArea>
                </Card>
            </motion.div>
            <Dialog open={showForgotDialog} onOpenChange={setShowForgotDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Forgot Your Password? 🤔</DialogTitle>
                        <DialogDescription className="space-y-4 pt-4">
                            <p>
                                Have you tried turning your brain off and on again? 
                                Sometimes our memory needs a quick reboot! 🧠✨
                            </p>
                            <p>
                                But seriously, we all forget things sometimes. 
                                Like that one time I forgot I was a computer program... 
                                Wait, am I? 🤖
                            </p>
                            <p className="font-medium text-foreground">
                                Don't worry! We're working on a proper password reset feature. 
                                For now, try meditating or asking your cat - they seem to know everything! 🐱
                            </p>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-center">
                        <Button
                            type="button"
                            variant="default"
                            onClick={() => {
                                setShowConfetti(true);
                                setTimeout(() => {
                                    setShowConfetti(false);
                                    setShowForgotDialog(false);
                                }, 4000);
                            }}
                        >
                            Thanks for the laugh! 😄
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {showConfetti && (
                <div style={{ 
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 60,
                    pointerEvents: 'none'
                }}>
                    <ReactConfetti
                        width={window.innerWidth}
                        height={window.innerHeight}
                        recycle={false}
                        numberOfPieces={500}
                        gravity={0.3}
                    />
                </div>
            )}
            <Toaster theme={theme} position="top-center" />
        </AnimatePresence>
    );
};

export default LoginForm;