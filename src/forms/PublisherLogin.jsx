import React from 'react';
import LoginForm from '../components/LoginForm';


const PublisherLogin = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    document.title = "Publisher Login";
    return (
        <LoginForm
            pingEndpoint={`${backendUrl}/authpublisher/ping`}
            authEndpoint={`${backendUrl}/authpublisher/login`}
            redirectRoute="/publisher/home"
            registerRoute="/publisher/register"
            forgotPasswordRoute="/publisher/forgotpassword"
            title="Publisher Login"
            alternativeTitle="Are you a User?"
            alternativeRoute="/user/login"
        />
    );
};

export default PublisherLogin;