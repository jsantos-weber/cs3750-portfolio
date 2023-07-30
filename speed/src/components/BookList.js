import {React,ReactDOM, useEffect, useState } from 'react';
import axios from 'axios';

const BookList = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    // Fetch data from the backend API
    axios.get('http://localhost:4000/Chat')
      .then((response) => {
        setBooks(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data from API:', error);
      });
  }, []);

  return (
    <div>
      <h2>Book List</h2>
      <ul>
        {books && books.map && books.map((book, index) => (
          <li key={index}>
            <h3>{book.title}</h3>
            <p>Author: {book.author}</p>
            <h4>Reviews:</h4>
            <ul>
              {book.review && book.map &&book.reviews.map((review, reviewIndex) => (
                <li key={reviewIndex}>
                  <p>User: {review.user}</p>
                  <p>Rating: {review.rating}</p>
                  <p>Comment: {review.comment}</p>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookList;