import React, { useState } from 'react';
import { Plus, X, Book } from 'lucide-react';

const BookTimeline = () => {
  const startYear = 1999;
  const endYear = 2025;
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
  
  const [books, setBooks] = useState({});
  const [showForm, setShowForm] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    name: ''
  });

  // Generate a consistent color based on author name
  const getAuthorColor = (author) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-red-500',
      'bg-indigo-500'
    ];
    const hash = author.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    return colors[hash % colors.length];
  };

  const handleSubmit = (year, e) => {
    e.preventDefault();
    if (formData.title && formData.author && formData.name) {
      setBooks(prev => ({
        ...prev,
        [year]: [...(prev[year] || []), { ...formData, id: Date.now() }]
      }));
      setFormData({ title: '', author: '', name: '' });
      setShowForm(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-8">Book Timeline</h2>
      
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-24 top-0 bottom-0 w-1 bg-gray-200" />

        {/* Years and books */}
        {years.map(year => (
          <div key={year} className="relative mb-8 flex">
            {/* Year label */}
            <div className="w-24 pt-2 font-bold text-right pr-8">{year}</div>

            {/* Add button and books */}
            <div className="flex-1 relative">
              <button
                onClick={() => setShowForm(year)}
                className="absolute -left-4 top-2 w-8 h-8 rounded-full bg-white border-2 border-gray-300 hover:border-gray-400 flex items-center justify-center"
              >
                <Plus size={20} />
              </button>

              {/* Book entries */}
              <div className="ml-8 space-y-2">
                {books[year]?.map(book => (
                  <div
                    key={book.id}
                    className="flex items-center space-x-2 group"
                  >
                    <div className={`w-3 h-3 rounded-full ${getAuthorColor(book.author)}`} />
                    <div className="flex-1">
                      <div className="font-medium">{book.title}</div>
                      <div className="text-sm text-gray-600">
                        by {book.author} (suggested by {book.name})
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add book form */}
              {showForm === year && (
                <div className="ml-8 mt-4 p-4 bg-white border rounded-lg shadow-lg">
                  <div className="flex justify-between mb-4">
                    <h3 className="font-medium">Add a book suggestion</h3>
                    <button onClick={() => setShowForm(null)}>
                      <X size={20} />
                    </button>
                  </div>
                  <form onSubmit={(e) => handleSubmit(year, e)} className="space-y-4">
                    <div>
                      <input
                        type="text"
                        placeholder="Book title"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Author"
                        value={formData.author}
                        onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full p-2 border rounded"
                        required
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
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookTimeline;
