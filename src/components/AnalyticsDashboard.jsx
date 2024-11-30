import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, TrendingUp, TrendingDown, BookOpen, Star, DollarSign } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AnalyticsDashboard() {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                const sessionToken = localStorage.getItem('sessionToken');
                console.log('Session token:', sessionToken ? 'Present' : 'Missing');
                if (!sessionToken) {
                    console.log('No session token found, skipping API call');
                    return;
                }

                console.log('Making API call to:', `${backendUrl}/analytics/publisher`);
                const response = await axios.get(`${backendUrl}/analytics/publisher`, {
                    headers: { Authorization: `Bearer ${sessionToken}` }
                });
                console.log('API Response:', response.data);
                setAnalytics(response.data);
            } catch (error) {
                console.error('Error fetching analytics:', error);
                if (error.response) {
                    console.error('Response data:', error.response.data);
                    console.error('Response status:', error.response.status);
                }
                setError('Failed to load analytics data');
            } finally {
                setLoading(false);
            }
        };

        console.log('AnalyticsDashboard mounted, fetching data...');
        fetchAnalytics();
    }, [backendUrl]);

    if (loading) {
        return (
            <div className="container mx-auto p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <Card key={i}>
                            <CardContent className="p-6">
                                <Skeleton className="h-4 w-24 mb-2" />
                                <Skeleton className="h-8 w-32" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-6">
                <Card className="bg-destructive/10">
                    <CardContent className="p-6">
                        <p className="text-destructive">{error}</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP'
        }).format(amount);
    };

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Books</CardTitle>
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analytics?.totalBooks || 0}</div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(analytics?.totalRevenue || 0)}</div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                            <Star className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{(analytics?.averageRating || 0).toFixed(1)}</div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Ratings Distribution */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Ratings Distribution</CardTitle>
                        <CardDescription>Distribution of book ratings from 1 to 5 stars</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[5, 4, 3, 2, 1].map((rating) => {
                                const count = analytics?.ratingsDistribution?.[rating] || 0;
                                const total = Object.values(analytics?.ratingsDistribution || {}).reduce((a, b) => a + b, 0);
                                const percentage = total > 0 ? (count / total) * 100 : 0;

                                return (
                                    <div key={rating} className="flex items-center gap-4">
                                        <div className="w-12 text-sm">{rating} stars</div>
                                        <Progress value={percentage} className="h-2" />
                                        <div className="w-12 text-sm text-muted-foreground">{count}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Top Books Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Top Performing Books</CardTitle>
                        <CardDescription>Books with the highest sales and revenue</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead className="text-right">Sales</TableHead>
                                    <TableHead className="text-right">Revenue</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {analytics?.topBooks?.map((book, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{book.title}</TableCell>
                                        <TableCell className="text-right">{book.sales}</TableCell>
                                        <TableCell className="text-right">{formatCurrency(book.revenue)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
