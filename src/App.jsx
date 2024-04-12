import './App.css';
import ExperimentComponent from './components/ExperimentComponent';
import { useEffect,useState } from 'react';

function App() {

  let [darkMode,setDarkMode] = useState(false);

  
  useEffect(()=>{
    if(darkMode){
      document.documentElement.classList.add('dark');
    }else{
      document.documentElement.classList.remove('dark');
    }
  },[darkMode])


  return (
    <div className="bg-white dark:bg-[#0e1117]">
      <button onClick={()=>{setDarkMode(!darkMode)}} className="absolute right-10 top-10 bg-stone-700 text-white px-5 py-3 rounded hover:bg-stone-700 text-xs dark:bg-[#262730] dark:hover:border">
        {darkMode?'Light':'Dark'} Mode
      </button>

      <ExperimentComponent />
    </div>
  );
}

export default App;
