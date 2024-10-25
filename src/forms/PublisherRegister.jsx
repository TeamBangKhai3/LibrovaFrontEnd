
import React from 'react';
import RegisterForm from '../components/RegisterForm';

const PublisherRegister = () => {
    return (
        <RegisterForm
            registerEndpoint="http://localhost:25566/authpublisher/register"
            redirectRoute="/publisher/home"
            title="Publisher Register"
            loginRoute="/publisher/login"
        />
    );
};

export default PublisherRegister;