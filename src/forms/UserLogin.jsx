// UserLogin.jsx
import React from 'react';
import LoginForm from '../components/LoginForm';

const UserLogin = () => {
    return (
        <LoginForm
            pingEndpoint="http://localhost:25566/authuser/ping"
            authEndpoint="http://localhost:25566/authuser/login"
            redirectRoute="/user/home"
            registerRoute="/user/register"
            forgotPasswordRoute="/user/forgotpassword"
            title="User Login"
        />
    );
};

export default UserLogin;