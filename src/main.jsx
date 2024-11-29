import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import UsrLogin from './forms/UserLogin.jsx'
import UsrRegister from './forms/UserRegister.jsx'
import UserDashboard from "./home/UserDashboard.jsx";
import UserAccountSetting from "./home/UserAccountSetting.jsx";

import PublisherDashboard from "./home/PublisherDashboard.jsx";
import PublisherLogin from  "./forms/PublisherLogin.jsx";
import PublisherRegister  from "./forms/PublisherRegister.jsx";
import PublisherAccountSetting from "./home/PublisherAccountSettings.jsx";
import PublisherAddBook from "./forms/AddNewBook.jsx";
import PublisherProductView from "./home/PublisherProductView.jsx"
import EditBook from "./forms/EditBook.jsx";
import UserProductView from "./home/UserProductView.jsx";
import ReadBook from "./pages/ReadBook.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import BooksPage from "./pages/BooksPage.jsx";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                {/*Testing the new Branch*/}
                <Route path="/" element={<Navigate to="/user/login" />} />
                <Route path="/user/login" element={<UsrLogin/>} />
                <Route path="/user/register" element={<UsrRegister/>} />
                <Route path="/user/home" element={<UserDashboard/>} />
                <Route path="/user/books" element={<BooksPage/>} />
                <Route path="/user/accountsetting" element={<UserAccountSetting/>} />
                <Route path="/user/home/ebookinfo/:id" element={<UserProductView/>} />
                <Route path="user/read/:id" element={<ReadBook />} />
                <Route path="/user/checkout" element={<CheckoutPage />} />
                <Route path="/publisher/login" element={<PublisherLogin/>} />
                <Route path="/publisher/register" element={<PublisherRegister/>} />
                <Route path="/publisher/home" element={<PublisherDashboard/>} />
                <Route path="/publisher/accountsetting" element={<PublisherAccountSetting/>} />
                <Route path="/publisher/addebook" element={<PublisherAddBook/>} />
                <Route path="publisher/home/ebookinfo/:id" element={<PublisherProductView/>} />
                <Route path="publisher/home/ebookinfo/editinfo/:id" element={<EditBook/>} />
            </Routes>
        </BrowserRouter>
    </StrictMode>
)
