'use client'

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Search, ShoppingCart, Bookmark, Library, User } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import logotrans from '../assets/logotrans.png'

export default function CustomAppBar({
                                         userInfoEndpoint,
                                         loginRoute,
                                         homeRoute,
                                         accountSettingRoute
                                     }) {
    const navigate = useNavigate()
    const [avatar, setAvatar] = useState(null)
    const [username, setUsername] = useState('')

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get(userInfoEndpoint, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('sessionToken')}`
                    }
                })
                if (response.status === 200) {
                    setUsername(response.data.username)
                    setAvatar(response.data.avatar)
                } else {
                    navigate(loginRoute)
                }
            } catch (error) {
                console.error('Error fetching user info:', error)
                navigate(loginRoute)
            }
        }

        fetchUserInfo()
    }, [navigate, userInfoEndpoint, loginRoute])

    const handleLogout = () => {
        localStorage.removeItem('sessionToken')
        navigate(loginRoute)
    }

    return (
        <div className="sticky top-0 z-50 w-screen">
            <header className="flex h-20 items-center justify-between bg-white px-4 shadow-sm">
                <Button variant="ghost" className="p-8 bg-transparent" onClick={() => navigate(homeRoute)}>
                    <img src={logotrans} alt="Logo" width={60} height={60} />
                </Button>

                <div className="flex-grow mx-4">
                    <div className="relative">
                        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-500" />
                        <Input
                            type="search"
                            placeholder="Search…"
                            className="w-full pl-8 h-[45px]"
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon">
                        <ShoppingCart className="h-6 w-6" />
                    </Button>
                    <Button variant="ghost" size="icon">
                        <Bookmark className="h-6 w-6" />
                    </Button>
                    <Button variant="ghost" size="icon">
                        <Library className="h-6 w-6" />
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex items-center space-x-2 p-7 bg-transparent">
                                <span>Hello, {username}</span>
                                <Avatar>
                                    <AvatarImage src={`data:image/png;base64,${avatar}`} />
                                    <AvatarFallback><User /></AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => navigate(accountSettingRoute)}>
                                Account Settings
                            </DropdownMenuItem>
                            <DropdownMenuItem>Ebook Manager</DropdownMenuItem>
                            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>

            <nav className="flex h-[50px] items-center justify-center bg-gray-200 shadow-sm space-x-64">
                <Button variant="ghost" className="bg-transparent px-10" onClick={() => navigate(homeRoute)}>Home</Button>
                <Button variant="ghost" className="bg-transparent px-10" >Books</Button>
                <Button variant="ghost" className="bg-transparent px-10">Genre</Button>
                <Button variant="ghost"className="bg-transparent px-10">More</Button>
            </nav>
        </div>
    )
}