'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

const BookGrid = ({ 
    className = "",
    endpoint = '/ebook/getallebooksbypublisher', 
    onAddBookPath = '/publisher/addebook', 
    onBookClickPath = '/publisher/home/ebookinfo',
    booksData = null
}) => {
    const [books, setBooks] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const token = localStorage.getItem('sessionToken')
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    useEffect(() => {
        if (booksData) {
            setBooks(booksData);
            setLoading(false);
            return;
        }

        const fetchBooks = async () => {
            try {
                const response = await axios.get(`${backendUrl}${endpoint}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                setBooks([...response.data, { isAddNew: true }])
            } catch (error) {
                console.error('Error fetching books:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchBooks()
    }, [endpoint, booksData])

    const handleAddBook = () => {
        navigate(onAddBookPath)
    }

    const handleBookClick = (id) => {
        navigate(`${onBookClickPath}/${id}`)
    }

    if (loading) {
        return (
            <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4 ${className}`}>
                {[...Array(8)].map((_, i) => (
                    <Card key={i} className="w-[180px] flex flex-col">
                        <div className="relative pt-[150%]">
                            <Skeleton className="absolute inset-0 rounded-t-lg" />
                        </div>
                        <CardContent className="flex-grow space-y-2 p-3">
                            <Skeleton className="h-3 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    return (
        <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4 ${className}`}>
            {books.map((book) => 
                book.isAddNew ? (
                    <Button
                        key="add-new"
                        variant="outline"
                        className="w-[180px] relative pt-[270px] border-2 border-dashed"
                        onClick={handleAddBook}
                    >
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                            <Plus className="h-10 w-10" />
                            <span className="text-base font-medium text-center px-2">Publish a new Book</span>
                        </div>
                    </Button>
                ) : (
                    <Card 
                        key={book.eBookID}
                        className="w-[180px] overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
                        onClick={() => handleBookClick(book.eBookID)}
                    >
                        <div className="relative pt-[150%]">
                            <div className="absolute inset-0">
                                <img
                                    src={`data:image/png;base64,${book.cover}`}
                                    alt={book.title}
                                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                        </div>
                        <CardContent className="p-3 space-y-1">
                            <h3 className="text-sm font-semibold line-clamp-2">
                                {book.title}
                            </h3>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                                {book.author}
                            </p>
                        </CardContent>
                        <CardFooter className="p-3 pt-0">
                            <p className="text-xs text-muted-foreground">
                                Click to view details
                            </p>
                        </CardFooter>
                    </Card>
                )
            )}
        </div>
    )
}

export default BookGrid