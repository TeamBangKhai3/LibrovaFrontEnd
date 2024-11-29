'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Camera, Loader2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
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

const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
}

const inputVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: i => ({
        opacity: 1,
        x: 0,
        transition: {
            delay: i * 0.1
        }
    })
}

const alertVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 }
}

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
    const [loading, setLoading] = useState(true)

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
                setLoading(false)
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

    const LoadingSkeleton = () => (
        <div className="space-y-4">
            <div className="flex items-center space-x-4">
                <Skeleton className="w-20 h-20 rounded-full" />
                <Skeleton className="h-10 w-32" />
            </div>
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                ))}
            </div>
        </div>
    )

    if (loading) {
        return (
            <Card className="w-full max-w-6xl mx-auto mt-10">
                <CardHeader>
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-96" />
                </CardHeader>
                <CardContent>
                    <LoadingSkeleton />
                </CardContent>
            </Card>
        )
    }

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={formVariants}
            transition={{ duration: 0.5 }}
            className="w-full max-w-6xl mx-auto"
        >
            <Card className="w-full mt-10 overflow-x-hidden">
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
                        <AnimatePresence mode="wait">
                            <TabsContent value="basic-info">
                                <motion.div 
                                    className="space-y-4"
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    variants={formVariants}
                                >
                                    <motion.div 
                                        className="flex items-center space-x-4"
                                        variants={inputVariants}
                                        custom={0}
                                    >
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
                                    </motion.div>
                                    <div className="grid gap-4">
                                        {[
                                            { id: "username", label: "Username", value: userInfo.username, readOnly: true },
                                            { id: "name", label: "Name", value: values.name },
                                            { id: "email", label: "Email", value: values.email, type: "email" },
                                            { id: "address", label: "Address", value: values.address },
                                            { id: "phoneNumber", label: "Phone Number", value: values.phoneNumber }
                                        ].map((field, i) => (
                                            <motion.div 
                                                key={field.id}
                                                className="grid gap-2"
                                                variants={inputVariants}
                                                custom={i + 1}
                                            >
                                                <Label htmlFor={field.id}>{field.label}</Label>
                                                <Input 
                                                    id={field.id}
                                                    name={field.id}
                                                    type={field.type || "text"}
                                                    value={field.value}
                                                    onChange={handleInputChange}
                                                    readOnly={field.readOnly}
                                                    disabled={field.readOnly}
                                                />
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            </TabsContent>
                            <TabsContent value="password">
                                <motion.div 
                                    className="space-y-4"
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    variants={formVariants}
                                >
                                    {[
                                        { id: "currentPassword", label: "Current Password" },
                                        { id: "newPassword", label: "New Password" },
                                        { id: "confirmNewPassword", label: "Confirm New Password" }
                                    ].map((field, i) => (
                                        <motion.div 
                                            key={field.id}
                                            className="grid gap-2"
                                            variants={inputVariants}
                                            custom={i}
                                        >
                                            <Label htmlFor={field.id}>{field.label}</Label>
                                            <Input 
                                                id={field.id}
                                                name={field.id}
                                                type="password"
                                                value={passwordValues[field.id]}
                                                onChange={handlePasswordChange}
                                            />
                                        </motion.div>
                                    ))}
                                    {passwordError && (
                                        <motion.div
                                            initial="hidden"
                                            animate="visible"
                                            exit="hidden"
                                            variants={alertVariants}
                                        >
                                            <Alert variant="destructive">
                                                <AlertCircle className="h-4 w-4" />
                                                <AlertTitle>Error</AlertTitle>
                                                <AlertDescription>{passwordError}</AlertDescription>
                                            </Alert>
                                        </motion.div>
                                    )}
                                </motion.div>
                            </TabsContent>
                        </AnimatePresence>
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
            </Card>

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

            <AnimatePresence>
                {showUpdateAlert && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={alertVariants}
                        className="fixed bottom-4 right-4"
                    >
                        <Alert
                            className="w-auto"
                            variant={updateAlertType === 'error' ? 'destructive' : 'default'}
                        >
                            <AlertTitle>{updateAlertType === 'success' ? 'Success' : 'Error'}</AlertTitle>
                            <AlertDescription>{updateAlertMessage}</AlertDescription>
                        </Alert>
                    </motion.div>
                )}

                {showDeleteAlert && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={alertVariants}
                        className="fixed bottom-4 right-4"
                    >
                        <Alert className="w-auto">
                            <AlertTitle>Success</AlertTitle>
                            <AlertDescription>Your account has been deleted successfully.</AlertDescription>
                        </Alert>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}