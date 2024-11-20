'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Camera, Loader2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function AccountSettingsForm({
                                                userInfoEndpoint = '/api/user',
                                                userUpdateEndpoint = '/api/user/update',
                                                userDeleteEndpoint = '/api/user/delete',
                                                authEndpoint = '/api/auth',
                                                breadcrumbLinks = [],
                                                title = 'Account Settings'
                                            }) {
    const navigate = useNavigate()
    const [userInfo, setUserInfo] = useState({})
    const [values, setValues] = useState({
        email: '',
        name: '',
        password: '',
        address: '',
        phoneNumber: '',
        avatar: ''
    })
    const [openDialog, setOpenDialog] = useState(false)
    const [showUpdateAlert, setShowUpdateAlert] = useState(false)
    const [showDeleteAlert, setShowDeleteAlert] = useState(false)
    const [updateAlertType, setUpdateAlertType] = useState('success')
    const [updateAlertMessage, setUpdateAlertMessage] = useState('')
    const [passwordValues, setPasswordValues] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    })
    const [passwordError, setPasswordError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const fetchUserInfo = async () => {
            const sessionToken = localStorage.getItem('sessionToken')
            try {
                const response = await axios.get(userInfoEndpoint, {
                    headers: {
                        'Authorization': `Bearer ${sessionToken}`
                    }
                })
                const data = response.data
                setUserInfo(data)
                setValues({
                    email: data.email,
                    name: data.name,
                    password: data.password,
                    address: data.address,
                    phoneNumber: data.phoneNumber,
                    avatar: data.avatar
                })
            } catch (error) {
                console.error('Error fetching user info:', error)
                navigate('/user/login')
            }
        }
        fetchUserInfo()
    }, [navigate, userInfoEndpoint])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setValues({
            ...values,
            [name]: value
        })
    }

    const handlePasswordChange = (e) => {
        const { name, value } = e.target
        setPasswordValues({
            ...passwordValues,
            [name]: value
        })
    }

    const handleSave = async () => {
        setIsLoading(true)
        const sessionToken = localStorage.getItem('sessionToken')
        try {
            await axios.put(userUpdateEndpoint, values, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionToken}`
                }
            })
            setUpdateAlertType('success')
            setUpdateAlertMessage('Your profile has been updated successfully.')
            setShowUpdateAlert(true)
            setTimeout(() => {
                setShowUpdateAlert(false)
            }, 3000)
        } catch (error) {
            console.error('Error updating user info:', error)
            setUpdateAlertType('error')
            setUpdateAlertMessage('Failed to update user info. Please try again.')
            setShowUpdateAlert(true)
            setTimeout(() => {
                setShowUpdateAlert(false)
            }, 3000)
        } finally {
            setIsLoading(false)
        }
    }

    const handlePasswordSave = async () => {
        if (passwordValues.newPassword.length < 8) {
            setPasswordError('New password must be at least 8 characters')
            return
        }
        if (passwordValues.newPassword !== passwordValues.confirmNewPassword) {
            setPasswordError('New passwords do not match')
            return
        }

        setIsLoading(true)
        try {
            const authResponse = await axios.post(authEndpoint, {
                username: userInfo.username,
                password: passwordValues.currentPassword
            })

            if (authResponse.status === 200) {
                const sessionToken = localStorage.getItem('sessionToken')
                const updateData = { ...values, password: passwordValues.newPassword }

                await axios.put(userUpdateEndpoint, updateData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${sessionToken}`
                    }
                })
                setUpdateAlertType('success')
                setUpdateAlertMessage('Your password has been updated successfully.')
                setShowUpdateAlert(true)
                setTimeout(() => {
                    setShowUpdateAlert(false)
                }, 3000)
            } else {
                setPasswordError('Current password is incorrect')
            }
        } catch (error) {
            console.error('Error changing password:', error)
            setPasswordError('Current password is incorrect')
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteAccount = async () => {
        setIsLoading(true)
        const sessionToken = localStorage.getItem('sessionToken')
        try {
            await axios.delete(userDeleteEndpoint, {
                headers: {
                    'Authorization': `Bearer ${sessionToken}`
                }
            })
            setShowDeleteAlert(true)
            localStorage.removeItem('sessionToken')
            setTimeout(() => {
                navigate('/user/login')
            }, 3000)
        } catch (error) {
            console.error('Error deleting account:', error)
            setUpdateAlertType('error')
            setUpdateAlertMessage('Failed to delete account. Please try again.')
            setShowUpdateAlert(true)
            setTimeout(() => {
                setShowUpdateAlert(false)
            }, 3000)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteClick = () => {
        setOpenDialog(true)
    }

    const handleDialogClose = () => {
        setOpenDialog(false)
    }

    const handleDialogConfirm = () => {
        handleDeleteAccount()
        setOpenDialog(false)
    }

    const handleUploadPhoto = (e) => {
        const file = e.target.files[0]
        const reader = new FileReader()
        reader.onloadend = () => {
            setValues({
                ...values,
                avatar: reader.result.split(',')[1]
            })
        }
        reader.readAsDataURL(file)
    }

    return (
        <Card className="w-full max-w-4xl mt-10 overflow-x-hidden" >
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>Manage your account settings and preferences.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="basic-info" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
                        <TabsTrigger value="password">Password</TabsTrigger>
                    </TabsList>
                    <TabsContent value="basic-info">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <Avatar className="w-20 h-20">
                                    <AvatarImage src={`data:image/png;base64,${values.avatar}`} alt="Profile Photo" />
                                    <AvatarFallback>{values.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <Button variant="contained" size="sm">
                                    <label className="flex items-center cursor-pointer">
                                        <Camera className="mr-2 h-4 w-4" />
                                        Change Photo
                                        <input type="file" accept="image/*" hidden onChange={handleUploadPhoto} />
                                    </label>
                                </Button>
                            </div>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input id="username" value={userInfo.username} readOnly disabled />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" name="name" value={values.name} onChange={handleInputChange} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" name="email" type="email" value={values.email} onChange={handleInputChange} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Input id="address" name="address" value={values.address} onChange={handleInputChange} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="phoneNumber">Phone Number</Label>
                                    <Input id="phoneNumber" name="phoneNumber" value={values.phoneNumber} onChange={handleInputChange} />
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="password">
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="currentPassword">Current Password</Label>
                                <Input id="currentPassword" name="currentPassword" type="password" value={passwordValues.currentPassword} onChange={handlePasswordChange} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="newPassword">New Password</Label>
                                <Input id="newPassword" name="newPassword" type="password" value={passwordValues.newPassword} onChange={handlePasswordChange} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                                <Input id="confirmNewPassword" name="confirmNewPassword" type="password" value={passwordValues.confirmNewPassword} onChange={handlePasswordChange} />
                            </div>
                            {passwordError && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>{passwordError}</AlertDescription>
                                </Alert>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="destructive" onClick={handleDeleteClick} disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Delete Account
                </Button>
                <Button onClick={passwordValues.currentPassword ? handlePasswordSave : handleSave} disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {passwordValues.currentPassword ? 'Change Password' : 'Save Changes'}
                </Button>
            </CardFooter>

            <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Account</AlertDialogTitle>
                        <AlertDialogDescription>Are you sure you want to delete your account? This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleDialogClose}>No</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDialogConfirm}>Yes</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {showUpdateAlert && (
                <Alert
                    className="fixed bottom-4 right-4 w-auto"
                    variant={updateAlertType === 'error' ? 'destructive' : 'default'}
                >
                    <AlertTitle>{updateAlertType === 'success' ? 'Success' : 'Error'}</AlertTitle>
                    <AlertDescription>{updateAlertMessage}</AlertDescription>
                </Alert>
            )}

            {showDeleteAlert && (
                <Alert className="fixed bottom-4 right-4 w-auto">
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>Your account has been deleted successfully.</AlertDescription>
                </Alert>
            )}
        </Card>
    )
}