import React, { useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { dracula, solarizedLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FiCopy } from 'react-icons/fi';
import experiments from '../assets/experiments';

const ExperimentComponent = () => {
  const [selectedCode, setSelectedCode] = useState('ls command');
  const [copied, setCopied] = useState(false);


  const handleDropdownChange = (e) => {
    setSelectedCode(e.target.value);
    setCopied(false);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-8 ">
      <div className="flex flex-col items-start mt-16">
      <h5 className="text-2xl font-bold dark:text-white mb-4">Operating System Lab Experiments</h5>
      <p className="mb-4 dark:text-white">Select the experiment to display:</p>
      <select
        className="p-2 border rounded-md mb-4 text-gray-800 bg-gray-50 w-full dark:bg-[#262730] dark:text-white dark:border-none"
        value={selectedCode}
        onChange={handleDropdownChange}
      >
        {experiments.map((experiment, index) => (
          <option key={index} value={experiment.title}>
            {experiment.title}
          </option>
        ))}
      </select>

      <div className="relative max-w-xl w-full">
        <div className="absolute top-0 right-0 flex items-center">
          <CopyToClipboard text={experiments.find(exp => exp.title === selectedCode)?.code} onCopy={() => setCopied(true)}>
            <button
              className="flex items-center p-2 rounded-md text-gray-500 hover:text-gray-700" // Light color, hover effect
            >
              {copied ? 'Copied!' : 'Copy'}
              <FiCopy className="ml-2 text-sm" /> {/* Small icon, spaced to the right */}
            </button>
          </CopyToClipboard>
        </div>

        <SyntaxHighlighter
          language="c"
          style={solarizedLight} // Assuming light mode for simplicity
          // showLineNumbers
          customStyle={{
            wordWrap:true,
            marginBottom: '1rem',
            overflowX: 'auto',
            textAlign: 'left',
            backgroundColor: '#F9FAFB',
            borderRadius: '5px',
            padding: '1rem',
            fontSize: '14px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          {experiments.find(exp => exp.title === selectedCode)?.code}
        </SyntaxHighlighter>
      </div>
      <div className="mt-4">
        <h6 className="text-xl font-bold dark:text-white mb-2">Sample Output</h6>
        <img src={experiments.find(exp => exp.title === selectedCode)?.imageUrl} alt="Sample Output" className="max-w-xl w-full shadow-md" />
      </div>
      </div>
    </div>
  );
};

export default ExperimentComponent;
