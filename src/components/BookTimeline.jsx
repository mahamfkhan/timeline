import React, { useState, useEffect, createContext, useContext } from 'react';
import { Moon, Sun } from 'lucide-react';

// Theme context
const ThemeContext = createContext();

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};

// Generate a color based on username
const generateColor = (name) => {
  const colors = [
    'rgb(239, 68, 68)', // red
    'rgb(34, 197, 94)', // green
    'rgb(59, 130, 246)', // blue
    'rgb(168, 85, 247)', // purple
    'rgb(249, 115, 22)', // orange
    'rgb(236, 72, 153)', // pink
  ];
  
  const hash = name.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
  return colors[hash % colors.length];
};

const TimelineEntry = ({ entry, isDark }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const dotColor = generateColor(entry.submitter);
  
  return (
    <div className="relative">
      <div 
        className="w-4 h-4 rounded-full absolute -left-2 cursor-pointer transform hover:scale-110 transition-transform"
        style={{ backgroundColor: dotColor }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      />
      {showTooltip && (
        <div className={`absolute left-4 -top-2 w-64 p-3 rounded-lg shadow-lg z-10 ${
          isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        }`}>
          <p className="font-medium">{entry.content}</p>
          <p className="text-sm mt-1 opacity-75">Added by: {entry.submitter}</p>
        </div>
      )}
    </div>
  );
};

const Timeline = () => {
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);
  const [newEntry, setNewEntry] = useState({
    content: '',
    submitter: ''
  });
  const { isDark, toggleTheme } = useTheme();

  // Load entries from localStorage
  useEffect(() => {
    const savedEntries = localStorage.getItem('timelineEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  // Save entries to localStorage
  useEffect(() => {
    localStorage.setItem('timelineEntries', JSON.stringify(entries));
  }, [entries]);

  const handleAddClick = (year) => {
    setSelectedYear(year);
    setShowForm(true);
    setNewEntry({ content: '', submitter: '' });
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedYear(null);
    setNewEntry({ content: '', submitter: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newEntry.content && newEntry.submitter) {
      setEntries([...entries, { ...newEntry, year: selectedYear }]);
      handleCloseForm();
    }
  };

  const years = Array.from({ length: 26 }, (_, i) => 1999 + i);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Memory Timeline</h1>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className={`absolute left-0 w-0.5 h-full ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`} />

          {/* Years and entries */}
          <div className="space-y-8">
            {years.map(year => (
              <div key={year} className="relative pl-8">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-semibold">{year}</h2>
                  <button
                    onClick={() => handleAddClick(year)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    +
                  </button>
                </div>
                <div className="space-y-4">
                  {entries
                    .filter(entry => entry.year === year)
                    .map((entry, index) => (
                      <TimelineEntry key={index} entry={entry} isDark={isDark} />
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add entry modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className={`p-6 rounded-lg max-w-md w-full ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add a memory for {selectedYear}</h3>
              <button
                onClick={handleCloseForm}
                className="opacity-70 hover:opacity-100"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <textarea
                  placeholder="Please enter a book, movie, song, etc."
                  value={newEntry.content}
                  onChange={e => setNewEntry({ ...newEntry, content: e.target.value })}
                  className={`w-full p-2 border rounded ${
                    isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  }`}
                  rows={3}
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Please enter your name"
                  value={newEntry.submitter}
                  onChange={e => setNewEntry({ ...newEntry, submitter: e.target.value })}
                  className={`w-full p-2 border rounded ${
                    isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  }`}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Add Memory
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Wrap the Timeline component with ThemeProvider
const TimelineWrapper = () => {
  const [isDark, setIsDark] = useState(false);
  const toggleTheme = () => setIsDark(!isDark);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <Timeline />
    </ThemeContext.Provider>
  );
};

export default TimelineWrapper;
