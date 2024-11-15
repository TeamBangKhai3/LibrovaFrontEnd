import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BookCarousel = ({ className = '' }) => {
    const [books, setBooks] = useState([]);
    const [visibleBooks, setVisibleBooks] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [booksPerRow, setBooksPerRow] = useState(3);
    const [loading, setLoading] = useState(true);
    const resizeTimeout = useRef(null);
    const containerRef = useRef(null);
    const navigate = useNavigate();

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const getallebooks = `${backendUrl}/ebook/getallebooks`;

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get(getallebooks);
                setBooks(response.data);
                setVisibleBooks(response.data.slice(0, booksPerRow));
            } catch (error) {
                console.error('Error fetching books:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, [booksPerRow]);

    const handleResize = () => {
        if (resizeTimeout.current) {
            clearTimeout(resizeTimeout.current);
        }
        resizeTimeout.current = setTimeout(() => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                const bookWidth = 200; // Width of each book card
                const newBooksPerRow = Math.floor(containerWidth / (bookWidth + 20)); // 20px is the gap between books
                setBooksPerRow(newBooksPerRow);
                setVisibleBooks(books.slice(currentIndex, currentIndex + newBooksPerRow));
            }
        }, 300);
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [books, currentIndex]);

    const handleNext = () => {
        const nextIndex = currentIndex + booksPerRow;
        setCurrentIndex(nextIndex);
        setVisibleBooks(books.slice(nextIndex, nextIndex + booksPerRow));
    };

    const handlePrevious = () => {
        const prevIndex = Math.max(currentIndex - booksPerRow, 0);
        setCurrentIndex(prevIndex);
        setVisibleBooks(books.slice(prevIndex, prevIndex + booksPerRow));
    };

    const handleBookClick = (id) => {
        navigate(`/user/home/ebookinfo/${id}`);
    };

    if (loading) {
        return null;
    }

    return (
        <div ref={containerRef} className={`relative flex flex-col items-center w-full overflow-hidden ${className}`}>
            <div className="flex flex-nowrap justify-center w-full">
                {visibleBooks.map((book) => (
                    <Card
                        key={book.eBookID}
                        className="w-[200px] h-[450px] m-2 cursor-pointer transition-all duration-300 hover:shadow-lg"
                        onClick={() => handleBookClick(book.eBookID)}
                    >
                        <CardContent className="p-4 flex flex-col items-center">
                            <div className="relative w-full h-[250px] mb-4">
                                <img
                                    src={`data:image/png;base64,${book.cover}`}
                                    alt={book.title}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <h3 className="text-lg font-semibold text-center line-clamp-2">{book.title}</h3>
                            <p className="text-sm text-muted-foreground text-center mt-2">{book.author}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
            {currentIndex > 0 && (
                <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2"
                    onClick={handlePrevious}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
            )}
            {currentIndex + booksPerRow < books.length && (
                <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={handleNext}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
};

export default BookCarousel;