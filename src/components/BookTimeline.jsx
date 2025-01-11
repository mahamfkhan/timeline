import React, { useState, useEffect } from 'react';

const BookTimeline = () => {
  const [books, setBooks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    submitter: ''
  });

  // Load books from localStorage on component mount
  useEffect(() => {
    const savedBooks = localStorage.getItem('timelineBooks');
    if (savedBooks) {
      setBooks(JSON.parse(savedBooks));
    }
  }, []);

  // Save books to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('timelineBooks', JSON.stringify(books));
  }, [books]);

  const handleAddClick = (year) => {
    setSelectedYear(year);
    setShowForm(true);
    setNewBook({ title: '', author: '', submitter: '' });
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedYear(null);
    setNewBook({ title: '', author: '', submitter: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newBook.title && newBook.author && newBook.submitter) {
      setBooks([...books, { ...newBook, year: selectedYear }]);
      handleCloseForm();
    }
  };

  const years = Array.from({ length: 12 }, (_, i) => 1999 + i);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Book Timeline</h1>
      <div className="space-y-4">
        {years.map(year => (
          <div key={year} className="border-b pb-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold">{year}</h2>
              <button
                onClick={() => handleAddClick(year)}
                className="w-8 h-8 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
              >
                +
              </button>
            </div>
            {books
              .filter(book => book.year === year)
              .map((book, index) => (
                <div key={index} className="ml-8 p-2 bg-white rounded shadow-sm">
                  <p className="font-medium">{book.title}</p>
                  <p className="text-sm text-gray-600">by {book.author}</p>
                  <p className="text-xs text-gray-500">Added by: {book.submitter}</p>
                </div>
              ))}
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add a book for {selectedYear}</h3>
              <button
                onClick={handleCloseForm}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Book title"
                  value={newBook.title}
                  onChange={e => setNewBook({ ...newBook, title: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Author"
                  value={newBook.author}
                  onChange={e => setNewBook({ ...newBook, author: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Your name"
                  value={newBook.submitter}
                  onChange={e => setNewBook({ ...newBook, submitter: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              >
                Add Book
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookTimeline;
