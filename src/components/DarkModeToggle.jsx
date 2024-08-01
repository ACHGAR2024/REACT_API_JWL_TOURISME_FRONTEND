import { useContext,useEffect } from 'react';
import DarkModeContext from '../context/DarkModeContext';

const DarkModeToggle = () => {
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <button
      onClick={() => toggleDarkMode(!isDarkMode)}
      className="p-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded  "
    >
      {isDarkMode ? <i className="fas fa-sun"></i> : <i className="fas fa-moon"></i>} 
    </button>
  );
};

export default DarkModeToggle;
