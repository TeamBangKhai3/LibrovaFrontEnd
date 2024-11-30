import React from 'react';
import CustomAppBar from '../components/CustomAppBar';
import AnalyticsDashboard from '../components/AnalyticsDashboard';

export default function AnalyticsPage() {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <CustomAppBar
                userInfoEndpoint={`${backendUrl}/publishers/getpublisherinfo`}
                loginRoute="/publisher/login"
                homeRoute="/publisher/home"
                accountSettingRoute="/publisher/accountsetting"
                userType={2}
            />
            <main className="flex-1 container mx-auto px-4 py-6">
                <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
                <AnalyticsDashboard />
            </main>
        </div>
    );
}
