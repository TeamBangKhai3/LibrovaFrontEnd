import React from 'react';
import LoginForm from '../components/LoginForm';


const PublisherLogin = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    return (
        <LoginForm
            pingEndpoint={`${backendUrl}/authpublisher/ping`}
            authEndpoint={`${backendUrl}/authpublisher/login`}
            redirectRoute="/publisher/home"
            registerRoute="/publisher/register"
            forgotPasswordRoute="/publisher/forgotpassword"
            title="Publisher Login"
        />
    );
};

export default PublisherLogin;