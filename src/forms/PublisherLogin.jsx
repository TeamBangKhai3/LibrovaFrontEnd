import React from 'react';
import LoginForm from '../components/LoginForm';

const PublisherLogin = () => {
    return (
        <LoginForm
            pingEndpoint="http://localhost:25566/authpublisher/ping"
            authEndpoint="http://localhost:25566/authpublisher/login"
            redirectRoute="/publisher/home"
            registerRoute="/publisher/register"
            forgotPasswordRoute="/publisher/forgotpassword"
            title="Publisher Login"
        />
    );
};

export default PublisherLogin;