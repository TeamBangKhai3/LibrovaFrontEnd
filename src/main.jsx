import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Login from './forms/login'
import Register from './forms/Register'
import './index.css'
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import UserDashboard from "./home/dashboard";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register/>} />
            <Route path="/home" element={<UserDashboard/>} />
            {/*    <Route path="/lyrics/singer1" element={<App colorr={"#ADD8E6"} textInputHide={false} />} />*/}
            {/*    <Route path="/lyrics/singer2" element={<App colorr={"#FF77FF"} textInputHide={false} />} />*/}
            {/*    <Route path="/lyrics/singer3" element={<App colorr={"#FF9999"} textInputHide={false} />} />*/}
            {/*    <Route path="/lyrics/singer4" element={<App colorr={"#FFD580"} textInputHide={false} />} />*/}
            </Routes>
        </BrowserRouter>
    </StrictMode>
)
