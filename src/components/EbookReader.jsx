import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import axios from "axios";
import ePub from "epubjs";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Download, Menu, X } from "lucide-react";

const EbookReader = ({ bookId }) => {
    console.log('EbookReader rendering with bookId:', bookId);
    console.log('VITE_BACKEND_URL:', import.meta.env.VITE_BACKEND_URL);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [fontSize, setFontSize] = useState(120);
    const [isViewerMounted, setIsViewerMounted] = useState(false);
    const [chapters, setChapters] = useState([]);
    const [showControls, setShowControls] = useState(true);
    const [showSidebar, setShowSidebar] = useState(false);
    const viewerRef = useRef(null);
    const bookRef = useRef(null);
    const renditionRef = useRef(null);
    const mountCountRef = useRef(0);
    const hideControlsTimerRef = useRef(null);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // Load saved page on mount
    useEffect(() => {
        if (bookId) {
            const savedPage = localStorage.getItem(`book-${bookId}-page`);
            if (savedPage) {
                // Removed setCurrentPage(parseInt(savedPage));
            }
        }
    }, [bookId]);

    // Save page on change
    useEffect(() => {
        if (bookId) {
            // Removed localStorage.setItem(`book-${bookId}-page`, currentPage.toString());
        }
    }, [bookId]);

    // Layout effect for viewer mounting
    useLayoutEffect(() => {
        console.log('Layout effect running, viewerRef:', viewerRef.current);
        if (viewerRef.current) {
            console.log('Viewer ref found in layout effect');
            setIsViewerMounted(true);
            mountCountRef.current += 1;
            console.log('Mount count:', mountCountRef.current);
        }
        return () => {
            console.log('Layout effect cleanup');
        };
    }, []);

    const handleDownload = async () => {
        try {
            const response = await axios.get(`${backendUrl}/ebook/getebookfile/${bookId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('sessionToken')}`,
                    'Accept': 'application/epub+zip'
                },
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `book-${bookId}.epub`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
        }
    };

    const navigateToChapter = (href) => {
        if (renditionRef.current) {
            renditionRef.current.display(href);
        }
    };

    useEffect(() => {
        console.log('Main effect running');
        console.log('Current state:', {
            isViewerMounted,
            viewerRef: viewerRef.current,
            bookId,
            backendUrl,
            hasBook: !!bookRef.current,
            hasRendition: !!renditionRef.current,
            mountCount: mountCountRef.current
        });

        let isCurrentMount = true;

        const fetchBook = async () => {
            if (!bookId || !isViewerMounted) {
                setIsLoading(false);
                return;
            }

            try {
                console.log('Starting fetchBook');
                console.log('Fetching book from:', `${backendUrl}/ebook/getebookfile/${bookId}`);
                
                // Get token from localStorage
                const token = localStorage.getItem('sessionToken');
                console.log('Auth token present:', !!token);

                const response = await axios.get(`${backendUrl}/ebook/getebookfile/${bookId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/epub+zip'
                    },
                    responseType: 'arraybuffer'
                });

                if (!isCurrentMount) return;

                console.log('Received response:', {
                    status: response.status,
                    dataLength: response.data?.byteLength,
                    contentType: response.headers['content-type']
                });

                if (response.headers['content-type'] !== 'application/epub+zip') {
                    throw new Error('Oops! The publisher did not add the correct eBook type. Please contact your publisher. Otherwise, this is Matt\'s fault.');
                }

                if (!response.data || response.data.byteLength === 0) {
                    throw new Error('Oops! The publisher did not add an eBook for this entry. Please contact your publisher. Otherwise, this is Matt\'s fault.');
                }

                // Create book instance
                console.log('Creating epub book instance');
                const epubBook = ePub();
                console.log('Opening book with ArrayBuffer of size:', response.data.byteLength);
                await epubBook.open(response.data);
                
                if (!isCurrentMount) return;

                console.log('Waiting for book to be ready');
                await epubBook.ready;
                
                if (!isCurrentMount) return;

                // Load chapters
                try {
                    console.log('Loading navigation');
                    const nav = await epubBook.loaded.navigation;
                    console.log('Navigation loaded:', nav);
                    
                    if (nav && nav.toc && nav.toc.length > 0) {
                        console.log('Setting chapters from TOC');
                        setChapters(nav.toc);
                    } else {
                        console.log('No TOC found, trying spine');
                        const spine = await epubBook.loaded.spine;
                        if (spine && spine.items) {
                            const spineItems = spine.items.map((item, index) => ({
                                label: `Chapter ${index + 1}`,
                                href: item.href
                            }));
                            setChapters(spineItems);
                        } else {
                            console.log('No spine items found');
                            setChapters([]);
                        }
                    }
                } catch (error) {
                    console.error('Error loading chapters:', error);
                    setChapters([]);
                }

                try {
                    // Create rendition
                    console.log('Creating rendition with viewer:', viewerRef.current);
                    const rendition = epubBook.renderTo(viewerRef.current, {
                        width: '100%',
                        height: '100%',
                        spread: 'always'
                    });

                    // Add custom styles
                    rendition.themes.default({
                        'p': {
                            'font-family': 'var(--font-inter)',
                            'line-height': '1.6'
                        }
                    });

                    // Set up rendition
                    console.log('Setting up rendition');

                    const savedLocation = localStorage.getItem(`book-${bookId}-location`);
                    if (savedLocation) {
                        console.log('Attempting to load saved location:', savedLocation);
                        rendition.display(savedLocation).catch(() => {
                            console.log('Starting from beginning (fallback)');
                            rendition.display();
                        });
                    } else {
                        console.log('Starting from beginning');
                        rendition.display();
                    }

                    // Set up event listeners
                    console.log('Setting up event listeners');
                    rendition.on('locationChanged', (loc) => {
                        if (!isCurrentMount) return;
                        try {
                            localStorage.setItem(`book-${bookId}-location`, JSON.stringify(loc));
                        } catch (error) {
                            console.error('Error saving location:', error);
                        }
                    });

                    // Store instances
                    bookRef.current = epubBook;
                    renditionRef.current = rendition;
                    setIsLoading(false);
                    console.log('Book setup complete');
                } catch (error) {
                    console.error('Error setting up rendition:', error);
                    if (isCurrentMount) {
                        setError(error.message || 'Failed to set up the book');
                        setIsLoading(false);
                    }
                }
            } catch (err) {
                console.error('Error loading book:', err);
                if (isCurrentMount) {
                    setError(err.message || 'Failed to load the book');
                    setIsLoading(false);
                }
            }
        };

        fetchBook();

        return () => {
            console.log('Main effect cleanup');
            isCurrentMount = false;
        };
    }, [bookId, backendUrl, isViewerMounted]);

    const changeFontSize = (size) => {
        console.log('Changing font size to:', size);
        setFontSize(size);
        if (renditionRef.current) {
            renditionRef.current.themes.default({
                'p': {
                    'font-family': 'var(--font-inter)',
                    'line-height': '1.6',
                    'font-size': `${size}%`
                },
                'div': {
                    'font-family': 'var(--font-inter)',
                    'line-height': '1.6',
                    'font-size': `${size}%`
                },
                'span': {
                    'font-family': 'var(--font-inter)',
                    'line-height': '1.6',
                    'font-size': `${size}%`
                }
            });
            renditionRef.current.views().forEach(view => view.pane ? view.pane.render() : null);
        }
    };

    const nextPage = () => {
        if (renditionRef.current) {
            renditionRef.current.next();
        }
    };

    const prevPage = () => {
        if (renditionRef.current) {
            renditionRef.current.prev();
        }
    };

    // Handle mouse movement
    useEffect(() => {
        const handleMouseMove = () => {
            setShowControls(true);
            if (hideControlsTimerRef.current) {
                clearTimeout(hideControlsTimerRef.current);
            }
            hideControlsTimerRef.current = setTimeout(() => {
                setShowControls(false);
            }, 5000);
        };

        // Initial timer
        handleMouseMove();

        // Add event listeners
        window.addEventListener('mousemove', handleMouseMove);
        
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (hideControlsTimerRef.current) {
                clearTimeout(hideControlsTimerRef.current);
            }
        };
    }, []);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight') {
                nextPage();
            } else if (e.key === 'ArrowLeft') {
                prevPage();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    // Cleanup only on full unmount
    useEffect(() => {
        return () => {
            console.log('Component cleanup');
            if (renditionRef.current) {
                console.log('Destroying rendition');
                renditionRef.current.destroy();
            }
            if (bookRef.current) {
                console.log('Destroying book');
                bookRef.current.destroy();
            }
        };
    }, []);

    return (
        <Card className="w-full h-[80vh] relative bg-background overflow-hidden">
            <div className="w-full h-full relative flex">
                {/* Sidebar */}
                <div 
                    className={`absolute inset-y-0 left-0 w-[300px] bg-background border-r transform transition-transform duration-300 ease-in-out z-30 ${
                        showSidebar ? 'translate-x-0' : '-translate-x-full'
                    }`}
                >
                    <div className="h-full flex flex-col">
                        <div className="p-4 border-b flex items-center justify-between">
                            <h3 className="font-semibold text-lg">Chapters</h3>
                            <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => setShowSidebar(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <ScrollArea className="flex-1 p-4">
                            <div className="space-y-1">
                                {chapters.length > 0 ? (
                                    chapters.map((chapter, index) => (
                                        <Button
                                            key={index}
                                            variant="ghost"
                                            className="w-full justify-start text-left h-auto py-3"
                                            onClick={() => {
                                                navigateToChapter(chapter.href);
                                                setShowSidebar(false);
                                            }}
                                        >
                                            <span className="truncate text-sm">{chapter.label}</span>
                                        </Button>
                                    ))
                                ) : (
                                    <div className="py-8 text-center text-muted-foreground text-sm">
                                        No chapters available
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 relative">
                    <div className="absolute inset-0 bg-background flex items-center justify-center">
                        <div 
                            className="h-full max-w-[1600px] w-full mx-auto relative"
                            style={{
                                perspective: '1000px',
                                transformStyle: 'preserve-3d'
                            }}
                        >
                            <div 
                                ref={viewerRef}
                                id="viewer"
                                className="w-full h-full" 
                                style={{ 
                                    position: 'absolute',
                                    inset: 0,
                                    backgroundColor: 'var(--background)',
                                    transformOrigin: 'center center',
                                    transform: 'rotateY(0deg)',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                    borderRadius: '4px',
                                    overflow: 'hidden'
                                }}
                            />
                        </div>
                    </div>

                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center z-10 bg-background/50">
                            <Skeleton className="w-[800px] h-[600px] max-w-[90%] max-h-[90%]" />
                        </div>
                    )}
                    {error && (
                        <div className="absolute inset-0 flex items-center justify-center z-10 bg-background/50 text-red-500">
                            {error}
                        </div>
                    )}
                </div>

                {/* Navigation Controls */}
                <div 
                    className={`absolute top-4 right-4 z-20 flex gap-2 transition-opacity duration-300 ${
                        showControls ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={prevPage}
                                    className="bg-background/80 backdrop-blur-sm"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                Previous Page (←)
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={nextPage}
                                    className="bg-background/80 backdrop-blur-sm"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                Next Page (→)
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handleDownload}
                                    className="bg-background/80 backdrop-blur-sm"
                                >
                                    <Download className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                Download Book
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>

                {/* Sidebar Toggle */}
                <Button 
                    variant="outline" 
                    size="icon"
                    className={`absolute top-4 left-4 z-20 transition-opacity duration-300 bg-background/80 backdrop-blur-sm ${
                        showControls ? 'opacity-100' : 'opacity-0'
                    }`}
                    onClick={() => setShowSidebar(true)}
                >
                    <Menu className="h-4 w-4" />
                </Button>
            </div>
        </Card>
    );
}

export default EbookReader;