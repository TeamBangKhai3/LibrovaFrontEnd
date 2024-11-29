// UserLogin.jsx
import React from 'react';
import LoginForm from '../components/LoginForm';

const UserLogin = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    document.title = "User Login";
    return (
        <LoginForm
            pingEndpoint={`${backendUrl}/authuser/ping`}
            authEndpoint={`${backendUrl}/authuser/login`}
            redirectRoute="/user/home"
            registerRoute="/user/register"
            forgotPasswordRoute="/user/forgotpassword"
            title="User Login"
            alternativeTitle="Are you a Publisher?"
            alternativeRoute="/publisher/login"
        />
    );
};

export default UserLogin;