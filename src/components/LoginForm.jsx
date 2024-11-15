import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast, Toaster } from "sonner";

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
import logotrans from '../assets/logotrans.png';
import loginbg from '../assets/loginbg.jpg';

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
        };
        checkSessionToken();
    }, [navigate, pingEndpoint, redirectRoute]);

    const onSubmit = async (data) => {
        try {
            console.table(data)
            const response = await axios.post(authEndpoint, data);
            if (response.status === 200 && response.data) {
                localStorage.setItem('sessionToken', response.data);
                toast("Successfully Logged In", {
                    description: "You will be redirected shortly.",
                });
                setTimeout(() => {
                    navigate(redirectRoute);
                }, 3000);
            } else {
                toast("Invalid Credentials", {
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast("Invalid Credentials", {
                variant: "destructive",
            });
        }
    };

    return (
        <>
            <Toaster />
            <section className="relative w-screen h-screen overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-cover bg-center filter blur-sm brightness-50" style={{ backgroundImage: `url(${loginbg})` }}></div>
                <div className="relative z-10 w-96 p-8 bg-white rounded-lg shadow-lg mx-auto my-auto top-1/2 transform -translate-y-1/2 flex flex-col items-center">
                    <img src={logotrans} alt="logo" className="w-24 h-24 mb-4" />
                    <header className="mb-4">
                        <h1 className="text-2xl font-bold text-black">{title}</h1>
                    </header>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full space-y-3">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Username" {...field} className="w-full h-12"/>
                                        </FormControl>
                                        <FormDescription>
                                            This is your public display name.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Password" {...field} className="w-full h-12"/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Link to={forgotPasswordRoute} className="self-start text-blue-500">Forgot Password?</Link>
                            <Button type="submit">Login</Button>
                        </form>
                    </Form>
                    <p className="mt-4 text-black text-center">
                        Don&apos;t have an account? <Link to={registerRoute} className="text-blue-500">Sign up here</Link><br />
                        {alternativeTitle} <Link to={alternativeRoute} className="text-blue-500">Log in here</Link>
                    </p>
                </div>
            </section>
        </>
    );
};

export default LoginForm;