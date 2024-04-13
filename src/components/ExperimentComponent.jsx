import React, { useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import {
  dracula,
  solarizedLight,
} from "react-syntax-highlighter/dist/esm/styles/hljs";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FiCopy } from "react-icons/fi";
import experiments from "../assets/experiments";

const ExperimentComponent = ({ darkMode }) => {
  const [selectedCode, setSelectedCode] = useState("ls command");
  const [copied, setCopied] = useState(false);

  const handleDropdownChange = (e) => {
    setSelectedCode(e.target.value);
    setCopied(false);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-8">
      <div className="flex flex-col items-start mt-16 w-full sm:w-[90%] md:w-[80%] lg:w-[60%] xl:w-[60%]">
        <h5
          className={`text-2xl font-bold ${
            darkMode ? "text-white" : "text-black"
          } py-4`}
        >
          Operating System Lab Experiments
        </h5>
        <p className={`${darkMode ? "text-white" : "text-black"} mb-4`}>
          Select the experiment to display:
        </p>
        <select
          className={`p-2 border rounded-md mb-4 px-4 text-gray-800 bg-gray-50 w-full dark:bg-[#262730] dark:text-white dark:border-none`}
          value={selectedCode}
          onChange={handleDropdownChange}
        >
          {experiments.map((experiment, index) => (
            <option key={index} value={experiment.title}>
              {experiment.title}
            </option>
          ))}
        </select>

        <div className="relative max-w-full w-full">
          <div className="absolute top-0 right-0 flex items-center">
            <CopyToClipboard
              text={experiments.find((exp) => exp.title === selectedCode)?.code}
              onCopy={() => setCopied(true)}
            >
              <button
                className={`flex items-center p-2 rounded-md ${
                  darkMode
                    ? "text-white hover:text-gray-300"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {copied ? "Copied!" : "Copy"}
                <FiCopy className="ml-2 text-sm" />
              </button>
            </CopyToClipboard>
          </div>

          <SyntaxHighlighter
            language="c"
            style={darkMode ? dracula : solarizedLight}
            customStyle={{
              wordWrap: "break-word",
              marginBottom: "1rem",
              overflowX: "auto",
              textAlign: "left",
              backgroundColor: darkMode ? "#262730" : "#F9FAFB",
              borderRadius: "5px",
              padding: "1rem",
              fontSize: "16px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              color: darkMode ? "#ffffff" : "#000000", // Text color based on dark mode
            }}
          >
            {experiments.find((exp) => exp.title === selectedCode)?.code}
          </SyntaxHighlighter>

          <div className={`mt-4 w-full`}>
            <h6 className={`${darkMode ? "text-white" : "text-black"} mb-4`}>
              Command-line execution
            </h6>
            <SyntaxHighlighter
            language="bash"
            style={darkMode ? dracula : solarizedLight}
            customStyle={{
              wordWrap: "break-word",
              marginBottom: "1rem",
              overflowX: "auto",
              textAlign: "left",
              backgroundColor: darkMode ? "#262730" : "#F9FAFB",
              borderRadius: "5px",
              padding: "1rem",
              fontSize: "16px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              color: darkMode ? "#ffffff" : "#000000", // Text color based on dark mode
            }}
          >
            {experiments.find((exp) => exp.title === selectedCode)?.cle}
          </SyntaxHighlighter>
          </div>

          {/* {experiments.find(exp => exp.title === selectedCode)?.imageUrl && (
          <div className={`mt-4 w-full`}>
            <h6 className={`${darkMode ? "text-white" : "text-black"} mb-4`}>
              Sample Output
            </h6>
            <img 
              src={experiments.find(exp => exp.title === selectedCode) ? `../src/assets/pictures/${experiments.find(exp => exp.title === selectedCode).imageUrl}` : null}
              alt="Sample Output"
              className=" w-full shadow-md"
            />
          </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

/*src={experiments.find(exp => exp.title === selectedCode) ? `../src/assets/pictures/${experiments.find(exp => exp.title === selectedCode).imageUrl}` : null} */

export default ExperimentComponent;
