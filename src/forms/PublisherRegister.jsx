
import React from 'react';
import RegisterForm from '../components/RegisterForm';

const PublisherRegister = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    return (
        <RegisterForm
            registerEndpoint={`${backendUrl}/authpublisher/register`}
            redirectRoute="/publisher/home"
            title="Publisher Register"
            loginRoute="/publisher/login"
        />
    );
};

export default PublisherRegister;