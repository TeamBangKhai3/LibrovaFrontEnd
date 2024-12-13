import React from 'react';
import RegisterForm from '../components/RegisterForm';

const PublisherRegister = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    document.title = "Publisher Register";
    return (
        <RegisterForm
            registerEndpoint={`${backendUrl}/authpublisher/register`}
            otpEndpoint="/authpublisher/registerwithotp"
            redirectRoute="/publisher/home"
            title="Publisher Register"
            loginRoute="/publisher/login"
        />
    );
};

export default PublisherRegister;