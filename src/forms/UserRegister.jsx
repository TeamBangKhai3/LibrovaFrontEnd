// UserRegister.jsx
import React from 'react';
import RegisterForm from '../components/RegisterForm';

const UserRegister = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    return (
        <RegisterForm
            registerEndpoint={`${backendUrl}/authuser/register`}
            redirectRoute="/user/home"
            title="User Register"
            loginRoute="/user/login"
        />
    );
};

export default UserRegister;