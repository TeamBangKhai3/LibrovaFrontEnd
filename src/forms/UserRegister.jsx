// UserRegister.jsx
import React from 'react';
import RegisterForm from '../components/RegisterForm';

const UserRegister = () => {
    return (
        <RegisterForm
            registerEndpoint="http://localhost:25566/authuser/register"
            redirectRoute="/user/home"
            title="User Register"
            loginRoute="/user/login"
        />
    );
};

export default UserRegister;