import './App.css';
import ExperimentComponent from './components/ExperimentComponent';
import { useEffect, useState } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa'; // Import icons

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="bg-white dark:bg-[#0e1117]">
      <button
  onClick={() => {
    setDarkMode(!darkMode);
  }}
  className="absolute right-10 top-10 bg-stone-700 text-white p-4 rounded-full flex items-center justify-center hover:bg-stone-700 text-xs dark:bg-[#262730] dark:hover:border"
>
  {darkMode ? (
    <FaSun className="inline-block" />
  ) : (
    <FaMoon className="inline-block" />
  )}
</button>
      <ExperimentComponent darkMode={darkMode} />
    </div>
  );
}

export default App;
