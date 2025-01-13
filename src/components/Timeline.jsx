import React, { useState, useEffect, createContext, useContext } from 'react';
import { Moon, Sun, Trash2 } from 'lucide-react';

// Theme context
const ThemeContext = createContext();

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};

// Generate a consistent color based on username
const generateColor = (name) => {
  const colors = [
    'rgb(239, 68, 68)', // red
    'rgb(34, 197, 94)', // green
    'rgb(59, 130, 246)', // blue
    'rgb(168, 85, 247)', // purple
    'rgb(249, 115, 22)', // orange
    'rgb(236, 72, 153)', // pink
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);
  return colors[hash % colors.length];
};

const TimelineEntry = ({ entry, isDark, index, totalEntries, onDelete, userColor }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isTooltipLocked, setIsTooltipLocked] = useState(false);
  
  // Calculate dot position
  const offset = (index / (totalEntries + 1)) * 100;
  
  return (
    <div className="absolute" style={{ left: `${offset}%`, top: '-10px' }}>
      <div 
        className="w-4 h-4 rounded-full cursor-pointer transform hover:scale-110 transition-transform"
        style={{ backgroundColor: userColor }}
        onMouseEnter={() => !isTooltipLocked && setShowTooltip(true)}
        onMouseLeave={() => !isTooltipLocked && setShowTooltip(false)}
        onClick={() => setIsTooltipLocked(!isTooltipLocked)}
      />
      {(showTooltip || isTooltipLocked) && (
        <div className={`absolute left-1/2 -translate-x-1/2 top-6 w-64 p-3 rounded-lg shadow-lg z-10 ${
          isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        }`}>
          <div className="flex justify-between items-start">
            <div className="flex-grow">
              <p className="font-medium">{entry.content}</p>
              <p className="text-sm mt-1 opacity-75">Added by: {entry.submitter}</p>
            </div>
            <button
              onClick={() => onDelete(entry)}
              className="p-1 rounded hover:bg-red-100 hover:text-red-600 transition-colors"
              aria-label="Delete entry"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Timeline = () => {
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);
  const [userColors, setUserColors] = useState({});
  const [newEntry, setNewEntry] = useState({
    content: '',
    submitter: ''
  });
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const savedEntries = localStorage.getItem('timelineEntries');
    if (savedEntries) {
      const parsedEntries = JSON.parse(savedEntries);
      setEntries(parsedEntries);
      
      // Generate colors for all unique users
      const colors = {};
      parsedEntries.forEach(entry => {
        if (!colors[entry.submitter]) {
          colors[entry.submitter] = generateColor(entry.submitter);
        }
      });
      setUserColors(colors);
    }
  }, []);

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
      // Assign color if this is a new user
      if (!userColors[newEntry.submitter]) {
        setUserColors(prev => ({
          ...prev,
          [newEntry.submitter]: generateColor(newEntry.submitter)
        }));
      }
      setEntries([...entries, { ...newEntry, year: selectedYear }]);
      handleCloseForm();
    }
  };

  const handleDelete = (entryToDelete) => {
    const newEntries = entries.filter(entry => 
      !(entry.content === entryToDelete.content && 
        entry.submitter === entryToDelete.submitter && 
        entry.year === entryToDelete.year)
    );
    setEntries(newEntries);
  };

  const years = Array.from({ length: 26 }, (_, i) => 1999 + i);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold">Reflections on the years 1999 to 2024: a collaborative timeline</h1>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        <div className="space-y-16">
          {years.map((year, yearIndex) => (
            <div key={year} className="relative">
              <div className="flex items-center justify-center space-x-4">
                <div className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {year}
                </div>
              </div>

              <div className="relative h-12 my-4">
                <div className={`absolute left-0 right-0 h-0.5 top-1/2 -translate-y-1/2 ${
                  isDark ? 'bg-gray-700' : 'bg-gray-300'
                }`} />
                
                {yearIndex < years.length - 1 && (
                  <button
                    onClick={() => handleAddClick(year)}
                    className={`absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    +
                  </button>
                )}

                <div className="relative h-full">
                  {entries
                    .filter(entry => entry.year === year)
                    .map((entry, index, arr) => (
                      <TimelineEntry 
                        key={index} 
                        entry={entry} 
                        isDark={isDark}
                        index={index}
                        totalEntries={arr.length}
                        onDelete={handleDelete}
                        userColor={userColors[entry.submitter]}
                      />
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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