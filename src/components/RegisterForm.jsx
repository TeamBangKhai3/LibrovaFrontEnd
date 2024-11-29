import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast, Toaster } from "sonner";

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
import logotrans from '../assets/logotrans.png';
import loginbg from '../assets/loginbg.jpg';

const FormSchema = z.object({
    username: z.string().min(2, { message: "Username is required" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string().min(8, { message: "Confirm Password is required" }),
    email: z.string().email({ message: "Email is invalid" }),
    address: z.string().min(1, { message: "Address is required" }),
    phoneNumber: z.string().min(1, { message: "Phone Number is required" }),
    name: z.string().min(1, { message: "Name is required" }),
});

const RegisterForm = ({ registerEndpoint, redirectRoute, title, loginRoute }) => {
    const navigate = useNavigate();
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

    const onSubmit = async (data) => {
        if (data.password !== data.confirmPassword) {
            form.setError("confirmPassword", { type: "manual", message: "Passwords do not match" });
            return;
        }

        try {
            const response = await axios.post(registerEndpoint, data);
            if (response.data === "Username already exists") {
                toast("Error", {
                    description: "Username already exists",
                    variant: "destructive",
                });
            } else {
                localStorage.setItem('sessionToken', response.data);
                toast("Success", {
                    description: "Registered Successfully! You will be redirected shortly.",
                    variant: "success",
                });
                setTimeout(() => navigate(redirectRoute), 3000);
            }
        } catch (error) {
            const errorMessage = error.response?.data || "Registration error";
            toast("Error", {
                description: errorMessage,
                variant: "destructive",
            });
        }
    };

    return (
        <>
            <Toaster />
            <section className="relative w-screen h-screen overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-cover bg-center filter blur-sm brightness-50"
                     style={{backgroundImage: `url(${loginbg})`}}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-7/8 max-h-svh w-11/12 max-w-xl p-8 bg-white rounded-lg shadow-lg overflow-y-auto">
                        <img src={logotrans} alt="logo" className="w-24 h-24 mb-4"/>
                        <header className="mb-4">
                            <h1 className="text-2xl font-bold text-black">{title}</h1>
                        </header>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}
                                  className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Name" {...field} className="w-full h-12"/>
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
                                                <Input placeholder="Username" {...field} className="w-full h-12"/>
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
                                                <Input type="password" placeholder="Password" {...field}
                                                       className="w-full h-12"/>
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
                                                <Input type="password" placeholder="Confirm Password" {...field}
                                                       className="w-full h-12"/>
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
                                            <FormLabel>Email Address</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="Email Address" {...field}
                                                       className="w-full h-12"/>
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
                                                <Input placeholder="Phone Number" {...field} className="w-full h-12"/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Address</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Address" {...field} className="w-full h-12"/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <div className="flex items-center col-span-1 md:col-span-2">
                                    <input type="checkbox" id="terms" required className="mr-2"/>
                                    <label htmlFor="terms" className="text-black">Agree to Terms and Conditions</label>
                                </div>
                                <Button type="submit" className="w-full col-span-1 md:col-span-2">Register</Button>
                            </form>
                        </Form>
                        <p className="mt-4 text-black text-center">
                            Already have an account? <Link to={loginRoute} className="text-black">Log in here</Link>
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
};

export default RegisterForm;