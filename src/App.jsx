import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BooksPage from './pages/BooksPage';
import CheckoutPage from './pages/CheckoutPage';
import ReadPage from './pages/ReadBook';
import BookmarksPage from './pages/BookmarksPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/user/books" element={<BooksPage />} />
        <Route path="/user/checkout" element={<CheckoutPage />} />
        <Route path="/user/read/:ebookId" element={<ReadPage />} />
        <Route path="/user/bookmarks" element={<BookmarksPage />} />
      </Routes>
    </Router>
  )
}

export default App;
