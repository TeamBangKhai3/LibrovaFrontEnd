'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useMediaQuery } from '@/hooks/use-media-query'

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import './BookCarousel.css'

const BookCarousel = ({ className = '' }) => {
    const [books, setBooks] = useState([])
    const [visibleBooks, setVisibleBooks] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [loading, setLoading] = useState(true)
    const [isAnimating, setIsAnimating] = useState(false)
    const containerRef = useRef(null)
    const navigate = useNavigate()

    const isDesktop = useMediaQuery("(min-width: 1024px)")
    const isTablet = useMediaQuery("(min-width: 768px)")
    const isMobile = useMediaQuery("(min-width: 640px)")

    const getBooksPerView = () => {
        if (isDesktop) return 5
        if (isTablet) return 3
        if (isMobile) return 2
        return 1
    }

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const getallebooks = `${backendUrl}/ebook/getallebooks`

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get(getallebooks)
                setBooks(response.data)
                const booksPerView = getBooksPerView()
                setVisibleBooks(response.data.slice(0, booksPerView))
            } catch (error) {
                console.error('Error fetching books:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchBooks()
    }, [])

    useEffect(() => {
        const booksPerView = getBooksPerView()
        setVisibleBooks(books.slice(currentIndex, currentIndex + booksPerView))
    }, [isDesktop, isTablet, isMobile, books, currentIndex])

    const handleNext = async () => {
        if (isAnimating) return
        setIsAnimating(true)
        const booksPerView = getBooksPerView()
        const nextIndex = currentIndex + booksPerView
        if (nextIndex < books.length) {
            setCurrentIndex(nextIndex)
            setVisibleBooks(books.slice(nextIndex, nextIndex + booksPerView))
        }
        setTimeout(() => setIsAnimating(false), 500)
    }

    const handlePrevious = async () => {
        if (isAnimating) return
        setIsAnimating(true)
        const booksPerView = getBooksPerView()
        const prevIndex = Math.max(currentIndex - booksPerView, 0)
        setCurrentIndex(prevIndex)
        setVisibleBooks(books.slice(prevIndex, prevIndex + booksPerView))
        setTimeout(() => setIsAnimating(false), 500)
    }

    const handleBookClick = (id) => {
        navigate(`/user/home/ebookinfo/${id}`)
    }

    if (loading) {
        return (
            <div className={cn("w-full px-4", className)}>
                <div className="relative flex justify-center items-center gap-4">
                    {[...Array(getBooksPerView())].map((_, i) => (
                        <Card key={i} className="w-[180px] flex-shrink-0">
                            <div className="relative pt-[150%]">
                                <Skeleton className="absolute inset-0 rounded-t-lg" />
                            </div>
                            <CardContent className="p-4 space-y-2">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div ref={containerRef} className={cn("w-full px-4", className)}>
            <div className="relative">
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={currentIndex}
                        className="flex justify-center items-center gap-4 carousel-container"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                    >
                        {visibleBooks.map((book) => (
                            <motion.div
                                key={book.eBookID}
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Card
                                    className="w-[180px] overflow-hidden cursor-pointer group"
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
                                    <CardContent className="p-4 space-y-2">
                                        <h3 className="text-sm font-semibold line-clamp-2">
                                            {book.title}
                                        </h3>
                                        <p className="text-xs text-muted-foreground line-clamp-1">
                                            {book.author}
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>

                {currentIndex > 0 && (
                    <Button
                        variant="outline"
                        size="icon"
                        className="absolute -left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background/90"
                        onClick={handlePrevious}
                        disabled={isAnimating}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                )}
                {currentIndex + getBooksPerView() < books.length && (
                    <Button
                        variant="outline"
                        size="icon"
                        className="absolute -right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background/90"
                        onClick={handleNext}
                        disabled={isAnimating}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    )
}

export default BookCarousel